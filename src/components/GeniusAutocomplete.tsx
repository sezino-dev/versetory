// /components/GeniusAutocomplete.tsx

'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import debounce from 'lodash.debounce'

interface GeniusResult {
    id: number
    title: string
    artist: string
    thumbnail: string
    url: string
}

interface Props {
    minimal?: boolean
}

export default function GeniusAutocomplete({ minimal = false }: Props) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<GeniusResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const fetchResults = debounce(async (search: string) => {
        if (!search.trim()) {
            setResults([])
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch(`/api/genius-search?q=${encodeURIComponent(search)}`)
            const json = await res.json()
            const hits = json.response?.hits || []
            const formatted = hits.map((hit: any) => ({
                id: hit.result.id,
                title: hit.result.title,
                artist: hit.result.primary_artist.name,
                thumbnail: hit.result.song_art_image_thumbnail_url || '/no-image.png',
                url: hit.result.url,
            }))
            setResults(formatted)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setIsLoading(false)
        }
    }, 400)

    useEffect(() => {
        fetchResults(query)
        return () => fetchResults.cancel()
    }, [query])

    // 전환 공백 최소화를 위해 미리 프리패치
    useEffect(() => {
        results.forEach((s) => {
            router.prefetch(`/explanation/${s.id}`).catch(() => { })
        })
    }, [results, router])

    const clearAndClose = () => {
        fetchResults.cancel()
        setQuery('')
        setResults([])
    }

    const onItemClick = () => {
        // Link가 네비게이션을 먼저 처리하도록 한 틱 뒤에 닫음
        setTimeout(clearAndClose, 0)
    }

    const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && results[0]) {
            const id = results[0].id
            clearAndClose()
            router.push(`/explanation/${id}`)
        }
    }

    return (
        <div className={`relative ${minimal ? 'w-72' : 'w-full'} mx-auto`}>
            {/* 검색 입력창 */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 border border-black rounded-md text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                aria-autocomplete="list"
                aria-expanded={results.length > 0}
            />

            {/* 돋보기 / 로딩 아이콘 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isLoading ? (
                    <Image src="/icons/loading.gif" alt="Loading" width={18} height={18} />
                ) : (
                    <Image src="/icons/search.svg" alt="Search" width={18} height={18} />
                )}
            </div>

            {/* 자동완성 리스트 */}
            {results.length > 0 && (
                <ul
                    className="absolute z-10 w-full bg-white border border-gray-200 mt-2 rounded-md shadow-md max-h-96 overflow-y-auto text-sm"
                    role="listbox"
                >
                    {results.map((song) => (
                        <li key={song.id} className="border-b last:border-none">
                            {/* minimal 여부와 상관없이 항상 Link 사용 */}
                            <Link
                                href={`/explanation/${song.id}`}
                                prefetch
                                onClick={onItemClick}
                                className="block hover:bg-gray-100 px-4 py-2 text-black"
                            >
                                {minimal ? (
                                    <span>{song.artist} - {song.title}</span>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={song.thumbnail}
                                            alt={song.title}
                                            width={48}
                                            height={48}
                                            className="rounded object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{song.title}</p>
                                            <p className="text-xs text-gray-500">{song.artist}</p>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
