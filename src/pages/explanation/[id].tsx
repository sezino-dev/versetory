import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Comments from "../../components/Comments";

export default function ExplanationPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [song, setSong] = useState<any>(null);
  const [lyrics, setLyrics] = useState("");
  const [about, setAbout] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  // About states
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [aboutLoading, setAboutLoading] = useState(false);

  // Comments states
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setTranslation("");
    setLoading(false);

    fetch(`/api/search?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);
        setLyrics(data.lyrics || "");
        setAbout(data.about || "");
      })
      .catch((err) => console.error("곡 데이터 가져오기 실패:", err));
  }, [id]);

  const handleTranslate = async () => {
    if (!lyrics) return;
    const songId = id;
    const songTitle = song?.title || "";

    setLoading(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics,
          about,
          mode: "translate",
          songId,
          songTitle,
        }),
      });
      const data = await res.json();
      setTranslation(data.result || "");
    } catch (e) {
      console.error(e);
      setTranslation("⚠️ 번역 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {!song ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-black text-lg mb-6">곡 정보를 불러오는 중...</p>
            <img src="/icons/loading.gif" alt="Loading..." className="w-12 h-12" />
          </div>
        ) : (
          <>
            {/* 상단 곡 정보 */}
            <div className="flex flex-col md:flex-row items-start gap-12 mb-12">
              <div className="flex flex-col items-center">
                <img
                  src={song.album_cover}
                  alt={`${song.title} album cover`}
                  className="w-64 h-64 rounded-lg shadow object-cover"
                />
                <span className="mt-2 text-sm text-gray-500">Album Cover</span>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 text-black">{song.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  <span className="block">Title : {song.title}</span>
                  <span className="block">Artist : {song.artist}</span>
                  <span className="block">Producer : {song.producer || "정보 없음"}</span>
                  <span className="block">
                    Release date : {song.release_date || "정보 없음"}
                  </span>
                </p>

                <button
                  onClick={handleTranslate}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                >
                  <img src="/icons/Translate.svg" alt="Translate Icon" className="w-5 h-5" />
                  Translate & Interpretation
                </button>
              </div>

              {/* 외부 링크 */}
              <div className="w-48">
                <h2 className="text-xl font-semibold mb-4 text-black">External Link</h2>
                <ul className="space-y-4 text-black">
                  <li className="flex items-center gap-2">
                    <img src="/icons/YouTube.svg" alt="YouTube" className="w-5 h-5" />
                    <span>YouTube</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src="/icons/Spotify.svg" alt="Spotify" className="w-5 h-5" />
                    <span>Spotify</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src="/icons/AppleMusic.png" alt="Apple Music" className="w-5 h-5" />
                    <span>Apple Music</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src="/icons/Melon.png" alt="Melon" className="w-5 h-5" />
                    <span>Melon</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src="/icons/Genie.png" alt="Genie Music" className="w-5 h-5" />
                    <span>Genie Music</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 좌/우 가사 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full">
                <h2 className="text-2xl font-semibold mb-4 text-black">Original Verse</h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-black font-sans">
                  {lyrics}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full">
                <h2 className="text-2xl font-semibold mb-4 text-black">Verse’tory Translate</h2>
                {loading ? (
                  <p className="text-gray-400">번역 중...</p>
                ) : translation ? (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-black font-sans">
                    {translation}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    아직 번역이 없습니다. [Translate & Interpretation] 버튼을 눌러주세요.
                  </p>
                )}
              </div>
            </div>

            {/* Send Feedback 버튼 */}
            <div className="flex justify-center my-24">
              <button
                onClick={() =>
                  router.push(`/feedback?song=${encodeURIComponent(song.title || "")}`)
                }
                className="px-6 py-3 flex items-center gap-2 bg-black text-white rounded-lg shadow hover:bg-gray-900"
              >
                <img src="/icons/paper-plane.svg" alt="Send" className="w-5 h-5" />
                Send Feedback
              </button>
            </div>

            {/* About */}
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-black mb-4">About</h2>

              {!aboutExpanded ? (
                <div className="relative transition-all duration-300 ease-in-out max-h-80 overflow-hidden">
                  <div className="whitespace-pre-wrap text-black leading-relaxed">
                    {about}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent flex justify-center items-end pb-4">
                    <button
                      onClick={async () => {
                        setAboutExpanded(true);
                        setAboutLoading(true);
                        try {
                          const res = await fetch("/api/interpret", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              about,
                              mode: "about",
                              songId: id,
                              songTitle: song?.title || "",
                            }),
                          });
                          const data = await res.json();
                          setAboutText(data.result || "");
                        } catch (e) {
                          console.error("About 번역 실패:", e);
                          setAboutText("⚠️ 번역 중 오류가 발생했습니다.");
                        } finally {
                          setAboutLoading(false);
                        }
                      }}
                      className="px-6 py-2 bg-transparent text-black border border-black rounded-lg hover:text-gray-700"
                    >
                      Extend
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aboutLoading ? (
                    <p className="text-gray-400">About 번역 중...</p>
                  ) : (
                    <div className="whitespace-pre-wrap text-black leading-relaxed">
                      {aboutText}
                    </div>
                  )}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setAboutExpanded(false);
                        setAboutText("");
                      }}
                      className="px-6 py-2 bg-transparent text-black border border-black rounded-lg hover:text-gray-700"
                    >
                      Collapse
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Comments */}
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-black mb-4">Comments</h2>
              <div
                className={`relative transition-all duration-300 ease-in-out ${
                  commentsExpanded ? "max-h-none" : "max-h-80 overflow-hidden"
                }`}
              >
                <Comments songId={id!} />

                {!commentsExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent flex justify-center items-end pb-4">
                    <button
                      onClick={() => setCommentsExpanded(true)}
                      className="px-6 py-2 bg-transparent text-black border border-black rounded-lg hover:text-gray-700"
                    >
                      Extend
                    </button>
                  </div>
                )}
              </div>

              {commentsExpanded && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setCommentsExpanded(false)}
                    className="px-6 py-2 bg-transparent text-black border border-black rounded-lg hover:text-gray-700"
                  >
                    Collapse
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
