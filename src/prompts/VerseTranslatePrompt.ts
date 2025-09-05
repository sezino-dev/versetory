const VerseTranslatePrompt = (lyrics: string, about: string) => `
다음은 영어 가사와 Genius Song Details API에서 가져온 곡 설명(About)입니다.
규칙:
- 원문 줄 수와 줄바꿈을 반드시 그대로 유지하세요. (한 줄도 합치거나 빼지 마세요)
- 원문 가사의 각 줄마다 정확히 대응하는 번역 줄을 출력하세요.
- [Chorus], [Verse], [Refrain], [Intro], [Bridge], [Outro] 같은 "대괄호 [ ] 로 표시된 섹션 라벨"은 번역하지 말고 그대로 두세요.
- ( ) 괄호 안에 있는 가사는 반드시 번역하세요.
- 'nigga'라는 단어는 원문 그대로 남기세요.
- 구어체 / 슬랭(slang) 표현 번역하지 않고 원문 그대로 두세요.
- 아티스트 이름, 곡 제목, 고유명사는 번역하지 말고 작은따옴표(' ') 안에 원문 영어 그대로 표기하세요.
- 오직 한국어 번역만 출력하세요. 원문 영어 가사는 절대 포함하지 마세요.
- 곡 설명(About)은 Genius Song Details API에서 가져온 것으로 반드시 참고하여, 모호한 부분(인물, 사건, 문화적 맥락)을 보강해서 번역하세요.

곡 설명(About):
${about || "없음"}

원문 가사:
${lyrics}
`;

export default VerseTranslatePrompt;
