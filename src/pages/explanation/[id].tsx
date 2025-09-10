// /pages/explanation/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Comments from "../../components/Comments";
import SignInModal from "../../components/SignInModal";
import HoverTooltip from "../../components/HoverTooltip";
import { createClient } from "@supabase/supabase-js";

// Supabase (client)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 해설 레코드 타입
type Interpretation = {
    id?: string;
    song_id: number;
    line_number: number | null;
    fragment_text: string;
    translated_text?: string | null;   // 한국어 줄 번역
    annotation_text?: string | null;   // 영문 Genius annotation
    annotation_ko?: string | null;     // 한국어 Genius annotation
};

// 한 줄에 매칭될 Interpretation 선택 로직
// 1) line_number === idx+1 우선
// 2) fragment_text가 line에 포함되는 후보 포함
// 3) annotation_ko 보유 후보가 있으면 그 집합만 사용
// 4) fragment_text 길이가 긴 후보를 우선 반환
function pickInterpForLine(
    line: string,
    idx: number,
    interps: Interpretation[]
): Interpretation | undefined {
    if (!interps?.length) return undefined;

    const byIndex = interps.filter((i) => i.line_number === idx + 1);
    const byFragment = interps.filter(
        (i) =>
            i.fragment_text &&
            line.toLowerCase().includes(i.fragment_text.toLowerCase())
    );

    let candidates: Interpretation[] = [...byIndex, ...byFragment];

    const withKo = candidates.filter(
        (c) => c.annotation_ko && c.annotation_ko.trim() !== ""
    );
    if (withKo.length) candidates = withKo;

    if (!candidates.length) return undefined;

    const unique = new Map<string, Interpretation>();
    candidates.forEach((c) =>
        unique.set(`${c.line_number}-${c.fragment_text}`, c)
    );

    return [...unique.values()].sort((a, b) => {
        const la = (a.fragment_text || "").length;
        const lb = (b.fragment_text || "").length;
        return lb - la; // 길이 긴 순
    })[0];
}

export default function ExplanationPage() {
    const router = useRouter();
    const { id } = router.query as { id?: string };

    // 페이지 상태
    const [song, setSong] = useState<any>(null);
    const [lyrics, setLyrics] = useState("");
    const [about, setAbout] = useState("");
    const [translation, setTranslation] = useState("");
    const [loading, setLoading] = useState(false);

    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [aboutText, setAboutText] = useState("");
    const [aboutLoading, setAboutLoading] = useState(false);

    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);

    const [interpretations, setInterpretations] = useState<Interpretation[]>([]);

    // 초기 데이터 로드
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
                setInterpretations(
                    Array.isArray(data.interpretations) ? data.interpretations : []
                );
            })
            .catch((err) => console.error("곡 데이터 가져오기 실패:", err));
    }, [id]);

    // 전체 번역 트리거 → interpretations.translated_text upsert
    const handleTranslate = async () => {
        if (!lyrics) return;
        const songId = id;
        const songTitle = song?.title || "";

        setLoading(true);
        try {
            const res = await fetch("/api/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lyrics, about, mode: "translate", songId, songTitle }),
            });
            const data = await res.json();
            setTranslation(data.result || "");
        } catch (e) {
            console.error("번역 요청 실패:", e);
            setTranslation("⚠️ 번역 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 가사 한 줄 렌더링
    const renderLyricLine = (line: string, idx: number) => {
        if (!line.trim()) return <br key={idx} />;

        const interp = pickInterpForLine(line, idx, interpretations);

        return (
            <HoverTooltip
                key={idx}
                original={line}
                highlightText={interp?.fragment_text}
                translated={interp?.translated_text || undefined}
                // annotation_ko가 있으면 우선 사용, 없을 때 영문 annotation 표시
                explanation={
                    (interp?.annotation_ko && interp.annotation_ko.trim())
                        ? interp.annotation_ko
                        : (interp?.annotation_text || undefined)
                }
            />
        );
    };

    // 외부 서비스 딥링크 (아티스트+타이틀 검색)
    const query = useMemo(() => {
        const q = `${song?.artist || ""} ${song?.title || ""}`.trim();
        return encodeURIComponent(q);
    }, [song?.artist, song?.title]);

    const youTubeMusicUrl = `https://music.youtube.com/search?q=${query}`;
    const spotifyUrl = `https://open.spotify.com/search/${query}`;
    const appleMusicUrl = `https://music.apple.com/kr/search?term=${query}`;
    const melonUrl = `https://www.melon.com/search/total/index.htm?q=${query}`;
    const genieUrl = `https://www.genie.co.kr/search/searchMain?query=${query}`;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                {!id || !song ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-black text-lg mb-6">곡 정보를 불러오는 중...</p>
                        <img src="/icons/loading.gif" alt="Loading..." className="w-12 h-12" />
                    </div>
                ) : (
                    <>
                        {/* 상단: 앨범 / 메타 / 번역 버튼 / 외부 링크 */}
                        <div className="flex flex-col md:flex-row items-start gap-12 mb-12">
                            {/* 앨범 커버 */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={song.album_cover}
                                    alt={`${song.title} album cover`}
                                    className="w-64 h-64 rounded-lg shadow object-cover"
                                />
                                <span className="mt-2 text-sm text-gray-500">Album Cover</span>
                            </div>

                            {/* 메타 + 번역 버튼 */}
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

                            {/* 외부 링크 (딥링크) */}
                            <div className="w-48">
                                <h2 className="text-xl font-semibold mb-4 text-black">External Link</h2>
                                <ul className="space-y-4 text-black">
                                    <li>
                                        <a
                                            href={youTubeMusicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            <img src="/icons/YouTube.svg" alt="YouTube Music" className="w-5 h-5" />
                                            <span>YouTube Music</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            <img src="/icons/Spotify.svg" alt="Spotify" className="w-5 h-5" />
                                            <span>Spotify</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={appleMusicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            <img src="/icons/AppleMusic.png" alt="Apple Music" className="w-5 h-5" />
                                            <span>Apple Music</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={melonUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            <img src="/icons/Melon.png" alt="Melon" className="w-5 h-5" />
                                            <span>Melon</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={genieUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 hover:underline"
                                        >
                                            <img src="/icons/Genie.png" alt="Genie Music" className="w-5 h-5" />
                                            <span>Genie Music</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 가사 + 번역 (한 박스 내 좌우 배치) */}
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full">
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <h3 className="text-3xl font-bold text-black">Original Verse</h3>
                                <h3 className="text-3xl font-bold text-black">Verse’tory Verse</h3>
                            </div>

                            <div className="space-y-4">
                                {lyrics.split("\n").map((line, idx) => (
                                    <div key={idx} className="grid grid-cols-2 gap-8">
                                        <div className="relative w-full text-sm leading-relaxed text-black font-sans">
                                            {renderLyricLine(line, idx)}
                                        </div>
                                        <div className="text-sm leading-relaxed text-gray-700 font-sans">
                                            {loading ? (
                                                idx === 0 && <p className="text-gray-400">Verse’tory 해석중...</p>
                                            ) : translation ? (
                                                translation.split("\n")[idx] || ""
                                            ) : (
                                                idx === 0 && (
                                                    <p className="text-gray-400">
                                                        번역과 해설은 [Translate &amp; Interpretation] 버튼을 누르면 표시됩니다.
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Send Feedback (가사와 About 사이) */}
                        <div className="flex justify-center my-24">
                            <button
                                onClick={async () => {
                                    const {
                                        data: { user },
                                    } = await supabase.auth.getUser();
                                    if (!user) {
                                        setSignInOpen(true);
                                    } else {
                                        router.push(`/feedback?song=${encodeURIComponent(song.title || "")}`);
                                    }
                                }}
                                className="px-6 py-3 flex items-center gap-2 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                            >
                                <img src="/icons/paper-plane.svg" alt="Send" className="w-5 h-5" />
                                Send Feedback
                            </button>
                        </div>

                        {/* About (접기/펼치기) */}
                        <section className="mt-24">
                            <h2 className="text-3xl font-bold text-black mb-4">About</h2>
                            {!aboutExpanded ? (
                                <div className="relative max-h-80 overflow-hidden">
                                    <div className="whitespace-pre-wrap text-black leading-relaxed">{about}</div>
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

                        {/* Comments (접기/펼치기) */}
                        <section className="mt-24">
                            <h2 className="text-3xl font-bold text-black mb-4">Comments</h2>
                            <div
                                className={`relative transition-all duration-300 ease-in-out ${commentsExpanded ? "max-h-none" : "max-h-80 overflow-hidden"
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

            {/* 로그인 모달 */}
            {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} />}

            <Footer />
        </div>
    );
}
