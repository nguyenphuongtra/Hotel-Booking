interface RoomDescriptionProps {
  description?: string
}

export function RoomDescription({ description }: RoomDescriptionProps) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-4">Giới thiệu</h3>
      <p className="text-gray-700 leading-relaxed text-lg">
        {description ||
          'Phòng nghỉ sang trọng với tầm nhìn tuyệt đẹp ra biển, nội thất hiện đại, đầy đủ tiện nghi cao cấp. Không gian rộng rãi, thoáng mát, phù hợp cho kỳ nghỉ thư giãn của bạn và gia đình.'}
      </p>
    </div>
  )
}


