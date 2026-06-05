'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Shield, Users, AlertCircle, Key, Info, HelpCircle, Crown } from 'lucide-react';

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
    setForgotSuccess('A recovery email has been sent with reset instructions (simulated).');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
      setForgotEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative z-15 glass-card border-t-primary/10">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Crown className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-poppins text-3xl font-black text-white tracking-tight">
            Sign In to <span className="text-primary text-gradient">CrewConnect</span>
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            Premium Event Staffing &amp; Attendance Console
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="flex border border-slate-800 rounded-xl overflow-hidden p-1 bg-slate-950/80">
          <button
            onClick={() => setRoleSelection('staff')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              roleSelection === 'staff'
                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Staff Portal
          </button>
          <button
            onClick={() => setRoleSelection('admin')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              roleSelection === 'admin'
                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Admin Console
          </button>
        </div>

        {/* Demo Credentials Quick-Select */}
        <div className="bg-slate-950/45 p-4 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary" /> Click to autofill demo credentials
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoSelect('staff@crewconnect.com', 'staff')}
              className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all group ${
                roleSelection === 'staff' 
                  ? 'bg-primary/10 border-primary/40 text-primary' 
                  : 'bg-slate-950 border-slate-800/85 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Users className="w-4 h-4 mb-1.5 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold">Rahul (Staff)</span>
            </button>
            
            <button
              onClick={() => handleDemoSelect('admin@crewconnect.com', 'admin')}
              className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all group ${
                roleSelection === 'admin' 
                  ? 'bg-primary/10 border-primary/40 text-primary' 
                  : 'bg-slate-950 border-slate-800/85 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 mb-1.5 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold">System (Admin)</span>
            </button>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs bg-slate-950 text-white placeholder-slate-650 transition-all font-medium"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
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
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs bg-slate-950 text-white placeholder-slate-650 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4 glass-card border-t-primary/20">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Password Recovery
              </h3>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotSuccess(''); }}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-400 rounded-2xl text-xs font-bold">
                {forgotSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-slate-450 text-xs leading-relaxed">
                  Enter your registered email below, and we will send you a recovery link to reset your credentials.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
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
