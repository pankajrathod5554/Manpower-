import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Award, CheckCircle2, Users, Briefcase, Calendar, Star, Building2, Utensils, Hotel, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-16 px-4 md:px-8 bg-slate-950 text-white overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-slate-355 tracking-wider font-semibold uppercase">
                Verified Event &amp; Hospitality Staffing
              </span>
            </div>

            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
              Find Trusted Staff <br />
              <span className="text-primary text-gradient">In Minutes</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              CrewConnect links elite wedding planners, hotels, caterers, and corporate organizers with verified, skilled, and professional event crew. Zero recruitment hassle, guaranteed reliability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Link href="/hire">
                <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/25">
                  Request Staff Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/join">
                <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2">
                  Apply as Crew
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="relative h-[400px] md:h-[500px] w-full hidden lg:flex items-center justify-center">
            {/* Main Panel */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col justify-between">
              <div 
                className="w-full h-full rounded-2xl bg-slate-800 relative overflow-hidden bg-cover bg-center" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="bg-primary p-2.5 rounded-lg text-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-white bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-xl backdrop-blur-md text-sm">
                    Verified Host Crew Deployed: Grand Plaza Wedding
                  </div>
                </div>
              </div>
            </div>

            {/* Float Cards */}
            <div className="absolute -top-6 -right-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-48 flex flex-col items-center">
              <div className="font-poppins text-4xl text-primary font-bold">4,800+</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-center">
                Vetted Event Workers
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-slate-900/95 border border-slate-800 p-5 rounded-2xl shadow-2xl w-60">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Star className="w-4 h-4 fill-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">Top Hospitality Choice</span>
              </div>
              <div className="text-xl font-bold text-white">4.9/5 Average Rating</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full w-[98%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Client Segments Banner */}
      <section className="py-12 px-4 md:px-8 bg-slate-900 border-y border-slate-850">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Staffing Deployed Across Premium Industries
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-slate-300">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Wedding Planners</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Hotel className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Luxury Hotels</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Utensils className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Premium Caterers</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Corporate Planners</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">Event Agencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="py-16 px-4 md:px-8 bg-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-premium flex flex-col gap-2 border border-slate-200">
            <div className="font-poppins text-4xl text-primary font-extrabold">15 Min</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Fill Time</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-premium flex flex-col gap-2 border border-slate-200">
            <div className="font-poppins text-4xl text-primary font-extrabold">20,000+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed Shifts</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-premium flex flex-col gap-2 border border-slate-200">
            <div className="font-poppins text-4xl text-primary font-extrabold">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Background Vetted</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-premium flex flex-col gap-2 border border-slate-200">
            <div className="font-poppins text-4xl text-primary font-extrabold">24/7</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">On-Site Dispatch Support</div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs block mb-3">
              Why CrewConnect
            </span>
            <h2 className="font-poppins text-3xl md:text-4xl text-slate-900 font-extrabold">
              Engineered Hospitality staffing
            </h2>
            <p className="text-slate-500 mt-4 text-base md:text-lg">
              We eliminate manpower shortages by offering a real-time marketplace of vetted candidates, automated attendance, and unified dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 hover:border-primary/50 transition-all shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Vetted &amp; Screened</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Background verification, previous hospitality review checks, and verified credentials. Fully compliant workers.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 hover:border-primary/50 transition-all shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Instant Booking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Post shift roles from your dashboard, review applicants' profiles, ratings, and experience, and lock in your staff instantly.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 hover:border-primary/50 transition-all shadow-premium flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">Complete Dashboard Console</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Review check-ins, approve payroll, and evaluate worker performance ratings inside the integrated dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
