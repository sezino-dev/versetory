import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FeedbackPage() {
  const router = useRouter();

  const [songTitle, setSongTitle] = useState("");
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");
  const [content, setContent] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (router.query.song) {
      setSongTitle(router.query.song as string);
    }
  }, [router.query.song]);

  const handleSubmit = async () => {
    if (!content.trim() || !agree) {
      setMessage("⚠️ 피드백 내용과 약관 동의가 필요합니다.");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("feedback").insert([
      {
        user_id: user?.id || null,
        content,
      },
    ]);

    if (error) {
      setMessage("⚠️ 저장 중 오류가 발생했습니다.");
    } else {
      setMessage("✅ 피드백이 제출되었습니다. 감사합니다!");
      setSongTitle("");
      setReason("");
      setTitle("");
      setEmail("");
      setAccountType("");
      setContent("");
      setAgree(false);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      {/* ✅ 폭 확장 */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-bold text-black mb-2">Send Feedback</h1>
        <p className="text-gray-600 mb-10">
          Your valuable feedback helps us improve and deliver a better-quality service. <br />
          사용자 여러분의 소중한 피드백이 더 나은 품질의 서비스를 제공하는데 큰 힘이 됩니다
        </p>

        {/* 곡 제목 + 이유 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <input
            type="text"
            placeholder="Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px]"
          />
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`w-full border border-gray-300 rounded-lg px-4 py-3 h-[52px] ${
              reason === "" ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="" disabled hidden>
              Please select a reason for your feedback
            </option>
            <option value="translation">Translation Quality</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other...</option>
          </select>
        </div>

        {/* 제목 + 이메일 + 계정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <input
            type="text"
            placeholder="Feedback Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px]"
          />
          <div className="flex gap-4 w-full">
            <input
              type="email"
              placeholder="Example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px]"
            />
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className={`flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-3 h-[52px] ${
                accountType === "" ? "text-gray-400" : "text-black"
              }`}
            >
              <option value="" disabled hidden>
                Select Account
              </option>
              <option value="Google Account">Google Account</option>
              <option value="Kakao Account">Kakao Account</option>
              <option value="Facebook Account">Facebook Account</option>
            </select>
          </div>
        </div>

        {/* 피드백 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <textarea
            placeholder="Leave your feedback"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="col-span-2 w-full border border-gray-300 rounded-lg px-4 py-3 h-40 text-black"
          />
        </div>

        {/* 약관 */}
        <label className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4"
          />
          I agree to the Terms of Service.
        </label>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!agree || loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Send Feedback"}
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </main>

      <Footer />
    </div>
  );
}
