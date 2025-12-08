import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, Users, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import toast from 'react-hot-toast'

interface Booking {
  checkIn: string
  checkOut: string
}

interface BookingFormProps {
  nightlyPrice: number
  maxAdults: number
  maxChildren: number
  bookedDates: Set<string>
  onBooking: (data: {
    checkIn: Date
    checkOut: Date
    adults: number
    children: number
    nights: number
    total: number
  }) => void
  isAuthenticated: boolean
}

export function BookingForm({
  nightlyPrice,
  maxAdults,
  maxChildren,
  bookedDates,
  onBooking,
  isAuthenticated,
}: BookingFormProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guestOption, setGuestOption] = useState('2-0')
  const [isDateUnavailable, setIsDateUnavailable] = useState(false)

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setIsDateUnavailable(false)
      return
    }
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    let conflict = false
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      if (bookedDates.has(d.toISOString().split('T')[0])) {
        conflict = true
        break
      }
    }
    setIsDateUnavailable(conflict)
  }, [checkIn, checkOut, bookedDates])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [checkIn, checkOut])

  const subtotal = nightlyPrice * nights
  const serviceFee = nightlyPrice ? Math.round(nightlyPrice * 0.1) : 0
  const total = subtotal + serviceFee

  const navigate = useNavigate()

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt phòng')
      navigate('/login')
      return
    }
    if (!checkIn || !checkOut) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng')
      return
    }
    if (isDateUnavailable) {
      toast.error('Phòng đã được đặt trong khoảng thời gian này')
      return
    }

    const [adults, children] = guestOption.split('-').map(Number)
    onBooking({
      checkIn,
      checkOut,
      adults,
      children,
      nights,
      total,
    })
  }

  const excludeDates = Array.from(bookedDates).map(
    (d: string) => new Date(d)
  ) as Date[]

  return (
    <Card className="sticky top-24 shadow-2xl border-0">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-2xl font-bold text-center">Đặt phòng</h3>

        <DatePickerField
          label="Ngày nhận phòng"
          date={checkIn}
          setDate={setCheckIn}
          minDate={new Date()}
          excludeDates={excludeDates}
        />
        <DatePickerField
          label="Ngày trả phòng"
          date={checkOut}
          setDate={setCheckOut}
          minDate={
            checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()
          }
          excludeDates={excludeDates}
        />

        <GuestSelector
          maxAdults={maxAdults}
          maxChildren={maxChildren}
          value={guestOption}
          onChange={setGuestOption}
        />

        {isDateUnavailable && (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              Phòng đã được đặt trong khoảng thời gian này
            </span>
          </div>
        )}

        {checkIn && checkOut && nights > 0 && (
          <PriceBreakdown
            nightlyPrice={nightlyPrice}
            nights={nights}
            serviceFee={serviceFee}
            total={total}
          />
        )}

        <Button
          size="lg"
          className="w-full text-lg py-7 font-bold text-white bg-slate-900 shadow-lg"
          onClick={handleBooking}
          disabled={!checkIn || !checkOut || isDateUnavailable}
        >
          {isDateUnavailable ? 'Phòng đã đặt' : 'Đặt phòng ngay'}
        </Button>

        <p className="text-center text-xs text-gray-500">
          Hủy miễn phí trong 48 giờ • Đảm bảo giá tốt nhất
        </p>
      </CardContent>
    </Card>
  )
}

interface DatePickerFieldProps {
  label: string
  date: Date | null
  setDate: (date: Date | null) => void
  minDate: Date
  excludeDates: Date[]
}

function DatePickerField({
  label,
  date,
  setDate,
  minDate,
  excludeDates,
}: DatePickerFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4" /> {label}
      </label>
      <DatePicker
        selected={date}
        onChange={setDate}
        minDate={minDate}
        excludeDates={excludeDates}
        dateFormat="dd/MM/yyyy"
        placeholderText="Chọn ngày"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
      />
    </div>
  )
}

interface GuestSelectorProps {
  maxAdults: number
  maxChildren: number
  value: string
  onChange: (value: string) => void
}

function GuestSelector({
  maxAdults,
  maxChildren,
  value,
  onChange,
}: GuestSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2 mb-2">
        <Users className="w-4 h-4" /> Số lượng khách
      </label>
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 appearance-none bg-white text-base font-medium"
        >
          {[...Array(maxAdults)].map((_, i) => (
            <option key={`a${i + 1}`} value={`${i + 1}-0`}>
              {i + 1} người lớn
            </option>
          ))}
          {maxChildren > 0 &&
            [...Array(maxChildren)].map((_, i) => (
              <option key={`c${i + 1}`} value={`${maxAdults}-${i + 1}`}>
                {maxAdults} người lớn, {i + 1} trẻ em
              </option>
            ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Tối đa: {maxAdults} người lớn{' '}
        {maxChildren > 0 ? `, ${maxChildren} trẻ em` : ''}
      </p>
    </div>
  )
}

interface PriceBreakdownProps {
  nightlyPrice: number
  nights: number
  serviceFee: number
  total: number
}

function PriceBreakdown({
  nightlyPrice,
  nights,
  serviceFee,
  total,
}: PriceBreakdownProps) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 space-y-4 border border-orange-200">
      <div className="flex justify-between text-lg">
        <span>
          {nightlyPrice.toLocaleString('vi-VN')}đ × {nights} đêm
        </span>
        <span className="font-bold">
          {(nightlyPrice * nights).toLocaleString('vi-VN')}đ
        </span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Phí dịch vụ</span>
        <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
      </div>
      <hr className="border-dashed border-gray-400" />
      <div className="flex justify-between text-xl font-bold">
        <span>Tổng cộng</span>
        <span className="text-orange-600">{total.toLocaleString('vi-VN')}đ</span>
      </div>
    </div>
  )
}

