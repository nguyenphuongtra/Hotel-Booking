import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function VnpayReturn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Get VNPay return params
    const vnpResponseCode = searchParams.get('vnp_ResponseCode')
    const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus')
    const bookingId = searchParams.get('vnp_TxnRef')

    if (vnpResponseCode && bookingId) {
      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        // Payment successful - redirect to success page
        toast.success('Thanh toán thành công!')
        navigate(`/success?vnp_ResponseCode=${vnpResponseCode}&vnp_TransactionStatus=${vnpTransactionStatus}&vnp_TxnRef=${bookingId}`, { replace: true })
      } else {
        // Payment failed
        toast.error('Thanh toán thất bại. Vui lòng thử lại.')
        navigate('/booking', { replace: true })
      }
    } else {
      // No valid params, redirect to home
      navigate('/', { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
      </div>
    </div>
  )
}


