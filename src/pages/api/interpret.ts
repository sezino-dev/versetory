// /pages/api/interpret.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import TranslatePrompt from "../../prompts/TranslatePrompt";
import VerseTranslatePrompt from "../../prompts/VerseTranslatePrompt";

// Next.js API Route 설정: 대용량/스트리밍 허용
export const config = {
    api: {
        bodyParser: { sizeLimit: "1mb" },
        responseLimit: false,
    },
};

// 서버 전용 Supabase (service_role)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// OpenAI 클라이언트
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 모델 이름은 OPENAI_MODEL에서 가져오기
function getModelOrThrow() {
    const model = process.env.OPENAI_MODEL;
    if (!model) throw new Error("OPENAI_MODEL 환경변수가 설정되지 않았습니다.");
    return model as string;
}

// 모델 출력 줄수를 입력(원문) 줄수에 맞춰 보정
function alignToSourceLines(src: string[], raw: string) {
    const out = (raw || "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.replace(/\s+$/, ""));

    // 1) 개수가 같으면 그대로
    if (out.length === src.length) return out;

    // 2) 2N(원문/번역 교차) 패턴이면 번역 줄만 추출
    if (out.length === src.length * 2) {
        let looksInterleaved = true;
        for (let i = 0; i < src.length; i++) {
            const a = (src[i] || "").trim();
            const b = (out[2 * i] || "").trim();
            if (a !== b) { looksInterleaved = false; break; }
        }
        if (looksInterleaved) {
            const picked: string[] = [];
            for (let i = 0; i < src.length; i++) picked.push((out[2 * i + 1] || "").trim());
            return picked;
        }
    }

    // 3) 그 외엔 단순 패딩/자르기
    if (out.length < src.length) {
        const padded = out.slice();
        while (padded.length < src.length) padded.push("");
        return padded;
    }
    return out.slice(0, src.length);
}

// annotation_text → annotation_ko 번역 후 행별 update 저장
async function translateMissingAnnotations(songId: number, model: string) {
    const { data: rows, error } = await supabase
        .from("interpretations")
        .select("id, line_number, annotation_text, annotation_ko")
        .eq("song_id", songId)
        .is("annotation_ko", null)
        .not("annotation_text", "is", null)
        .order("line_number", { ascending: true });

    if (error) {
        console.error("annotation 조회 실패:", error);
        return;
    }
    if (!rows || rows.length === 0) return;

    const originals = rows.map((r) => (r.annotation_text || "").replace(/\r\n/g, "\n").trim());
    const delimiter = "#####";

    const systemMsg =
        "너는 영어 해설(Annotation)을 한국어로 정확하고 자연스럽게 번역한다. " +
        "요약/생략/의미 추가/삭제 금지. 문단/줄바꿈/헤더/불릿/인용/URL/고유명사/숫자/기호 보존. " +
        "마크다운/불릿 새로 만들지 말 것.";
    const userMsg = [
        "다음은 노래 주석(Annotation) 원문 목록이다.",
        `각 항목을 한국어로 번역하되, 항목 사이를 정확히 '${delimiter}' 한 줄로만 구분해서 반환해라.`,
        "항목 수와 순서를 반드시 유지해라.",
        "",
        "원문 목록 시작 >>>",
        originals.join(`\n${delimiter}\n`),
        "<<< 원문 목록 끝",
    ].join("\n");

    const completion = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg },
        ],
    });

    const raw = completion.choices[0].message?.content ?? "";
    let parts = raw.split(delimiter).map((s) => s.trim());

    if (parts.length < originals.length) {
        while (parts.length < originals.length) parts.push("");
    } else if (parts.length > originals.length) {
        parts = parts.slice(0, originals.length);
    }

    const tasks = rows.map((r, i) =>
        supabase.from("interpretations").update({ annotation_ko: parts[i] || null }).eq("id", r.id)
    );

    const results = await Promise.allSettled(tasks);
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) console.error(`annotation_ko 업데이트 실패 건수: ${failed.length}`);
}

// ===== SSE 유틸 =====

// SSE 헤더 설정
function sseInit(res: NextApiResponse) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Nginx 등 중간 버퍼링 방지
    // @ts-ignore
    res.flushHeaders?.();
}

// SSE payload 전송
function sseSend(res: NextApiResponse, payload: any) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// SSE 하트비트(선택)
function sseHeartbeat(res: NextApiResponse) {
    res.write(`: heartbeat\n\n`);
}

// SSE 종료
function sseEnd(res: NextApiResponse) {
    res.write(`data: ${JSON.stringify({ type: "end" })}\n\n`);
    res.end();
}

// ===== 스트리밍 처리 =====

// Verse 번역 스트리밍 (마지막에 정렬/업서트/최종본 전송)
async function handleStreamTranslate(req: NextApiRequest, res: NextApiResponse) {
    const { lyrics, songId, songTitle } = req.body as {
        lyrics: string;
        songId: string | number;
        songTitle?: string;
    };

    if (!lyrics || !songId) {
        res.status(400).json({ error: "lyrics, songId 필요" });
        return;
    }

    const model = getModelOrThrow();
    sseInit(res);

    const srcLines = lyrics.replace(/\r\n/g, "\n").split("\n");
    let full = "";
    let streamed = false;

    try {
        const completion = await openai.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: "너는 영어 가사를 한국어로 자연스럽게 번역한다. 요약 금지. 원문 줄수와 동일하게 한 줄씩 대응하여 출력할 것. 추가 텍스트 금지." },
                { role: "user", content: VerseTranslatePrompt(lyrics, songTitle ?? "") },
            ],
        });

        for await (const part of completion) {
            const delta = part.choices?.[0]?.delta?.content || "";
            if (!delta) continue;
            streamed = true;
            full += delta;
            sseSend(res, { type: "delta", data: delta });
        }
    } catch (e) {
        console.error("OpenAI 스트리밍 오류(translate):", e);
    }

    // 스트림 실패/중단 시 폴백: 비스트림 완본을 받아서 SSE로 쪼개 흘려보내기
    if (!streamed && full.length === 0) {
        try {
            const c = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 가사를 한국어로 자연스럽게 번역한다. 요약 금지. 원문 줄수와 동일하게 한 줄씩 대응하여 출력할 것. 추가 텍스트 금지." },
                    { role: "user", content: VerseTranslatePrompt(lyrics, songTitle ?? "") },
                ],
            });
            full = c.choices[0].message?.content?.trim() || "";

            // 폴백도 SSE 유지: 줄 단위로 delta 전송
            const lines = full.replace(/\r\n/g, "\n").split("\n");
            for (let i = 0; i < lines.length; i++) {
                sseSend(res, { type: "delta", data: (i > 0 ? "\n" : "") + lines[i] });
            }
        } catch (e2) {
            console.error("폴백 번역 실패(translate):", e2);
            sseSend(res, { type: "error", data: "translate_fallback_failed" });
            sseEnd(res);
            return;
        }
    }

    // 최종 정렬 및 DB 업서트
    let finalText = full.replace(/\r\n/g, "\n");
    try {
        const aligned = alignToSourceLines(srcLines, finalText);
        finalText = aligned.join("\n");

        const upserts = srcLines.map((line, idx) => ({
            song_id: Number(songId),
            line_number: idx + 1,
            fragment_text: line,
            translated_text: aligned[idx] || null,
        }));

        const { error: upErr } = await supabase
            .from("interpretations")
            .upsert(upserts, { onConflict: "song_id,line_number" });
        if (upErr) console.error("interpretations 번역 업서트 실패:", upErr);

        // annotation_text만 있고 annotation_ko 비어있는 항목 보조 번역
        translateMissingAnnotations(Number(songId), model).catch((err) =>
            console.error("annotation 보조 번역 실패:", err)
        );
    } catch (dbErr) {
        console.error("번역 최종 정렬/업서트 오류:", dbErr);
    }

    // 최종본/종료 이벤트
    sseSend(res, { type: "final", data: finalText });
    sseEnd(res);
}

// About 번역 스트리밍 (그대로 스트림, 폴백은 완본을 delta로 한번에 흘리기)
async function handleStreamAbout(req: NextApiRequest, res: NextApiResponse) {
    const { about, songTitle } = req.body as {
        about: string;
        songTitle?: string;
    };

    if (!about) {
        res.status(400).json({ error: "about 필요" });
        return;
    }

    const model = getModelOrThrow();
    sseInit(res);

    let full = "";
    let streamed = false;

    try {
        const completion = await openai.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: "너는 영어 설명을 한국어로 자연스럽게 번역한다. 요약/생략/의미 추가/삭제 금지. 문단/문장/줄바꿈/헤더/불릿/인용/URL/고유명사/숫자 보존. 번역문만 출력할 것." },
                { role: "user", content: TranslatePrompt(about, songTitle ?? "") },
            ],
        });

        for await (const part of completion) {
            const delta = part.choices?.[0]?.delta?.content || "";
            if (!delta) continue;
            streamed = true;
            full += delta;
            sseSend(res, { type: "delta", data: delta });
        }
    } catch (e) {
        console.error("OpenAI 스트리밍 오류(about):", e);
    }

    if (!streamed && full.length === 0) {
        try {
            const c = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 설명을 한국어로 자연스럽게 번역한다. 요약/생략/의미 추가/삭제 금지. 문단/문장/줄바꿈/헤더/불릿/인용/URL/고유명사/숫자 보존. 번역문만 출력할 것." },
                    { role: "user", content: TranslatePrompt(about, songTitle ?? "") },
                ],
            });
            full = (c.choices[0].message?.content || "").toString();

            // 폴백도 SSE 유지: 내용 전체를 delta 한 번으로 송신
            sseSend(res, { type: "delta", data: full });
        } catch (e2) {
            console.error("폴백 번역 실패(about):", e2);
            sseSend(res, { type: "error", data: "about_fallback_failed" });
            sseEnd(res);
            return;
        }
    }

    sseSend(res, { type: "final", data: full });
    sseEnd(res);
}

// ===== API 핸들러 =====
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { lyrics, about, mode, songId, songTitle, stream } = req.body as {
        lyrics?: string;
        about?: string;
        mode: "translate" | "about";
        songId?: string | number;
        songTitle?: string;
        stream?: boolean;
    };

    // 클라이언트가 어떤 방식으로든 스트림을 원하면 SSE로 처리
    const wantsStream =
        stream === true ||
        (typeof req.query.stream === "string" && req.query.stream === "1") ||
        (req.headers.accept || "").toLowerCase().includes("text/event-stream");

    try {
        const model = getModelOrThrow();

        // 스트리밍 분기
        if (wantsStream) {
            if (mode === "translate") return await handleStreamTranslate(req, res);
            if (mode === "about") return await handleStreamAbout(req, res);
            return res.status(400).json({ error: "유효하지 않은 mode" });
        }

        // ===== 비-스트리밍 폴백 처리 =====
        if (mode === "translate") {
            if (!lyrics || !songId) return res.status(400).json({ error: "lyrics, songId 필요" });

            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 가사를 한국어로 자연스럽게 번역한다. 요약 금지. 원문 줄수와 동일하게 한 줄씩 대응하여 출력할 것. 추가 텍스트 금지." },
                    { role: "user", content: VerseTranslatePrompt(lyrics, songTitle ?? "") },
                ],
            });

            const raw = completion.choices[0].message?.content?.trim() || "";
            const srcLines = lyrics.replace(/\r\n/g, "\n").split("\n");
            const aligned = alignToSourceLines(srcLines, raw);

            const upserts = srcLines.map((line, idx) => ({
                song_id: Number(songId),
                line_number: idx + 1,
                fragment_text: line,
                translated_text: aligned[idx] || null,
            }));

            const { error: upErr } = await supabase
                .from("interpretations")
                .upsert(upserts, { onConflict: "song_id,line_number" });
            if (upErr) console.error("interpretations 번역 업서트 실패:", upErr);

            translateMissingAnnotations(Number(songId), model).catch((err) =>
                console.error("annotation 보조 번역 실패:", err)
            );

            return res.status(200).json({ result: aligned.join("\n") });
        }

        if (mode === "about") {
            if (!about) return res.status(400).json({ error: "about 필요" });

            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 설명을 한국어로 자연스럽게 번역한다. 요약/생략/의미 추가/삭제 금지. 문단/문장/줄바꿈/헤더/불릿/인용/URL/고유명사/숫자 보존. 번역문만 출력할 것." },
                    { role: "user", content: TranslatePrompt(about, songTitle ?? "") },
                ],
            });

            const result = completion.choices[0].message?.content?.trim() || "";
            return res.status(200).json({ result });
        }

        return res.status(400).json({ error: "mode 값이 유효하지 않습니다." });
    } catch (err) {
        console.error("interpret.ts 오류:", err);
        if (!res.headersSent) {
            return res.status(500).json({ error: "번역 처리 중 오류" });
        } else {
            try { res.write("\n"); } catch { }
            res.end();
        }
    }
}
