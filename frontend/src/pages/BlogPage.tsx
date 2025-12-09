import { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  X,
  Share2,
  Heart
} from 'lucide-react';
import { blogAPI } from '../api/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { LoadingState } from '../components/ui/LoadingState';
import {
  Dialog,
  DialogContent,
} from '../components/ui/DiaLog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/Separator';

interface Blog {
  _id: string;
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  datePorted: string;
  author?: string;
  readTime?: number; // Giả lập thời gian đọc
  category?: string; // Giả lập danh mục
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllBlogs();
      const rawBlogs = response.data.blogs || response.data || [];
      
      // Map và thêm dữ liệu giả lập cho UI đẹp hơn nếu thiếu
      const enhancedBlogs = rawBlogs.map((blog: any) => ({
        ...blog,
        readTime: Math.ceil(blog.content.length / 1000) || 5,
        category: 'Travel & Guide', // Default category
        author: 'Hotel Admin'
      }));

      setBlogs(enhancedBlogs);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadBlog = async (blog: Blog) => {
    setSelectedBlog(blog);
    // Nếu cần fetch chi tiết đầy đủ từ API (ví dụ content quá dài không trả về hết ở list)
    // setDetailLoading(true);
    // try {
    //   const res = await blogAPI.getBlogById(blog._id);
    //   setSelectedBlog(res.data);
    // } catch (e) { ... } finally { setDetailLoading(false); }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Featured blog là bài mới nhất
  const featuredBlog = filteredBlogs[0];
  const remainingBlogs = filteredBlogs.slice(1);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-400/30 backdrop-blur-sm">
            Travel & Lifestyle
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Khám phá thế giới cùng chúng tôi
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Những câu chuyện du lịch, bí quyết đặt phòng và cẩm nang nghỉ dưỡng tuyệt vời nhất dành cho chuyến đi của bạn.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl">
              <Search className="ml-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, địa điểm..."
                className="w-full px-4 py-2 text-gray-900 bg-transparent outline-none placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Không tìm thấy bài viết</h3>
            <p className="text-gray-500 mt-2">Hãy thử từ khóa khác xem sao.</p>
          </div>
        ) : (
          <>
            {/* --- FEATURED POST (Chỉ hiện nếu không search hoặc search khớp bài đầu) --- */}
            {featuredBlog && !searchTerm && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  Bài viết nổi bật
                </h2>
                <div 
                  className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer grid md:grid-cols-2 bg-white hover:shadow-2xl transition-all duration-300"
                  onClick={() => handleReadBlog(featuredBlog)}
                >
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src={featuredBlog.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"} 
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-black hover:bg-white shadow-sm">
                        Mới nhất
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(featuredBlog.datePorted).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredBlog.readTime} phút đọc
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredBlog.title}
                    </h3>
                    <p className="text-gray-600 mb-8 line-clamp-3 text-lg leading-relaxed">
                      {featuredBlog.description}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group/btn">
                      Đọc tiếp <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- RECENT POSTS GRID --- */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                 {searchTerm ? 'Kết quả tìm kiếm' : 'Bài viết mới nhất'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchTerm ? filteredBlogs : remainingBlogs).map((blog) => (
                  <Card 
                    key={blog._id} 
                    className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
                    onClick={() => handleReadBlog(blog)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={blog.imageUrl || `https://source.unsplash.com/random/800x600?travel&sig=${blog._id}`} 
                        alt={blog.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                         <span className="text-white text-sm font-medium flex items-center gap-1">
                            Xem chi tiết <ArrowRight className="w-4 h-4" />
                         </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.datePorted).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                        {blog.description}
                      </p>

                      <Separator className="my-4" />
                      
                      <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                               A
                            </div>
                            <span className="text-gray-600 font-medium">{blog.author}</span>
                         </div>
                         <span className="text-gray-400 text-xs">{blog.readTime} min read</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- READING MODAL --- */}
      <Dialog open={!!selectedBlog} onOpenChange={(open) => !open && setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white">
          {selectedBlog && (
            <>
              {/* Header ảnh */}
              <div className="relative h-64 sm:h-80 shrink-0">
                <img 
                  src={selectedBlog.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200"} 
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <Button 
                  className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/40 text-white border-none"
                  size="icon"
                  onClick={() => setSelectedBlog(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                   <div className="flex gap-2 mb-3">
                      <Badge className="bg-blue-600 hover:bg-blue-700 border-none">{selectedBlog.category}</Badge>
                      <Badge className="text-white border-white/40 bg-black/20 backdrop-blur-md">
                        {new Date(selectedBlog.datePorted).toLocaleDateString('vi-VN')}
                      </Badge>
                   </div>
                   <h2 className="text-2xl sm:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">
                      {selectedBlog.title}
                   </h2>
                </div>
              </div>

              {/* Nội dung bài viết */}
              <ScrollArea className="flex-1">
                 <div className="p-6 sm:p-10 max-w-3xl mx-auto">
                    {/* Toolbar giả lập */}
                    <div className="flex items-center justify-between border-b pb-6 mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Admin" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-900">{selectedBlog.author}</p>
                             <p className="text-xs text-gray-500">Editor</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2 text-gray-600">
                             <Heart className="w-4 h-4" /> <span className="hidden sm:inline">Lưu</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 text-gray-600">
                             <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Chia sẻ</span>
                          </Button>
                       </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                       {/* Render mô tả đậm */}
                       {selectedBlog.description && (
                          <p className="text-xl font-medium text-gray-800 mb-8 font-serif italic border-l-4 border-blue-500 pl-4">
                             {selectedBlog.description}
                          </p>
                       )}
                       
                       {/* Render nội dung chính - Giả lập HTML rendering an toàn */}
                       <div className="whitespace-pre-wrap font-serif">
                          {selectedBlog.content}
                       </div>
                    </div>

                    {/* Footer bài viết */}
                    <div className="mt-12 pt-8 border-t flex justify-center">
                       <p className="text-gray-400 text-sm italic">
                          Cảm ơn bạn đã đọc bài viết này.
                       </p>
                    </div>
                 </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}