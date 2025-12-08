import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Download, Eye, X, CheckCircle, XCircle, AlertCircle, Receipt, Printer } from 'lucide-react';
import { bookingAPI } from '../api/api';
import moment from 'moment';

interface Booking {
  _id: string;
  room: {
    _id: string;
    name: string;
    totalPrice: number; 
    images: string[];
    location?: string;
    type?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: string;
  createdAt: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      setBookings(Array.isArray(response.data.bookings) ? response.data.bookings : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: Booking['status']) => {
    const configs = {
      pending: { color: 'text-yellow-600 border-yellow-600 bg-yellow-50', icon: AlertCircle, label: 'PENDING' },
      confirmed: { color: 'text-green-600 border-green-600 bg-green-50', icon: CheckCircle, label: 'CONFIRMED' },
      cancelled: { color: 'text-red-600 border-red-600 bg-red-50', icon: XCircle, label: 'CANCELLED' },
      completed: { color: 'text-blue-600 border-blue-600 bg-blue-50', icon: CheckCircle, label: 'COMPLETED' }
    };
    return configs[status] || configs.pending;
  };

  // Hàm xuất file text (giả lập xuất hoá đơn)
  const exportToTextInvoice = (booking: Booking) => {
    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = booking.totalPrice / (nights || 1);

    const content = `
    INVOICE / RECEIPT
    =========================================
    Booking ID: ${booking._id}
    Date: ${moment().format('DD/MM/YYYY HH:mm')}
    
    Status: ${booking.status?.toUpperCase()}
    Payment: ${booking.paymentStatus?.toUpperCase() || 'PENDING'}
    
    -----------------------------------------
    GUEST DETAILS
    Name:  ${booking.user?.name || 'N/A'}
    Email: ${booking.user?.email || 'N/A'}
    
    -----------------------------------------
    RESERVATION DETAILS
    Room:      ${booking.room?.name || 'N/A'}
    Location:  ${booking.room?.location || 'N/A'}
    Check-in:  ${moment(booking.checkIn).format('DD/MM/YYYY')}
    Check-out: ${moment(booking.checkOut).format('DD/MM/YYYY')}
    Duration:  ${nights} night(s)
    
    -----------------------------------------
    PAYMENT BREAKDOWN
    Price per night:  ${pricePerNight.toLocaleString('vi-VN')} VND
    Nights:           x ${nights}
    
    TOTAL AMOUNT:     ${booking.totalPrice?.toLocaleString('vi-VN')} VND
    =========================================
    Thank you for staying with us!
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Receipt className="w-8 h-8" />
              My Bookings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý đặt phòng và hoá đơn</p>
          </div>
          
          {/* Filters */}
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === status
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.length === 0 ? (
             <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
               <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
               <p className="text-gray-500">There are no bookings matching your filter.</p>
             </div>
          ) : (
            filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div 
                  key={booking._id}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${statusConfig.color} bg-opacity-10 border-opacity-20`}>
                        {booking.status}
                      </span>
                      <span className="text-xs font-mono text-gray-400">#{booking._id.slice(-6).toUpperCase()}</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {booking.room?.name || 'Unknown Room'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                       <MapPin className="w-3 h-3 mr-1" />
                       <span className="line-clamp-1">{booking.room?.location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Check-in</p>
                        <p className="font-medium">{moment(booking.checkIn).format('DD/MM')}</p>
                      </div>
                      <div className="border-r border-gray-300 h-8 mx-2"></div>
                      <div>
                         <p className="text-xs text-gray-400 uppercase">Total</p>
                         <p className="font-bold text-gray-900 dark:text-white">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex justify-between items-center">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {nights} đêm
                    </span>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                      View Invoice →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* INVOICE MODAL */}
      {selectedBooking && (() => {
         const nights = Math.ceil((new Date(selectedBooking.checkOut).getTime() - new Date(selectedBooking.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
         const pricePerNight = selectedBooking.totalPrice / nights;
         const statusConfig = getStatusConfig(selectedBooking.status);

         return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white text-gray-900 rounded-sm shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Invoice Content */}
              <div className="p-8 md:p-10 relative overflow-hidden">
                {/* Decorative Status Stamp */}
                <div className={`absolute top-12 right-12 border-4 ${statusConfig.color} rounded opacity-20 transform -rotate-12 pointer-events-none`}>
                  <div className={`px-4 py-2 text-2xl font-black uppercase tracking-widest border-2 border-white`}>
                    {selectedBooking.status}
                  </div>
                </div>

                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-sm">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xl tracking-tight">Hoá đơn khách sạn</span>
                    </div>
                    <p className="text-sm text-gray-500">Bản gốc Copy</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Hóa đơn#</p>
                    <p className="font-mono font-bold text-lg">{selectedBooking._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                  <div>
                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Billed To</h4>
                    <p className="font-bold text-base">{selectedBooking.user?.name}</p>
                    <p className="text-gray-600">{selectedBooking.user?.email}</p>
                    <p className="text-gray-600 mt-1">Thanh toán: <span className="capitalize font-medium">{selectedBooking.paymentStatus || 'Pending'}</span></p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Chi tiết lưu trú</h4>
                    <p className="font-medium text-gray-900">{moment(selectedBooking.checkIn).format('MMM DD, YYYY')}</p>
                    <p className="text-gray-400 text-xs my-1">to</p>
                    <p className="font-medium text-gray-900">{moment(selectedBooking.checkOut).format('MMM DD, YYYY')}</p>
                    <p className="text-blue-600 font-medium mt-1">{nights} đêm{nights > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 text-gray-500 font-medium w-1/2">Description</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Rate</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Qty</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      <tr className="border-b border-gray-100 border-dashed">
                        <td className="py-4 pr-2">
                          <p className="font-bold text-gray-800 font-sans">{selectedBooking.room?.name}</p>
                          <p className="text-xs text-gray-500 font-sans">{selectedBooking.room?.type} Room - {selectedBooking.room?.location}</p>
                        </td>
                        <td className="py-4 text-right text-gray-600">
                          {pricePerNight?.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-4 text-right text-gray-600">{nights}</td>
                        <td className="py-4 text-right font-medium text-gray-900">
                          {selectedBooking.totalPrice?.toLocaleString('vi-VN')}
                        </td>
                      </tr>
                      {/* Có thể thêm các dòng Taxes/Fees ở đây nếu có */}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="pt-6 text-right text-gray-500 font-sans text-xs uppercase tracking-wide">Subtotal</td>
                        <td className="pt-6 text-right font-mono font-medium text-gray-900">{selectedBooking.totalPrice?.toLocaleString('vi-VN')}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="pt-2 text-right text-gray-500 font-sans text-xs uppercase tracking-wide">Tax (Included)</td>
                        <td className="pt-2 text-right font-mono font-medium text-gray-900">0</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="pt-4 text-right font-bold text-xl text-gray-900 font-sans">Total</td>
                        <td className="pt-4 text-right font-bold text-xl text-gray-900 font-mono">
                          {selectedBooking.totalPrice?.toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer / Notes */}
                <div className="bg-gray-50 -mx-10 -mb-10 p-8 border-t border-gray-200 mt-auto">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="text-xs text-gray-500 text-center sm:text-left">
                      <p className="font-medium text-gray-900 mb-1">Cảm ơn quý khách đã ủng hộ!</p>
                      <p>Vui lòng liên hệ với bộ phận hỗ trợ nếu bạn có bất kỳ câu hỏi nào về hóa đơn này.</p>
                    </div>
                    <button
                      onClick={() => exportToTextInvoice(selectedBooking)}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded shadow-sm transition-all text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Xuất hoá đơn
                    </button>
                  </div>
                </div>

                {/* Jagged Edge Effect (CSS Visual Trick) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent bg-[length:10px_10px]"
                     style={{
                        backgroundImage: 'linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%)',
                        backgroundSize: '10px 20px',
                        backgroundPosition: '0 10px'
                     }}>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}