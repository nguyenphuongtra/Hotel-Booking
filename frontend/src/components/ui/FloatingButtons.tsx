import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface FloatingButtonsProps {
  zalo?: string; // Số điện thoại Zalo
}

export default function FloatingButtons({ 
  zalo = "0365480142" 
}: FloatingButtonsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Logic ẩn hiện nút Scroll to Top
  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi cuộn xuống quá 300px
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Hàm cuộn lên đầu trang mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
      
      {/* --- NÚT 2: ZALO (Nằm trên) --- */}
      <a 
        href={`https://zalo.me/${zalo}`} 
        target="_blank" 
        rel="noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-white"
      >
        {/* Tooltip 'Chat Zalo' */}
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Chat Zalo
        </span>

        {/* Icon Zalo - Sử dụng ảnh logo chuẩn */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
          alt="Zalo"
          className="w-full h-full object-cover rounded-full" 
        />
        
        {/* Hiệu ứng sóng lan tỏa (Ping effect) để thu hút chú ý */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-20 animate-ping -z-10"></span>
      </a>

      {/* --- NÚT 1: SCROLL TO TOP (Giống ảnh bạn gửi) --- */}
      <button
        onClick={scrollToTop}
        className={`
          flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-500 transform
          bg-amber-500 hover:bg-amber-600 text-white border-2 border-white
          ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
        `}
        aria-label="Lên đầu trang"
      >
        <ChevronUp size={28} strokeWidth={3} />
      </button>

    </div>
  );
}