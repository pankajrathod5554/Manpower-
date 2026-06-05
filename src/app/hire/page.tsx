'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Mail, Users, CheckCircle2, AlertCircle, Building2, HelpCircle } from 'lucide-react';

export default function HireStaff() {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setLocation] = useState('');
  const [staffCount, setStaffCount] = useState('');
  const [staffCategory, setStaffCategory] = useState('Hospitality');
  const [details, setDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactPerson,
          mobileNumber,
          email,
          eventName,
          eventDate,
          eventLocation,
          staffCount: Number(staffCount),
          staffCategory,
          details
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setCompanyName('');
        setContactPerson('');
        setMobileNumber('');
        setEmail('');
        setEventName('');
        setEventDate('');
        setLocation('');
        setStaffCount('');
        setDetails('');
      } else {
        setError(data.error || 'Failed to submit staffing inquiry.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please verify your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Info Left */}
        <div className="space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              Booking Services
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Request Premium <br />
              <span className="text-primary text-gradient">Manpower Supply</span>
            </h1>
            <p className="text-slate-550 text-sm md:text-base leading-relaxed">
              Submit your specific crew requirements below. Our coordination desk will analyze your venue layout, staff counts, and dates to draft an official proposal.
            </p>
          </header>

          <div className="p-6 bg-white border border-slate-205 rounded-2xl shadow-premium space-y-4">
            <div className="flex items-center gap-3 text-slate-800">
              <Building2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-bold">Want direct marketplace control?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Skip manual quotes! Register an Employer account, post your shifts directly, set your hourly payouts, and hire workers in real-time.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
              Login to Post Shifts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Full compliance with national labor laws and statutory filings.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <span>Dedicated site managers deployed for shifts with 5+ workers.</span>
            </div>
          </div>
        </div>

        {/* Inquiry Form Right */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium space-y-6">
          <h2 className="font-poppins text-2xl font-bold text-slate-950">Inquiry Specifications</h2>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span>Staffing request logged successfully! Our team will call you within 2 hours.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-650 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Grand Event Planners"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Contact Person</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event / Project Name</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Wedding Reception SG Road"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-905"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Location</label>
              <input
                type="text"
                required
                value={eventLocation}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Grand Plaza, Ahmedabad"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Staff Count</label>
                <input
                  type="number"
                  required
                  value={staffCount}
                  onChange={(e) => setStaffCount(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Staff Category</label>
                <select
                  value={staffCategory}
                  onChange={(e) => setStaffCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                >
                  <option value="Hospitality">Hospitality / Ushering</option>
                  <option value="Security">Security / Bouncers</option>
                  <option value="Logistics">Logistics / Loading</option>
                  <option value="Technical">Technical / AV Crew</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Additional Specifications</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe details: timings, languages required, dress instructions..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
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
                'Submit Inquiry Request'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
