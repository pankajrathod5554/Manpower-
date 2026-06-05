'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function SeekerRegistration() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [experience, setExperience] = useState('Fresher');
  const [experienceYears, setExperienceYears] = useState('0');
  const [position, setPosition] = useState('Hospitality Usher');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/jobseeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          email,
          dob,
          gender,
          experience,
          experienceYears,
          position
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFullName('');
        setMobileNumber('');
        setEmail('');
        setDob('');
        setExperienceYears('0');
      } else {
        setError(data.error || 'Failed to submit candidate profile.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Info left */}
        <div className="space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              Registration Portal
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Register in the <br />
              <span className="text-primary text-gradient">Candidate Registry</span>
            </h1>
            <p className="text-slate-550 text-sm md:text-base leading-relaxed">
              Fill in your details to register in our hospitality database. Our dispatch managers evaluate candidate entries weekly for bulk deployments.
            </p>
          </header>

          <div className="p-6 bg-white border border-slate-205 rounded-2xl shadow-premium space-y-4">
            <div className="flex items-center gap-3 text-slate-800">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-bold">Want to browse and apply for shifts instantly?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create a free CrewConnect Worker account to browse active shifts, view hourly payouts, and apply directly to gigs in real-time.
            </p>
            <Link href="/register" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
              Sign Up as Worker <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Form right */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium space-y-6">
          <h2 className="font-poppins text-2xl font-bold text-slate-950">Candidate Information</h2>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <span>Candidate profile registered successfully! Our hiring desk will reach out soon.</span>
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-905"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Desired Role</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                >
                  <option value="Hospitality Usher">Hospitality Usher / Host</option>
                  <option value="VIP security Guard">VIP Security / Bouncer</option>
                  <option value="Staging Technician">Staging / AV Technician</option>
                  <option value="General Labor">General Labor / Load Crew</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Experience Level</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900 font-medium"
                />
              </div>
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
                  <UserPlus className="w-4 h-4" /> Submit Candidate Profile
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
