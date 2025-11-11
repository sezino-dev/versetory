// /components/HoverTooltip.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

/* 섹션 라벨 판별 유틸: 대괄호 라인 전용 + 정확 매칭 */
const SECTION_WORDS = new Set([
    "chorus",
    "verse",
    "refrain",
    "intro",
    "bridge",
    "outro",
    "prechorus",   // pre-chorus / pre chorus
    "postchorus",  // post-chorus / post chorus
    "hook",
    "interlude",
    "instrumental",
    "break",
    "drop",
]);

const normalizeLabel = (s: string) =>
    s.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

// 보컬 리스트처럼 보이는지 판단(이름/All/Solo 등만 허용)
const looksLikeVocalList = (s: string) => {
    const cleaned = (s ?? "").trim().replace(/^\(|\)$/g, "");
    if (!cleaned) return true;
    return cleaned.split(/[,&]/).every((part) =>
        /^(all|solo)$/i.test(part.trim()) ||
        /^[A-Za-z\u00C0-\u024F\u0370-\u1FFF\uAC00-\uD7AF.'\-\s]+$/u.test(part.trim())
    );
};

// [Label [index] [:|-|( vocalist list )]] 형태만 섹션으로 인정
// 예: [Verse], [Verse 1], [Verse I], [Verse 1: Chester Bennington], [Pre-Chorus 2 - Rumi]
const SECTION_LABEL_RE =
    /^\[\s*([A-Za-z]+(?:[\s-][A-Za-z]+)*)\s*(\d+|[IVX]+)?\s*(?:(?::|[-–—(])\s*(.*?)\s*\)?\s*)?\]$/i;

/**
 * 한 줄 원문 + 선택적 하이라이트 + 번역/해설 툴팁
 * 설명 우선순위: annotation_ko > annotation_text > legacy explanation
 */
export type HoverTooltipProps = {
    original: string;
    highlightText?: string;
    translated?: string;

    explanationKo?: string | null;
    explanationEn?: string | null;

    /** @deprecated explanationKo/explanationEn 사용 권장 */
    explanation?: string;
};

export default function HoverTooltip({
    original,
    highlightText,
    translated,
    explanationKo,
    explanationEn,
    explanation, // legacy
}: HoverTooltipProps) {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const lineRef = useRef<HTMLSpanElement>(null);

    // 섹션 라벨은 툴팁 비활성
    const isSectionLabel = useMemo(() => {
        const t = (original ?? "").trim();
        const m = SECTION_LABEL_RE.exec(t);
        if (!m) return false;

        const labelNorm = normalizeLabel(m[1]); // 라벨만(숫자 제외)
        if (!SECTION_WORDS.has(labelNorm)) return false;

        const vocalist = (m[3] ?? "").trim();
        return looksLikeVocalList(vocalist);
    }, [original]);

    // 우선순위: ko > en > legacy
    const effectiveExplanation = useMemo(() => {
        const ko = (explanationKo ?? "").trim();
        const en = (explanationEn ?? "").trim();
        if (ko) return ko;
        if (en) return en;
        return (explanation ?? "").trim();
    }, [explanationKo, explanationEn, explanation]);

    const hasContent = Boolean(translated || effectiveExplanation);
    const enableTooltip = hasContent && !isSectionLabel;

    const updateCoords = () => {
        if (!lineRef.current) return;
        const rect = lineRef.current.getBoundingClientRect();
        setCoords({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
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

    const renderWithHighlight = (text: string, target?: string, active?: boolean) => {
        if (!target || isSectionLabel) return <>{text}</>;
        const from = text.toLowerCase().indexOf(target.toLowerCase());
        if (from < 0) return <>{text}</>;
        const before = text.slice(0, from);
        const match = text.slice(from, from + target.length);
        const after = text.slice(from + target.length);
        const base = "inline-block align-baseline box-border px-0.5 rounded outline outline-1";
        const off = "bg-transparent outline-transparent";
        const on = "bg-gray-200 outline-gray-300";
        return (
            <>
                {before}
                <span className={[base, active ? on : off].join(" ")}>{match}</span>
                {after}
            </>
        );
    };

    return (
        <>
            <span
                ref={lineRef}
                className={[
                    "inline-block box-border",
                    "px-1 border border-transparent rounded transition-colors",
                    enableTooltip ? "cursor-help hover:bg-gray-50 hover:border-gray-200" : "cursor-text",
                ].join(" ")}
                onMouseEnter={() => { if (enableTooltip) setShow(true); }}
                onMouseLeave={() => setShow(false)}
                onTouchStart={() => { if (enableTooltip) setShow((v) => !v); }}
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
                    key={effectiveExplanation ? effectiveExplanation.slice(0, 32) : "empty"}
                >
                    {translated && (
                        <p className="mb-1">
                            <span className="font-semibold">번역: </span>
                            {translated}
                        </p>
                    )}
                    {effectiveExplanation && (
                        <p className="text-gray-600">
                            <span className="font-semibold">해설: </span>
                            {effectiveExplanation}
                        </p>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}
