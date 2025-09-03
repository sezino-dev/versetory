import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = "gpt-4o-mini";

// 한국시간(Asia/Seoul) 기준 날짜/시간 포맷
function getKSTDateTime() {
  const now = new Date();

  // UTC → KST(+9)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 60 * 60000);

  const yyyy = kst.getFullYear();
  const MM = String(kst.getMonth() + 1).padStart(2, "0");
  const dd = String(kst.getDate()).padStart(2, "0");
  const hh = String(kst.getHours()).padStart(2, "0");
  const mm = String(kst.getMinutes()).padStart(2, "0");
  const ss = String(kst.getSeconds()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd}_${hh}:${mm}:${ss}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { lyrics, about, mode, songId, songTitle } = req.body;

    if (!lyrics && !about) {
      return res.status(400).json({ error: "가사나 About 정보가 필요합니다." });
    }

    // 줄바꿈 정리
    if (lyrics) {
      lyrics = lyrics.replace(/\n{2,}/g, "\n\n").trim();
    }

    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

    // 프롬프트
    const prompt =
      mode === "translate"
        ? `다음은 영어 가사와 곡 설명(About)입니다.
- [Chorus], [Verse], [Refrain], [Intro], [Bridge], [Outro] 같은 "대괄호 [ ] 로 표시된 섹션 라벨"은 번역하지 말고 그대로 두세요.
- ( ) 괄호 안에 있는 가사는 반드시 번역하세요.
- 오직 한국어 번역만 출력하세요. 원문 영어 가사는 절대 포함하지 마세요.
- 각 가사 줄은 줄바꿈 기준으로 그대로 유지하세요.
- 힙합/랩 슬랭, 문화적 맥락은 자연스럽게 한국어로 풀어주세요.
- 곡 설명(About)을 참고해 맥락을 보강하세요.

곡 설명(About):
${about || "없음"}

원문 가사:
${lyrics}`
        : `다음 내용을 한국어로 해석/분석해줘.
- [Chorus], [Verse], [Refrain], [Intro], [Bridge], [Outro] 같은 대괄호 [ ] 라벨은 번역하지 않음.
- ( ) 괄호 안의 가사는 반드시 번역해야 함.
- 오직 한국어 결과만 출력하세요.

곡 설명(About):
${about || "없음"}

원문:
${lyrics || about}`;

    // OpenAI API 호출
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result =
      completion.choices[0]?.message?.content?.trim() ||
      "⚠️ OpenAI API 응답이 비어 있습니다.";

    // 로그 저장
    try {
      const logDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const logFile = path.join(logDir, "translate.log");

      // 토큰 사용량
      const usage: any = (completion as any).usage || {};
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      const totalTokens = usage.total_tokens || promptTokens + completionTokens;

      // 비용 계산 (기본 gpt-4o-mini, 필요시 모델별 요율 나눌 수 있음)
      const inputCost = (promptTokens / 1_000_000) * 0.15;
      const outputCost = (completionTokens / 1_000_000) * 0.60;
      const cost = (inputCost + outputCost).toFixed(6);

      const kstTime = getKSTDateTime();
      const utcTime = new Date().toISOString();

      const logLine = `[${kstTime}_${utcTime}] model=${model}, input=${promptTokens}, output=${completionTokens}, total=${totalTokens}, cost=$${cost} , ${songId || "-"} , ${songTitle || "-"}\n`;

      fs.appendFileSync(logFile, logLine, "utf8");
    } catch (logError) {
      console.error("로그 저장 실패:", logError);
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: "번역 요청 중 오류 발생" });
  }
}
