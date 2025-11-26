import React, { useEffect, useState } from 'react';
import { roomAPI } from '../api/api';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Wifi, Tv, Coffee, Car, Grid, List } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { Slider } from '../components/ui/Slider';

interface Room {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  amenities: string[];
  type?: string;
  rating?: number;
  reviews?: number;
  size?: string;
}

const AMENITIES = [
  { id: 'Wifi', label: 'WiFi', icon: Wifi },
  { id: 'TV', label: 'TV', icon: Tv },
  { id: 'Coffee', label: 'Coffee', icon: Coffee },
  { id: 'Parking', label: 'Parking', icon: Car }
];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Villa'];

const PAGE_SIZE = 8;

export default function Rooms() {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState<[number, number]>([0, 5_000_000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Reset page về 1 mỗi khi filter/search thay đổi
  React.useEffect(() => { setPage(1); }, [search, selectedTypes, selectedAmenities, price]);

  const handleSearch = () => {
    // Implement your search logic here, e.g., navigate to a new page with search params or refetch rooms
    console.log({ checkIn, checkOut, adults, children });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await roomAPI.listRooms();
        setAllRooms(res.data.rooms || []);
      } catch (e: any) {
        setError(e?.message || 'Không thể tải danh sách phòng.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter/sort logic
  const filteredRooms = allRooms
    .filter(room =>
      room.price >= price[0] &&
      room.price <= price[1] &&
      (!search || room.name.toLowerCase().includes(search.toLowerCase())) &&
      (selectedTypes.length === 0 || (room.type && selectedTypes.includes(room.type))) &&
      (selectedAmenities.length === 0 || selectedAmenities.every(a => room.amenities?.includes(a)))
    )
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
  const paginatedRooms = filteredRooms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  const handleAmenity = (id: string) => {
    setSelectedAmenities(arr => arr.includes(id) ? arr.filter(a => a !== id) : [...arr, id]);
  };
  const handleType = (type: string) => {
    setSelectedTypes(arr => arr.includes(type) ? arr.filter(t => t !== type) : [...arr, type]);
  };
  const handleReset = () => {
    setSearch(''); setSelectedAmenities([]); setSelectedTypes([]); setPrice([0, 5000000]); setPage(1);
  };

  // UI
  if (loading) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="text-center py-24 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Sidebar */}
        <div className="w-full md:w-80">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6"><SlidersHorizontal className="w-5 h-5" /><h3>Bộ lọc</h3></div>

              <label className="text-sm mb-3 block">Giá (VNĐ/đêm)</label>
              <Slider min={0} max={5000000} step={100000} value={price} onValueChange={setPrice} className="mb-3" />
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                <span>{price[0].toLocaleString()}</span> <span>{price[1].toLocaleString()}</span>
              </div>

              <label className="text-sm mb-3 block">Loại phòng</label>
              <div className="space-y-2 mb-6">
                {ROOM_TYPES.map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox checked={selectedTypes.includes(type)} id={type} onCheckedChange={() => handleType(type)} />
                    <label htmlFor={type} className="text-sm cursor-pointer">{type}</label>
                  </div>
                ))}
              </div>

              <label className="text-sm mb-3 block">Tiện ích</label>
              <div className="space-y-2 mb-6">
                {AMENITIES.map(am => {
                  const Icon = am.icon;
                  return (
                    <div key={am.id} className="flex items-center gap-2">
                      <Checkbox checked={selectedAmenities.includes(am.id)} id={am.id} onCheckedChange={() => handleAmenity(am.id)} />
                      <label htmlFor={am.id} className="text-sm cursor-pointer flex items-center gap-2"><Icon className="w-4 h-4" />{am.label}</label>
                    </div>
                  );
                })}
              </div>
              <Button className="w-full" variant="outline" onClick={handleReset}>Đặt lại bộ lọc</Button>
            </CardContent>
          </Card>
        </div>
        {/* Main content */}
        <div className="flex-1">
          {/* Search & toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm phòng theo tên..." className="pl-10 pr-4" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-fit justify-end">
              <select className="border rounded p-2 text-sm" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="popularity">Phổ biến nhất</option>
                <option value="price-low">Giá tăng dần</option>
                <option value="price-high">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>
              <div className="flex gap-1 border rounded-lg p-1 bg-white">
                <Button variant={viewType === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewType('grid')}><Grid className="w-4 h-4" /></Button>
                <Button variant={viewType === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewType('list')}><List className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
          {/* Result summary */}
          <div className="mb-5 text-sm text-gray-600">Tìm thấy <b>{filteredRooms.length}</b> phòng phù hợp</div>
          {/* Room List */}
          <div className={`${viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}`}>
            {paginatedRooms.map(room => (
              <Card key={room._id} className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${viewType === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
                <div className={`${viewType === 'list' ? 'w-48 md:w-80' : ''} relative`}>
                  <div className={`${viewType === 'grid' ? 'aspect-[4/3]' : 'h-full min-h-[180px]'}`}>
                    <img src={room.images?.[0] || '/placeholder-room.jpg'} alt={room.name} className="w-full h-full object-cover" />
                  </div>
                  {room.type && <Badge className="absolute top-3 left-3">{room.type}</Badge>}
                  {(room.rating || room.reviews) && (
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{room.rating || 4.8}</span>
                    </div>
                  )}
                </div>
                <CardContent className={`p-4 ${viewType === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="mb-1 font-bold text-base line-clamp-1">{room.name}</h4>
                      <p className="text-xs text-gray-500">{room.size || '--'}{room.reviews ? ` • ${room.reviews} đánh giá` : ''}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description || 'Phòng tiện nghi, hiện đại.'}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {room.amenities?.slice(0, 4).map((am, i) => {
                      const amObj = AMENITIES.find(a => a.id === am);
                      return (
                        <Badge key={am} variant="secondary" className="text-xs flex items-center gap-1">
                          {amObj && <amObj.icon className="w-3 h-3" />} {am}
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <span className="text-blue-600 font-bold">{room.price.toLocaleString('vi-VN')} VNĐ</span>
                      <span className="text-xs text-gray-500"> /đêm</span>
                    </div>
                    <Button size="sm"><Link to={`/rooms/${room._id}`}>Xem chi tiết</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paginatedRooms.length === 0 && <div className="col-span-full py-16 text-center text-gray-500">Không có phòng nào phù hợp.</div>}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 gap-2">
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Trước</Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button size="sm" key={i} variant={page === i + 1 ? 'default' : 'outline'} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{i + 1}</Button>
                ))}
                <Button size="sm" variant="ghost" disabled={page === totalPages} onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Tiếp</Button>
              </div>
              <div className="text-xs text-gray-500">Trang {page}/{totalPages}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}