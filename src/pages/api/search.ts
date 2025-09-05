import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";

// 재시도 유틸
async function fetchWithRetry(url: string, options: any, retries = 2, delay = 1000) {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (res.status !== 429 && res.status < 500) return res; // 4xx(429 제외)는 재시도 안 함

    console.warn(`API ${res.status} → ${delay}ms 후 재시도 (${i + 1}/${retries})`);
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error("API 호출 실패 (429/5xx 지속)");
}

// Genius HTML → 텍스트 추출
function extractLyricsFromHtml(html: string) {
  const $ = load(html);
  $("script, style, noscript, iframe").remove();

  const blocks: string[] = [];

  const sel1 = $('[data-lyrics-container="true"]');
  if (sel1.length) {
    blocks.push(...sel1.toArray().map((el) => $(el).text()));
  }

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

  const text = blocks.join("\n");

  return text
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "곡 ID가 유효하지 않습니다." });
  }

  try {
    // 1) 메타데이터
    const metaRes = await fetchWithRetry(
      `https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=${id}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
        },
      }
    );

    if (!metaRes.ok) throw new Error(`메타데이터 요청 실패: ${metaRes.status}`);
    const metaData = await metaRes.json();
    const song = metaData.song;
    if (!song) throw new Error("곡 데이터를 찾을 수 없습니다.");

    const producers = song.producer_artists?.map((a: any) => a.name) || [];
    const aboutHtml = song.description?.html || "";
    const aboutText = aboutHtml.replace(/<\/?[^>]+(>|$)/g, "");

    // 2) 가사
    let lyrics = "";
    try {
      const lyricsRes = await fetchWithRetry(
        `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${id}&text_format=plain`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
          },
        }
      );

      if (lyricsRes.ok) {
        const data = await lyricsRes.json();
        const plain =
          data?.lyrics?.lyrics?.body?.plain ??
          data?.lyrics?.lyrics?.body?.plaintext ??
          null;

        const html =
          data?.lyrics?.lyrics?.body?.html ??
          data?.lyrics?.lyrics?.body?.dom ??
          null;

        if (plain && typeof plain === "string") {
          lyrics = plain;
        } else if (html && typeof html === "string") {
          lyrics = extractLyricsFromHtml(html);
        }
      }
    } catch (err) {
      console.warn("Lyrics API 실패, fallback 시도:", err);
    }

    // 3) fallback 크롤링
    if (!lyrics) {
      try {
        const htmlRes = await fetchWithRetry(song.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        const html = await htmlRes.text();
        lyrics = extractLyricsFromHtml(html);
      } catch (crawlErr) {
        console.error("크롤링 실패:", crawlErr);
      }
    }

    // 4) fallback Musixmatch
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
      } catch (mxErr) {
        console.error("Musixmatch fallback 실패:", mxErr);
      }
    }

    // 5) 최종 후처리
    if (lyrics) {
      lyrics = lyrics
        .replace(/\r\n/g, "\n")
        .replace(/\u00a0/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    // 6) 응답
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
    });
  } catch (e) {
    console.error("곡 데이터 가져오기 실패:", e);
    res.status(500).json({ error: "곡 데이터를 가져오는 중 오류 발생" });
  }
}
