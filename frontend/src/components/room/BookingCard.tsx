import { useState, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import { Users } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'

interface BookingCardProps {
  nightlyPrice: number
}

export function BookingCard({ nightlyPrice }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(new Date())
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(Date.now() + 86400000)
  )
  const [guestOption, setGuestOption] = useState('2')

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn).getTime()
    const end = new Date(checkOut).getTime()
    const diff = Math.max(0, end - start)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [checkIn, checkOut])

  const subtotal = nightlyPrice * nights
  const serviceFee = nightlyPrice ? Math.round(nightlyPrice * 0.1) : 0
  const total = subtotal + serviceFee

  return (
    <div className="w-full lg:w-96 shrink-0">
      <Card className="lg:sticky lg:top-24">
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Đặt phòng</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">
              Ngày nhận phòng
            </label>
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">
              Ngày trả phòng
            </label>
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Số lượng khách</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={guestOption}
                onChange={(e) => setGuestOption(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 người lớn</option>
                <option value="2">2 người lớn</option>
                <option value="3">2 người lớn, 1 trẻ em</option>
              </select>
            </div>
          </div>
          <hr />
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {nightlyPrice.toLocaleString('vi-VN')}đ × {nights} đêm
              </span>
              <span>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Phí dịch vụ</span>
              <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
            </div>
            <hr />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Tổng</span>
              <span className="text-blue-600">{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <Button className="w-full" size="lg">
            Thêm vào giỏ
          </Button>
          <Button variant="outline" className="w-full">
            Đặt ngay
          </Button>
          <p className="text-xs text-center text-gray-500">
            Hủy miễn phí trong vòng 24 giờ
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

