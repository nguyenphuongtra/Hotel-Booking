import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Ticket, 
  Calendar, 
  Percent, 
  Users, 
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { couponAPI } from '../api/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/Dialog';
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
import { Label } from '../components/ui/label';
// import { Switch } from '../components/ui/Switch'; // Giả sử bạn có component Switch, nếu không dùng Checkbox

interface CouponData {
  _id: string;
  code: string;
  discount: number; // Phần trăm giảm hoặc số tiền
  type: 'percent' | 'fixed'; // Loại giảm giá
  maxUses: number;
  usedCount: number;
  startAt: string;
  endAt: string;
  active: boolean;
  createdAt: string;
}

interface CouponForm {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  maxUses: number;
  startAt: string;
  endAt: string;
  active: boolean;
}

interface AdminCouponsProps {
  viewMode: 'desktop' | 'mobile';
}

export function AdminCoupons({ viewMode }: AdminCouponsProps) {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<CouponData | null>(null);

  const initialForm: CouponForm = {
    code: '',
    discount: 10,
    type: 'percent',
    maxUses: 100,
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
  };
  const [formData, setFormData] = useState<CouponForm>(initialForm);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      // Lưu ý: Cần bổ sung getAllCoupons vào api.ts
      const response = await couponAPI.getAllCoupons(); 
      const fetchedCoupons = Array.isArray(response.data.coupons) ? response.data.coupons : [];
      setCoupons(fetchedCoupons);
    } catch (err: any) {
      setError('Không thể tải danh sách mã giảm giá.');
      // Mock data nếu API chưa có để test UI
      // setCoupons([
      //   { _id: '1', code: 'WELCOME20', discount: 20, type: 'percent', maxUses: 100, usedCount: 45, startAt: '2023-10-01', endAt: '2024-12-31', active: true, createdAt: '2023-10-01' },
      //   { _id: '2', code: 'SUMMER50', discount: 50000, type: 'fixed', maxUses: 50, usedCount: 50, startAt: '2023-06-01', endAt: '2023-08-31', active: false, createdAt: '2023-06-01' },
      // ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép: ${code}`);
  };

  const openAddForm = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setFormOpen(true);
  };

  const openEditForm = (coupon: CouponData) => {
    setIsEditing(true);
    setCurrentId(coupon._id);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      maxUses: coupon.maxUses,
      startAt: coupon.startAt.split('T')[0], // Format date for input
      endAt: coupon.endAt.split('T')[0],
      active: coupon.active,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('form');
    try {
      if (isEditing && currentId) {
        // Cần bổ sung updateCoupon vào api.ts
        await couponAPI.updateCoupon(currentId, formData);
        toast.success('Cập nhật mã giảm giá thành công');
      } else {
        await couponAPI.createCoupon(formData);
        toast.success('Tạo mã giảm giá mới thành công');
      }
      setFormOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (coupon: CouponData) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    setActionLoading(couponToDelete._id);
    try {
      // Cần bổ sung deleteCoupon vào api.ts
      await couponAPI.deleteCoupon(couponToDelete._id);
      setCoupons(prev => prev.filter(c => c._id !== couponToDelete._id));
      toast.success('Đã xóa mã giảm giá');
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

  // --- Helpers ---
  
  const isExpired = (endAt: string) => new Date(endAt) < new Date();
  
  const getStatusBadge = (coupon: CouponData) => {
    if (!coupon.active) return <Badge variant="secondary">Đã tắt</Badge>;
    if (isExpired(coupon.endAt)) return <Badge variant="destructive">Hết hạn</Badge>;
    if (coupon.usedCount >= coupon.maxUses) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Hết lượt</Badge>;
    return <Badge className="bg-green-600 hover:bg-green-700">Đang chạy</Badge>;
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMobile = viewMode === 'mobile';

  if (loading) return <LoadingState />;
  if (error && coupons.length === 0) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!isMobile && <AdminSidebar />}

      <div className={`${!isMobile ? 'ml-64' : ''} flex-1 p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Ticket className="w-8 h-8 text-blue-600" />
                Quản lý Mã giảm giá
              </h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={fetchCoupons} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" /> Tạo mã mới
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã code..."
                  className="pl-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mobile View */}
          {isMobile ? (
            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <Card key={coupon._id} className="relative overflow-hidden border-l-4 border-l-blue-500">
                  <div className="absolute right-0 top-0 p-2 opacity-10">
                    <Ticket className="w-24 h-24" />
                  </div>
                  <CardContent className="p-4 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <div 
                        className="font-mono text-xl font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded cursor-pointer flex items-center gap-2 active:scale-95 transition-transform"
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        {coupon.code} <Copy className="w-3 h-3 text-gray-400" />
                      </div>
                      {getStatusBadge(coupon)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 my-3">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        <span className="font-semibold text-black">
                          {coupon.type === 'percent' ? `${coupon.discount}%` : `-${coupon.discount.toLocaleString()}đ`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{coupon.usedCount} / {coupon.maxUses}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(coupon.startAt).toLocaleDateString('vi-VN')} - {new Date(coupon.endAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditForm(coupon)}>
                        <Edit className="w-4 h-4 mr-1" /> Sửa
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDelete(coupon)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop View */
            <Card>
              <CardHeader>
                <CardTitle>Danh sách mã ({filteredCoupons.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã Code</TableHead>
                      <TableHead>Giảm giá</TableHead>
                      <TableHead>Lượt dùng</TableHead>
                      <TableHead>Thời gian hiệu lực</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.map((coupon) => (
                      <TableRow key={coupon._id}>
                        <TableCell>
                          <div 
                            className="font-mono font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-2"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Click để copy"
                          >
                            {coupon.code}
                            <Copy className="w-3 h-3 opacity-50" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {coupon.type === 'percent' ? (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              Giảm {coupon.discount}%
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Giảm {coupon.discount.toLocaleString()}đ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${coupon.usedCount >= coupon.maxUses ? 'bg-red-500' : 'bg-blue-500'}`} 
                                  style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }} 
                                />
                             </div>
                             <span className="text-xs text-gray-500">{coupon.usedCount}/{coupon.maxUses}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <div className="text-sm">
                              <div>{new Date(coupon.startAt).toLocaleDateString('vi-VN')}</div>
                              <div className="text-xs text-gray-400">đến {new Date(coupon.endAt).toLocaleDateString('vi-VN')}</div>
                           </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(coupon)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditForm(coupon)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => confirmDelete(coupon)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCoupons.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Chưa có mã giảm giá nào.
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

      {/* --- FORM DIALOG --- */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</DialogTitle>
            <DialogDescription>Thiết lập các thông số cho chương trình khuyến mãi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã Code</Label>
                <Input 
                  id="code" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="VD: SUMMER2024" 
                  className="uppercase font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Loại giảm giá</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Giá trị giảm ({formData.type === 'percent' ? '%' : 'VNĐ'})</Label>
                <Input 
                  id="discount" 
                  type="number"
                  value={formData.discount} 
                  onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Số lượt tối đa</Label>
                <Input 
                  id="maxUses" 
                  type="number"
                  value={formData.maxUses} 
                  onChange={(e) => setFormData({...formData, maxUses: Number(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAt">Ngày bắt đầu</Label>
                <Input 
                  id="startAt" 
                  type="date"
                  value={formData.startAt} 
                  onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAt">Ngày kết thúc</Label>
                <Input 
                  id="endAt" 
                  type="date"
                  value={formData.endAt} 
                  onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="active" 
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="active" className="cursor-pointer">Kích hoạt ngay lập tức</Label>
            </div>

            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button>
               <Button type="submit" disabled={actionLoading === 'form'}>
                 {actionLoading === 'form' ? 'Đang lưu...' : 'Lưu thay đổi'}
               </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE DIALOG --- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa mã giảm giá?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mã <strong>{couponToDelete?.code}</strong>?
              <br/>Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {actionLoading ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}