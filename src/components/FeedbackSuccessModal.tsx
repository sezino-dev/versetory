'use client'

import Image from 'next/image'

interface FeedbackSuccessModalProps {
  onClose: () => void
}

export default function FeedbackSuccessModal({ onClose }: FeedbackSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-[400px] bg-white rounded-lg p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로고 */}
        <div className="flex justify-center mb-4">
          <Image
            src="/Versetory_Logo.svg"
            alt="Verse’tory Logo"
            width={160}
            height={50}
          />
        </div>

        {/* 메시지 */}
        <h2 className="text-xl font-bold text-black mb-2">
          피드백이 제출되었습니다
        </h2>
        <p className="text-gray-600 mb-6">감사합니다!</p>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-900"
        >
          OK
        </button>
      </div>
    </div>
  )
}
