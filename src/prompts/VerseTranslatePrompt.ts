// VerseTranslatePrompt.ts
export const VerseTranslatePrompt = (lyrics: string, about: string) => `
다음은 영어 가사(lyrics)와 Genius Song Details API에서 가져온 곡 설명(about)입니다.
한국어 학습/이해 목적의 번역을 수행하세요.

[핵심 규칙]
- 원문 줄 수와 해석된 줄을 1:1로 유지하세요. 절대로 임의로 줄바꿈을 하지 마세요. (줄병합/삭제 금지)
- [Chorus], [Verse], [Refrain], [Intro], [Bridge], [Outro] 등 대괄호 섹션 라벨은 그대로 두세요.
- ( ) 괄호 안 가사는 반드시 번역하세요. 다만 아래 감탄사/추임새 토큰은 원문 그대로 보존하며, 의미가 있는 나머지 부분만 한국어로 번역하세요.
  * 허용 토큰(소문자 기준): psst, ayy, yo, ho, hey, wop, uh, mm, hmm, ooh, woo, aye, yeah, yah, ya, huh
  * 출력 시 괄호는 유지합니다. 예: (Mustard on the beat, ho) → (비트는 'Mustard'가 찍었어, ho)
- 슬랭/의성어/감탄사는 번역이 어색하면 원문을 유지합니다. (괄호 안에서는 위 “부분 번역 + 토큰 유지”를 적용)
- 'nigga'는 기본적으로 원문 그대로 두세요(자동 마스킹 금지). 문맥상 한국어 욕설이 훨씬 자연스러우면 “X 치환” 규칙으로 변환할 수 있습니다. 예: "You niggas" → "너희 새X들"
- 욕설/비속어는 한국어 번역 시 한 글자를 X로 치환하세요. 예: 새끼→X끼, 좆 같이→X 같이
- 고유명사(인명/아티스트/곡명/지명/브랜드)는 번역하지 말고 작은따옴표(' ')로 감싼 원문 표기로 남기세요.
- 최종 출력은 한국어 번역만 포함하세요. 원문 영어는 포함하지 마세요.
- 곡 설명(about)을 참고하여 번역 중 모호한 인물/사건/문화 맥락을 자연스럽게 보강하세요.

[출력 형식]
- 입력된 각 줄에 정확히 대응하는 번역 한 줄만 출력합니다.
- 불필요한 주석/해설/번호/빈 줄을 추가하지 않습니다.

[미니 예시]
- 원문: (Mustard on the beat, ho)
  출력: (비트는 'Mustard'가 찍었어, ho)

- 원문: Ayy, we outside
  출력: Ayy, 우린 밖으로 나간다

- 원문: You niggas don't get it
  출력: 너희 새X들은 아직도 몰라

- 원문: From 'Compton' to LA
  출력: 'Compton'에서 LA까지

[about]
${about}

[lyrics]
${lyrics}
`.trim();


export default VerseTranslatePrompt;
