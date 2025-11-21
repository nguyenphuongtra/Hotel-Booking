import { Star } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'

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
}

export function RoomReviews({ reviews }: RoomReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-4">Đánh giá</h3>
        <p className="text-sm text-gray-500">Chưa có đánh giá cho phòng này.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Đánh giá</h3>
      <div className="space-y-4">
        {reviews.map((review) => {
          const name = review.userName || 'Khách ẩn danh'
          const rating = review.rating ?? 5
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
                              i < rating
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
      <Button variant="outline" className="w-full mt-4">
        Xem thêm đánh giá
      </Button>
    </div>
  )
}

