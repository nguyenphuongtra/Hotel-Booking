import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import DatePicker from 'react-datepicker';
import { Search, Users, Wifi, Utensils, Shield, Wind } from 'lucide-react';
import { roomAPI } from '../api/api'; 
import { Button } from '../components/ui/Button';
import FloatingButtons from '../components/ui/FloatingButtons';
import HotelMap from '../components/Layout/HotelMap';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';

interface Room {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  roomNumber?: string;
  type?: string;
  occupancy?: { adults: number; children: number };
  amenities?: string[];
}

export default function Home() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(new Date(Date.now() + 86400000));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // GỌI API ĐÚNG CÁCH
  const { data: roomsData, isLoading: roomsLoading, error: roomsError } = useQuery({
    queryKey: ['rooms', 'featured'],
    queryFn: () => roomAPI.listRooms({ limit: 6 }),
    retry: false,
  });

  // ĐÚNG: rooms nằm trong response.data.rooms
  const rooms: Room[] = roomsData?.data?.rooms || [];
  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      adults: adults.toString(),
      children: children.toString(),
    });
    navigate(`/rooms?${params.toString()}`);
  };

  const bannerSlides = [
    {
      image: 'https://images.squarespace-cdn.com/content/v1/5aadf482aa49a1d810879b88/1626698419120-J7CH9BPMB2YI728SLFPN/1.jpg',
      title: 'Khám phá sang trọng',
      subtitle: 'Trải nghiệm không quên tại những khách sạn hàng đầu',
    },
    {
      image: 'https://acihome.vn/uploads/15/thiet-ke-khach-san-hien-dai-co-cac-ban-cong-view-bien-sieu-dep-seaside-mirage-hotel-1.JPG',
      title: 'Điểm đến tuyệt vời',
      subtitle: 'Những phòng đẹp đang chờ bạn',
    },
    {
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      title: 'Thư giãn hoàn toàn',
      subtitle: 'Hãy chọn phòng của bạn ngay hôm nay',
    },
  ];

  const amenities = [
    { icon: Wifi, name: 'WiFi miễn phí', desc: 'Kết nối internet tốc độ cao' },
    { icon: Utensils, name: 'Bữa sáng đầy đủ', desc: 'Đặc sản địa phương' },
    { icon: Users, name: 'Lễ tân 24/7', desc: 'Hỗ trợ bất cứ lúc nào' },
    { icon: Wind, name: 'Điều hòa không khí', desc: 'Với kiểm soát nhiệt độ' },
    { icon: Shield, name: 'An ninh tuyệt đối', desc: 'Camera giám sát khắp nơi' },
    { icon: Search, name: 'Phòng rộng rãi', desc: 'Thiết kế hiện đại' },
  ];

  const reviews = [
    { name: 'Nguyễn Văn A', rating: 5, text: 'Dịch vụ tuyệt vời, phòng sạch sẽ!', avatar: 'Male' },
    { name: 'Trần Thị B', rating: 5, text: 'Nhân viên rất thân thiện và chuyên nghiệp.', avatar: 'Female' },
    { name: 'Lê Văn C', rating: 4.5, text: 'Vị trí tuyệt vời, gần trung tâm thành phố.', avatar: 'Male' },
  ];

  const blogs = [
    { id: 1, title: 'Top 10 khách sạn tốt nhất Đà Nẵng 2025', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop', date: '15/11/2024' },
    { id: 2, title: 'Mẹo đặt phòng khách sạn tiết kiệm chi phí', image: 'https://images.unsplash.com/photo-1542314503-37143e4538a9?w=400&h=250&fit=crop', date: '10/11/2024' },
    { id: 3, title: 'Điểm đến lý tưởng cho kỳ nghỉ gia đình', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop', date: '05/11/2024' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Banner Slider */}
      <section className="relative -mx-4 mb-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="w-full h-96"
        >
          {bannerSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-96 relative flex items-center justify-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
                  <Button className="px-8" onClick={() => navigate('/rooms')}>
                    Khám phá ngay
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Search Form */}
      <section className="bg-white rounded-lg shadow-xl p-6 mb-16 -mt-20 relative z-20 mx-4 md:mx-0">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ngày nhận phòng</label>
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày trả phòng</label>
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              minDate={checkIn || new Date()}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Người lớn</label>
            <select
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n} người</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trẻ em</label>
            <select
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>{n} trẻ em</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full gap-2">
              <Search size={20} />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Phòng nổi bật</h2>
        {roomsLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : roomsError ? (
          <div className="text-center text-red-500 py-10">
            Có lỗi khi gọi API phòng: {roomsError instanceof Error ? roomsError.message : String(roomsError)}
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">Không có phòng nào.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col"
                onClick={() => navigate(`/rooms/${room._id}`)}
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden flex items-center justify-center">
                  {room.images && room.images.length > 0 && room.images[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.name || 'Room'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{room.name || 'Không rõ tên phòng'}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {room.description || 'Phòng sang trọng, đầy đủ tiện nghi.'}
                  </p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {room.amenities.slice(0,4).map((amenity, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {amenity === 'WiFi' && <Wifi className="w-4 h-4 mr-1 inline-block" />}
                          {amenity === 'Bữa sáng đầy đủ' && <Utensils className="w-4 h-4 mr-1 inline-block" />}
                          {amenity === 'Lễ tân 24/7' && <Users className="w-4 h-4 mr-1 inline-block" />}
                          {amenity === 'Điều hòa không khí' && <Wind className="w-4 h-4 mr-1 inline-block" />}
                          {amenity === 'An ninh tuyệt đối' && <Shield className="w-4 h-4 mr-1 inline-block" />}
                          {amenity === 'Phòng rộng rãi' && <Search className="w-4 h-4 mr-1 inline-block" />}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-1xl font-bold text-blue-500">
                      {room.price?.toLocaleString('vi-VN') || '--'}đ
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/ đêm</span>
                    <Button className="ml-auto px-4 py-1 text-sm" onClick={e => {e.stopPropagation();navigate(`/rooms/${room._id}`)}}>
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Amenities */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Tiện ích khách sạn</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="mb-16 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Đánh giá khách hàng</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-2xl text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-yellow-500">{'★'.repeat(Math.floor(review.rating))}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.text}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Blog & CTA */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Bài viết mới nhất</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer group">
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                <h3 className="text-lg font-bold line-clamp-2">{blog.title}</h3>
                <Button variant="ghost" className="mt-4">
                  Đọc thêm →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-lg p-8 md:p-12 text-center text-white mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng đặt phòng?</h2>
        <p className="text-lg mb-6 opacity-90">Hàng ngàn phòng tuyệt đẹp đang chờ bạn. Đặt ngay hôm nay!</p>
        <Button onClick={() => navigate('/rooms')} size="lg" className="px-8">
          Xem tất cả phòng
        </Button>
      </section>

      {/* Google Map */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Vị trí khách sạn</h2>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <HotelMap />
        </div>
      </section>

      <FloatingButtons />
    </div>
  );
}