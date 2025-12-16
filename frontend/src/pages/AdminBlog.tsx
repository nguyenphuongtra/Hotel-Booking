import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { blogAPI } from '../api/api';
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
} from '../components/ui/DiaLog';
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

// Interface dựa trên Schema
interface BlogData {
  _id: string;
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  datePorted: string; // Hoặc createdAt tùy backend trả về
  createdAt?: string;
}

interface BlogForm {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
}

interface AdminBlogsProps {
  viewMode: 'desktop' | 'mobile';
}

export function AdminBlogs({ viewMode }: AdminBlogsProps) {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal & Form States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogData | null>(null);
  
  const initialForm: BlogForm = {
    title: '',
    description: '',
    content: '',
    imageUrl: '',
  };
  const [formData, setFormData] = useState<BlogForm>(initialForm);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllBlogs();
      // Xử lý dữ liệu trả về (tùy thuộc cấu trúc response: data.blogs hoặc data trực tiếp)
      const fetchedBlogs = response.data.blogs || response.data || [];
      setBlogs(fetchedBlogs);
    } catch (err: any) {
      setError('Không thể tải danh sách bài viết.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const openAddForm = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setFormOpen(true);
  };

  const openEditForm = (blog: BlogData) => {
    setIsEditing(true);
    setCurrentId(blog._id);
    setFormData({
      title: blog.title,
      description: blog.description || '',
      content: blog.content,
      imageUrl: blog.imageUrl || '',
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('form');

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        imageUrl: formData.imageUrl,
      };

      if (isEditing && currentId) {
        await blogAPI.updateBlog(currentId, data);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await blogAPI.createBlog(data);
        toast.success('Đăng bài viết mới thành công');
      }
      
      setFormOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (blog: BlogData) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setActionLoading(blogToDelete._id);
    try {
      await blogAPI.deleteBlog(blogToDelete._id);
      setBlogs(prev => prev.filter(b => b._id !== blogToDelete._id));
      toast.success('Đã xóa bài viết');
    } catch (err) {
      toast.error('Xóa thất bại');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    }
  };

  // --- Render Helpers ---

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMobile = viewMode === 'mobile';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!isMobile && <AdminSidebar />}

      <div className={`${!isMobile ? 'ml-64' : ''} flex-1 p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                Quản lý Blog
              </h1>
              <p className="text-gray-600 mt-1">Đăng tải tin tức, bài viết quảng bá</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={fetchBlogs} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" /> Viết bài mới
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề bài viết..."
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
              {filteredBlogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden">
                  {blog.imageUrl && (
                    <div className="h-40 w-full overflow-hidden">
                      <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {blog.description || 'Không có mô tả'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.datePorted || blog.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditForm(blog)}>
                        <Edit className="w-4 h-4 mr-1" /> Sửa
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => confirmDelete(blog)}>
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
                <CardTitle>Danh sách bài viết ({filteredBlogs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Hình ảnh</TableHead>
                      <TableHead className="w-[30%]">Tiêu đề</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Ngày đăng</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden border">
                            {blog.imageUrl ? (
                              <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium align-top">
                          <div className="line-clamp-2" title={blog.title}>{blog.title}</div>
                        </TableCell>
                        <TableCell className="align-top">
                           <div className="text-sm text-gray-500 line-clamp-2">
                             {blog.description || 'Không có mô tả'}
                           </div>
                        </TableCell>
                        <TableCell className="align-top">
                           <span className="text-sm text-gray-600">
                             {new Date(blog.datePorted || blog.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                           </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditForm(blog)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => confirmDelete(blog)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBlogs.length === 0 && (
                      <TableRow>
                        <TableCell className="text-center py-8 text-gray-500">
                          Chưa có bài viết nào.
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho bài blog của bạn.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề bài viết</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Nhập tiêu đề hấp dẫn..." 
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả ngắn (Description)</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Tóm tắt nội dung bài viết để hiển thị ở danh sách..." 
                className="h-20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL ảnh đại diện</Label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    id="imageUrl" 
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="Nhập URL ảnh (vd: https://example.com/image.jpg)" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Dán link ảnh từ các trang web hoặc CDN.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Nội dung chi tiết</Label>
              {/* Đây là Textarea cơ bản, có thể thay thế bằng Rich Text Editor như ReactQuill sau này */}
              <Textarea 
                id="content" 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Nội dung chính của bài viết..." 
                className="min-h-[200px] font-mono text-sm"
                required
              />
            </div>
            <DialogFooter className="mt-4">
               <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button>
               <Button type="submit" disabled={actionLoading === 'form'}>
                 {actionLoading === 'form' ? 'Đang lưu...' : 'Lưu bài viết'}
               </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE DIALOG --- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{blogToDelete?.title}"</strong>?
              <br/>Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {actionLoading ? 'Đang xóa...' : 'Xóa bài viết'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}