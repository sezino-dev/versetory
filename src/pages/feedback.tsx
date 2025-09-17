'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeedbackSuccessModal from '@/components/FeedbackSuccessModal'
import TermsModal from '@/components/TermsModal'

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FeedbackPage() {
    const router = useRouter()

    // 입력 상태
    const [songTitle, setSongTitle] = useState('')
    const [reason, setReason] = useState('')
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [accountType, setAccountType] = useState('')
    const [content, setContent] = useState('')
    const [agree, setAgree] = useState(false)

    // UI 상태
    const [loading, setLoading] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [showTerms, setShowTerms] = useState(false)

    // URL 파라미터에서 곡 제목 수신
    useEffect(() => {
        if (router.query.song) {
            setSongTitle(router.query.song as string)
        }
    }, [router.query.song])

    // 로그인 사용자 정보 불러오기
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
                setAccountType(user.app_metadata?.provider || '')
            } else {
                router.push('/')
            }
        }
        fetchUser()
    }, [router])

    // 제출
    const handleSubmit = async () => {
        if (!content.trim() || !agree) {
            setMessage('⚠️ 피드백 내용과 약관 동의가 필요합니다.')
            return
        }

        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setMessage('⚠️ 로그인 후 이용 가능합니다.')
            setLoading(false)
            return
        }

        // users 존재 확인
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!existingUser) {
            const { error: insertUserError } = await supabase.from('users').insert([
                {
                    id: user.id,
                    email: user.email,
                    provider: user.app_metadata?.provider || 'unknown',
                },
            ])
            if (insertUserError) {
                console.error('유저 생성 실패:', insertUserError)
                setMessage('⚠️ 유저 정보를 저장하는 중 오류가 발생했습니다.')
                setLoading(false)
                return
            }
        }

        // feedback 저장
        const { error: feedbackError } = await supabase.from('feedback').insert([
            {
                user_id: user.id,
                song_title: songTitle || null,
                feedback_title: title || null,
                reason: reason || null,
                content: content || null,
            },
        ])

        if (feedbackError) {
            console.error('피드백 저장 실패:', feedbackError)
            setMessage('⚠️ 피드백 저장 중 오류가 발생했습니다.')
        } else {
            setSuccessOpen(true)
            setSongTitle('')
            setReason('')
            setTitle('')
            setContent('')
            setAgree(false)
            setMessage('')
        }

        setLoading(false)
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
                <h1 className="text-3xl font-bold text-black mb-2">Send Feedback</h1>
                <p className="text-gray-600 mb-10">
                    Your valuable feedback helps us improve and deliver a better-quality service. <br />
                    사용자 여러분의 소중한 피드백이 더 나은 품질의 서비스를 제공하는데 큰 힘이 됩니다
                </p>

                {/* 곡 제목 + 이유 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <input
                        type="text"
                        placeholder="Song Title"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px]"
                    />
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 h-[52px] ${reason === '' ? 'text-gray-400' : 'text-black'
                            }`}
                    >
                        <option value="" disabled hidden>
                            Please select a reason for your feedback
                        </option>
                        <option value="translation">Translation Quality</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other...</option>
                    </select>
                </div>

                {/* 제목 + 유저 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <input
                        type="text"
                        placeholder="Feedback Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px]"
                    />
                    <div className="flex gap-4 w-full">
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px] bg-gray-100"
                        />
                        <input
                            type="text"
                            value={accountType ? `${accountType} Account` : ''}
                            readOnly
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-black h-[52px] bg-gray-100"
                        />
                    </div>
                </div>

                {/* 피드백 입력 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <textarea
                        placeholder="Leave your feedback"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="col-span-2 w-full border border-gray-300 rounded-lg px-4 py-3 h-40 text-black"
                    />
                </div>

                {/* 약관 동의 */}
                <label className="flex items-start gap-2 text-sm text-gray-500 mb-6 select-none">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 w-4 h-4"
                    />
                    <span>
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="underline text-gray-500 hover:text-black focus:outline-none"
                            title="Open Terms"
                        >
                            Terms of Service
                        </button>
                        .
                    </span>
                </label>

                {/* 제출 버튼 */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!agree || loading}
                        className={`px-6 py-3 rounded-lg ${!agree || loading
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-900'
                            }`}
                    >
                        {loading ? 'Submitting...' : 'Send Feedback'}
                    </button>
                </div>

                {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
            </main>

            <Footer />

            {/* 성공 모달 */}
            {successOpen && (
                <FeedbackSuccessModal
                    onClose={() => {
                        setSuccessOpen(false)
                        router.back()
                    }}
                />
            )}

            {/* 약관 모달 */}
            <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
        </div>
    )
}
