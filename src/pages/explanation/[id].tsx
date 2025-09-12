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
    translated_text?: string | null;
    annotation_text?: string | null;
    annotation_ko?: string | null;
};

// 한 줄에 매칭될 Interpretation 선택 (annotation_ko 우선)
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
    candidates.forEach((c) => unique.set(`${c.line_number}-${c.fragment_text}`, c));

    return [...unique.values()].sort((a, b) => {
        const la = (a.fragment_text || "").length;
        const lb = (b.fragment_text || "").length;
        return lb - la;
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

    /**
     * 곡 ID가 바뀔 때:
     * 1) 이전 곡 상태를 초기화해 로딩 문구가 즉시 보이게 함
     * 2) 새 요청만 유효하도록 이전 요청을 Abort
     */
    useEffect(() => {
        if (!id) return;

        // 상태 초기화 (로딩 문구 표시)
        setSong(null);
        setLyrics("");
        setAbout("");
        setInterpretations([]);
        setTranslation("");
        setLoading(false);
        setAboutExpanded(false);
        setAboutText("");
        setAboutLoading(false);
        setCommentsExpanded(false);

        const ac = new AbortController();

        (async () => {
            try {
                const res = await fetch(`/api/search?id=${id}`, { signal: ac.signal });
                const data = await res.json();
                if (ac.signal.aborted) return;

                setSong(data);
                setLyrics(data.lyrics || "");
                setAbout(data.about || "");
                setInterpretations(
                    Array.isArray(data.interpretations) ? data.interpretations : []
                );
            } catch (err) {
                if (!ac.signal.aborted) {
                    console.error("곡 데이터 가져오기 실패:", err);
                }
            }
        })();

        return () => ac.abort();
    }, [id]);

    // 번역 완료 후 interpretations 리프레시
    const refreshInterpretations = async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/search?id=${id}`);
            const data = await res.json();
            setInterpretations(
                Array.isArray(data.interpretations) ? data.interpretations : []
            );
        } catch (e) {
            console.error("interpretations 갱신 실패:", e);
        }
    };

    // SSE 이벤트 파서 유틸 (data: {type, data} 만 처리)
    const consumeSSE = async (
        res: Response,
        onDelta: (chunk: string) => void,
        onFinal?: (full: string) => void
    ) => {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("ReadableStream 미지원 응답");

        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buf += decoder.decode(value, { stream: true });

            // SSE는 이벤트 사이를 빈 줄로 구분
            const events = buf.split("\n\n");
            buf = events.pop() || "";

            for (const evt of events) {
                const lines = evt.split("\n");
                for (const l of lines) {
                    if (!l.startsWith("data:")) continue;
                    const raw = l.slice(5).trim();
                    if (!raw) continue;

                    try {
                        const payload = JSON.parse(raw);
                        if (payload?.type === "delta") {
                            onDelta(payload.data || "");
                        } else if (payload?.type === "final") {
                            if (onFinal) onFinal((payload.data || "").toString());
                        } else if (payload?.type === "error") {
                            throw new Error("서버 스트림 에러");
                        }
                    } catch {
                        // JSON 파싱 실패는 무시
                    }
                }
            }
        }
    };

    // 전체 번역 스트리밍 (줄 단위 확정 커밋)
    const handleTranslate = async () => {
        if (!lyrics) return;

        const songId = id;
        const songTitle = song?.title || "";

        setLoading(true);
        setTranslation("");

        const lineCount = lyrics.replace(/\r\n/g, "\n").split("\n").length;
        const committed: string[] = new Array(lineCount).fill("");
        let partial = "";
        let lineIdx = 0;

        const pushDelta = (delta: string) => {
            if (!delta) return;

            partial += delta.replace(/\r\n/g, "\n");

            // 개행이 들어오면 줄 확정
            let nl = partial.indexOf("\n");
            while (nl >= 0 && lineIdx < committed.length) {
                const finished = partial.slice(0, nl);
                committed[lineIdx] = finished;
                lineIdx += 1;
                partial = partial.slice(nl + 1);
                nl = partial.indexOf("\n");
            }

            // 미완 줄은 미리보기로 현재 인덱스에 얹음
            const preview = committed.slice();
            if (lineIdx < preview.length) preview[lineIdx] = partial;

            setTranslation(preview.join("\n"));
        };

        try {
            const res = await fetch(`/api/interpret?stream=1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({
                    lyrics,
                    about,
                    mode: "translate",
                    songId,
                    songTitle,
                }),
            });

            if (
                res.ok &&
                res.headers.get("content-type")?.includes("text/event-stream")
            ) {
                await consumeSSE(
                    res,
                    (delta) => pushDelta(delta),
                    (finalText) =>
                        setTranslation((finalText || "").replace(/\r\n/g, "\n"))
                );
            } else {
                // SSE 미지원 폴백
                const data = await res.json();
                setTranslation((data.result || "").replace(/\r\n/g, "\n"));
            }

            await refreshInterpretations();
        } catch (e) {
            console.error("번역 스트리밍 실패, 일반 모드로 재시도:", e);
            try {
                const res2 = await fetch("/api/interpret", {
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
                const data = await res2.json();
                setTranslation((data.result || "").replace(/\r\n/g, "\n"));
                await refreshInterpretations();
            } catch (e2) {
                console.error(e2);
                setTranslation("⚠️ 번역 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    // About 번역 스트리밍
    const handleExtendAbout = async () => {
        if (!about) {
            setAboutExpanded(true);
            setAboutText("");
            return;
        }

        setAboutExpanded(true);
        setAboutLoading(true);
        setAboutText("");

        try {
            const res = await fetch(`/api/interpret?stream=1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({
                    about,
                    mode: "about",
                    songId: id,
                    songTitle: song?.title || "",
                }),
            });

            if (
                res.ok &&
                res.headers.get("content-type")?.includes("text/event-stream")
            ) {
                let acc = "";
                await consumeSSE(
                    res,
                    (delta) => {
                        acc += delta;
                        setAboutText(acc);
                    },
                    (finalText) => setAboutText((finalText || "").toString())
                );
            } else {
                const data = await res.json();
                setAboutText(data.result || "");
            }
        } catch (e) {
            console.error("About 스트리밍 실패, 일반 모드로 재시도:", e);
            try {
                const res2 = await fetch("/api/interpret", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        about,
                        mode: "about",
                        songId: id,
                        songTitle: song?.title || "",
                    }),
                });
                const data = await res2.json();
                setAboutText(data.result || "");
            } catch (e2) {
                console.error(e2);
                setAboutText("⚠️ 번역 중 오류가 발생했습니다.");
            }
        } finally {
            setAboutLoading(false);
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
                // annotation_ko 우선, 없으면 영문 주석
                explanation={
                    interp?.annotation_ko && interp.annotation_ko.trim()
                        ? interp.annotation_ko
                        : interp?.annotation_text || undefined
                }
            />
        );
    };

    // 외부 서비스 딥링크
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
                            <div className="flex flex-col items-center">
                                <img
                                    src={song.album_cover || "/no-image.png"}
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
                                    Translate &amp; Interpretation
                                </button>
                            </div>

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

                        {/* 가사 + 번역 */}
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
                                            {
                                                translation
                                                    ? (translation.split("\n")[idx] || "")
                                                    : loading
                                                        ? (idx === 0 && <p className="text-gray-400">Verse’tory 해석중...</p>)
                                                        : (idx === 0 && (
                                                            <p className="text-gray-400">
                                                                번역과 해설은 [Translate &amp; Interpretation] 버튼을 누르면 표시됩니다.
                                                            </p>
                                                        ))
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Send Feedback */}
                        <div className="flex justify-center my-24">
                            <button
                                onClick={async () => {
                                    const { data: { user } } = await supabase.auth.getUser();
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

                        {/* About (스트리밍) */}
                        <section className="mt-24">
                            <h2 className="text-3xl font-bold text-black mb-4">About</h2>
                            {!aboutExpanded ? (
                                <div className="relative max-h-80 overflow-hidden">
                                    <div className="whitespace-pre-wrap text-black leading-relaxed">{about}</div>
                                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent flex justify-center items-end pb-4">
                                        <button
                                            onClick={handleExtendAbout}
                                            className="px-6 py-2 bg-transparent text-black border border-black rounded-lg hover:text-gray-700"
                                        >
                                            Extend
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="whitespace-pre-wrap text-black leading-relaxed">
                                        {aboutLoading && !aboutText && (
                                            <span className="text-gray-400">About 번역 중...</span>
                                        )}
                                        {aboutText}
                                    </div>
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

            {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} />}
            <Footer />
        </div>
    );
}
