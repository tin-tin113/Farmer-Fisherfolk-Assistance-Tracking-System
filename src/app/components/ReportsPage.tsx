import { FileText, Download, Users, Fish, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast, Toaster } from 'sonner';

const summaryStats = [
  { label: 'Farmers Assisted', value: 210, icon: Users, color: 'text-green-600' },
  { label: 'Fisherfolks Assisted', value: 190, icon: Fish, color: 'text-blue-600' },
  { label: 'Total Resources', value: 530, icon: Package, color: 'text-amber-600' },
];

const monthlyData = [
  { month: 'Jan', Farmers: 45, Fisherfolks: 30 },
  { month: 'Feb', Farmers: 55, Fisherfolks: 40 },
  { month: 'Mar', Farmers: 60, Fisherfolks: 50 },
  { month: 'Apr', Farmers: 50, Fisherfolks: 70 },
];

const resourceData = [
  { name: 'Rice Seeds', value: 150, color: '#166534' },
  { name: 'Fertilizer', value: 120, color: '#3b82f6' },
  { name: 'Fishing Nets', value: 90, color: '#f59e0b' },
  { name: 'Boat Repair', value: 50, color: '#ef4444' },
  { name: 'Others', value: 120, color: '#8b5cf6' },
];

const barangayData = [
  { barangay: 'Brgy. A', farmers: 85, fisherfolks: 40, resources: 130 },
  { barangay: 'Brgy. B', farmers: 65, fisherfolks: 55, resources: 125 },
  { barangay: 'Brgy. C', farmers: 90, fisherfolks: 35, resources: 140 },
  { barangay: 'Brgy. D', farmers: 80, fisherfolks: 60, resources: 135 },
];

export function ReportsPage() {
  const handleDownload = (type: string) => {
    toast.success(`${type} report downloaded successfully!`);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-700" />
          <h1>Reports</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleDownload('PDF')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={() => handleDownload('Excel')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
            <Download className="w-4 h-4" /> Download Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="mb-4">Monthly Assistance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
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

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="mb-4">Resource Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={resourceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {resourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barangay Table */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="mb-4">Per Barangay Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Barangay</th>
                <th className="py-3 px-4">Farmers</th>
                <th className="py-3 px-4">Fisherfolks</th>
                <th className="py-3 px-4">Total Resources</th>
              </tr>
            </thead>
            <tbody>
              {barangayData.map((row) => (
                <tr key={row.barangay} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">{row.barangay}</td>
                  <td className="py-3 px-4">{row.farmers}</td>
                  <td className="py-3 px-4">{row.fisherfolks}</td>
                  <td className="py-3 px-4">{row.resources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}