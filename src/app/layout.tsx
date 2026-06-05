'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Shield, LogOut, LogIn, Calendar, Users, PhoneCall, Info } from 'lucide-react';
import './globals.css';

interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  fullName: string;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>CrewConnect | Event Staff Deployment &amp; Attendance Platform</title>
        <meta name="description" content="Deploy professional event staff across hospitality, security, and logistics. Monitor attendance in real-time with selfie verification and GPS geolocation." />
      </head>
      <body className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased font-inter">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/95 text-white backdrop-blur-md shadow-md h-16 md:h-20 flex items-center border-b border-slate-900">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 md:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden text-primary hover:text-white p-2 rounded-lg focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex flex-col select-none group">
                <span className="font-poppins text-lg md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  ⚡ <span className="text-primary">Crew</span>Connect
                </span>
                <span className="text-[8px] md:text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                  Staff Deployment &amp; Attendance
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-slate-300'}`}>Home</Link>
              <Link href="/services" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/services' ? 'text-primary' : 'text-slate-300'}`}>Services</Link>
              <Link href="/contact" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary' : 'text-slate-300'}`}>Contact</Link>

              {/* Active Admin links */}
              {user?.role === 'admin' && (
                <Link href="/admin" className={`text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 ${pathname === '/admin' ? 'text-primary' : 'text-slate-400'}`}>
                  <Shield className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              )}

              {/* Active Staff links */}
              {user?.role === 'staff' && (
                <Link href="/dashboard/staff" className={`text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-slate-400'}`}>
                  <Calendar className="w-3.5 h-3.5" /> My Deployments
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block text-xs font-bold text-slate-350">
                    Logged in as: <span className="text-primary">{user.fullName}</span> ({user.role})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all border border-slate-700"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className="bg-primary hover:bg-primary-hover text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-md shadow-primary/15 flex items-center gap-1">
                      <LogIn className="w-3.5 h-3.5" /> Portal Sign In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside 
          className={`fixed inset-y-0 left-0 w-80 z-[100] bg-slate-950 text-white shadow-2xl flex flex-col py-6 space-y-4 transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-900">
            <span className="font-poppins text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ⚡ <span className="text-primary">Crew</span>Connect
            </span>
            <button 
              onClick={() => setDrawerOpen(false)} 
              className="text-slate-400 hover:text-white p-2 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex flex-col flex-1 px-4 space-y-2 overflow-y-auto pt-4">
            <Link 
              href="/" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              Contact
            </Link>

            {/* Auth Dependent Routes */}
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={() => setDrawerOpen(false)} 
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
              >
                <Shield className="w-4 h-4 text-primary" /> Admin Portal
              </Link>
            )}

            {user?.role === 'staff' && (
              <Link 
                href="/dashboard/staff" 
                onClick={() => setDrawerOpen(false)} 
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
              >
                <Calendar className="w-4 h-4 text-primary" /> My Deployments
              </Link>
            )}

            {user && (
              <button 
                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                className="flex w-full items-center gap-4 px-4 py-3 rounded-lg text-slate-450 hover:bg-red-950/30 hover:text-red-400 transition-all text-sm font-semibold border-t border-slate-900 mt-auto"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </nav>
        </aside>

        {/* Content Canvas */}
        <main className="flex-grow pt-16 md:pt-20 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-slate-950 text-white flex flex-col px-4 md:px-8 py-8 md:py-12 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="font-poppins text-xl font-bold tracking-tight text-white">
                ⚡ <span className="text-primary">Crew</span>Connect
              </div>
              <p className="text-slate-450 text-xs md:text-sm leading-relaxed max-w-sm">
                Event Staff Deployment &amp; Attendance Management Platform. Restructured layout serving luxury weddings, corporate hospitality, private security, logistics, and AV technical manpower.
              </p>
            </div>
            
            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">Verticals</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li>Wedding Staff</li>
                <li>Hospitality Staff</li>
                <li>Security Staff</li>
                <li>Technical Staff</li>
                <li>Logistics Staff</li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">Contact &amp; Support</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support Desk</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors font-bold">Services Catalog</Link></li>
                <li><span className="text-slate-500">System Telemetry Online</span></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-900 text-xs text-slate-400 gap-4">
            <p>© 2026 CrewConnect Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider">
              Selfie &amp; GPS Verification Active <span className="text-primary">★</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
