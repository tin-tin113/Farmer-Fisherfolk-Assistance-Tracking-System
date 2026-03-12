import { useState, useRef } from 'react';
import { Settings, Save, User, Bell, Shield, Building2, Upload, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLGUSettings } from '../context/LGUSettingsContext';
import { toast, Toaster } from 'sonner';

export function SettingsPage() {
  const { user } = useAuth();
  const { settings, updateSettings } = useLGUSettings();
  const [activeTab, setActiveTab] = useState('organization');
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || 'Admin User',
    email: user?.email || 'admin@ebmagalona.gov.ph',
    role: 'Administrator',
    phone: '09171234567',
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotif: true,
    smsNotif: false,
    systemNotif: true,
  });

  // Organization form
  const [orgForm, setOrgForm] = useState({
    municipalityName: settings.municipalityName,
    systemName: settings.systemName,
    logoUrl: settings.logoUrl,
  });
  const [logoPreview, setLogoPreview] = useState(settings.logoUrl);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setOrgForm(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    setOrgForm(prev => ({ ...prev, logoUrl: '' }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleSaveLogoOnly = () => {
    updateSettings({ logoUrl: orgForm.logoUrl });
    toast.success('Logo saved and updated across the system!');
  };

  const handleSaveOrg = () => {
    updateSettings({
      municipalityName: orgForm.municipalityName,
      systemName: orgForm.systemName,
      logoUrl: orgForm.logoUrl,
    });
    toast.success('Organization settings saved! Logo and name updated across the system.');
  };

  const handleSaveProfile = () => {
    toast.success('Profile settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSaveSecurity = () => {
    toast.success('Password updated successfully!');
  };

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-green-700" />
        <h1>Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div>
                <h3>Organization Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Edit your LGU logo, municipality name, and system name. Changes will appear across the entire system including the login page and sidebar.</p>
              </div>

              {/* Logo Upload */}
              <div className="border rounded-xl p-5 bg-gray-50/50">
                <label className="text-sm text-gray-600 block mb-3">LGU Logo</label>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden shrink-0 bg-white flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                      >
                        <Upload className="w-4 h-4" /> Upload Logo
                      </button>
                      {logoPreview && (
                        <>
                          <button
                            onClick={handleSaveLogoOnly}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                          >
                            <Check className="w-4 h-4" /> Save Logo
                          </button>
                          <button
                            onClick={removeLogo}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                          >
                            <X className="w-4 h-4" /> Remove
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">Recommended: Square image, at least 200x200px. PNG or JPG.</p>
                    {logoPreview && logoPreview !== settings.logoUrl && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">⚠ Unsaved — click "Save Logo" to apply changes across the system.</p>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Municipality Name</label>
                  <input
                    value={orgForm.municipalityName}
                    onChange={e => setOrgForm({ ...orgForm, municipalityName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. LGU Enrique B. Magalona"
                  />
                  <p className="text-xs text-gray-400 mt-1">Displayed in the sidebar header and login page</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">System Name</label>
                  <input
                    value={orgForm.systemName}
                    onChange={e => setOrgForm({ ...orgForm, systemName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Assistance Tracking System"
                  />
                  <p className="text-xs text-gray-400 mt-1">Displayed below the municipality name</p>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-xl p-5">
                <label className="text-sm text-gray-600 block mb-3">Preview</label>
                <div className="flex items-center gap-6">
                  {/* Sidebar preview */}
                  <div className="bg-[#1a3a2a] rounded-xl p-4 flex items-center gap-3 min-w-56">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-green-900 flex items-center justify-center">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm leading-tight">{orgForm.municipalityName || 'Municipality Name'}</p>
                      <p className="text-green-300 text-xs">{orgForm.systemName || 'System Name'}</p>
                    </div>
                  </div>
                  {/* Login preview */}
                  <div className="bg-[#1a3a2a] rounded-xl p-4 flex flex-col items-center min-w-44">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center mb-2">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <p className="text-white text-xs text-center leading-tight">{orgForm.municipalityName || 'Municipality Name'}</p>
                    <p className="text-green-300 text-[10px] text-center">{orgForm.systemName || 'System Name'}</p>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveOrg} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                <Save className="w-4 h-4" /> Save Organization Settings
              </button>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3>Profile Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <input value={profile.role} disabled className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <button onClick={handleSaveProfile} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3>Notification Preferences</h3>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="text-sm text-gray-700">{key === 'emailNotif' ? 'Email Notifications' : key === 'smsNotif' ? 'SMS Notifications' : 'System Notifications'}</p>
                    <p className="text-xs text-gray-400">Receive alerts via {key.replace('Notif', '').toLowerCase()}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${value ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
              <button onClick={handleSaveNotifications} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3>Security Settings</h3>
              <div>
                <label className="text-sm text-gray-600">Current Password</label>
                <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Confirm New Password</label>
                <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <button onClick={handleSaveSecurity} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}