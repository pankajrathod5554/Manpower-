'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Star, Users, Crown } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function Services() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Wedding Hospitality Staff');

  const serviceCategories = [
    {
      title: "Wedding Hospitality Staff",
      desc: "Immaculate hospitality specialists who welcome and manage guests with absolute elegance, setting a premium tone for luxury weddings.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      bullets: [
        "Welcome Girls",
        "Welcome Boys",
        "Guest Management Team",
        "VIP Guest Handling",
        "Registration Desk Team"
      ]
    },
    {
      title: "Event Supervisors",
      desc: "Vetted floor managers and operations controllers overseeing venue details, running schedules, and crew management seamlessly.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      bullets: [
        "Event Supervisors",
        "Floor Managers",
        "Operations Coordinators",
        "Event Controllers"
      ]
    },
    {
      title: "Hostess & Promoters",
      desc: "Polished hostesses and corporate brand promoters representing premium brands at launches, trade shows, and exhibitions.",
      image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80",
      bullets: [
        "Exhibition Hostess",
        "Brand Promoters",
        "Corporate Hostess",
        "Product Launch Teams"
      ]
    },
    {
      title: "Corporate Event Staff",
      desc: "Professional administrative and guest relations specialists facilitating smooth registrations, desk handlings, and concierge services.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      bullets: [
        "Registration Executives",
        "Front Desk Team",
        "Guest Relations Team",
        "Concierge Team"
      ]
    },
    {
      title: "Technical Supervisors",
      desc: "AV and production specialists coordinating audio, light, camera angles, and LED displays for high-production concerts and premium events.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      bullets: [
        "Sound Supervisors",
        "Light Supervisors",
        "LED Supervisors",
        "Camera Coordinators",
        "Production Coordinators"
      ]
    }
  ];

  const handleBookClick = (category: string) => {
    setSelectedCategory(category);
    setIsBookingOpen(true);
  };

  return (
    <div className="py-16 md:py-24 px-4 md:px-8 bg-slate-950 text-white relative overflow-hidden min-h-screen">
      
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-20 max-w-3xl space-y-4 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Premium Event Manpower Verticals
          </div>
          <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
            Our Luxury <span className="text-primary text-gradient">Services Directory</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Elite event staff, hostesses, operations supervisors, and production controllers tailored for high-stakes agencies, luxury weddings, and brand experiences.
          </p>
        </header>

        {/* Services Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((srv, idx) => (
            <article 
              key={idx} 
              className="bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800/80 hover:border-primary/40 transition-all duration-300 shadow-2xl flex flex-col justify-between group glass-card border-t-primary/10"
            >
              <div>
                {/* Large cinematic background image */}
                <div 
                  className="w-full h-56 bg-slate-800 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03] relative"
                  style={{ backgroundImage: `url('${srv.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                  <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 backdrop-blur-sm p-2 rounded-xl text-primary">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h2 className="font-poppins text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {srv.title}
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                  
                  {/* Category Details Bullet points */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-2">
                      Included Roles
                    </p>
                    <ul className="space-y-2.5">
                      {srv.bullets.map((b, bidx) => (
                        <li key={bidx} className="flex items-center gap-2 text-slate-300 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="p-6 md:p-8 pt-0 mt-auto">
                <button 
                  onClick={() => handleBookClick(srv.title)}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10"
                >
                  Book Staff
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Booking Popup Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialCategory={selectedCategory}
      />
    </div>
  );
}
