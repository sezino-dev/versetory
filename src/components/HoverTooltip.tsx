// /components/HoverTooltip.tsx
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// 한 줄 원문 + 선택적 하이라이트 + 번역/해설 툴팁
export type HoverTooltipProps = {
    original: string;       // 화면에 보이는 원문 한 줄
    highlightText?: string; // 원문 안에서 하이라이트할 부분(있을 때만)
    translated?: string;    // 해당 줄 한국어 번역(있을 때만)
    explanation?: string;   // 해당 줄 해설(있을 때만, annotation_ko > annotation_text 순)
};

export default function HoverTooltip({
    original,
    highlightText,
    translated,
    explanation,
}: HoverTooltipProps) {
    // 툴팁 노출 여부
    const [show, setShow] = useState(false);

    // 툴팁 좌표 (viewport 고정 좌표)
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // 줄 전체를 감쌀 요소 참조
    const lineRef = useRef<HTMLSpanElement>(null);

    // 번역/해설이 하나라도 있으면 툴팁 활성 후보
    const hasContent = Boolean(translated || explanation);

    // 섹션 라벨([Chorus], [Verse 1], [Intro], [Bridge], [Outro], [Refrain] 등)은 툴팁 비활성
    const isSectionLabel = (() => {
        const t = original.trim();
        return /^\[(chorus|verse|refrain|intro|bridge|outro)(\s*\d+)?\]$/i.test(t);
    })();

    // 실제로 툴팁을 활성화할지 결정
    const enableTooltip = hasContent && !isSectionLabel;

    // viewport 기준 고정 좌표 계산 (scrollX/Y 더하지 않음)
    const updateCoords = () => {
        if (!lineRef.current) return;
        const rect = lineRef.current.getBoundingClientRect();
        setCoords({
            top: rect.bottom + 6,            // 줄 바로 아래 6px
            left: rect.left + rect.width / 2 // 줄 중앙
        });
    };

    // 툴팁 보일 때 좌표 업데이트 + 스크롤/리사이즈 대응
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

    // 항상 동일한 DOM 구조 유지: 하이라이트 매칭 시 호버 전/후 모두 같은 <span>을 렌더
    const renderWithHighlight = (text: string, target?: string, active?: boolean) => {
        if (!target || isSectionLabel) return <>{text}</>;
        const from = text.toLowerCase().indexOf(target.toLowerCase());
        if (from < 0) return <>{text}</>;
        const before = text.slice(0, from);
        const match = text.slice(from, from + target.length);
        const after = text.slice(from + target.length);

        // 레이아웃 고정: 항상 같은 padding/outline/box-border, 색만 토글
        const base = "inline-block align-baseline box-border px-0.5 rounded outline outline-1";
        const off = "bg-transparent outline-transparent";
        const on = "bg-gray-200 outline-gray-300";

        return (
            <>
                {before}
                <span className={[base, active ? on : off].join(" ")}>
                    {match}
                </span>
                {after}
            </>
        );
    };

    return (
        <>
            <span
                ref={lineRef}
                // 줄 밀림 방지: 항상 동일 padding/border/box-border 유지 (색만 토글)
                className={[
                    "inline-block box-border",
                    "px-1 border border-transparent rounded transition-colors",
                    enableTooltip ? "cursor-help hover:bg-gray-50 hover:border-gray-200" : "cursor-text",
                ].join(" ")}
                onMouseEnter={() => { if (enableTooltip) setShow(true); }}
                onMouseLeave={() => setShow(false)}
                onTouchStart={() => { if (enableTooltip) setShow((v) => !v); }} // 모바일 탭 대응(옵션)
            >
                {renderWithHighlight(original, highlightText, show)}
            </span>

            {show && enableTooltip && createPortal(
                <div
                    className={[
                        "fixed z-50 transform -translate-x-1/2",
                        "bg-white border border-gray-300 rounded-lg shadow-lg",
                        "text-sm text-gray-700 p-3 max-w-md whitespace-pre-wrap break-words",
                        "pointer-events-none",
                    ].join(" ")}
                    style={{ top: coords.top, left: coords.left }}
                    role="tooltip"
                >
                    {translated && (
                        <p className="mb-1">
                            <span className="font-semibold">번역: </span>
                            {translated}
                        </p>
                    )}
                    {explanation && (
                        <p className="text-gray-600">
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
