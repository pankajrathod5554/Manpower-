'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Shield, Users, AlertCircle, Key, Info, HelpCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<'staff' | 'admin'>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        const userRole = data.user.role;
        router.refresh();
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'staff') {
          router.push('/dashboard/staff');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string, role: 'admin' | 'staff') => {
    setEmail(demoEmail);
    setPassword('password123');
    setRoleSelection(role);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess('A recovery email has been sent with instructions to reset your password (simulated).');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
      setForgotEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-premium relative z-15">
        <div className="text-center">
          <h2 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">
            Sign In to <span className="text-primary text-gradient">CrewConnect</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Event Staff Deployment &amp; Attendance Platform
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Role Portal Selection Tabs */}
        <div className="flex border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-100">
          <button
            onClick={() => setRoleSelection('staff')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              roleSelection === 'staff'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> Staff Portal
          </button>
          <button
            onClick={() => setRoleSelection('admin')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              roleSelection === 'admin'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin Console
          </button>
        </div>

        {/* Demo Credentials Quick-Select */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5 text-primary" /> Click to autofill demo credentials
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoSelect('staff@crewconnect.com', 'staff')}
              className={`py-3.5 px-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all group ${
                roleSelection === 'staff' 
                  ? 'bg-white border-primary/40 shadow-sm text-primary' 
                  : 'bg-slate-100/50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Users className="w-5 h-5 mb-1 group-hover:text-primary" />
              <span className="text-[10px] font-bold">Rahul (Staff)</span>
            </button>
            
            <button
              onClick={() => handleDemoSelect('admin@crewconnect.com', 'admin')}
              className={`py-3.5 px-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all group ${
                roleSelection === 'admin' 
                  ? 'bg-white border-primary/40 shadow-sm text-primary' 
                  : 'bg-slate-100/50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Shield className="w-5 h-5 mb-1 group-hover:text-primary" />
              <span className="text-[10px] font-bold">System (Admin)</span>
            </button>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@crewconnect.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white transition-all text-slate-900 font-medium"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Key className="w-3 h-3" /> Forgot Password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white transition-all text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/15 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Enter {roleSelection === 'admin' ? 'Admin Panel' : 'Staff Dashboard'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-250 max-w-sm w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-bold text-lg text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Password Recovery
              </h3>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotSuccess(''); }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold">
                {forgotSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Enter your registered email below, and we will send you a recovery link to reset your credentials.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-905 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Request Reset Instructions
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
