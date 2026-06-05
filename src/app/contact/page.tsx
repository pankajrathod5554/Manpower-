'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Crown } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 md:px-8 bg-slate-950 text-white min-h-[90vh] relative overflow-hidden">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
        
        {/* Support details */}
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-primary animate-pulse" /> Contact Dispatch HQ
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Connect with <span className="text-primary text-gradient">Our Concierge Desk</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-lg">
              Planning a luxury event or corporate exhibition? Get in touch with our operations center to coordinate bespoke staffing solutions or check shift allocations.
            </p>
          </header>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-2xl glass-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Call concierge center</h3>
                <p className="text-primary text-sm mt-1 font-semibold">+91 79 4000 1234</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Active 24/7 for urgent staffing dispatches</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-2xl glass-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">Direct email</h3>
                <p className="text-primary text-sm mt-1 font-semibold">support@crewconnect.com</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Response time within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-2xl glass-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">HQ Dispatch office</h3>
                <p className="text-primary text-sm mt-1 font-semibold">Stitch Building, SG Highway, Ahmedabad, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 glass-card border-t-primary/10">
          <h2 className="font-poppins text-2xl font-bold text-white">Send Message</h2>
          
          {success && (
            <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-400 rounded-2xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span>Thank you! Your ticket has been registered. Concierge support will contact you shortly.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-450 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we assist you?"
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
