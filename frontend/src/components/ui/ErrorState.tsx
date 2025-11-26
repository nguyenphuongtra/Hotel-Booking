import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

export function ErrorState({ message }: { message?: string }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{message || "Không tìm thấy phòng"}</h2>
        <p className="text-gray-600 mb-6">
          Xin lỗi, phòng bạn tìm không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate('/rooms')} size="lg">
          Quay lại danh sách phòng
        </Button>
      </div>
    </div>
  )
}


