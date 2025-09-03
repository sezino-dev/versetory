import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "곡 ID가 유효하지 않습니다." });
  }

  try {
    // 1) 곡 메타데이터
    const songRes = await fetch(`https://api.genius.com/songs/${id}`, {
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });
    if (!songRes.ok) throw new Error(`Genius API 곡 요청 실패: ${songRes.status}`);

    const songData = await songRes.json();
    const song = songData.response.song;

    const producers = song.producer_artists?.map((a: any) => a.name) || [];
    const about = song.description?.plain || null;

    // 2) 가사 페이지 HTML 크롤링
    const pageRes = await fetch(song.url);
    const html = await pageRes.text();
    const $ = load(html);

    let lyrics = "";

    // 3) __NEXT_DATA__ JSON 찾기
    const nextDataScript = $('script#__NEXT_DATA__').html();
    if (nextDataScript) {
      try {
        const nextData = JSON.parse(nextDataScript);

        // 구조 확인: Genius 프론트의 pageProps 내부
        const lyricsHtml =
          nextData?.props?.pageProps?.songPage?.lyricsData?.lyrics?.body?.html;

        if (lyricsHtml) {
          const $lyrics = load(lyricsHtml);
          lyrics = $lyrics.text();
        }
      } catch (err) {
        console.error(">>> [DEBUG] __NEXT_DATA__ 파싱 실패:", err);
      }
    }

    // 4) fallback: 기존 구조
    if (!lyrics) {
      lyrics =
        $('[data-lyrics-container="true"]').map((_, el) => $(el).text()).get().join("\n") ||
        $(".Lyrics__Container").map((_, el) => $(el).text()).get().join("\n");
    }

    // 5) fallback2: <p> 태그 모아보기
    if (!lyrics) {
      lyrics = $("p").map((_, el) => $(el).text()).get().join("\n");
    }

    // 6) 후처리
    if (lyrics) {
      lyrics = lyrics
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/Translations.*\n?/gi, "")
        .replace(/Contributors.*\n?/gi, "")
        .replace(/Read More/gi, "")
        .replace(/Follow @genius.*/gi, "")
        .replace(/^\d+\s*$/gm, "")
        .replace(/\n{2,}/g, "\n\n")
        .trim();
    }

    console.log(">>> [DEBUG] Extracted Lyrics (id:", id, ")\n", lyrics?.slice(0, 300));

    // 7) 응답
    res.status(200).json({
      id: song.id,
      title: song.title,
      artist: song.primary_artist?.name,
      album: song.album?.name || null,
      release_date: song.release_date || null,
      album_cover: song.song_art_image_url,
      producer: producers.length ? producers.join(", ") : null,
      about,
      lyrics,
    });
  } catch (e) {
    console.error("곡 데이터 가져오기 실패:", e);
    res.status(500).json({ error: "곡 데이터를 가져오는 중 오류 발생" });
  }
}
