import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    // Get VNPay return params
    const vnpResponseCode = searchParams.get('vnp_ResponseCode')
    const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus')
    const bookingIdFromUrl = searchParams.get('vnp_TxnRef')

    if (vnpResponseCode && bookingIdFromUrl) {
      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        // Payment successful
        setBookingId(bookingIdFromUrl)
        // Clean URL
        window.history.replaceState({}, '', '/success')
      } else {
        // Payment failed - redirect back
        navigate('/booking', { replace: true })
      }
    } else {
      // No valid params, redirect to home
      navigate('/', { replace: true })
    }
  }, [navigate, searchParams])

  if (!bookingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã thanh toán. Đặt phòng của bạn đã được xác nhận.
        </p>

        <Card className="mb-8 text-left">
          <CardHeader>
            <CardTitle>Chi tiết đặt phòng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đặt phòng:</span>
              <span className="font-mono">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="capitalize">VNPay</span>
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

