import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// 조회용 (anon key)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 수정용 (service_role key)
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ================== 댓글 조회 (GET) ==================
  if (req.method === "GET") {
    const { songId } = req.query;
    if (!songId || typeof songId !== "string") {
      return res.status(400).json({ error: "songId is required" });
    }

    try {
      const songIdNum = Number(songId);

      const { data, error } = await supabaseAnon
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          users (
            provider,
            email
          )
        `
        )
        .eq("song_id", songIdNum)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("댓글 불러오기 실패:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    } catch (err: any) {
      console.error("댓글 조회 에러:", err);
      return res.status(500).json({ error: "댓글을 불러오는 중 오류 발생" });
    }
  }

  // ================== 댓글 작성 (POST) ==================
  if (req.method === "POST") {
    const { songId, userId, content, email, provider } = req.body;

    if (!songId || !userId || !content) {
      return res.status(400).json({ error: "songId, userId, content 필수" });
    }

    try {
      const songIdNum = Number(songId);

      // ✅ 먼저 users 테이블에 해당 user upsert
      const { error: userError } = await supabaseService.from("users").upsert(
        {
          id: userId,
          email: email || null,
          provider: provider || "unknown",
        },
        { onConflict: "id" }
      );

      if (userError) {
        console.error("유저 upsert 실패:", userError);
        return res.status(500).json({ error: "유저 정보 저장 중 오류 발생" });
      }

      // ✅ 댓글 저장
      const { error } = await supabaseService.from("comments").insert([
        {
          song_id: songIdNum,
          user_id: userId,
          content,
        },
      ]);

      if (error) {
        console.error("댓글 저장 실패:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("댓글 작성 에러:", err);
      return res.status(500).json({ error: "댓글 저장 중 오류 발생" });
    }
  }

  // ================== 댓글 삭제 (DELETE) ==================
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id 필수" });
    }

    try {
      const { error } = await supabaseService.from("comments").delete().eq("id", id);

      if (error) {
        console.error("댓글 삭제 실패:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("댓글 삭제 에러:", err);
      return res.status(500).json({ error: "댓글 삭제 중 오류 발생" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
