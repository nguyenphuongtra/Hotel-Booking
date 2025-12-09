import { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Calendar, 
  CheckCircle, 
  Eye, 
  Trash2, 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { bookingAPI } from '../api/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/AlertDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/DiaLog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Label } from '../components/ui/label';

interface BookingData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  room: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
}

interface AdminBookingsProps {
  viewMode: 'desktop' | 'mobile';
}

export function AdminBookings({ viewMode }: AdminBookingsProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<BookingData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    fetchBookings();
    
    // Refresh data when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBookings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Auto-refresh every 10 seconds to catch payment updates from VNPAY IPN
    const refreshInterval = setInterval(() => {
      fetchBookings();
    }, 10000); // 10 seconds
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      const rawData = response.data?.bookings || response.data || [];
      
      const fetchedBookings: BookingData[] = rawData.map((b: any) => {
        // Xác định trạng thái thanh toán từ paymentStatus (nguồn chính)
        const paymentStatus = b.paymentStatus === 'paid' ? 'paid' : 'unpaid';        
        return {
          _id: b._id,
          user: b.user || { name: 'Unknown', email: 'N/A' },
          room: b.room || { name: 'Unknown Room', price: 0, images: [] },
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          totalPrice: b.totalPrice,
          status: b.status,
          paymentMethod: b.paymentMethod,
          paymentStatus: paymentStatus,
          createdAt: b.createdAt,
        };
      });
      
      setBookings(fetchedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError('Không thể tải danh sách đặt phòng.');
      toast.error('Lỗi tải dữ liệu đặt phòng');
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status: newStatus });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus as any } : b));
      toast.success(`Cập nhật trạng thái thành: ${translateStatus(newStatus)}`);
      
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus as any });
      }
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (booking: BookingData) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;
    setActionLoading(bookingToDelete._id);
    try {
      await bookingAPI.deleteBooking(bookingToDelete._id);
      setBookings(prev => prev.filter(b => b._id !== bookingToDelete._id));
      toast.success('Xóa đơn đặt phòng thành công');
      setDetailDialogOpen(false); // Đóng detail nếu đang xóa từ detail
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const openDetailDialog = (booking: BookingData) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  // --- Helpers ---

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default'; // Black/Dark
      case 'completed': return 'default'; // Có thể custom màu xanh lá ở UI
      case 'pending': return 'secondary'; // Gray/Yellow tint
      case 'cancelled': return 'destructive'; // Red
      default: return 'outline';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  // --- Filters ---

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const isMobile = viewMode === 'mobile';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {!isMobile && <AdminSidebar />}

      {/* Main Content */}
      <div className={`${!isMobile ? 'ml-64' : ''} flex-1 p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý đặt phòng</h1>
                <p className="text-gray-600 mt-1">Theo dõi, cập nhật trạng thái đơn đặt phòng</p>
              </div>
              <Button onClick={fetchBookings} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Card className="flex-1">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Tìm theo Mã đơn, Tên khách, Phòng..."
                    className="pl-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Status Filter Tabs (Desktop style) */}
                <div className="hidden md:flex bg-gray-100 p-1 rounded-lg">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        statusFilter === status 
                          ? 'bg-white text-black shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {status === 'all' ? 'Tất cả' : translateStatus(status)}
                    </button>
                  ))}
                </div>
                {/* Status Filter Select (Mobile) */}
                <div className="md:hidden">
                   <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking List */}
          {isMobile ? (
            /* Mobile View */
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden">
                  <div className={`h-1 w-full ${
                    booking.status === 'confirmed' ? 'bg-blue-500' : 
                    booking.status === 'completed' ? 'bg-green-500' :
                    booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-gray-400 uppercase font-mono">#{booking._id.slice(-6)}</span>
                        <h3 className="font-bold text-lg">{booking.room?.name}</h3>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>
                        {translateStatus(booking.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{booking.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.checkIn).toLocaleDateString('vi-VN')} - {new Date(booking.checkOut).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium text-black">
                        <span className="text-lg">{booking.totalPrice.toLocaleString('vi-VN')}₫</span>
                        <span className="text-xs text-gray-400 font-normal">({calculateNights(booking.checkIn, booking.checkOut)} đêm)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => openDetailDialog(booking)}>
                        <Eye className="w-4 h-4 mr-2" /> Chi tiết
                      </Button>
                      {booking.status === 'pending' && (
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700" 
                          disabled={actionLoading === booking._id}
                          onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                        >
                          Duyệt
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop View */
            <Card>
              <CardHeader>
                <CardTitle>Danh sách đơn hàng ({filteredBookings.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Phòng & Thời gian</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-mono text-xs text-gray-500">
                          #{booking._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.user?.name}</div>
                          <div className="text-xs text-gray-500">{booking.user?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-blue-600">{booking.room?.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.checkIn).toLocaleDateString('vi-VN')} → {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">{booking.totalPrice.toLocaleString('vi-VN')}₫</div>
                          <div className="text-xs text-gray-400">{calculateNights(booking.checkIn, booking.checkOut)} đêm</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(booking.status)}>
                            {translateStatus(booking.status)}
                          </Badge>
                        </TableCell>
                         <TableCell>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'pending' && (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                                title="Xác nhận"
                                disabled={actionLoading === booking._id}
                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              title="Chi tiết"
                              onClick={() => openDetailDialog(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              title="Xóa đơn"
                              disabled={actionLoading === booking._id}
                              onClick={() => confirmDelete(booking)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBookings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Không tìm thấy đơn đặt phòng nào phù hợp.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đặt phòng</DialogTitle>
            <DialogDescription>Mã đơn: <span className="font-mono text-black">#{selectedBooking?._id}</span></DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid gap-6 py-4">
              {/* Status & Actions Section */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                <div>
                   <p className="text-sm text-gray-500 mb-1">Trạng thái đơn</p>
                   <Badge className="text-base" variant={getStatusColor(selectedBooking.status)}>
                      {translateStatus(selectedBooking.status)}
                   </Badge>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-xs text-gray-500">Cập nhật trạng thái:</Label>
                    <Select 
                      value={selectedBooking.status} 
                      onValueChange={(val) => handleUpdateStatus(selectedBooking._id, val)}
                      disabled={actionLoading === selectedBooking._id}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Hủy đơn</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>

              {/* Payment Status Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-2">Trạng thái thanh toán</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      selectedBooking.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className="font-semibold text-lg">
                      {selectedBooking.paymentStatus === 'paid' ? '✓ Đã thanh toán' : '✗ Chưa thanh toán'}
                    </span>
                  </div>
                  {selectedBooking.paymentMethod && (
                    <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 font-medium">
                      {selectedBooking.paymentMethod.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Guest Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                    <UserIcon className="w-4 h-4" /> Thông tin khách
                  </h3>
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                    <span className="text-gray-500">Họ tên:</span>
                    <span className="font-medium">{selectedBooking.user?.name}</span>
                    <span className="text-gray-500">Email:</span>
                    <span>{selectedBooking.user?.email}</span>
                    <span className="text-gray-500">SĐT:</span>
                    <span>{selectedBooking.user?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                    <HomeIcon className="w-4 h-4" /> Thông tin phòng
                  </h3>
                  <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                    <span className="text-gray-500">Phòng:</span>
                    <span className="font-medium">{selectedBooking.room?.name}</span>
                    <span className="text-gray-500">Giá gốc:</span>
                    <span>{selectedBooking.room?.price.toLocaleString()}₫ / đêm</span>
                  </div>
                </div>
              </div>

              {/* Timeline & Payment */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Nhận phòng</p>
                      <p className="font-semibold">{new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex-1 border-b-2 border-dashed border-blue-200 mx-4 relative top-2"></div>
                    <div className="text-center">
                       <p className="text-xs text-gray-500 mb-1">Trả phòng</p>
                       <p className="font-semibold">{new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-blue-200 mt-2">
                    <span className="font-medium">Tổng thanh toán ({calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} đêm)</span>
                    <span className="text-xl font-bold text-blue-700">{selectedBooking.totalPrice.toLocaleString()}₫</span>
                  </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
             <Button variant="destructive" onClick={() => selectedBooking && confirmDelete(selectedBooking)}>
                <Trash2 className="w-4 h-4 mr-2" /> Xóa đơn này
             </Button>
             <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy/Xóa đơn đặt phòng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn của <strong>{bookingToDelete?.user?.name}</strong>?
              <br/>
              Hành động này sẽ xóa dữ liệu vĩnh viễn khỏi hệ thống. Nếu bạn chỉ muốn hủy đơn, hãy đổi trạng thái sang "Đã hủy".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {actionLoading ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

// Icons components for internal use if not imported from lucide-react directly in some environments
function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function HomeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}