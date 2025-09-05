const TranslatePrompt = (lyrics: string, about: string) => `
다음은 Genius Song Details API에서 가져온 곡 설명(About)입니다.
한국어로 자연스럽게 해석/분석해줘.

규칙:
- 문단 구조와 의미는 살리되, 반드시 한국어 문장으로 표현하세요.
- 구어체 / 슬랭(slang) 표현은 번역하지 않고 원문 그대로 두세요.
- 아티스트 이름, 곡 제목, 고유명사는 번역하지 말고 작은따옴표(' ') 안에 원문 영어 그대로 표기하세요.
- 오직 한국어 결과만 출력하세요.
- 곡 설명(About)은 Genius Song Details API에서 가져온 것으로 반드시 참고하여,
  모호한 부분(인물, 사건, 문화적 맥락)을 보강해서 해석하세요.

원문:
${about}
`;

export default TranslatePrompt;
