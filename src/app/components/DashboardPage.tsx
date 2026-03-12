import { Users, Fish, Package, Clock, Eye, X, MapPin, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLGUSettings } from '../context/LGUSettingsContext';

const statsCards = [
  { label: 'Total Farmers', value: '320', icon: Users, color: 'bg-green-50 text-green-700', iconBg: 'bg-green-100' },
  { label: 'Total Fisherfolks', value: '210', icon: Fish, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
  { label: 'Resources Distributed', value: '530', icon: Package, color: 'bg-teal-50 text-teal-700', iconBg: 'bg-teal-100' },
  { label: 'Pending Assistance', value: '34', icon: Clock, color: 'bg-orange-50 text-orange-700', iconBg: 'bg-orange-100' },
];

const recentAssistance = [
  { beneficiary: 'Juan Dela Cruz', type: 'Farmer', resource: 'Rice Seeds (20kg)', status: 'Distributed', date: 'Apr 22, 2025', statusColor: 'bg-green-100 text-green-700' },
  { beneficiary: 'Maria Santos', type: 'Fisherfolk', resource: 'Fishing Net (5)', status: 'Pending', date: 'Apr 21, 2025', statusColor: 'bg-yellow-100 text-yellow-700' },
  { beneficiary: 'Pedro Gomez', type: 'Farmer', resource: 'Fertilizer (15kg)', status: 'Approved', date: 'Apr 20, 2025', statusColor: 'bg-blue-100 text-blue-700' },
  { beneficiary: 'Ana Lopez', type: 'Fisherfolk', resource: 'Boat Repair', status: 'Delivered', date: 'Apr 19, 2025', statusColor: 'bg-purple-100 text-purple-700' },
];

const chartData = [
  { month: 'Jan', Farmers: 120, Fisherfolks: 80 },
  { month: 'Feb', Farmers: 200, Fisherfolks: 150 },
  { month: 'Mar', Farmers: 280, Fisherfolks: 180 },
  { month: 'Apr', Farmers: 320, Fisherfolks: 210 },
];

const mapMarkers = [
  { name: 'Juan Dela Cruz', type: 'Farmer', hectares: 2, crop: 'Rice', barangay: 'Brgy. Consing', contact: '09171234567', location: 'Brgy. Consing, Enrique B. Magalona', x: 60, y: 30, photoUrl: 'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { name: 'Maria Santos', type: 'Fisherfolk', hectares: 0, crop: '', barangay: 'Brgy. Mambulac', contact: '09187654321', location: 'Brgy. Mambulac, Enrique B. Magalona', x: 75, y: 45, photoUrl: 'https://images.unsplash.com/photo-1714287297882-2feb2d99d9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
  { name: 'Pedro Gomez', type: 'Farmer', hectares: 1.5, crop: 'Corn', barangay: 'Brgy. Tolotolo', contact: '09209876543', location: 'Brgy. Tolotolo, Enrique B. Magalona', x: 40, y: 65, photoUrl: 'https://images.unsplash.com/photo-1729559149688-bee985e447ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200' },
];

interface MarkerProfile {
  name: string;
  type: string;
  hectares: number;
  crop: string;
  barangay: string;
  contact: string;
  location: string;
  photoUrl: string;
}

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [selectedMarker, setSelectedMarker] = useState(0);
  const [showProfile, setShowProfile] = useState<MarkerProfile | null>(null);
  const { settings } = useLGUSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-sm text-gray-500">{settings.municipalityName} &mdash; {settings.systemName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 flex items-center gap-4`}>
            <div className={`${stat.iconBg} p-3 rounded-xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-75">{stat.label}</p>
              <p className="text-2xl">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Assistance & Map & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Assistance */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="mb-4">Recent Assistance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Beneficiary</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Resource</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAssistance.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2.5">{item.beneficiary}</td>
                    <td className="py-2.5 text-gray-500">{item.type}</td>
                    <td className="py-2.5">{item.resource}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geo-Mapping Preview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <h3>Geo-Mapping</h3>
          </div>
          <div className="relative h-64">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1654662063473-966e2e7d76b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGlsaXBwaW5lJTIwbWFwJTIwYmFyYW5nYXklMjBhZXJpYWx8ZW58MXx8fHwxNzczMTkzNDE3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Map"
              className="w-full h-full object-cover"
            />
            {/* Map overlay with markers */}
            <div className="absolute inset-0 bg-black/10">
              {mapMarkers.map((marker, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMarker(i)}
                  className="absolute w-6 h-6 -ml-3 -mt-6"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <div className={`w-full h-full rounded-full border-2 border-white shadow-lg ${marker.type === 'Farmer' ? 'bg-red-500' : 'bg-blue-500'}`} />
                </button>
              ))}
              {/* Info popup */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg max-w-48">
                <p className="text-sm text-gray-900">{mapMarkers[selectedMarker].name}</p>
                <p className="text-xs text-gray-500">
                  {mapMarkers[selectedMarker].type}
                  {mapMarkers[selectedMarker].hectares > 0 && ` - ${mapMarkers[selectedMarker].hectares} Hectares`}
                </p>
                {mapMarkers[selectedMarker].crop && (
                  <p className="text-xs text-gray-500">Crop: {mapMarkers[selectedMarker].crop}</p>
                )}
                <button
                  onClick={() => setShowProfile(mapMarkers[selectedMarker])}
                  className="mt-1 text-xs text-green-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> View Profile
                </button>
              </div>
            </div>
            {/* Barangay labels */}
            <div className="absolute bottom-12 right-8 text-xs text-white bg-black/40 px-2 py-0.5 rounded">Brgy. Consing</div>
            <div className="absolute bottom-4 left-12 text-xs text-white bg-black/40 px-2 py-0.5 rounded">Brgy. Tolotolo</div>
          </div>
        </div>

        {/* Monthly Report Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3>Monthly Report</h3>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>April 2025</option>
              <option>March 2025</option>
              <option>February 2025</option>
              <option>January 2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar key="farmers" dataKey="Farmers" fill="#166534" radius={[4, 4, 0, 0]} />
              <Bar key="fisherfolks" dataKey="Fisherfolks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3>Beneficiary Profile</h3>
              <button onClick={() => setShowProfile(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-green-200">
                  {showProfile.photoUrl ? (
                    <ImageWithFallback src={showProfile.photoUrl} alt={showProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"><User className="w-8 h-8 text-gray-400" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2>{showProfile.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-xs ${showProfile.type === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {showProfile.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Contact: {showProfile.contact}</p>
                    {showProfile.hectares > 0 && <p>Farm Size: {showProfile.hectares} ha</p>}
                    {showProfile.crop && <p>Crop: {showProfile.crop}</p>}
                    <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> {showProfile.location}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-lg overflow-hidden h-44 relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1654662063473-966e2e7d76b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                  alt="Location map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/5">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg" fill="rgba(239,68,68,0.3)" />
                      <div className="bg-white rounded px-2 py-0.5 shadow text-xs mt-1 whitespace-nowrap">{showProfile.barangay}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}