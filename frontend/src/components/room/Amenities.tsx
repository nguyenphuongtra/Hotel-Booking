import { Wifi, Tv, Coffee, Car, Wind, MapPin } from 'lucide-react'

interface AmenitiesProps {
  amenities?: string[]
}

export function Amenities({ amenities }: AmenitiesProps) {
  const defaultAmenities = [
    'WiFi miễn phí',
    'Máy lạnh',
    'Smart TV',
    'Minibar',
    'Tắm đứng',
    'Ban công',
  ]
  const list = amenities && amenities.length > 0 ? amenities : defaultAmenities

  const iconMap: Record<string, React.ComponentType<any>> = {
    wifi: Wifi,
    tv: Tv,
    coffee: Coffee,
    parking: Car,
    'air conditioning': Wind,
    'máy lạnh': Wind,
    'ban công': MapPin,
  }

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-6 text-slate-900">Tiện ích nổi bật</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((item: string) => {
          const Icon = iconMap[item.toLowerCase()] || Wifi
          return (
            <div
              key={item}
              className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* ĐỔI MÀU: Nền xám nhạt thay vì cam */}
              <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-900 transition-colors">
                {/* ĐỔI MÀU: Icon màu đen/xám đậm thay vì cam */}
                <Icon className="w-6 h-6 text-slate-900" />
              </div>
              <span className="font-medium text-slate-700">{item}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}