import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, RefreshCw, Bed, Users, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
// import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';

import { roomAPI } from '../api/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/AlertDialog';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../components/ui/DiaLog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

interface RoomData {
  _id: string;
  name: string;
  roomNumber?: string;
  type: 'single' | 'double' | 'suite' | 'family';
  price: number;
  images: string[];
  amenities?: string[];
  occupancy?: { adults?: number; children?: number; };
  description?: string;
  quantity: number;
  ratingsAvg?: number;
  ratingsCount?: number;
  status: 'available' | 'maintenance' | 'booked';
  createdAt: string;
}

interface RoomForm {
  name: string;
  roomNumber: string;
  type: 'single' | 'double' | 'suite' | 'family';
  price: number;
  images: string[];
  amenities: string[];
  adults: number;
  children: number;
  description: string;
  quantity: number;
  status: 'available' | 'maintenance' | 'booked';
}

interface AdminRoomsProps {
  viewMode: 'desktop' | 'mobile';
}

export function AdminRooms({ viewMode }: AdminRoomsProps) {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomData | null>(null);
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
  const initialRoomData: RoomForm = {
    name: '',
    roomNumber: '',
    type: 'single',
    price: 0,
    images: [],
    amenities: [],
    adults: 1,
    children: 0,
    description: '',
    quantity: 1,
    status: 'available',
  };
  const [roomFormData, setRoomFormData] = useState<RoomForm>(initialRoomData);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.listRooms();
      const fetchedRooms: RoomData[] = response.data.rooms.map((r: any) => ({
        _id: r._id,
        name: r.name,
        type: r.type,
        roomNumber: r.roomNumber,
        price: r.price,
        images: r.images || [],
        amenities: r.amenities || [],
        occupancy: r.occupancy || { adults: 2, children: 0 },
        description: r.description,
        quantity: r.quantity || 1,
        ratingsAvg: r.ratingsAvg || 0,
        ratingsCount: r.ratingsCount || 0,
        status: r.status || 'available',
        createdAt: new Date(r.createdAt).toLocaleDateString('vi-VN'),
      }));
      setRooms(fetchedRooms);
    } catch (err: any) {
      setError('Không thể tải danh sách phòng.');
      toast.error('Không thể tải danh sách phòng.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (room: RoomData) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;
    setActionLoading(roomToDelete._id);
    try {
      await roomAPI.deleteRoom(roomToDelete._id);
      setRooms(prev => prev.filter(r => r._id !== roomToDelete._id));
      toast.success('Xóa phòng thành công!');
    } catch (err) {
      toast.error('Xóa phòng thất bại.');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  const openAddRoomForm = () => {
    setIsEditing(false);
    setRoomFormData(initialRoomData);
    setCurrentRoom(null);
    setRoomFormOpen(true);
  };

  const openEditRoomForm = (room: RoomData) => {
    setIsEditing(true);
    setCurrentRoom(room);
    setRoomFormData({
      name: room.name,
      roomNumber: room.roomNumber || '',
      type: room.type,
      price: room.price,
      images: room.images || [],
      amenities: room.amenities || [],
      adults: room.occupancy?.adults || 1,
      children: room.occupancy?.children || 0,
      description: room.description || '',
      quantity: room.quantity,
      status: room.status,
    });
    setRoomFormOpen(true);
  };

  const closeRoomForm = () => {
    setRoomFormOpen(false);
    setIsEditing(false);
    setCurrentRoom(null);
    setRoomFormData(initialRoomData);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'adults' || name === 'children' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRoomFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setRoomFormData(prev => {
      const newAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(amenity => amenity !== value);
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleSubmitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('room-form');
    try {
      const roomPayload = {
        name: roomFormData.name,
        roomNumber: roomFormData.roomNumber,
        type: roomFormData.type,
        price: roomFormData.price,
        images: roomFormData.images,
        amenities: roomFormData.amenities,
        occupancy: { adults: roomFormData.adults, children: roomFormData.children },
        description: roomFormData.description,
        quantity: roomFormData.quantity,
        status: roomFormData.status,
      };

      if (isEditing && currentRoom) {
        await roomAPI.updateRoom(currentRoom._id, roomPayload);
        toast.success('Cập nhật phòng thành công!');
      } else {
        await roomAPI.createRoom(roomPayload);
        toast.success('Thêm phòng mới thành công!');
      }
      closeRoomForm();
      fetchRooms();
    } catch (err: any) {
      toast.error(`Thao tác thất bại: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-3xl font-bold">Quản lý phòng</h1>
                <p className="text-gray-600 mt-1">Xem, thêm, sửa, xóa các loại phòng trong khách sạn</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={fetchRooms} variant="outline" size="sm">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAddRoomForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm phòng mới
                </Button>
              </div>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên phòng hoặc loại phòng..."
                  className="pl-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mobile Cards */}
          {isMobile ? (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <Card key={room._id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex-shrink-0">
                        {room.images[0] ? (
                          <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Bed className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{room.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">₫{room.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>{room.occupancy?.adults} người</span>
                          </div>
                          <div className="text-gray-500">x{room.quantity}</div>
                        </div>
                        <Badge className="mt-2" variant={room.status === 'available' ? 'default' : room.status === 'maintenance' ? 'secondary' : 'outline'}>
                          {room.status === 'available' ? 'Sẵn sàng' : room.status === 'maintenance' ? 'Bảo trì' : 'Đã đặt'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditRoomForm(room)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === room._id}
                        onClick={() => confirmDelete(room)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table */
            <Card>
              <CardHeader>
                <CardTitle>Tất cả phòng ({filteredRooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phòng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Giá / đêm</TableHead>
                      <TableHead>Sức chứa</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0">
                              {room.images[0] ? (
                                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Bed className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{room.name}</div>
                              <div className="text-sm text-gray-500">Thêm: {room.createdAt}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{room.type}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          ₫{room.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {room.occupancy?.adults} người
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='secondary'>{room.quantity} phòng</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={room.status === 'available' ? 'default' : room.status === 'maintenance' ? 'secondary' : 'outline'}>
                            {room.status === 'available' ? 'Sẵn sàng' : room.status === 'maintenance' ? 'Bảo trì' : 'Đã đặt'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditRoomForm(room)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === room._id}
                              onClick={() => confirmDelete(room)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>...</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                Xóa vĩnh viễn
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Room Form Dialog */}
      <Dialog open={roomFormOpen} onOpenChange={closeRoomForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Chỉnh sửa thông tin phòng hiện có.' : 'Thêm một phòng mới vào hệ thống.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRoom} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Tên phòng</Label>
              <Input id="name" name="name" value={roomFormData.name} onChange={handleFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">Số phòng</Label>
              <Input id="roomNumber" name="roomNumber" value={roomFormData.roomNumber} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Loại phòng</Label>
              <Select name="type" value={roomFormData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Giá/đêm</Label>
              <Input id="price" name="price" type="number" value={roomFormData.price} onChange={handleFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adults" className="text-right">Người lớn</Label>
              <Input id="adults" name="adults" type="number" value={roomFormData.adults} onChange={handleFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="children" className="text-right">Trẻ em</Label>
              <Input id="children" name="children" type="number" value={roomFormData.children} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Số lượng</Label>
              <Input id="quantity" name="quantity" type="number" value={roomFormData.quantity} onChange={handleFormChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Mô tả</Label>
              <Textarea id="description" name="description" value={roomFormData.description} onChange={handleFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amenities" className="text-right">Tiện nghi</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {[ 'WiFi', 'TV', 'Điều hòa', 'Ban công', 'Tắm nước nóng', 'Minibar' ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      value={amenity}
                      checked={roomFormData.amenities.includes(amenity)}
                      onChange={handleAmenityChange}
                      className="form-checkbox"
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">URL ảnh</Label>
              <Input id="images" name="images" value={roomFormData.images.join(', ')} onChange={(e) => setRoomFormData(prev => ({ ...prev, images: e.target.value.split(', ').map(img => img.trim()) }))} className="col-span-3" placeholder="Phân tách bằng dấu phẩy" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Trạng thái</Label>
              <Select name="status" value={roomFormData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-6">
                <Button variant="outline" onClick={closeRoomForm}>
                    Hủy
                </Button>
                <Button type="submit" disabled={actionLoading === 'room-form'}>
                    {actionLoading === 'room-form' 
                    ? (isEditing ? 'Đang cập nhật...' : 'Đang thêm...') 
                    : (isEditing ? 'Cập nhật' : 'Thêm phòng')
                    }
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}