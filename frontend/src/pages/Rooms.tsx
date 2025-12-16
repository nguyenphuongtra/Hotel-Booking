import React, { useEffect, useState, useRef, useCallback } from 'react';
import { roomAPI } from '../api/api';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Wifi, Tv, Coffee, Car, Grid, List, Calendar, Users, Minus, Plus, ChevronDown } from 'lucide-react';
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
  occupancy?: { adults: number; children: number };
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
  const [searchParams] = useSearchParams();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [price, setPrice] = useState<[number, number]>([0, 5_000_000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [startDate, setStartDate] = useState(searchParams.get('checkIn') || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [adults, setAdults] = useState(parseInt(searchParams.get('adults') || '1'));
  const [children, setChildren] = useState(parseInt(searchParams.get('children') || '0'));
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setIsGuestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce keyword input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [keyword]);

  React.useEffect(() => { 
    setPage(1); 
  }, [selectedTypes, selectedAmenities, price, adults, children]);

  const handleSearch = () => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Tìm kiếm với:', { startDate, endDate, adults, children });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params: any = {
          page: page,
          limit: PAGE_SIZE
        };
        
        // Add filters
        if (debouncedKeyword) params.q = debouncedKeyword;
        if (selectedTypes.length > 0) params.type = selectedTypes[0]; // API takes single type
        if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
        if (price[0] > 0) params.minPrice = price[0];
        if (price[1] < 5000000) params.maxPrice = price[1];
        
        const res = await roomAPI.listRooms(params);
        console.log('API Response:', res.data);
        setAllRooms(res.data.rooms || []);
        setTotalCount(res.data.meta?.total || res.data.rooms?.length || 0);
      } catch (e: any) {
        setError(e?.message || 'Không thể tải danh sách phòng.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [page, debouncedKeyword, selectedTypes, selectedAmenities, price]);

  const filteredRooms = allRooms
    .filter(room => {
      // Filter by occupancy
      const totalGuests = adults + children;
      if (room.occupancy) {
        const maxAdults = room.occupancy.adults || 0;
        const maxChildren = room.occupancy.children || 0;
        const maxTotal = maxAdults + maxChildren;
        
        if (totalGuests > maxTotal) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const paginatedRooms = filteredRooms;

  const handleAmenity = (id: string) => {
    setSelectedAmenities(arr => arr.includes(id) ? arr.filter(a => a !== id) : [...arr, id]);
  };
  const handleType = (type: string) => {
    setSelectedTypes(arr => arr.includes(type) ? arr.filter(t => t !== type) : [...arr, type]);
  };
  const handleReset = () => {
    setKeyword(''); setSelectedAmenities([]); setSelectedTypes([]); setPrice([0, 5000000]); setPage(1);
  };

  if (loading) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div></div>;
  }
  if (error) {
    return <div className="text-center py-24 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modern Search Bar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:bg-gradient-to-r lg:from-gray-50 lg:to-gray-50 lg:border lg:rounded-2xl lg:shadow-md lg:p-3 transition-all">
            
            {/* Search Keyword */}
            <div className="flex-1 flex items-center gap-3 border-b lg:border-none pb-2 lg:pb-0 px-2">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full shrink-0">
                <Search className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Tìm kiếm</p>
                <input 
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-700 truncate"
                  placeholder="Tên phòng, loại phòng..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>

            {/* Date Range Picker */}
            <div className="flex-[1.4] flex items-center gap-2 border-b lg:border-none pb-2 lg:pb-0 px-2">
              <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-full shrink-0">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 flex gap-2 items-center">
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Nhận phòng</p>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent cursor-pointer placeholder-gray-400 text-gray-700 p-0 border-none focus:ring-0"
                    />
                </div>
                <span className="text-gray-300">-</span>
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Trả phòng</p>
                    <input 
                        type="date" 
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent cursor-pointer placeholder-gray-400 text-gray-700 p-0 border-none focus:ring-0"
                    />
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>

            {/* Guest Selector (Popover) */}
            <div className="flex-[0.8] relative px-2" ref={guestRef}>
              <button 
                className="flex items-center gap-3 w-full text-left hover:opacity-80 transition"
                onClick={() => setIsGuestOpen(!isGuestOpen)}
              >
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Khách</p>
                   <p className="text-sm text-gray-600 truncate">
                     {adults} người lớn, {children} trẻ em
                   </p>
                </div>
                {isGuestOpen && <ChevronDown className="w-4 h-4 text-gray-400 rotate-180" />}
              </button>

              {/* Guest Dropdown */}
              {isGuestOpen && (
                <div className="absolute top-full right-0 lg:left-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Người lớn</p>
                      <p className="text-xs text-gray-500">Từ 13 tuổi trở lên</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setAdults(Math.max(1, adults - 1))} 
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-gray-800">{adults}</span>
                      <button 
                        onClick={() => setAdults(adults + 1)} 
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">Trẻ em</p>
                      <p className="text-xs text-gray-500">Độ tuổi 2 - 12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setChildren(Math.max(0, children - 1))} 
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-gray-800">{children}</span>
                      <button 
                        onClick={() => setChildren(children + 1)} 
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="lg:ml-2 mt-2 lg:mt-0">
               <Button 
                 onClick={handleSearch}
                 className="w-full lg:w-auto h-12 rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 font-semibold shadow-md hover:shadow-lg transition-all"
               >
                 <Search className="w-4 h-4 mr-2" />
                 Tìm phòng
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-80">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full sm:flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={keyword} 
                onChange={e => setKeyword(e.target.value)} 
                placeholder="Tìm phòng theo loại..." 
                className="pl-10 pr-4" 
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-fit justify-end">
              <select 
                className="border border-gray-200 rounded-lg p-2 text-sm bg-white hover:border-gray-300 transition" 
                value={sort} 
                onChange={e => setSort(e.target.value)}
              >
                <option value="popularity">Phổ biến nhất</option>
                <option value="price-low">Giá tăng dần</option>
                <option value="price-high">Giá giảm dần</option>
                <option value="rating">Đánh giá cao</option>
              </select>
              <div className="flex gap-1 border border-gray-200 rounded-lg p-1 bg-white">
                <Button 
                  variant={viewType === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewType('grid')}
                  title="Lưới"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewType === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewType('list')}
                  title="Danh sách"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Result summary */}
          <div className="mb-5 text-sm text-gray-600">Tìm thấy <b className="text-gray-800">{totalCount}</b> phòng phù hợp</div>
          {/* Room List */}
          <div className={`${viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {paginatedRooms.map(room => (
              <Card 
                key={room._id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${viewType === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
              >
                <div className={`${viewType === 'list' ? 'w-full sm:w-56' : ''} relative overflow-hidden bg-gray-200`}>
                  <div className={`${viewType === 'grid' ? 'aspect-[4/3]' : 'h-48'}`}>
                    <img 
                      src={room.images?.[0] || '/placeholder-room.jpg'} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  {room.type && <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-700">{room.type}</Badge>}
                  {(room.rating || room.reviews) && (
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md hover:shadow-lg transition">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-800">{room.rating || 4.8}</span>
                    </div>
                  )}
                </div>
                <CardContent className={`p-4 flex flex-col justify-between ${viewType === 'list' ? 'flex-1' : ''}`}>
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-base text-gray-800 line-clamp-2">{room.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500">{room.size || '--'}{room.reviews ? ` • ${room.reviews} đánh giá` : ''}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{room.description || 'Phòng tiện nghi, hiện đại.'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities?.slice(0, 3).map((am) => (
                      <Badge key={am} variant="secondary" className="text-xs">
                        {am}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-blue-600 font-bold text-lg">{room.price.toLocaleString('vi-VN')}</span>
                      <span className="text-xs text-gray-500 ml-1">/đêm</span>
                    </div>
                    <Button size="sm" className="bg-slate-600 hover:bg-slate-700">
                      <Link to={`/rooms/${room._id}`} className="w-full h-full flex items-center justify-center">Chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paginatedRooms.length === 0 && <div className="col-span-full py-16 text-center text-gray-500">Không có phòng nào phù hợp với tiêu chí tìm kiếm của bạn.</div>}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-12 gap-6">
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-3 py-2 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Trước
                </Button>
                
                <div className="flex gap-1 items-center">
                  {totalPages <= 5 ? (
                    // Nếu ít trang, hiển thị tất cả
                    [...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        size="sm"
                        variant={page === i + 1 ? 'default' : 'outline'}
                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 p-0 ${page === i + 1 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                          : 'hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        {i + 1}
                      </Button>
                    ))
                  ) : (
                    // Nếu nhiều trang, hiển thị thông minh
                    <>
                      {/* Trang đầu */}
                      <Button
                        size="sm"
                        variant={page === 1 ? 'default' : 'outline'}
                        onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 p-0 ${page === 1 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                          : 'hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        1
                      </Button>

                      {/* Dấu ... nếu cần */}
                      {page > 3 && <span className="px-2 text-gray-400">...</span>}

                      {/* Các trang xung quanh trang hiện tại */}
                      {[...Array(3)].map((_, i) => {
                        const pageNum = page - 1 + i;
                        if (pageNum > 1 && pageNum < totalPages) {
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={page === pageNum ? 'default' : 'outline'}
                              onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className={`w-10 h-10 p-0 ${page === pageNum 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                                : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        return null;
                      })}

                      {/* Dấu ... nếu cần */}
                      {page < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}

                      {/* Trang cuối */}
                      <Button
                        size="sm"
                        variant={page === totalPages ? 'default' : 'outline'}
                        onClick={() => { setPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 p-0 ${page === totalPages 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                          : 'hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={page === totalPages} 
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-3 py-2 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp →
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Trang <span className="font-semibold text-gray-800">{page}</span> / <span className="font-semibold text-gray-800">{totalPages}</span></span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Tổng <span className="font-semibold text-gray-800">{totalCount}</span> phòng</span>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}