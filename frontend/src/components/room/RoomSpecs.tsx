import { Square, Users, Bed } from 'lucide-react'

interface Room {
  size?: number
  occupancy?: { adults?: number; children?: number }
}

interface RoomSpecsProps {
  room: Room
}

export function RoomSpecs({ room }: RoomSpecsProps) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-6">Thông tin chi tiết</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-gray-50 p-5 rounded-xl">
          <Square className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-sm text-gray-600">Diện tích</div>
          <div className="font-bold">{room.size || 35} m²</div>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl">
          <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-sm text-gray-600">Người lớn</div>
          <div className="font-bold">{room.occupancy?.adults || 2}</div>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl">
          <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-sm text-gray-600">Trẻ em</div>
          <div className="font-bold">{room.occupancy?.children || 0}</div>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl">
          <Bed className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-sm text-gray-600">Giường</div>
          <div className="font-bold">King Size</div>
        </div>
      </div>
    </div>
  )
}

