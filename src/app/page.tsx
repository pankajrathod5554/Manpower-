'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Zap, Star, Users, Calendar, 
  MapPin, Clock, Camera, Sparkles, UserCheck 
} from 'lucide-react';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      title: "Wedding Staff",
      desc: "Polished hostesses, guest coordinators, and registry managers for luxury weddings.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Hospitality Staff",
      desc: "Professional banquet servers, front-desk managers, and lounge coordinators for premium corporate events.",
      image: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Security Staff",
      desc: "Vetted bouncers, VIP crowd control specialists, and strategic entry coordinators.",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Technical Staff",
      desc: "Certified AV sound engineers, lighting technicians, and stage setup crew.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Logistics Staff",
      desc: "Stage setup crew, loaders, packers, and venue setup operators.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <div className="relative overflow-x-hidden bg-slate-950 text-white min-h-[90vh]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 md:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-slate-300 tracking-wider font-semibold uppercase">
                Premium Event Staffing &amp; Attendance Console
              </span>
            </div>

            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
              Deploy &amp; Track <br />
              <span className="text-primary text-gradient">Staff Attendance</span>
            </h1>

            <p className="text-slate-350 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              CrewConnect links event managers with professional on-site crew. Track real-time attendance using photo-selfie validation and Geolocation GPS check-ins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              {loading ? (
                <div className="w-40 h-14 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
              ) : session ? (
                <Link href={session.role === 'admin' ? '/admin' : '/dashboard/staff'}>
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/25">
                    Go to Dashboard Console
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/25">
                    Access Portal Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="relative h-[400px] md:h-[500px] w-full hidden lg:flex items-center justify-center">
            {/* Main Panel */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col justify-between">
              <div 
                className="w-full h-full rounded-2xl bg-slate-850 relative overflow-hidden bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="bg-primary p-2.5 rounded-lg text-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-white bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-sm">
                    Live GPS-Verified Staff Attendance Active
                  </div>
                </div>
              </div>
            </div>

            {/* Float Cards */}
            <div className="absolute -top-6 -right-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-56 flex flex-col items-center">
              <div className="font-poppins text-3xl text-primary font-bold">100% Vetted</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-center">
                Hospitality, Security &amp; AV Crew
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-64">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Camera className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Selfie On-Site Verification</span>
              </div>
              <div className="text-base font-bold text-white">Attendance Fraud Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 md:px-8 bg-slate-900 border-t border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs block mb-3">
              Deployment Verticals
            </span>
            <h2 className="font-poppins text-3xl md:text-4xl text-white font-extrabold">
              Our Professional Event Manpower
            </h2>
            <p className="text-slate-400 mt-4 text-base md:text-lg">
              We deploy highly skilled specialists across five primary categories, backed by complete real-time tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((svc, idx) => (
              <div 
                key={idx} 
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-xl group flex flex-col justify-between"
              >
                <div 
                  className="w-full h-40 bg-slate-800 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${svc.image}')` }}
                />
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-poppins">{svc.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{svc.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-900 text-xs font-bold text-primary flex items-center gap-1.5 select-none">
                    Vetted &amp; Certified <UserCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
