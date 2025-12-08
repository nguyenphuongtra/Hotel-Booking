import { Star, User } from 'lucide-react'

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
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        Chưa có đánh giá nào cho phòng này.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => {
        const name = review.userName || 'Khách ẩn danh'
        const reviewRating = review.rating ?? 5
        const date = review.createdAt
          ? new Date(review.createdAt).toLocaleDateString('vi-VN')
          : ''
        
        // Tạo key unique
        const reviewKey = review._id || `review-${index}`

        return (
          <div key={reviewKey} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {/* Avatar Placeholder */}
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-200">
                  {review.avatarUrl ? (
                    <img src={review.avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                     name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{date}</div>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1 sm:mt-0 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < reviewRating ? "#FACC15" : "none"}
                        className={i < reviewRating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}