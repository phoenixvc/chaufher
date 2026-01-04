import { Card, StatsCard, Badge } from '@chaufher/ui';
import { Car, Users, MapPin, CreditCard, TrendingUp, Clock } from 'lucide-react';

// Mock data - replace with API calls
const stats = [
  {
    title: 'Total Rides',
    value: '1,234',
    icon: <MapPin className="h-6 w-6" />,
    trend: { value: 12, isPositive: true },
  },
  {
    title: 'Active Drivers',
    value: '56',
    icon: <Car className="h-6 w-6" />,
    trend: { value: 8, isPositive: true },
  },
  {
    title: 'Total Users',
    value: '2,456',
    icon: <Users className="h-6 w-6" />,
    trend: { value: 24, isPositive: true },
  },
  {
    title: 'Revenue (MTD)',
    value: 'R 45,678',
    icon: <CreditCard className="h-6 w-6" />,
    trend: { value: 18, isPositive: true },
  },
];

const recentRides = [
  { id: 'CHF-A1B2C3', rider: 'Sarah M.', driver: 'Nomsa K.', status: 'completed', amount: 'R 125.00' },
  { id: 'CHF-D4E5F6', rider: 'Priya S.', driver: 'Thandi N.', status: 'in-progress', amount: 'R 89.50' },
  { id: 'CHF-G7H8I9', rider: 'Lerato B.', driver: null, status: 'scheduled', amount: 'R 156.00' },
  { id: 'CHF-J0K1L2', rider: 'Fatima A.', driver: 'Zanele M.', status: 'en-route', amount: 'R 78.00' },
  { id: 'CHF-M3N4O5', rider: 'Amanda T.', driver: 'Sipho D.', status: 'cancelled', amount: 'R 0.00' },
];

const pendingDrivers = [
  { name: 'Precious Ndlovu', submitted: '2 hours ago', documents: '4/5' },
  { name: 'Busisiwe Dlamini', submitted: '5 hours ago', documents: '5/5' },
  { name: 'Nokuthula Zulu', submitted: '1 day ago', documents: '3/5' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-poppins text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Rides */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-lg font-semibold text-gray-900">
                Recent Rides
              </h2>
              <a href="/rides" className="text-sm text-magenta-600 hover:text-magenta-700">
                View all →
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRides.map((ride) => (
              <div key={ride.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ride.id}</p>
                    <p className="text-sm text-gray-500">
                      {ride.rider} → {ride.driver || 'Awaiting driver'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      ride.status === 'completed' ? 'completed' :
                      ride.status === 'in-progress' ? 'in-progress' :
                      ride.status === 'en-route' ? 'en-route' :
                      ride.status === 'scheduled' ? 'scheduled' :
                      'cancelled'
                    }
                  >
                    {ride.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{ride.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Driver Approvals */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-lg font-semibold text-gray-900">
                Pending Driver Approvals
              </h2>
              <a href="/drivers?status=pending" className="text-sm text-magenta-600 hover:text-magenta-700">
                View all →
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingDrivers.map((driver) => (
              <div key={driver.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-soft flex items-center justify-center">
                    <span className="font-semibold text-magenta-600">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {driver.submitted}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="pending">
                    {driver.documents} docs
                  </Badge>
                  <button className="block mt-2 text-sm text-magenta-600 hover:text-magenta-700">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
