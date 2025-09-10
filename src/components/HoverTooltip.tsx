import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export type HoverTooltipProps = {
    original: string;          // 줄 전체 원문
    highlightText?: string;    // 하이라이트할 구간(있을 때만)
    translated?: string;       // 줄 번역(있을 때만 툴팁)
    explanation?: string;      // 해설(ko 우선, 없으면 en)
};

export default function HoverTooltip({
    original,
    highlightText,
    translated,
    explanation,
}: HoverTooltipProps) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const ref = useRef<HTMLSpanElement>(null);

    const hasContent = Boolean((translated && translated.trim()) || (explanation && explanation.trim()));

    // viewport 내에서 중앙 정렬 + 살짝 여백, 화면 밖으로 나가지 않게 클램프
    const updateCoords = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // ⚠️ fixed 포지션은 viewport 기준이므로 scrollX/Y 더하면 안 됨
        const rawLeft = rect.left + rect.width / 2;
        const clampedLeft = Math.max(12, Math.min(rawLeft, window.innerWidth - 12));
        const top = rect.bottom + 8; // 줄 바로 밑 8px

        setCoords({ top, left: clampedLeft });
    };

    useEffect(() => {
        if (!show) return;
        updateCoords();

        const onScroll = () => updateCoords();
        const onResize = () => updateCoords();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [show]);

    // 하이라이트 렌더링: show일 때만 target 부분을 회색으로
    const renderWithHighlight = (text: string, target?: string, active?: boolean) => {
        if (!target || !active) return <>{text}</>;
        const idx = text.toLowerCase().indexOf(target.toLowerCase());
        if (idx < 0) return <>{text}</>;
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + target.length);
        const after = text.slice(idx + target.length);
        return (
            <>
                {before}
                <span className="bg-gray-200 ring-1 ring-gray-300 rounded px-0.5">{match}</span>
                {after}
            </>
        );
    };

    return (
        <>
            <span
                ref={ref}
                className={[
                    "inline-block",
                    hasContent ? "cursor-help hover:bg-gray-50 rounded px-0.5" : "cursor-text",
                ].join(" ")}
                onMouseEnter={() => hasContent && setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {renderWithHighlight(original, highlightText, show)}
            </span>

            {show && hasContent &&
                createPortal(
                    <div
                        className="
              fixed z-50 transform -translate-x-1/2
              bg-white border border-gray-300 rounded-lg shadow-lg
              text-sm text-gray-700 p-3
              max-w-md md:max-w-lg lg:max-w-xl
              pointer-events-none
            "
                        style={{ top: coords.top, left: coords.left }}
                        role="tooltip"
                        aria-hidden={!show}
                    >
                        {translated && (
                            <p className="mb-1">
                                <span className="font-semibold">번역: </span>
                                {translated}
                            </p>
                        )}
                        {explanation && (
                            <p className="text-gray-600 whitespace-pre-wrap">
                                <span className="font-semibold">해설: </span>
                                {explanation}
                            </p>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
