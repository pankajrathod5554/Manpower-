import Link from 'next/link';
import { Shield, Hammer, HardHat, FileText, CheckCircle2, Sparkles, Heart } from 'lucide-react';

export default function Services() {
  const serviceCategories = [
    {
      title: "Wedding Staff",
      icon: <Heart className="w-8 h-8 text-primary" />,
      desc: "Polished hostesses, guest coordinators, ushering teams, and registration managers for luxury weddings.",
      bullets: [
        "Guest reception & welcome protocols",
        "Gift desk & registry supervision",
        "Seating & guest coordination"
      ]
    },
    {
      title: "Hospitality Staff",
      icon: <FileText className="w-8 h-8 text-primary" />,
      desc: "Professional banquet servers, front-desk receptionists, lounge coordinators, and corporate hosts.",
      bullets: [
        "Corporate meeting room management",
        "High-end banquet serving protocol",
        "Bilingual guest registration desks"
      ]
    },
    {
      title: "Security Staff",
      icon: <Shield className="w-8 h-8 text-primary" />,
      desc: "Physically fit bouncers, VIP entrance checkpoint operators, and crowd coordination specialists.",
      bullets: [
        "Entrance security screening",
        "VIP green-room close protection",
        "Polite yet firm crowd control"
      ]
    },
    {
      title: "Technical Staff",
      icon: <HardHat className="w-8 h-8 text-primary" />,
      desc: "Certified audio-visual engineers, stage lighting operators, and power logistics technicians.",
      bullets: [
        "Stage sound & AV monitoring",
        "Professional lighting programming",
        "Electrical cable routing safety"
      ]
    },
    {
      title: "Logistics Staff",
      icon: <Hammer className="w-8 h-8 text-primary" />,
      desc: "Uniformed load/unload laborers, venue packing crews, stage builders, and general setup helpers.",
      bullets: [
        "Pre-event loading & warehouse setup",
        "Exhibition booth assembly",
        "Post-event breakdown & teardown"
      ]
    }
  ];

  return (
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Capabilities Directory
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-905 leading-tight">
            Vetted Event Manpower Verticals
          </h1>
          <p className="text-slate-550 mt-4 text-sm md:text-base leading-relaxed">
            Deploy fully-vetted, compliant personnel across wedding, corporate hospitality, security, logistics, and AV technical verticals.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((srv, idx) => (
            <article key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/50 transition-all shadow-premium flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {srv.icon}
                </div>
                <h2 className="font-poppins text-xl font-bold text-slate-950 mb-3">{srv.title}</h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{srv.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {srv.bullets.map((b, bidx) => (
                    <li key={bidx} className="flex items-center gap-2 text-slate-700 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 border-t border-slate-50 pt-4">
                <Link href="/login" className="flex-1">
                  <button className="w-full bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-xs transition-all text-center">
                    Login to Book Staff
                  </button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
