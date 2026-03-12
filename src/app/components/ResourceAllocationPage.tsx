import { useState } from 'react';
import { Package, Plus, X } from 'lucide-react';

interface ResourceItem {
  id: number;
  beneficiary: string;
  resource: string;
  qty: string;
  status: 'Pending' | 'Allocated' | 'Distributed';
}

const initialResources: ResourceItem[] = [
  { id: 1, beneficiary: 'Juan Dela Cruz', resource: 'Rice Seeds', qty: '20kg', status: 'Pending' },
  { id: 2, beneficiary: 'Maria Santos', resource: 'Fishing Net', qty: '5 pcs', status: 'Allocated' },
  { id: 3, beneficiary: 'Pedro Gomez', resource: 'Fertilizer', qty: '15kg', status: 'Distributed' },
  { id: 4, beneficiary: 'Ana Lopez', resource: 'Boat Repair Kit', qty: '1 set', status: 'Pending' },
  { id: 5, beneficiary: 'Carlos Reyes', resource: 'Rice Seeds', qty: '25kg', status: 'Allocated' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Allocated: 'bg-blue-100 text-blue-700',
  Distributed: 'bg-green-100 text-green-700',
};

export function ResourceAllocationPage() {
  const [resources, setResources] = useState(initialResources);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ResourceItem | null>(null);

  const updateStatus = (id: number) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next = r.status === 'Pending' ? 'Allocated' : r.status === 'Allocated' ? 'Distributed' : 'Pending';
      return { ...r, status: next as ResourceItem['status'] };
    }));
  };

  const openAdd = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const [form, setForm] = useState({ beneficiary: '', resource: '', qty: '' });

  const handleSave = () => {
    if (!form.beneficiary || !form.resource) return;
    if (editItem) {
      setResources(prev => prev.map(r => r.id === editItem.id ? { ...r, ...form } : r));
    } else {
      setResources(prev => [...prev, { id: Date.now(), ...form, status: 'Pending' as const }]);
    }
    setShowModal(false);
    setForm({ beneficiary: '', resource: '', qty: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-green-700" />
          <h1>Resource Allocation</h1>
        </div>
        <button onClick={openAdd} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Allocation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">{r.beneficiary}</td>
                  <td className="py-3 px-4">{r.resource}</td>
                  <td className="py-3 px-4">{r.qty}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateStatus(r.id)}
                      className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h3>Add Resource Allocation</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-sm text-gray-600">Beneficiary</label>
                <input value={form.beneficiary} onChange={e => setForm({ ...form, beneficiary: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Resource</label>
                <input value={form.resource} onChange={e => setForm({ ...form, resource: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Quantity</label>
                <input value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
