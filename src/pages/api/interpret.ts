// /pages/api/interpret.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import TranslatePrompt from "../../prompts/TranslatePrompt";
import VerseTranslatePrompt from "../../prompts/VerseTranslatePrompt";

// 서버 전용 Supabase (service_role)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 환경변수에서 OpenAI 모델 이름 얻기
function getModelOrThrow() {
    const model = process.env.OPENAI_MODEL;
    if (!model) throw new Error("OPENAI_MODEL 환경변수가 설정되지 않았습니다.");
    return model as string;
}

// 줄 정렬 유틸: 모델 출력이 원문+번역(2N) 형태거나 개수가 달라도 입력 줄 수에 맞춰 보정
function alignToSourceLines(src: string[], raw: string) {
    const out = (raw || "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((s) => s.replace(/\s+$/, ""));

    if (out.length === src.length) return out;

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

    if (out.length < src.length) {
        const padded = out.slice();
        while (padded.length < src.length) padded.push("");
        return padded;
    }
    return out.slice(0, src.length);
}

// OpenAI 클라이언트
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// annotation_text(영문) → annotation_ko(한글) 번역 후, 행별 update로 저장
async function translateMissingAnnotations(songId: number, model: string) {
    // 1) annotation_ko가 비어 있고 annotation_text가 있는 줄 조회
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

    // 2) 원문 리스트 구성
    const originals = rows.map((r) => (r.annotation_text || "").replace(/\r\n/g, "\n").trim());
    const delimiter = "#####";

    // 3) 프롬프트 구성 (요약 금지, 순서 유지, delimiter로 정확히 분리)
    const systemMsg =
        "너는 영어 해설(Annotation)을 한국어로 정확하고 자연스럽게 번역한다. 요약/의미 추가/삭제 금지. 마크다운/불릿 금지.";
    const userMsg = [
        "다음은 노래 주석(Annotation) 원문 목록이다.",
        `각 항목을 한국어로 번역하여, 항목 사이를 정확히 '${delimiter}' 한 줄로만 구분해서 반환해라.`,
        "항목 수와 순서를 반드시 유지해라.",
        "",
        "원문 목록 시작 >>>",
        originals.join(`\n${delimiter}\n`),
        "<<< 원문 목록 끝",
    ].join("\n");

    // 4) OpenAI 호출
    const completion = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg },
        ],
    });

    const raw = completion.choices[0].message?.content ?? "";
    let parts = raw.split(delimiter).map((s) => s.trim());

    // 5) 개수 보정
    if (parts.length < originals.length) {
        while (parts.length < originals.length) parts.push("");
    } else if (parts.length > originals.length) {
        parts = parts.slice(0, originals.length);
    }

    // 6) 각 행을 id로 update (upsert 대신 update로 정확히 갱신)
    const tasks = rows.map((r, i) =>
        supabase
            .from("interpretations")
            .update({ annotation_ko: parts[i] || null })
            .eq("id", r.id)
    );

    const results = await Promise.allSettled(tasks);
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
        console.error(`annotation_ko 업데이트 실패 건수: ${failed.length}`);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { lyrics, about, mode, songId, songTitle } = req.body as {
        lyrics?: string;
        about?: string;
        mode: "translate" | "about";
        songId?: string | number;
        songTitle?: string;
    };

    try {
        const model = getModelOrThrow();

        // 가사 번역 + interpretations.translated_text 업서트
        if (mode === "translate") {
            if (!lyrics || !songId) return res.status(400).json({ error: "lyrics, songId 필요" });

            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 가사를 한국어로 자연스럽게 번역한다. 요약 금지." },
                    { role: "user", content: VerseTranslatePrompt(lyrics, songTitle ?? "") },
                ],
            });

            const raw = completion.choices[0].message?.content?.trim() || "";
            const srcLines = lyrics.replace(/\r\n/g, "\n").split("\n");
            const aligned = alignToSourceLines(srcLines, raw);

            // interpretations에 줄 기준으로 업서트 (song_id,line_number 충돌 키)
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

            // 이어서 annotation_text만 있고 annotation_ko가 비어있는 항목을 한국어로 번역
            await translateMissingAnnotations(Number(songId), model);

            return res.status(200).json({ result: aligned.join("\n") });
        }

        // About 번역 (요약 금지)
        if (mode === "about") {
            if (!about) return res.status(400).json({ error: "about 필요" });

            const completion = await openai.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "너는 영어 설명을 한국어로 자연스럽게 번역한다. 요약 금지." },
                    { role: "user", content: TranslatePrompt(about, songTitle ?? "") },
                ],
            });

            const result = completion.choices[0].message?.content?.trim() || "";
            return res.status(200).json({ result });
        }

        return res.status(400).json({ error: "mode 값이 유효하지 않습니다." });
    } catch (err) {
        console.error("interpret.ts 오류:", err);
        return res.status(500).json({ error: "번역 처리 중 오류" });
    }
}
