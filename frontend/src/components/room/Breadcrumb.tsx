import { useNavigate } from 'react-router-dom'

interface BreadcrumbProps {
  roomName: string
}

export function Breadcrumb({ roomName }: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 text-sm text-gray-600">
      <span
        className="hover:text-blue-600 cursor-pointer"
        onClick={() => navigate('/')}
      >
        Trang chủ
      </span>
      <span className="mx-2">/</span>
      <span
        className="hover:text-blue-600 cursor-pointer"
        onClick={() => navigate('/rooms')}
      >
        Phòng
      </span>
      <span className="mx-2">/</span>
      <span>{roomName}</span>
    </div>
  )
}

