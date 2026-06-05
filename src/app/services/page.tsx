import Link from 'next/link';
import { Shield, Hammer, HardHat, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export default function Services() {
  const serviceCategories = [
    {
      title: "Technical & Engineering Support",
      icon: <HardHat className="w-8 h-8 text-primary" />,
      desc: "Skilled electricians, site engineers, and AV technical crews trained for heavy corporate event setups, staging, and power grids.",
      bullets: [
        "Primary power grid configurations",
        "HVAC and temperature control maintenance",
        "Certified stage & scaffolding crew"
      ]
    },
    {
      title: "Logistical & General Manpower",
      icon: <Hammer className="w-8 h-8 text-primary" />,
      desc: "Capable, vetted load/unload laborers, warehouse handlers, and assembly staff available for round-the-clock shift rotations.",
      bullets: [
        "Strict compliance with site safety standards",
        "24/7 on-site rotation managers",
        "Uniformed, disciplined ground labor"
      ]
    },
    {
      title: "Elite Event & VIP Security",
      icon: <Shield className="w-8 h-8 text-primary" />,
      desc: "Fully trained, physically imposing security officers and VIP close-protection bouncers to secure entries, exits, and boundaries.",
      bullets: [
        "Certified crowd management systems",
        "Celebrity close-protection units",
        "Discreet, polite front-of-house protocol"
      ]
    },
    {
      title: "Administrative & Hospitality Staff",
      icon: <FileText className="w-8 h-8 text-primary" />,
      desc: "Polished front-desk coordinators, registration hosts, ushers, and VIP guides with exceptional communication skills.",
      bullets: [
        "Bilingual hosts & greeters",
        "QR ticketing & registration management",
        "Impeccable corporate etiquette"
      ]
    }
  ];

  return (
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Capability Catalog
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Workforce Solutions For <span className="text-primary text-gradient">CrewConnect</span>
          </h1>
          <p className="text-slate-550 mt-4 text-sm md:text-base leading-relaxed">
            Deploy fully-vetted, compliant personnel across core hospitality and event segments. We maintain a database of active talent to ensure prompt support.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {serviceCategories.map((srv, idx) => (
            <article key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/50 transition-all shadow-premium flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {srv.icon}
                </div>
                <h2 className="font-poppins text-2xl font-bold text-slate-950 mb-3">{srv.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{srv.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {srv.bullets.map((b, bidx) => (
                    <li key={bidx} className="flex items-center gap-2 text-slate-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href="/hire" className="flex-1">
                  <button className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all text-center">
                    Book Workforce
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
