// /pages/api/genius-search.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query
  const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: '검색어가 유효하지 않습니다.' })
  }

  try {
    const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
      headers: {
        Authorization: `Bearer ${GENIUS_API_TOKEN}`,
      },
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Genius API 요청 실패:', error)
    res.status(500).json({ error: 'Genius API 요청 실패' })
  }
}
