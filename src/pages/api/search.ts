// /pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import { createClient } from "@supabase/supabase-js";

/** Supabase (server 전용) */
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** 재시도 유틸 (429/5xx만 재시도) */
async function fetchWithRetry(url: string, options: any, retries = 2, delay = 900) {
    for (let i = 0; i <= retries; i++) {
        const res = await fetch(url, options);
        if (res.ok) return res;
        if (res.status !== 429 && res.status < 500) return res;
        await new Promise((r) => setTimeout(r, delay));
    }
    throw new Error("API 재시도 실패");
}

/** Genius HTML → 가사 텍스트 추출 (fallback) */
function extractLyricsFromHtml(html: string) {
    const $ = load(html);
    $("script, style, noscript, iframe").remove();

    const blocks: string[] = [];
    const sel1 = $('[data-lyrics-container="true"]');
    if (sel1.length) blocks.push(...sel1.toArray().map((el) => $(el).text()));
    if (blocks.length === 0) {
        const sel2 = $(".Lyrics__Container");
        blocks.push(...sel2.toArray().map((el) => $(el).text()));
    }
    if (blocks.length === 0) {
        const sel3 = $("[data-lyrics-state]");
        blocks.push(...sel3.toArray().map((el) => $(el).text()));
    }
    if (blocks.length === 0) {
        const sel4 = $("div.Lyrics");
        blocks.push(...sel4.toArray().map((el) => $(el).text()));
    }

    return blocks
        .join("\n")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/Translations.*\n?/gi, "")
        .replace(/Contributors.*\n?/gi, "")
        .replace(/Read More/gi, "")
        .replace(/Follow @genius.*/gi, "")
        .replace(/^\d+\s*$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/** 문자열 정규화 (매칭 보정) */
function norm(s: string) {
    return s
        .replace(/\u00a0/g, " ")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

/** referent(fragment) → 가사 줄번호 매핑 */
function mapReferentsToLines(lyrics: string, referents: any[]) {
    const lines = lyrics.split("\n");
    const normLines = lines.map((l) => norm(l));
    const cursorByFrag = new Map<string, number>(); // 같은 fragment가 여러 번 나올 때 진행 커서

    type Mapped = {
        line_number: number;
        fragment_text: string;
        annotation_text: string | null;
    };

    const mapped: Mapped[] = [];

    for (const ref of referents) {
        const fragment: string | undefined = ref?.fragment;
        const anns: any[] = ref?.annotations || [];
        if (!fragment || anns.length === 0) continue;

        const bestAnn = anns[0]; // 가장 상단 것을 채택
        const annBodyPlain: string | undefined =
            bestAnn?.body?.plain || bestAnn?.body?._html?.replace(/<[^>]+>/g, "");

        const f = norm(fragment);
        if (!f) continue;

        const startIdx = cursorByFrag.get(f) ?? 0;

        // 완전 일치 우선, 없으면 포함 검색
        let foundIdx = -1;
        for (let i = startIdx; i < normLines.length; i++) {
            if (normLines[i] === f) {
                foundIdx = i;
                break;
            }
        }
        if (foundIdx === -1) {
            for (let i = startIdx; i < normLines.length; i++) {
                if (normLines[i].includes(f)) {
                    foundIdx = i;
                    break;
                }
            }
        }
        if (foundIdx === -1) continue;

        cursorByFrag.set(f, foundIdx + 1);

        mapped.push({
            line_number: foundIdx + 1,
            fragment_text: lines[foundIdx],
            annotation_text: annBodyPlain ? annBodyPlain.trim() : null,
        });
    }

    // 중복 줄번호가 있을 수 있어 최신 것만 남김
    const byLine = new Map<number, Mapped>();
    for (const m of mapped) byLine.set(m.line_number, m);
    return Array.from(byLine.values()).sort((a, b) => a.line_number - b.line_number);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "곡 ID가 유효하지 않습니다." });
    }

    try {
        // 1) 곡 메타데이터 (RapidAPI: genius-song-lyrics1)
        const metaRes = await fetchWithRetry(
            `https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=${id}`,
            {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
                    "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
                },
            }
        );
        if (!metaRes.ok) throw new Error(`메타데이터 실패: ${metaRes.status}`);
        const metaData = await metaRes.json();
        const song = metaData.song;
        if (!song) throw new Error("곡 데이터를 찾을 수 없음");

        const producers = song.producer_artists?.map((a: any) => a.name) || [];
        const aboutHtml = song.description?.html || "";
        const aboutText = aboutHtml.replace(/<\/?[^>]+(>|$)/g, "");

        // 2) 가사 (RapidAPI: plain → 실패시 html fallback)
        let lyrics = "";
        try {
            const lyrRes = await fetchWithRetry(
                `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${id}&text_format=plain`,
                {
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
                        "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
                    },
                }
            );
            if (lyrRes.ok) {
                const d = await lyrRes.json();
                const plain =
                    d?.lyrics?.lyrics?.body?.plain ??
                    d?.lyrics?.lyrics?.body?.plaintext ??
                    null;
                const html =
                    d?.lyrics?.lyrics?.body?.html ??
                    d?.lyrics?.lyrics?.body?.dom ??
                    null;
                if (plain) lyrics = plain;
                else if (html) lyrics = extractLyricsFromHtml(html);
            }
        } catch {
            /* 무시 */
        }

        // 3) html 크롤링 fallback
        if (!lyrics) {
            try {
                const htmlRes = await fetchWithRetry(song.url, {
                    headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
                });
                const html = await htmlRes.text();
                lyrics = extractLyricsFromHtml(html);
            } catch {
                /* 무시 */
            }
        }

        // 4) Musixmatch fallback
        if (!lyrics && song.title && song.primary_artist?.name) {
            try {
                const mxRes = await fetchWithRetry(
                    `https://musixmatchcom-musixmatch-v1.p.rapidapi.com/matcher.lyrics.get?q_track=${encodeURIComponent(
                        song.title
                    )}&q_artist=${encodeURIComponent(song.primary_artist?.name)}`,
                    {
                        headers: {
                            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
                            "X-RapidAPI-Host": "musixmatchcom-musixmatch-v1.p.rapidapi.com",
                        },
                    }
                );
                if (mxRes.ok) {
                    const mx = await mxRes.json();
                    const body = mx?.message?.body?.lyrics?.lyrics_body || "";
                    if (body) {
                        lyrics = body
                            .replace(/\*{3,}.*This Lyrics is NOT for Commercial use.*$/is, "")
                            .replace(/\n{3,}/g, "\n\n")
                            .trim();
                    }
                }
            } catch {
                /* 무시 */
            }
        }

        // 5) 가사 후처리
        if (lyrics) {
            lyrics = lyrics
                .replace(/\r\n/g, "\n")
                .replace(/\u00a0/g, " ")
                .replace(/\n{3,}/g, "\n\n")
                .trim();
        }

        // 6) 곡 캐시 upsert
        await supabase.from("songs").upsert(
            {
                id: song.id,
                title: song.title,
                artist: song.artist_names || song.primary_artist?.name,
                album: song.album?.name || null,
                released_at: song.release_date || null,
                lyrics: lyrics || null,
                created_at: new Date().toISOString(),
            },
            { onConflict: "id" }
        );

        // 7) Genius 공식 API(referents)로 annotation 수집
        //    Authorization: Bearer GENIUS_API_TOKEN 사용
        let allReferents: any[] = [];
        if (process.env.GENIUS_API_TOKEN) {
            let page = 1;
            const perPage = 50;
            for (; ;) {
                const r = await fetch(
                    `https://api.genius.com/referents?song_id=${id}&text_format=plain&per_page=${perPage}&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.GENIUS_API_TOKEN}`,
                            Accept: "application/json",
                        },
                    }
                );
                if (!r.ok) break;
                const j = await r.json();
                const refs = j?.response?.referents || [];
                allReferents = allReferents.concat(refs);
                const next = j?.response?.next_page;
                if (!next) break;
                page = next;
            }
        }

        // 8) referents → 줄번호 매핑
        let mappedAnn: {
            line_number: number;
            fragment_text: string;
            annotation_text: string | null;
        }[] = [];
        if (lyrics && allReferents.length > 0) {
            mappedAnn = mapReferentsToLines(lyrics, allReferents);
        }

        // 9) interpretations upsert (영어 annotation 저장, 번역 칼럼은 보존)
        if (mappedAnn.length > 0) {
            const rows = mappedAnn.map((m) => ({
                song_id: Number(id),
                line_number: m.line_number,
                fragment_text: m.fragment_text,
                annotation_text: m.annotation_text,
                // translated_text는 유지 (이미 있으면 그대로 두기 위해 upsert 시 null을 덮어쓰지 않음)
                created_at: new Date().toISOString(),
            }));

            // upsert: (song_id, line_number) 고유 제약
            const { error: upErr } = await supabase
                .from("interpretations")
                .upsert(rows, { onConflict: "song_id,line_number" });
            if (upErr) {
                console.error("interpretations upsert 실패:", upErr);
            }
        }

        // 10) 클라이언트용 interpretations 조회
        const { data: interpretations, error: selErr } = await supabase
            .from("interpretations")
            .select("id,song_id,line_number,fragment_text,translated_text,annotation_text,annotation_ko,created_at")
            .eq("song_id", id)
            .order("line_number", { ascending: true });

        if (selErr) {
            console.error("interpretations select 실패:", selErr);
        }

        // 11) 응답
        res.status(200).json({
            id: song.id,
            title: song.title,
            artist: song.artist_names || song.primary_artist?.name,
            album: song.album?.name || null,
            release_date: song.release_date || null,
            album_cover: song.song_art_image_url,
            producer: producers.length ? producers.join(", ") : null,
            about: aboutText,
            lyrics,
            interpretations: interpretations || [],
        });
    } catch (e) {
        console.error("검색 처리 실패:", e);
        res.status(500).json({ error: "검색 처리 중 오류" });
    }
}
