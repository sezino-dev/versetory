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
  const [aboutKo, setAboutKo] = useState("");
  const [loading, setLoading] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(false);

  // 곡 정보 + 가사 불러오기
  useEffect(() => {
    if (!id) return;

    // 초기화
    setTranslation("");
    setAboutKo("");
    setLoading(false);
    setAboutLoading(false);

    fetch(`/api/search?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);
        setLyrics(data.lyrics || "");
        setAbout(data.about || "");
      })
      .catch((err) => console.error("곡 데이터 가져오기 실패:", err));
  }, [id]);

  // 번역 요청
  const handleTranslate = async () => {
    if (!lyrics && !about) return;

    const songId = id;
    const songTitle = song?.title || "";

    // 가사 번역
    if (lyrics) {
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
    }

    // About 번역
    if (about) {
      setAboutLoading(true);
      try {
        const res2 = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            about,
            mode: "about",
            songId,
            songTitle,
          }),
        });
        const data2 = await res2.json();
        setAboutKo(data2.result || "");
      } catch (e) {
        console.error(e);
        setAboutKo("⚠️ About 번역 중 오류가 발생했습니다.");
      } finally {
        setAboutLoading(false);
      }
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
                  <span className="block">Release date : {song.release_date || "정보 없음"}</span>
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
                    아직 번역이 없습니다. [Translate &amp; Interpretation] 버튼을 눌러주세요.
                  </p>
                )}
              </div>
            </div>

            {/* About */}
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-black mb-2">About</h2>
              <p className="text-gray-500 mb-4">Genius의 About을 한국어로 자연스럽게 번역한 내용</p>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {aboutLoading ? (
                  <p className="text-gray-400">About 번역 중...</p>
                ) : aboutKo ? (
                  <div className="whitespace-pre-wrap text-black">{aboutKo}</div>
                ) : about ? (
                  <p className="text-gray-400">
                    아직 번역이 없습니다. 상단의 [Translate &amp; Interpretation] 버튼을 눌러주세요.
                  </p>
                ) : (
                  <p className="text-gray-400">About 정보가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 댓글 */}
            {id && <Comments songId={id} />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
