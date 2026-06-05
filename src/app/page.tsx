'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Star, Users, Calendar, 
  MapPin, Clock, Camera, Sparkles, UserCheck, Crown
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
          setSession(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const services = [
    {
      title: "Wedding Hospitality Staff",
      desc: "Polished welcome girls, welcome boys, guest management, and VIP registration desk teams.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Event Supervisors",
      desc: "Vetted floor managers, operations coordinators, event controllers, and supervisors.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Hostess & Promoters",
      desc: "Exhibition hostesses, brand promoters, corporate hostesses, and product launch teams.",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Corporate Event Staff",
      desc: "Registration executives, front desk teams, guest relations coordinators, and concierge desks.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Technical Supervisors",
      desc: "Professional sound, light, LED coordinators, camera operators, and production managers.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <div className="relative overflow-x-hidden bg-slate-950 text-white min-h-[90vh]">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-slate-350 tracking-wider font-bold uppercase flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-primary" /> Premium Event Manpower Solutions
              </span>
            </div>

            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6.5xl font-black leading-tight tracking-tight">
              Elite Staffing for <br />
              <span className="text-primary text-gradient">Luxury &amp; Corporate Events</span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              CrewConnect Luxury links premium event planners and agencies with vetted hostesses, hosts, supervisors, and technical coordinators. Streamline attendance checking using real-time photo-selfie validation and satellite GPS locations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 active:scale-95"
              >
                Book Staff Now
                <ArrowRight className="w-4 h-4" />
              </button>

              {loading ? (
                <div className="w-40 h-14 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
              ) : session ? (
                <Link href={session.role === 'admin' ? '/admin' : '/dashboard/staff'} className="w-full sm:w-auto">
                  <button className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95">
                    Access Portal
                  </button>
                </Link>
              ) : (
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95">
                    Portal Login
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="relative h-[450px] w-full hidden lg:flex items-center justify-center">
            {/* Main Panel */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col justify-between glass-card border-t-primary/10">
              <div 
                className="w-full h-full rounded-2xl bg-slate-850 relative overflow-hidden bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="bg-primary p-2.5 rounded-lg text-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-white bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-xs tracking-wider">
                    GPS-Verified Staff On Duty
                  </div>
                </div>
              </div>
            </div>

            {/* Float Cards */}
            <div className="absolute -top-6 -right-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-56 flex flex-col items-center glass-card border-t-primary/20">
              <div className="font-poppins text-2xl text-primary font-bold">100% Vetted</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-center">
                Luxury Hospitality &amp; Tech Supervisors
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-64 glass-card border-t-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Camera className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Selfie On-Site Verification</span>
              </div>
              <div className="text-sm font-bold text-white">Attendance Fraud Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 md:px-8 bg-slate-900/50 border-t border-slate-900/80 relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] block mb-3">
              Deployment Categories
            </span>
            <h2 className="font-poppins text-3xl md:text-5xl text-white font-extrabold leading-tight">
              Premium Event Manpower Services
            </h2>
            <p className="text-slate-400 mt-4 text-xs md:text-sm max-w-xl mx-auto">
              Completely replacing generic logistics and labor staffing. We deploy elite crews across five dedicated hospitality and supervisor verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((svc, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-xl group flex flex-col justify-between glass-card border-t-primary/5"
              >
                <div 
                  className="w-full h-44 bg-slate-850 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${svc.image}')` }}
                />
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 font-poppins group-hover:text-primary transition-colors">{svc.title}</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{svc.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/50 text-[10px] font-bold text-primary flex items-center gap-1.5 select-none">
                    Elite Services <UserCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <button className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs py-3 px-8 rounded-xl active:scale-95 transition-all">
                View Service Role Details
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Popup Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}
