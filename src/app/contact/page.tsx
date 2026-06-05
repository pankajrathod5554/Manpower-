'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Support details */}
        <div className="space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              Contact Center
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Get in Touch with <span className="text-primary text-gradient">CrewConnect</span>
            </h1>
            <p className="text-slate-550 text-sm md:text-base">
              Need assistance with shift scheduling, payroll details, or booking massive event crew? Our dispatch desk is active 24/7.
            </p>
          </header>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-premium">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Call Support Desk</h3>
                <p className="text-slate-600 text-sm mt-1 font-semibold">+91 79 4000 1234</p>
                <p className="text-xs text-slate-400">Available 24/7 for urgent staffing dispatches</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-premium">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Email Inquiry</h3>
                <p className="text-slate-600 text-sm mt-1 font-semibold">support@crewconnect.com</p>
                <p className="text-xs text-slate-400">Response time within 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-premium">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">HQ Address</h3>
                <p className="text-slate-600 text-sm mt-1 font-semibold">Stitch Building, SG Highway, Ahmedabad, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium space-y-6">
          <h2 className="font-poppins text-2xl font-bold text-slate-950">Send Message</h2>
          
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span>Thank you! Your support ticket has been registered. We will contact you shortly.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-650 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-905 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-905 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What can we help you with?"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-905 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your detailed requirements or issue description..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-905 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
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
