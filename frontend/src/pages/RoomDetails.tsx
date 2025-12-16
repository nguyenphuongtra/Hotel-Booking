import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { roomAPI } from '../api/api'
import { useAuth } from '../contexts/AuthContext'

// Components
import { RoomImageGallery } from '../components/room/RoomImageGallery'
import { RoomHeader } from '../components/room/RoomHeader'
import { RoomDescription } from '../components/room/RoomDescription'
import { Amenities } from '../components/room/Amenities'
import { RoomSpecs } from '../components/room/RoomSpecs'
import { RoomReviews } from '../components/room/RoomReviews'
import { ReviewForm } from '../components/room/ReviewForm'
import { SuggestedRooms } from '../components/room/SuggestedRooms'
import { BookingForm } from '../components/room/BookingForm'
import { Breadcrumb } from '../components/room/Breadcrumb'
import { LoadingState } from '../components/ui/LoadingState'
import { ErrorState } from '../components/ui/ErrorState'

interface RoomReview {
  _id?: string
  userName?: string
  rating?: number
  comment?: string
  createdAt?: string
}

interface Booking {
  _id?: string
  userId?: string
  checkIn: string
  checkOut: string
  status?: string
}

interface Room {
  _id: string
  name: string
  description?: string
  price: number
  images?: string[]
  amenities?: string[]
  size?: number
  type?: string
  occupancy?: { adults?: number; children?: number }
  reviews?: RoomReview[]
  bookings?: Booking[]
}

export default function RoomDetails() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['room-detail', roomId],
    queryFn: () => roomAPI.getRoom(roomId || ''),
    enabled: !!roomId,
  })

  const room: Room | undefined = data?.data?.room || data?.data?.data || data?.data
  const images = room?.images?.filter(img => img && img.trim()) || []
  const reviews = room?.reviews ?? []
  const bookings: Booking[] = room?.bookings || []

  const bookedDates = useMemo(() => {
    const dates = new Set<string>()
    bookings.forEach(booking => {
      if (booking.status === 'cancelled') return 
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.add(d.toISOString().split('T')[0])
      }
    })
    return dates
  }, [bookings])

  const canReview = useMemo(() => {
    if (!isAuthenticated || !user || !bookings || bookings.length === 0) {
      console.log('canReview check failed:', { isAuthenticated, user, bookingsCount: bookings?.length });
      return false;
    }
    
    // Logic: User phải có booking đã hoàn thành hoặc confirmed
    const hasCompletedBooking = bookings.some(booking => {
      // Kiểm tra booking của user hiện tại
      const isUserBooking = booking.userId === user.id;
      // Kiểm tra nếu ngày checkout đã qua (hoàn thành)
      const checkOutDate = new Date(booking.checkOut);
      const isCompleted = checkOutDate < new Date();
      // Kiểm tra booking status (nếu không có status hoặc là confirmed/completed, cho phép)
      // Exclude cancelled bookings
      const isValidStatus = booking.status !== 'cancelled';
      
      console.log('Booking detail:', { 
        bookingId: booking._id,
        bookingUserId: booking.userId,
        currentUserId: user.id,
        isUserBooking,
        checkOutDate: booking.checkOut,
        isCompleted,
        status: booking.status,
        isValidStatus,
        canComment: isUserBooking && isCompleted && isValidStatus
      });
      
      return isUserBooking && isCompleted && isValidStatus;
    });

    console.log('Final canReview result:', hasCompletedBooking);
    return hasCompletedBooking;
  }, [isAuthenticated, user, bookings]);

  const nightlyPrice = room?.price ?? 0

  const handleBooking = (bookingData: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
    nights: number
    total: number
    couponCode?: string
  }) => {
    if (!room) return

    navigate('/booking', {
      state: {
        roomId: room._id,
        roomName: room.name,
        checkIn: bookingData.checkIn.toISOString(),
        checkOut: bookingData.checkOut.toISOString(),
        adults: bookingData.adults,
        children: bookingData.children,
        nights: bookingData.nights,
        total: bookingData.total,
        pricePerNight: nightlyPrice,
        image: images[0],
        couponCode: bookingData.couponCode,
      }
    })
  }

  if (isLoading) return <LoadingState />
  if (error || !room) return <ErrorState />

  const maxAdults = room.occupancy?.adults || 2
  const maxChildren = room.occupancy?.children || 0

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Breadcrumb roomName={room.name} />

        <div className="flex flex-col lg:flex-row gap-8 relative">
          <div className="flex-1 min-w-0">
            <RoomImageGallery images={images} roomName={room.name} />
            
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <RoomHeader room={room} nightlyPrice={nightlyPrice} />
              
              <hr className="my-8 border-gray-100" />
              
              <RoomDescription description={room.description} />
              <Amenities amenities={room.amenities} />
              <RoomSpecs room={room} />
              
              <hr className="my-8 border-gray-100" />
              
              <div id="reviews">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                       {reviews.length > 0 
                         ? (reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0) / reviews.length).toFixed(1)
                         : '0.0'}
                    </span>
                    <div className="text-sm text-gray-500 text-right">
                      <div>trên 5</div>
                      <div>{reviews.length} đánh giá</div>
                    </div>
                  </div>
                </div>

                {canReview ? (
                  <ReviewForm roomId={room._id} />
                ) : isAuthenticated ? (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
                    <span className="font-semibold">Lưu ý:</span>
                    Bạn cần hoàn thành kỳ nghỉ tại phòng này mới có thể viết đánh giá.
                  </div>
                ) : null}

                <RoomReviews reviews={reviews} />
              </div>
            </div>

            <SuggestedRooms currentRoomId={room._id} />
          </div>

          <div className="w-full lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 transition-all duration-300">
              <BookingForm
                nightlyPrice={nightlyPrice}
                maxAdults={maxAdults}
                maxChildren={maxChildren}
                bookedDates={bookedDates}
                onBooking={handleBooking}
                isAuthenticated={isAuthenticated}
              />
              
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Đảm bảo giá tốt nhất
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Thanh toán an toàn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}