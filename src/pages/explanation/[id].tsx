import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ExplanationPage() {
  const router = useRouter()
  const { id } = router.query

  const [songId, setSongId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof id === 'string') {
      setSongId(id)
      
    }
  }, [id])

  return (
    <div className="max-w-screen-lg mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">곡 해설 페이지</h1>
      {songId ? (
        <p className="text-lg">곡 ID: {songId}</p>
      ) : (
        <p>곡 정보를 불러오는 중...</p>
      )}
    </div>
  )
}
