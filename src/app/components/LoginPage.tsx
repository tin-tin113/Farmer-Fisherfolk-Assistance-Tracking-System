import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLGUSettings } from '../context/LGUSettingsContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import loginBg from "figma:asset/99364a2ece53632966ad08206395cdcb27a90962.png";

export function LoginPage() {
  const { login } = useAuth();
  const { settings } = useLGUSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1609554259810-ad331c1a9519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxpcGlubyUyMGZhcm1lciUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3NzMxOTM0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080)` }}
      />
      <div className="relative z-10 bg-[#1a3a2a] rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3 overflow-hidden">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="LGU Logo" className="w-full h-full object-cover" />
            ) : (
              <img src={loginBg} alt="LGU Logo" className="w-full h-full object-cover" />
            )}
          </div>
          <h2 className="text-white text-center">{settings.municipalityName}<br />{settings.systemName}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-800 placeholder-gray-400 border-0 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-gray-800 placeholder-gray-400 border-0 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Login
            </button>
          </div>
        </form>

        <p className="text-gray-400 text-center mt-4 text-xs">
          Demo: use any email & password (4+ chars)
        </p>
      </div>
    </div>
  );
}