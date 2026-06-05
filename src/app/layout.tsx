'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Shield, LogOut, LogIn, Calendar, Users, PhoneCall, Info } from 'lucide-react';
import JoinTeamModal from '@/components/JoinTeamModal';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import './globals.css';

interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  fullName: string;
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
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

  useEffect(() => {
    const handleOpenJoinModal = () => setJoinModalOpen(true);
    window.addEventListener('open-join-modal', handleOpenJoinModal);
    return () => window.removeEventListener('open-join-modal', handleOpenJoinModal);
  }, []);

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
        <title>CrewConnect Luxury | Premium Event Manpower Services</title>
        <meta name="description" content="Deploy premium event manpower across luxury hospitality, corporate hosting, and technical event management. Real-time GPS &amp; selfie attendance verification." />
      </head>
      <body className="flex flex-col min-h-screen text-slate-100 bg-slate-950 antialiased font-inter">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 text-white backdrop-blur-md shadow-lg h-16 md:h-20 flex items-center border-b border-slate-900/50">
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
                  👑 <span className="text-primary-gradient">Crew</span>Connect <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-medium uppercase tracking-wider font-inter">Luxury</span>
                </span>
                <span className="text-[8px] md:text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                  Premium Event Manpower Platform
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-slate-300'}`}>Home</Link>
              <Link href="/services" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/services' ? 'text-primary' : 'text-slate-300'}`}>Manpower Services</Link>
              <Link href="/contact" className={`text-sm font-semibold hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary' : 'text-slate-300'}`}>Contact Inquiry</Link>

              {/* Active Admin links */}
              {user?.role === 'admin' && (
                <Link href="/admin" className={`text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 ${pathname === '/admin' ? 'text-primary' : 'text-slate-400'}`}>
                  <Shield className="w-3.5 h-3.5" /> Admin Console
                </Link>
              )}

              {/* Active Staff links */}
              {user?.role === 'staff' && (
                <Link href="/dashboard/staff" className={`text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 ${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-slate-400'}`}>
                  <Calendar className="w-3.5 h-3.5" /> Staff Shifts
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setJoinModalOpen(true)}
                className="hidden md:inline-block border border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs md:text-sm px-4 py-2 rounded-lg active:scale-95 transition-all"
              >
                Join Our Team
              </button>

              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline-block text-xs font-bold text-slate-400">
                    Active: <span className="text-primary">{user.fullName}</span> ({user.role})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all border border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <button className="bg-primary hover:bg-primary-hover text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-1">
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
          className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside 
          className={`fixed inset-y-0 left-0 w-80 z-[100] bg-slate-950 text-white shadow-2xl flex flex-col py-6 space-y-4 transform transition-transform duration-300 ease-in-out border-r border-slate-900 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-900">
            <span className="font-poppins text-xl font-bold tracking-tight text-white flex items-center gap-2">
              👑 <span className="text-primary">Crew</span>Connect
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
              Manpower Services
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setDrawerOpen(false)} 
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
            >
              Contact Inquiry
            </Link>
            
            <button 
              onClick={() => { setDrawerOpen(false); setJoinModalOpen(true); }} 
              className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg text-primary hover:bg-primary/10 transition-all text-sm font-bold border border-primary/20"
            >
              Join Our Team
            </button>

            {/* Auth Dependent Routes */}
            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={() => setDrawerOpen(false)} 
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
              >
                <Shield className="w-4 h-4 text-primary" /> Admin Console
              </Link>
            )}

            {user?.role === 'staff' && (
              <Link 
                href="/dashboard/staff" 
                onClick={() => setDrawerOpen(false)} 
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold"
              >
                <Calendar className="w-4 h-4 text-primary" /> Staff Shifts
              </Link>
            )}

            {user && (
              <button 
                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                className="flex w-full items-center gap-4 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all text-sm font-semibold border-t border-slate-900 mt-auto"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </nav>
        </aside>

        {/* Content Canvas */}
        <main className="flex-grow pt-16 md:pt-20 min-h-screen bg-slate-950">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-slate-950 text-white flex flex-col px-4 md:px-8 py-8 md:py-12 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="font-poppins text-xl font-bold tracking-tight text-white">
                👑 <span className="text-primary">Crew</span>Connect <span className="text-xs text-slate-400 font-normal">Luxury</span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
                Premium Event Manpower Platform. Sourcing and deploying top-tier hospitality, supervisor, hostess, corporate, and technical production staff for elite private and corporate events.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex gap-4 items-center pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="LinkedIn">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.016-1.074-1.819-2.09-2.09C19.57 3.73 12 3.73 12 3.73s-7.57 0-9.408.343c-1.016.272-1.819 1.074-2.09 2.09C.17 8 .17 12 .17 12s0 4 .332 5.837c.272 1.016 1.074 1.819 2.09 2.09 1.838.343 9.408.343 9.408.343s7.57 0 9.408-.343c1.016-.272 1.819-1.074 2.09-2.09.332-1.837.332-5.837.332-5.837s0-4-.332-5.837zm-13.75 8.163V9.674l5.65 3.326-5.65 3.326z"/></svg>
                </a>
                <a href="https://wa.me/919725705554" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors" title="WhatsApp">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-3.535l.393.233c1.524.905 3.284 1.382 5.083 1.383 5.485 0 9.948-4.464 9.952-9.95.002-2.656-1.03-5.153-2.905-7.03C17.203 3.228 14.71 2.196 12.015 2.196c-5.495 0-9.96 4.467-9.964 9.953-.001 1.887.498 3.73 1.442 5.361l.26.45-1.006 3.67 3.76-.986zm11.548-7.534c-.31-.156-1.834-.905-2.11-.1-.278.1-.482.4-.592.526-.11.127-.22.19-.53.033-.31-.157-1.309-.483-2.493-1.54-.922-.82-1.544-1.833-1.725-2.146-.18-.313-.02-.482.137-.638.14-.14.31-.362.465-.544.156-.18.208-.31.31-.517.105-.207.053-.388-.026-.544-.08-.156-.731-1.761-1.002-2.41-.264-.636-.53-.55-.731-.56-.19-.01-.408-.01-.622-.01-.214 0-.564.08-.86.4-.296.32-1.131 1.106-1.131 2.697 0 1.59 1.157 3.129 1.317 3.345.16.216 2.277 3.478 5.516 4.88 2.698 1.168 3.25 1.05 3.967.92.716-.13 1.833-.748 2.093-1.434.26-.687.26-1.277.182-1.433-.078-.156-.285-.25-.595-.406z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">Services Catalog</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li>Wedding Hospitality Staff</li>
                <li>Event Supervisors</li>
                <li>Hostess &amp; Promoters</li>
                <li>Corporate Event Staff</li>
                <li>Technical Supervisors</li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-bold text-sm text-primary uppercase tracking-widest mb-4">Contact &amp; Policies</h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li><Link href="/contact" className="hover:text-primary transition-colors font-semibold">Contact Us</Link></li>
                <li><span className="text-slate-400">Call Support: <a href="tel:9725705554" className="text-white hover:text-primary font-bold">9725705554</a></span></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-slate-900 text-xs text-slate-400 gap-4">
            <p>© 2026 CrewConnect Luxury. All rights reserved.</p>
            <p className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-slate-500">
              Verified Premium Event Staffing Platform <span className="text-primary">★</span>
            </p>
          </div>
        </footer>

        {/* Global Modal & Floating widgets */}
        <JoinTeamModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

