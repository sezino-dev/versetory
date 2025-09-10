"use client";

import { useEffect, useState } from "react";
import { useSession, useUser } from "@supabase/auth-helpers-react";

type Comment = {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  users?: {
    email: string;
    provider: string;
  };
};

export default function Comments({ songId }: { songId: string }) {
  const session = useSession();
  const user = useUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 댓글 불러오기
  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?songId=${songId}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
    }
  }

  useEffect(() => {
    if (songId) fetchComments();
  }, [songId]);

  // 댓글 등록
  async function handleSubmit() {
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId,
        userId: user?.id,
        email: user?.email,
        provider: user?.app_metadata?.provider || "unknown",
        content,
      }),
    });

    setContent("");
    await fetchComments();
    setLoading(false);
  }

  // 댓글 삭제
  async function handleDelete(id: number, commentUserId: string) {
    if (user?.id !== commentUserId) {
      return alert("본인 댓글만 삭제할 수 있습니다.");
    }

    await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: user.id }),
    });
    await fetchComments();
  }

  return (
    <div className="space-y-6">
      {/* 입력창 */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={session ? "댓글을 입력하세요..." : "로그인 후 댓글 작성 가능"}
          className="w-full min-h-[80px] p-3 border rounded-md text-black"
          disabled={!session || loading}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={!session || loading || !content.trim()}
            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border rounded-md p-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {c.users?.provider
                    ? `${c.users.provider}_${c.user_id.slice(0, 5)}`
                    : c.user_id}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </span>
              </div>
              <p className="text-black mt-2 whitespace-pre-wrap">{c.content}</p>
              {user?.id === c.user_id && (
                <button
                  onClick={() => handleDelete(c.id, c.user_id)}
                  className="text-xs text-red-500 hover:underline mt-2"
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
