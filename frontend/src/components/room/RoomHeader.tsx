import { Star } from 'lucide-react'
import { Badge } from '../ui/Badge'

interface Room {
  name: string
  type?: string
}

interface RoomHeaderProps {
  room: Room
  nightlyPrice: number
}

export function RoomHeader({ room, nightlyPrice }: RoomHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{room.name}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
            <span className="text-sm">(124 đánh giá)</span>
          </div>
          {room.type && <Badge variant="secondary">{room.type}</Badge>}
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-orange-600">
          {nightlyPrice.toLocaleString('vi-VN')}đ
        </div>
        <div className="text-sm text-gray-500">mỗi đêm</div>
      </div>
    </div>
  )
}


