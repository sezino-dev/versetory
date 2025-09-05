import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

import VerseTranslatePrompt from "../../prompts/VerseTranslatePrompt";
import TranslatePrompt from "../../prompts/TranslatePrompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = "gpt-4o-mini";

function getKSTDateTime() {
  const now = new Date();
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

    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

    // 프롬프트 분리 적용
    const prompt =
      mode === "translate"
        ? VerseTranslatePrompt(lyrics, about)
        : TranslatePrompt(lyrics, about);

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

      const usage: any = (completion as any).usage || {};
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      const totalTokens = usage.total_tokens || promptTokens + completionTokens;

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
