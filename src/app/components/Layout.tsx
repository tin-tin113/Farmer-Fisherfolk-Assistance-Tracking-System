import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLGUSettings } from '../context/LGUSettingsContext';
import {
  LayoutDashboard, Users, Package, MapPin, MessageSquare,
  FileText, Settings, LogOut, Bell, Mail, Search, ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import loginBg from "figma:asset/99364a2ece53632966ad08206395cdcb27a90962.png";

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/beneficiaries', icon: Users, label: 'Beneficiaries' },
  { to: '/resource-allocation', icon: Package, label: 'Resource Allocation' },
  { to: '/geo-mapping', icon: MapPin, label: 'Geo-Mapping' },
  { to: '/sms-notification', icon: MessageSquare, label: 'SMS Notification' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const { settings } = useLGUSettings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmails, setShowEmails] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New beneficiary registered', desc: 'Juan Dela Cruz was added to Brgy. A', time: '5 min ago', read: false },
    { id: 2, title: 'Resource distributed', desc: 'Rice Seeds (20kg) distributed to Pedro Gomez', time: '1 hour ago', read: false },
    { id: 3, title: 'Pending approval', desc: 'Maria Santos requested Fishing Net assistance', time: '3 hours ago', read: false },
    { id: 4, title: 'Report generated', desc: 'Monthly report for April 2025 is ready', time: 'Yesterday', read: true },
  ]);

  const [emails, setEmails] = useState([
    { id: 1, from: 'DA Regional Office', subject: 'Seed Distribution Schedule', preview: 'Please find attached the schedule for the upcoming seed distribution...', time: '10 min ago', read: false },
    { id: 2, from: 'BFAR Office', subject: 'Fisherfolk Registration Update', preview: 'We have updated the registration list for your municipality...', time: '2 hours ago', read: false },
    { id: 3, from: 'Municipal Planning', subject: 'Budget Allocation Q2', preview: 'The budget allocation for Q2 has been approved. Please review...', time: 'Yesterday', read: true },
  ]);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadEmails = emails.filter(e => !e.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (emailRef.current && !emailRef.current.contains(e.target as Node)) setShowEmails(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markNotifRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markEmailRead = (id: number) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const markAllEmailsRead = () => {
    setEmails(prev => prev.map(e => ({ ...e, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a3a2a] text-white flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-green-900 flex items-center justify-center">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <img src={loginBg} alt="Logo" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <h3 className="text-white text-sm leading-tight">{settings.municipalityName}</h3>
            <p className="text-green-300 text-xs">{settings.systemName}</p>
          </div>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-red-300 hover:text-red-200 hover:bg-white/5 transition-colors border-t border-white/10 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search beneficiaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowEmails(false); setShowUserMenu(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-sm text-gray-800">Notifications</h4>
                    {unreadNotifs > 0 && (
                      <button onClick={markAllNotifsRead} className="text-xs text-green-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotifRead(n.id)}
                        className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-green-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-green-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">{n.title}</p>
                            <p className="text-xs text-gray-500 truncate">{n.desc}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t bg-gray-50 text-center">
                    <button className="text-xs text-green-600 hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Emails */}
            <div ref={emailRef} className="relative">
              <button
                onClick={() => { setShowEmails(!showEmails); setShowNotifications(false); setShowUserMenu(false); }}
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {unreadEmails > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadEmails}
                  </span>
                )}
              </button>
              {showEmails && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-sm text-gray-800">Messages</h4>
                    {unreadEmails > 0 && (
                      <button onClick={markAllEmailsRead} className="text-xs text-blue-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {emails.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => markEmailRead(e.id)}
                        className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition-colors ${!e.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs ${!e.read ? 'bg-blue-500' : 'bg-gray-400'}`}>
                            {e.from.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm text-gray-800 truncate">{e.from}</p>
                              <span className="text-[10px] text-gray-400 shrink-0">{e.time}</span>
                            </div>
                            <p className="text-xs text-gray-700 truncate">{e.subject}</p>
                            <p className="text-xs text-gray-400 truncate">{e.preview}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t bg-gray-50 text-center">
                    <button className="text-xs text-blue-600 hover:underline">View all messages</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); setShowEmails(false); }}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-white text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className="text-sm">{user?.name || 'Admin'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-700">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}