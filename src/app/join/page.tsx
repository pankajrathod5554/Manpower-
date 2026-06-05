import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Award, CheckCircle2, ChevronRight, Star } from 'lucide-react';

export default function JoinCareers() {
  return (
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 min-h-[90vh] space-y-20">
      {/* Intro section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            Join the Crew
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Flexible Shifts. <br />
            <span className="text-primary text-gradient">Instant Hourly Payouts.</span>
          </h1>
          <p className="text-slate-550 text-sm md:text-base leading-relaxed">
            CrewConnect links hospitality professionals, AV engineers, support staff, and security crew with elite events. Work when you want, where you want, and track your metrics in real-time.
          </p>
          
          <div className="pt-4 flex gap-4">
            <Link href="/join-team-registration">
              <button className="bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95">
                Register as Worker <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Info Graphic / Stats */}
        <div className="bg-slate-950 text-white p-6 md:p-8 rounded-2xl border border-slate-900 shadow-premium space-y-6">
          <h3 className="font-poppins font-bold text-lg text-primary border-b border-slate-800 pb-3">Crew Member Privileges</h3>
          
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <strong className="text-white">Direct-to-Bank Payouts</strong>
                <p className="text-xs text-slate-400 mt-0.5">Payments cleared within 24 hours of employer shift logs verification.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <strong className="text-white">Complete Schedule Autonomy</strong>
                <p className="text-xs text-slate-400 mt-0.5">Apply to gigs matching your available dates and location range.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div>
                <strong className="text-white">Premium Client Networks</strong>
                <p className="text-xs text-slate-400 mt-0.5">Work shifts with luxury 5-star hotels, high-profile weddings, and summits.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
