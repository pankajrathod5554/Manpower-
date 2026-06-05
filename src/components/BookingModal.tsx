'use client';

import { useState } from 'react';
import { X, Calendar, MapPin, Users, Mail, Phone, Briefcase, User, FileText, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export default function BookingModal({ isOpen, onClose, initialCategory = 'Wedding Hospitality Staff' }: BookingModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [staffCategory, setStaffCategory] = useState(initialCategory);
  const [staffCount, setStaffCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    const payload = {
      companyName,
      contactPerson,
      mobileNumber,
      email,
      eventName,
      eventDate,
      eventLocation,
      staffCategory,
      staffCount: Number(staffCount),
      notes
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // Reset fields
        setCompanyName('');
        setContactPerson('');
        setMobileNumber('');
        setEmail('');
        setEventName('');
        setEventDate('');
        setEventLocation('');
        setStaffCategory('Wedding Hospitality Staff');
        setStaffCount(1);
        setNotes('');
      } else {
        setErrorMsg(data.error || 'Failed to submit booking inquiry.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative my-8 glass-card border-t-primary/20">
        
        {/* Glow Element */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-poppins text-2xl font-black text-white flex items-center gap-2">
              👑 Book Premium Crew
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Provide event details to reserve VIP manpower, hostesses, coordinators, and supervisors.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-450 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
              <CheckCircle2 className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
            <h4 className="font-poppins text-xl font-bold text-white">Booking Request Logged</h4>
            <p className="text-slate-400 text-sm max-w-sm">
              Your luxury staffing inquiry has been submitted. Our Event Coordinator will contact you shortly with profiles of vetted specialists.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Company Info */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-primary" /> Company Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Red Events Ltd"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-primary" /> Contact Person
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-primary" /> Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 99999 88888"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-primary" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. corporate@events.com"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Event Name */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-primary" /> Event Name
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. YOYO Concert Ahmedabad / Luxury Car Launch"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary" /> Event Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> Event Location
                </label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Grand Hyatt, Ahmedabad"
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Staff Category */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary" /> Staff Category
                </label>
                <select
                  value={staffCategory}
                  onChange={(e) => setStaffCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="Wedding Hospitality Staff">Wedding Hospitality Staff</option>
                  <option value="Event Supervisors">Event Supervisors</option>
                  <option value="Hostess & Promoters">Hostess & Promoters</option>
                  <option value="Corporate Event Staff">Corporate Event Staff</option>
                  <option value="Technical Supervisors">Technical Supervisors</option>
                </select>
              </div>

              {/* Number Of Staff Required */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary" /> Staff Count
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={staffCount}
                  onChange={(e) => setStaffCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  Notes &amp; Custom Requirements
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about specific theme uniforms, dress codes, languages spoken, etc."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 hover:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-lg shadow-primary/20"
              >
                {loading ? 'Submitting...' : 'Submit Staffing Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
