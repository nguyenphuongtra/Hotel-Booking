import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, Wallet, CheckCircle, User, Mail, Phone } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup'
import { Separator } from '../components/ui/Separator'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../contexts/AuthContext'
import { paymentAPI, bookingAPI } from '../api/api'
import toast from 'react-hot-toast'

interface BookingState {
  roomId: string
  roomName: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  phoneNumber?: string
  nights: number
  total: number
  pricePerNight: number
  image?: string
}

interface PaymentPageProps {
  viewMode?: 'desktop' | 'mobile'
}

export default function PaymentPage({ viewMode = 'desktop' }: PaymentPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Get booking data from location state
  const bookingData = location.state as BookingState | null

  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || []
      setFirstName(nameParts[0] || '')
      setLastName(nameParts.slice(1).join(' ') || '')
      setEmail(user.email || '')
    }
  }, [user])

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      toast.error('Vui lòng chọn phòng trước khi thanh toán')
      navigate('/rooms')
    }
  }, [bookingData, navigate])

  if (!bookingData) {
    return null
  }

  // Calculate order summary
  const orderSummary = {
    rooms: [
      {
        name: bookingData.roomName,
        nights: bookingData.nights,
        price: bookingData.pricePerNight * bookingData.nights,
      },
    ],
    subtotal: bookingData.pricePerNight * bookingData.nights,
    serviceFee: Math.round((bookingData.pricePerNight * bookingData.nights) * 0.1),
    total: bookingData.total,
  }

  const containerWidth = viewMode === 'mobile' ? 'max-w-md' : 'max-w-6xl'

  // Handle VNPay return from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const vnpResponseCode = urlParams.get('vnp_ResponseCode')
    const vnpTransactionStatus = urlParams.get('vnp_TransactionStatus')
    const bookingIdFromUrl = urlParams.get('vnp_TxnRef')

    if (vnpResponseCode && bookingIdFromUrl) {
      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        // Payment successful
        setBookingId(bookingIdFromUrl)
        setShowSuccess(true)
        toast.success('Thanh toán thành công!')
        // Clean URL
        window.history.replaceState({}, '', '/booking')
      } else {
        // Payment failed
        toast.error('Thanh toán thất bại. Vui lòng thử lại.')
        // Clean URL
        window.history.replaceState({}, '', '/booking')
      }
    }
  }, [])

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      toast.error('Vui lòng nhập tên')
      return false
    }
    if (!lastName.trim()) {
      toast.error('Vui lòng nhập họ')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ')
      return false
    }
    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Create booking first
      const bookingResponse = await bookingAPI.createBooking({
        roomId: bookingData.roomId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        price: orderSummary.total,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        phoneNumber: phone,
        paymentMethod: paymentMethod,
      })

      // Handle different response structures
      const responseData = bookingResponse.data
      const newBooking =
        responseData?.data?.booking ||
        responseData?.booking ||
        responseData?.data ||
        responseData
      const createdBookingId = newBooking?._id || newBooking?.id

      if (!createdBookingId) {
        throw new Error('Không thể tạo đặt phòng. Vui lòng thử lại.')
      }

      if (paymentMethod === 'vnpay') {
        // Create VNPay payment URL
        const orderDescription = `Thanh toán đặt phòng ${bookingData.roomName}`

        const paymentResponse = await paymentAPI.createPaymentUrl({
          amount: orderSummary.total,
          bookingId: createdBookingId,
          orderDescription: orderDescription,
        })

        // Backend returns: { code: '00', data: vnpUrl }
        const paymentUrl = paymentResponse.data?.data

        if (paymentUrl && paymentResponse.data?.code === '00') {
          // Redirect to VNPay gateway
          window.location.href = paymentUrl
          // Don't set isProcessing to false here as we're redirecting
        } else {
          toast.error('Không thể tạo URL thanh toán VNPay')
          setIsProcessing(false)
        }
      } else {
        // Cash or MoMo - mark as completed
        setBookingId(createdBookingId)
        setShowSuccess(true)
        toast.success('Đặt phòng thành công!')
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán'
      toast.error(errorMessage)
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <div className={`${containerWidth} mx-auto p-4 md:p-8`}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Đặt phòng thành công!</h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã đặt phòng. Email xác nhận đã được gửi đến địa chỉ email của bạn.
          </p>

          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle>Chi tiết đặt phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đặt phòng:</span>
                <span className="font-mono">{bookingId || `BK${Date.now()}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="text-orange-600 font-bold">
                  {orderSummary.total.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="capitalize">
                  {paymentMethod === 'cash'
                    ? 'Tiền mặt'
                    : paymentMethod === 'momo'
                    ? 'MoMo Wallet'
                    : 'VNPay'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <Badge variant="secondary">Đã xác nhận</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/bookings')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Xem đặt phòng
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${containerWidth} mx-auto p-4 md:p-8 bg-gray-50`}>
      <h1 className="text-3xl font-bold mb-8">Thanh toán & Đặt phòng</h1>

      <div className={`flex ${viewMode === 'mobile' ? 'flex-col' : 'gap-8'}`}>
        {/* Payment Form */}
        <div className="flex-1">
          {/* Customer Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Tên *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Nhập tên"
                      className="pl-10"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Họ *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      placeholder="Nhập họ"
                      className="pl-10"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+84 xxx xxx xxx"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {/* Cash Payment */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cash" id="cash" />
                    <label
                      htmlFor="cash"
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className="p-2 bg-white rounded-lg border">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Thanh toán tại khách sạn</div>
                        <div className="text-sm text-gray-500">Thanh toán khi đến nhận phòng</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* MoMo Wallet */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'momo'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="momo" id="momo" />
                    <label
                      htmlFor="momo"
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Ví MoMo</div>
                        <div className="text-sm text-gray-500">Thanh toán bằng ví MoMo</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* VNPay */}
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'vnpay'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <label
                      htmlFor="vnpay"
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">VNPay</div>
                        <div className="text-sm text-gray-500">Thanh toán qua cổng VNPay</div>
                      </div>
                    </label>
                  </div>
                </div>
              </RadioGroup>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ℹ️ Thông tin thanh toán của bạn được bảo mật và mã hóa. Chúng tôi không lưu trữ
                  thông tin thẻ của bạn.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className={`${viewMode === 'mobile' ? 'w-full mt-6' : 'w-96'} shrink-0`}>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Room List */}
              {orderSummary.rooms.map((room, index) => (
                <div key={index} className="pb-3 border-b">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{room.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{room.nights} đêm</span>
                    <span>{room.price.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  {bookingData.image && (
                    <img
                      src={bookingData.image}
                      alt={room.name}
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    <div>Nhận phòng: {new Date(bookingData.checkIn).toLocaleDateString('vi-VN')}</div>
                    <div>Trả phòng: {new Date(bookingData.checkOut).toLocaleDateString('vi-VN')}</div>
                    <div>
                      {bookingData.adults} người lớn
                      {bookingData.children > 0 && `, ${bookingData.children} trẻ em`}
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{orderSummary.subtotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span>{orderSummary.serviceFee.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-orange-600 font-bold text-lg">
                    {orderSummary.total.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              {/* Complete Payment Button */}
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
                isLoading={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
              </Button>

              {/* Terms */}
              <p className="text-xs text-center text-gray-500">
                Bằng cách hoàn tất đặt phòng này, bạn đồng ý với{' '}
                <a href="#" className="text-orange-600 hover:underline">
                  Điều khoản & Điều kiện
                </a>{' '}
                của chúng tôi
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

