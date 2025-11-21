// src/pages/RoomDetails.tsx
import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { roomAPI } from '../api/api'
import { useAuth } from '../contexts/AuthContext'
import { RoomImageGallery } from '../components/room/RoomImageGallery'
import { RoomHeader } from '../components/room/RoomHeader'
import { RoomDescription } from '../components/room/RoomDescription'
import { Amenities } from '../components/room/Amenities'
import { RoomSpecs } from '../components/room/RoomSpecs'
import { RoomReviews } from '../components/room/RoomReviews'
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
  checkIn: string
  checkOut: string
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
  const { isAuthenticated } = useAuth()


  const { data, isLoading, error } = useQuery({
    queryKey: ['room-detail', roomId],
    queryFn: () => roomAPI.getRoom(roomId || ''),
    enabled: !!roomId,
  })

  const room: Room | undefined = data?.data?.room || data?.data?.data || data?.data
  const images = room?.images?.filter(img => img && img.trim()) || []
  const reviews = room?.reviews ?? []
  const bookings: Booking[] = room?.bookings || []

  // Tính toán ngày đã đặt
  const bookedDates = useMemo(() => {
    const dates = new Set<string>()
    bookings.forEach(booking => {
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        dates.add(d.toISOString().split('T')[0])
      }
    })
    return dates
  }, [bookings])

  const nightlyPrice = room?.price ?? 0

  const handleBooking = (bookingData: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
    nights: number
    total: number
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
      }
    })
  }

  if (isLoading) return <LoadingState />
  if (error || !room) return <ErrorState />

  const maxAdults = room.occupancy?.adults || 2
  const maxChildren = room.occupancy?.children || 0

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50">
      <Breadcrumb roomName={room.name} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Images + Info */}
        <div className="flex-1">
          <RoomImageGallery images={images} roomName={room.name} />
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <RoomHeader room={room} nightlyPrice={nightlyPrice} />
            <hr className="my-8 border-gray-200" />
            <RoomDescription description={room.description} />
            <Amenities amenities={room.amenities} />
            <RoomSpecs room={room} />
            <RoomReviews reviews={reviews} />
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="w-full lg:w-96 shrink-0">
          <BookingForm
            nightlyPrice={nightlyPrice}
            maxAdults={maxAdults}
            maxChildren={maxChildren}
            bookedDates={bookedDates}
            onBooking={handleBooking}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  )
}