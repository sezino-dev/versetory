// /src/pages/api/comments.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { songId } = req.query;
    if (!songId || typeof songId !== "string") {
      return res.status(400).json([]); // 항상 배열 반환
    }

    const { data, error } = await supabase
      .from("comments")
      .select("id, user_id, content, created_at")
      .eq("song_id", songId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("댓글 불러오기 실패:", error);
      return res.status(500).json([]);
    }

    return res.status(200).json(data || []);
  }

  if (req.method === "POST") {
    const { songId, userId, content } = req.body;
    if (!songId || !userId || !content) {
      return res.status(400).json({ error: "songId, userId, content가 필요합니다." });
    }

    const { error } = await supabase.from("comments").insert({
      song_id: songId,
      user_id: userId,
      content,
    });

    if (error) {
      console.error("댓글 작성 실패:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "댓글 작성 성공" });
  }

  if (req.method === "DELETE") {
    const { id, userId } = req.body;
    if (!id || !userId) {
      return res.status(400).json({ error: "id, userId가 필요합니다." });
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("댓글 삭제 실패:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "댓글 삭제 성공" });
  }

  return res.status(405).json({ error: "허용되지 않은 메소드" });
}
