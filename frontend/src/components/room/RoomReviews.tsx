import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { useState } from 'react'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsAPI } from '../../api/api'
import { toast } from 'sonner'

interface RoomReview {
  _id?: string
  userName?: string
  rating?: number
  comment?: string
  createdAt?: string
  avatarUrl?: string
}

interface RoomReviewsProps {
  reviews: RoomReview[]
  roomId: string
  isAuthenticated: boolean
  hasBookedRoom: boolean
}

export function RoomReviews({ reviews, roomId, isAuthenticated, hasBookedRoom }: RoomReviewsProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const submitReviewMutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: { rating: number; comment?: string } }) =>
      reviewsAPI.submitReview(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-detail', roomId] })
      setRating(0)
      setComment('')
      toast.success('Đánh giá của bạn đã được gửi thành công!')
    },
    onError: (error) => {
      console.error('Lỗi khi gửi đánh giá:', error)
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại.')
    },
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá.')
      return
    }
    submitReviewMutation.mutate({ roomId, data: { rating, comment } })
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Đánh giá</h3>
      <div className="space-y-4">
        {reviews.map((review) => {
          const name = review.userName || 'Khách ẩn danh'
          const reviewRating = review.rating ?? 5
          const date = review.createdAt
            ? new Date(review.createdAt).toLocaleDateString('vi-VN')
            : ''
          return (
            <Card key={review._id || `${name}-${date}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white flex items-center justify-center font-semibold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-sm text-gray-500">{date}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {reviews.length > 0 && (
        <Button variant="outline" className="w-full mt-4">
          Xem thêm đánh giá
        </Button>
      )}

      {isAuthenticated && hasBookedRoom && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h4 className="font-semibold mb-4">Viết đánh giá của bạn</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Đánh giá sao</label>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Bình luận (tùy chọn)</label>
              <Textarea
                id="comment"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
              />
            </div>
            <Button type="submit" disabled={submitReviewMutation.isPending}>
              {submitReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

