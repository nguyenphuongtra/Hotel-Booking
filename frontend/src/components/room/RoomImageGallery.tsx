import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RoomImageGalleryProps {
  images: string[]
  roomName: string
}

export function RoomImageGallery({ images, roomName }: RoomImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const hasImages = images.length > 0

  if (!hasImages) {
    return (
      <div className="mb-8">
        <div className="bg-gray-200 border-2 border-dashed rounded-2xl h-96 flex items-center justify-center">
          <p className="text-gray-500 text-xl">Chưa có hình ảnh</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src={images[currentImage]}
          alt={roomName}
          className="w-full h-96 md:h-[500px] object-cover"
        />
        <button
          onClick={() =>
            setCurrentImage((currentImage - 1 + images.length) % images.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentImage((currentImage + 1) % images.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index ? 'bg-white w-10' : 'bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, index) => (
          <button
            key={`${img}-${index}`}
            onClick={() => setCurrentImage(index)}
            className={`aspect-video rounded-xl overflow-hidden border-4 transition-all ${
              currentImage === index ? 'border-orange-500' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`Thumb ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

