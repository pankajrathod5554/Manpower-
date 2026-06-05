'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, User, Briefcase, UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [role, setRole] = useState<'worker' | 'employer'>('worker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, mobileNumber, role })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Ensure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-premium">
        <div className="text-center">
          <h2 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">
            Join <span className="text-primary text-gradient">CrewConnect</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create an account to hire or work at top events
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-850 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-850 rounded-xl text-xs font-bold text-center">
            {success}
          </div>
        )}

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1.5">
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-bold text-xs transition-all uppercase tracking-wider ${
              role === 'worker' ? 'bg-white text-primary shadow-md border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Look for Shifts
          </button>
          
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-bold text-xs transition-all uppercase tracking-wider ${
              role === 'employer' ? 'bg-white text-primary shadow-md border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Hire Event Crew
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/15 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Register Account
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
