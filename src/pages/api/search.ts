// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from "next";

const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN!;
const RAPIDAPI_KEY = process.env.MUSIXMATCH_API_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "곡 ID가 유효하지 않습니다." });
  }

  try {
    // 1) Genius API로 곡 메타데이터 조회
    const songRes = await fetch(`https://api.genius.com/songs/${id}`, {
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });
    if (!songRes.ok) throw new Error(`Genius API 요청 실패: ${songRes.status}`);

    const { response: { song } } = await songRes.json();
    const title = song.title;
    const artist = song.primary_artist?.name || "";
    const producers = song.producer_artists?.map((a: any) => a.name).join(", ") || null;
    const about = song.description?.plain || null;

    // 2) RapidAPI Musixmatch: 검색 요청
    const searchUrl = `https://musixmatch-song-lyrics-api.p.rapidapi.com/search?q=${encodeURIComponent(`${title} ${artist}`)}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "musixmatch-song-lyrics-api.p.rapidapi.com",
      },
    });

    let lyrics = "";
    if (searchRes.ok) {
      const searchJson = await searchRes.json();
      const tracks = searchJson.tracks;
      const trackId = tracks?.[0]?.id;

      if (trackId) {
        const lyricsUrl = `https://musixmatch-song-lyrics-api.p.rapidapi.com/track_lyrics?id=${trackId}`;
        const lyricsRes = await fetch(lyricsUrl, {
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "musixmatch-song-lyrics-api.p.rapidapi.com",
          },
        });

        if (lyricsRes.ok) {
          const lyricsJson = await lyricsRes.json();
          lyrics = lyricsJson.lyrics || "";
        }
      }
    }

    if (!lyrics) {
      console.warn(`[DEBUG] RapidAPI 가사 없음 for "${title}" by "${artist}"`);
      lyrics = "가사를 불러오지 못했습니다.";
    }

    res.status(200).json({
      id: song.id,
      title,
      artist,
      album: song.album?.name || null,
      release_date: song.release_date || null,
      album_cover: song.song_art_image_url,
      producer: producers,
      about,
      lyrics,
    });
  } catch (err) {
    console.error("곡 데이터 추출 실패:", err);
    res.status(500).json({ error: "곡 데이터를 가져오는 중 오류 발생" });
  }
}
