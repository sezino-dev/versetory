// pages/api/search.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.q as string

  if (!query) {
    return res.status(400).json({ error: '검색어(q)를 입력하세요.' })
  }

  const token = process.env.GENIUS_API_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'Genius API 토큰이 설정되어 있지 않습니다.' })
  }

  try {
    const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Genius API 요청 실패' })
    }

    const data = await response.json()
    res.status(200).json(data.response.hits)
  } catch (err) {
    res.status(500).json({ error: '서버 오류', detail: err })
  }
}
