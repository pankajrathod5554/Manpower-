'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Sparkles, User, Users, Briefcase, Shield, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        const role = data.user.role;
        router.refresh();
        if (role === 'employer') {
          router.push('/dashboard/employer');
        } else if (role === 'worker') {
          router.push('/dashboard/worker');
        } else if (role === 'admin' || role === 'superadmin' || role === 'staff_manager') {
          router.push('/admin');
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

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-premium">
        <div className="text-center">
          <h2 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">
            Sign In to <span className="text-primary text-gradient">CrewConnect</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Access your shifts, jobs, and staffing portal
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Demo Quick Logins */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            🚀 Test Instantly With Demo Accounts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => handleDemoSelect('worker@crewconnect.com')}
              className="p-3 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/40 rounded-xl flex flex-col items-center justify-between text-center transition-all group h-24"
            >
              <User className="w-5 h-5 text-slate-550 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-slate-700">Worker</span>
            </button>
            
            <button
              onClick={() => handleDemoSelect('employer@crewconnect.com')}
              className="p-3 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/40 rounded-xl flex flex-col items-center justify-between text-center transition-all group h-24"
            >
              <Briefcase className="w-5 h-5 text-slate-550 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-slate-700">Employer</span>
            </button>

            <button
              onClick={() => handleDemoSelect('admin@crewconnect.com')}
              className="p-3 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/40 rounded-xl flex flex-col items-center justify-between text-center transition-all group h-24"
            >
              <Shield className="w-5 h-5 text-slate-555 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-slate-700">Admin</span>
            </button>

            <button
              onClick={() => handleDemoSelect('superadmin@crewconnect.com')}
              className="p-3 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/40 rounded-xl flex flex-col items-center justify-between text-center transition-all group h-24"
            >
              <Shield className="w-5 h-5 text-red-500 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-slate-700">Super Admin</span>
            </button>

            <button
              onClick={() => handleDemoSelect('manager@crewconnect.com')}
              className="p-3 bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/40 rounded-xl flex flex-col items-center justify-between text-center transition-all group h-24 col-span-2 sm:col-span-1"
            >
              <Users className="w-5 h-5 text-emerald-500 group-hover:text-primary" />
              <span className="text-[10px] font-bold text-slate-700">Staff Manager</span>
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white transition-all text-slate-900 font-medium"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
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
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
