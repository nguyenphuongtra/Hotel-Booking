import { useEffect, useState } from 'react';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { userAPI } from '../api/api';
import { bookingAPI } from '../api/api';
import { roomAPI } from '../api/api';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

interface AdminDashboardProps {
  viewMode: 'desktop' | 'mobile';
}

export default function AdminDashboard({ viewMode }: AdminDashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [roomTypeData, setRoomTypeData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, bookingsRes, roomsRes] = await Promise.all([
          userAPI.getAllUsers(),
          bookingAPI.getAllBookings(),
          roomAPI.listRooms()
        ]);

        const users = usersRes.data.users;
        const bookings = bookingsRes.data.bookings;
        const rooms = roomsRes.data.rooms;

        // Process stats
        const totalRevenue = bookings.reduce((acc: any, booking: any) => acc + booking.price, 0);
        const totalBookings = bookings.length;
        const newCustomers = users.length; // This should be refined based on a creation date
        const confirmedBookings = bookings.filter((b:any) => b.status === 'confirmed').length;
        const totalRooms = rooms.reduce((acc: number, room: any) => acc + (room.quantity || 1), 0);
        const occupancyRate = totalRooms > 0 ? ((confirmedBookings / totalRooms) * 100).toFixed(1) : 0;
        
        const dashboardStats = [
          {
            title: 'Total Revenue',
            value: `₫${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600'
          },
          {
            title: 'Total Bookings',
            value: totalBookings,
            icon: Package,
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'New Customers',
            value: newCustomers,
            icon: Users,
            color: 'bg-purple-100 text-purple-600'
          },
          {
            title: 'Occupancy Rate',
            value: `${occupancyRate}%`,
            icon: TrendingUp,
            color: 'bg-orange-100 text-orange-600'
          },
        ];
        setStats(dashboardStats);
        
        // Process revenue data
        const monthlyData = bookings.reduce((acc: any, booking: any) => {
          const month = new Date(booking.checkIn).toLocaleString('default', { month: 'short' });
          if (!acc[month]) {
            acc[month] = { month, revenue: 0, bookings: 0 };
          }
          acc[month].revenue += booking.price;
          acc[month].bookings += 1;
          return acc;
        }, {});
        setRevenueData(Object.values(monthlyData));
        
        // Process room type data
        const roomTypeCounts = bookings.reduce((acc: any, booking: any) => {
          const roomType = booking.room?.type || 'Unknown';
          if (!acc[roomType]) {
            acc[roomType] = { name: roomType, value: 0, color: '' };
          }
          acc[roomType].value += 1;
          return acc;
        }, {});

        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        Object.values(roomTypeCounts).forEach((type: any, index) => {
            type.color = colors[index % colors.length];
        });
        setRoomTypeData(Object.values(roomTypeCounts));

        // Process recent bookings
        const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentBookings(sortedBookings.slice(0, 4));

      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerWidth = viewMode === 'mobile' ? 'max-w-md' : 'max-w-7xl';

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingState/></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><ErrorState message={error} /></div>;
  }

  return (
    <div className={`${containerWidth} mx-auto p-4 md:p-8 bg-gray-50`}>
      {/* Annotation */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="text-purple-900 mb-2">📊 Admin Dashboard Statistics</h4>
        <p className="text-sm text-purple-700">
          <strong>Features:</strong> Real-time stats • Revenue charts • Booking analytics • Occupancy tracking • Recent activity
        </p>
      </div>

      <div className="mb-8">
        <h1>Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your hotel.</p>
      </div>

      {/* Stats Cards */}
      <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-6 mb-8`}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <div className="text-2xl">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} gap-6 mb-8`}>
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
        {/* Room Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-gray-500">{booking._id.slice(-6)}</span>
                      <Badge
                        variant={
                          booking.status === 'confirmed' ? 'default' :
                          'secondary'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span>{booking.user?.name || 'Unknown User'}</span>
                      <span className="text-gray-500"> • {booking.room?.name || 'Unknown Room'}</span>
                    </div>
                  </div>
                  <div className="text-blue-600">{booking.price.toLocaleString()} VNĐ</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
