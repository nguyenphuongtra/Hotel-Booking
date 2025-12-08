import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsAPI } from '../../api/api'
import { Star, Loader2, Send } from 'lucide-react'

interface ReviewFormProps {
  roomId: string
  onSuccess?: () => void
}

export function ReviewForm({ roomId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: { rating: number; comment: string }) => 
      reviewsAPI.submitReview(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-detail', roomId] })
      setRating(0)
      setComment('')
      setError('')
      if (onSuccess) onSuccess()
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá.')
      return
    }
    mutation.mutate({ rating, comment })
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá trải nghiệm của bạn</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Mức độ hài lòng</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={28}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors duration-200`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-medium text-gray-500 self-center">
              {rating > 0 ? (
                rating === 5 ? 'Tuyệt vời!' : 
                rating >= 4 ? 'Rất tốt' : 
                rating >= 3 ? 'Bình thường' : 'Chưa tốt'
              ) : ''}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nhận xét</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ chi tiết về trải nghiệm nghỉ dưỡng của bạn..."
            className="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-white"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send size={18} />
                Gửi đánh giá
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}