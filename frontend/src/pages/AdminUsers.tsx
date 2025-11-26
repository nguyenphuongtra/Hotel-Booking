import { useState, useEffect } from 'react';
import { Search, Lock, Unlock, Shield, User, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/AlertDialog';
import { userAPI } from '../api/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  isLocked: boolean;
  createdAt: string;
  bookingsCount: number;
  avatar?: string;
}

interface AdminUsersProps {
  viewMode: 'desktop' | 'mobile';
}

export function AdminUsers({ viewMode }: AdminUsersProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      const fetchedUsers: UserData[] = response.data.users.map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        role: u.isAdmin ? 'admin' : 'user',
        isLocked: u.isLocked || false,
        createdAt: new Date(u.createdAt).toLocaleDateString('vi-VN'),
        bookingsCount: u.bookingsCount || 0,
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u._id}`,
      }));
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError('Không thể tải danh sách người dùng.');
      toast.error('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleLockUnlock = async (userId: string, isLocked: boolean) => {
    setActionLoading(userId);
    try {
      if (isLocked) {
        await userAPI.unlockUser(userId);
        toast.success('Đã mở khóa tài khoản');
      } else {
        await userAPI.lockUser(userId);
        toast.success('Đã khóa tài khoản');
      }
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isLocked: !isLocked } : u));
    } catch (err) {
      toast.error('Thao tác thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: 'admin' | 'user') => {
    setActionLoading(userId);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await userAPI.updateUserRole(userId, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Đổi vai trò thành ${newRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`);
    } catch (err) {
      toast.error('Thay đổi vai trò thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (user: UserData) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(userToDelete._id);
    try {
      await userAPI.deleteUser(userToDelete._id);
      setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
      toast.success('Xóa người dùng thành công');
    } catch (err) {
      toast.error('Xóa người dùng thất bại');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Layout: Sidebar cố định + nội dung chính có margin-left trên desktop
  const isMobile = viewMode === 'mobile';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Ẩn trên mobile, hiện trên desktop */}
      {!isMobile && <AdminSidebar />}

      {/* Main Content */}
      <div className={`${!isMobile ? 'ml-64' : ''} flex-1 p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
                <p className="text-gray-600 mt-1">Xem, khóa, mở khóa, thay đổi quyền và xóa tài khoản</p>
              </div>
              <Button onClick={fetchUsers} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
              {filteredUsers.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                          <Badge variant={user.isLocked ? 'destructive' : 'default'}>
                            {user.isLocked ? 'Khóa' : 'Hoạt động'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                          <div>SĐT: {user.phone}</div>
                          <div>Tham gia: {user.createdAt}</div>
                          <div>Đặt phòng: {user.bookingsCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={actionLoading === user._id}
                        onClick={() => handleLockUnlock(user._id, user.isLocked)}
                      >
                        {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span className="ml-1">{user.isLocked ? 'Mở khóa' : 'Khóa'}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={actionLoading === user._id}
                        onClick={() => handleChangeRole(user._id, user.role)}
                      >
                        <Shield className="w-4 h-4" />
                        <span className="ml-1">Quyền</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === user._id}
                        onClick={() => confirmDelete(user)}
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
                <CardTitle>Tất cả người dùng ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Liên hệ</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tham gia</TableHead>
                      <TableHead>Đặt phòng</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isLocked ? 'destructive' : 'default'}>
                            {user.isLocked ? 'Đã khóa' : 'Hoạt động'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>{user.bookingsCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === user._id}
                              onClick={() => handleLockUnlock(user._id, user.isLocked)}
                            >
                              {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === user._id}
                              onClick={() => handleChangeRole(user._id, user.role)}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === user._id}
                              onClick={() => confirmDelete(user)}
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
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
              <br />
              <span className="text-red-600">Hành động này không thể hoàn tác!</span>
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