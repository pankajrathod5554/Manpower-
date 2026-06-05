'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Briefcase, Users, PhoneCall, Info, LayoutDashboard, Shield, Sparkles, LogOut, LogIn, ClipboardList, UserCheck } from 'lucide-react';
import './globals.css';

interface UserSession {
  id: string;
  email: string;
  role: 'employer' | 'worker' | 'admin' | 'superadmin' | 'staff_manager';
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
        <title>CrewConnect | Find Trusted Event & Hospitality Staff in Minutes</title>
        <meta name="description" content="CrewConnect connects top event managers, caterers, hotels, and corporate planners with verified, high-performance hospitality and logistical staff." />
      </head>
      <body className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased font-inter">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/95 text-white backdrop-blur-md shadow-md h-16 md:h-20 flex items-center border-b border-slate-900">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 md:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden text-primary hover:text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex flex-col select-none group">
                <span className="font-poppins text-lg md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  ⚡ <span className="text-primary">Crew</span>Connect
                </span>
                <span className="text-[8px] md:text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                  Event & Hospitality Staffing
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-slate-300'}`}>Home</Link>
              
              {/* Common Roles Pages */}
              <Link href="/services" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/services' ? 'text-primary' : 'text-slate-300'}`}>Services</Link>
              
              {/* Worker specific links */}
              {user?.role === 'worker' && (
                <>
                  <Link href="/jobs" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/jobs' ? 'text-primary' : 'text-slate-300'}`}>Browse Jobs</Link>
                  <Link href="/dashboard/worker" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-slate-300'}`}>Worker Dashboard</Link>
                </>
              )}

              {/* Employer specific links */}
              {user?.role === 'employer' && (
                <>
                  <Link href="/jobs" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/jobs' ? 'text-primary' : 'text-slate-300'}`}>All Jobs</Link>
                  <Link href="/dashboard/employer" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-slate-300'}`}>Employer Dashboard</Link>
                </>
              )}

              {/* Admin / Manager specific links */}
              {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff_manager') && (
                <>
                  <Link href="/jobs" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/jobs' ? 'text-primary' : 'text-slate-300'}`}>Manage Jobs</Link>
                  <Link href="/admin" className={`text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 ${pathname === '/admin' ? 'text-primary' : 'text-slate-400'}`}>
                    <Shield className="w-3.5 h-3.5" /> Admin Panel
                  </Link>
                </>
              )}

              {/* Guest links */}
              {!user && (
                <>
                  <Link href="/hire" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/hire' ? 'text-primary' : 'text-slate-300'}`}>Request Staff</Link>
                  <Link href="/join" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/join' ? 'text-primary' : 'text-slate-300'}`}>Careers</Link>
                  <Link href="/join-team-registration" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/join-team-registration' ? 'text-primary' : 'text-slate-300'}`}>Register</Link>
                </>
              )}

              <Link href="/contact" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary' : 'text-slate-300'}`}>Contact</Link>
            </nav>

            <div className="flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block text-xs font-bold text-slate-300">
                    Hi, <span className="text-primary">{user.fullName.split(' ')[0]}</span> ({user.role})
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
                    <button className="text-slate-300 hover:text-white font-bold text-xs md:text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
                      <LogIn className="w-3.5 h-3.5 text-primary" /> Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-primary hover:bg-primary-hover text-white font-bold text-xs md:text-sm px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-md shadow-primary/15 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Join Free
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
              <Briefcase className="w-4 h-4 text-primary" /> Home
            </Link>
            
            <Link 
              href="/services" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              <ClipboardList className="w-4 h-4 text-primary" /> Services
            </Link>

            {/* Auth Dependent Routes */}
            {user?.role === 'worker' && (
              <>
                <Link 
                  href="/jobs" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Briefcase className="w-4 h-4 text-primary" /> Browse Jobs
                </Link>
                <Link 
                  href="/dashboard/worker" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Worker Dashboard
                </Link>
              </>
            )}

            {user?.role === 'employer' && (
              <>
                <Link 
                  href="/jobs" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Briefcase className="w-4 h-4 text-primary" /> All Jobs
                </Link>
                <Link 
                  href="/dashboard/employer" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Employer Dashboard
                </Link>
              </>
            )}

            {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff_manager') && (
              <>
                <Link 
                  href="/jobs" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Briefcase className="w-4 h-4 text-primary" /> Manage Jobs
                </Link>
                <Link 
                  href="/admin" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Shield className="w-4 h-4 text-primary" /> Admin Portal
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link 
                  href="/hire" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <UserCheck className="w-4 h-4 text-primary" /> Request Staff
                </Link>
                <Link 
                  href="/join" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Users className="w-4 h-4 text-primary" /> Careers
                </Link>
                <Link 
                  href="/join-team-registration" 
                  onClick={() => setDrawerOpen(false)} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-primary" /> Register as Crew
                </Link>
              </>
            )}

            <Link 
              href="/contact" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-primary" /> Contact
            </Link>
            
            {user && (
              <button 
                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                className="flex w-full items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all text-sm font-semibold border-t border-slate-900 mt-auto"
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
        <footer className="w-full bg-slate-950 text-white flex flex-col px-4 md:px-8 py-8 md:py-12 border-t border-slate-900">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="font-poppins text-xl font-bold tracking-tight text-white">
                ⚡ <span className="text-primary">Crew</span>Connect
              </div>
              <p className="text-slate-450 text-xs md:text-sm leading-relaxed max-w-sm">
                National hospitality and event staffing marketplace. Connecting caterers, wedding planners, hotels, and corporate events with screened, trained, and verified manpower instantly.
              </p>
            </div>
            
            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">For Employers</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li><Link href="/hire" className="hover:text-primary transition-colors">Request Staff</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Post a Job</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Staffing Solutions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">For Staff</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li><Link href="/join" className="hover:text-primary transition-colors">Careers Page</Link></li>
                <li><Link href="/join-team-registration" className="hover:text-primary transition-colors">Crew Registration</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Find Shifts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services Catalog</Link></li>
                <li><span className="text-slate-500">Privacy & Terms</span></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-900 text-xs text-slate-400 gap-4">
            <p>© 2026 CrewConnect Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Safety, Reliability, Professionalism <span className="text-primary">★</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
