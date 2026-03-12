import { useState, useRef } from 'react';
import { Search, Plus, Eye, Edit, Trash2, X, MapPin, Upload, Camera, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast, Toaster } from 'sonner';

interface Beneficiary {
  id: number;
  name: string;
  type: 'Farmer' | 'Fisherfolk';
  farmSize: string;
  location: string;
  barangay: string;
  address: string;
  contact: string;
  crop: string;
  photoUrl: string;
  latitude: string;
  longitude: string;
}

const defaultPhotos = [
  'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  'https://images.unsplash.com/photo-1714287297882-2feb2d99d9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  'https://images.unsplash.com/photo-1729559149688-bee985e447ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  'https://images.unsplash.com/photo-1707735508321-9e19789c17e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  'https://images.unsplash.com/photo-1772535553085-af8695f69d93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
];

const initialBeneficiaries: Beneficiary[] = [
  { id: 1, name: 'Juan Dela Cruz', type: 'Farmer', farmSize: '2 ha', location: 'Brgy. Consing, Enrique B. Magalona', barangay: 'Brgy. Consing', address: 'Purok 3, Sitio Malinong', contact: '09171234567', crop: 'Rice', photoUrl: defaultPhotos[0], latitude: '10.4012', longitude: '122.9545' },
  { id: 2, name: 'Maria Santos', type: 'Fisherfolk', farmSize: '-', location: 'Brgy. Mambulac, Enrique B. Magalona', barangay: 'Brgy. Mambulac', address: 'Coastal Area, Sitio Baybayon', contact: '09187654321', crop: '-', photoUrl: defaultPhotos[1], latitude: '10.4135', longitude: '122.9432' },
  { id: 3, name: 'Pedro Gomez', type: 'Farmer', farmSize: '1.5 ha', location: 'Brgy. Tolotolo, Enrique B. Magalona', barangay: 'Brgy. Tolotolo', address: 'Purok 1, National Highway', contact: '09209876543', crop: 'Corn', photoUrl: defaultPhotos[2], latitude: '10.3987', longitude: '122.9610' },
  { id: 4, name: 'Ana Lopez', type: 'Fisherfolk', farmSize: '-', location: 'Brgy. Poblacion, Enrique B. Magalona', barangay: 'Brgy. Poblacion', address: 'Fishing Wharf Area', contact: '09281112233', crop: '-', photoUrl: defaultPhotos[3], latitude: '10.4056', longitude: '122.9501' },
  { id: 5, name: 'Carlos Reyes', type: 'Farmer', farmSize: '3 ha', location: 'Brgy. Consing, Enrique B. Magalona', barangay: 'Brgy. Consing', address: 'Purok 5, Hacienda Area', contact: '09334445566', crop: 'Rice', photoUrl: defaultPhotos[4], latitude: '10.4020', longitude: '122.9550' },
  { id: 6, name: 'Elena Garcia', type: 'Fisherfolk', farmSize: '-', location: 'Brgy. Mambulac, Enrique B. Magalona', barangay: 'Brgy. Mambulac', address: 'Sitio Dagat, Coastal Road', contact: '09457778899', crop: '-', photoUrl: defaultPhotos[1], latitude: '10.4140', longitude: '122.9440' },
];

const barangayOptions = [
  'Brgy. Consing', 'Brgy. Mambulac', 'Brgy. Tolotolo', 'Brgy. Poblacion',
  'Brgy. Alicante', 'Brgy. Damgo', 'Brgy. Latasan', 'Brgy. Molocaboc',
  'Brgy. San Isidro', 'Brgy. Tabun-ac', 'Brgy. Tanza',
];

export function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState<Beneficiary | null>(null);
  const [editItem, setEditItem] = useState<Beneficiary | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const emptyForm = {
    name: '', type: 'Farmer' as 'Farmer' | 'Fisherfolk', farmSize: '', location: '',
    barangay: '', address: '', contact: '', crop: '', photoUrl: '', latitude: '', longitude: '',
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = beneficiaries.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'All' || b.type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setPhotoPreview('');
    setShowModal(true);
  };

  const openEdit = (b: Beneficiary) => {
    setEditItem(b);
    setForm({
      name: b.name, type: b.type, farmSize: b.farmSize, location: b.location,
      barangay: b.barangay, address: b.address, contact: b.contact, crop: b.crop,
      photoUrl: b.photoUrl, latitude: b.latitude, longitude: b.longitude,
    });
    setPhotoPreview(b.photoUrl);
    setShowModal(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setForm(prev => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.barangay) {
      toast.error('Name and Barangay are required');
      return;
    }
    const location = `${form.barangay}, Enrique B. Magalona`;
    if (editItem) {
      setBeneficiaries(prev => prev.map(b => b.id === editItem.id ? { ...b, ...form, location } : b));
      toast.success('Beneficiary updated successfully!');
    } else {
      setBeneficiaries(prev => [...prev, { id: Date.now(), ...form, location }]);
      toast.success('Beneficiary added successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Beneficiary removed successfully');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1>Beneficiaries</h1>
          <p className="text-sm text-gray-500">{beneficiaries.length} total registered beneficiaries</p>
        </div>
        <button onClick={openAdd} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Beneficiary
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex gap-1">
            {['All', 'Farmer', 'Fisherfolk'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${filterType === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Farm Size</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {b.photoUrl ? (
                        <ImageWithFallback src={b.photoUrl} alt={b.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{b.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${b.type === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{b.farmSize}</td>
                  <td className="py-3 px-4">{b.crop}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{b.barangay}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowProfile(b)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(b.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No beneficiaries found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="mb-1">Delete Beneficiary?</h3>
            <p className="text-sm text-gray-500 mb-4">This action cannot be undone. The beneficiary record will be permanently removed.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

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
                    {showProfile.type === 'Farmer' && <p>Farm Size: {showProfile.farmSize}</p>}
                    {showProfile.crop !== '-' && <p>Crop: {showProfile.crop}</p>}
                    <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> {showProfile.location}</p>
                    <p className="text-xs text-gray-400">{showProfile.address}</p>
                    {showProfile.latitude && showProfile.longitude && (
                      <p className="text-xs text-gray-400">Coordinates: {showProfile.latitude}, {showProfile.longitude}</p>
                    )}
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
              <div className="mt-3 flex justify-end">
                <button onClick={() => { setShowProfile(null); openEdit(showProfile); }} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10 rounded-t-xl">
              <h3>{editItem ? 'Edit Beneficiary' : 'Add New Beneficiary'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Photo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 shrink-0 flex items-center justify-center relative group cursor-pointer"
                  onClick={() => photoInputRef.current?.click()}>
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Photo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-gray-300 mx-auto" />
                      <p className="text-[10px] text-gray-400 mt-1">Add Photo</p>
                    </div>
                  )}
                </div>
                <div>
                  <button onClick={() => photoInputRef.current?.click()} className="text-sm text-green-700 hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" /> {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG. Max 5MB.</p>
                </div>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>

              {/* Personal Info */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Personal Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Full Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Juan Dela Cruz" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'Farmer' | 'Fisherfolk' })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="Farmer">Farmer</option>
                      <option value="Fisherfolk">Fisherfolk</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Contact Number</label>
                    <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="09XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Farm Size</label>
                    <input value={form.farmSize} onChange={e => setForm({ ...form, farmSize: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder={form.type === 'Farmer' ? 'e.g. 2 ha' : '-'} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Crop / Catch</label>
                    <input value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder={form.type === 'Farmer' ? 'e.g. Rice, Corn' : 'e.g. Fish, Shrimp'} />
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Location Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Barangay *</label>
                    <select value={form.barangay} onChange={e => setForm({ ...form, barangay: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Select Barangay</option>
                      {barangayOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Detailed Address</label>
                    <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Purok, Sitio, or Street" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Latitude</label>
                    <input value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 10.4012" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Longitude</label>
                    <input value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 122.9545" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 text-sm bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors">
                  {editItem ? 'Update Beneficiary' : 'Add Beneficiary'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
