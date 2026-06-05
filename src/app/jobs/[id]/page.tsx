'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, Clock, DollarSign, Users, ShieldCheck, Zap, HardHat, Hammer, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JobType {
  _id: string;
  title: string;
  description: string;
  category: 'technical' | 'logistics' | 'security' | 'hospitality';
  clientType: 'Wedding Planner' | 'Hotel' | 'Caterer' | 'Event Company' | 'Corporate';
  location: string;
  date: string;
  durationHours: number;
  payRatePerHour: number;
  slots: number;
  filledSlots: number;
  status: 'open' | 'closed';
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
  };
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`/api/jobs/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setJob(data.data);
      } else {
        setError('Job not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch details.');
    } finally {
      setLoading(false);
    }
  };

  const checkAuthAndApplication = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setRole(data.user.role);
        
        // Check if already applied
        const appRes = await fetch('/api/applications');
        const appData = await appRes.json();
        if (appData.success) {
          const hasApplied = appData.data.some((app: any) => app.jobId?._id === params.id);
          setApplied(hasApplied);
        }
      }
    } catch (err) {
      console.error('Session error:', err);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    checkAuthAndApplication();
  }, [params.id]);

  const handleApply = async () => {
    if (!role) {
      router.push('/login');
      return;
    }

    if (role !== 'worker') {
      setError('Only Worker accounts can apply for event shifts.');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id })
      });
      const data = await res.json();

      if (data.success) {
        setApplied(true);
        setSuccess('Application submitted successfully! Track it in your Dashboard.');
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during submission.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading gig requirements...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Job Not Found</h3>
        <p className="text-slate-500 mt-2 text-sm">The job listing you are looking for does not exist or has been deleted.</p>
        <Link href="/jobs" className="mt-6 inline-block font-bold text-primary hover:underline">
          Back to Listings
        </Link>
      </div>
    );
  }

  const slotsLeft = job.slots - job.filledSlots;
  const totalPayout = job.durationHours * job.payRatePerHour;

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4" /> Back to Listings
        </Link>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium space-y-6">
              {/* Category, Title, Creator */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {job.category}
                  </span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {job.clientType}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    job.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {job.status === 'open' ? 'Recruiting' : 'Filled'}
                  </span>
                </div>
                <h1 className="font-poppins text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  {job.title}
                </h1>
                <p className="text-xs text-slate-550">
                  Posted by <span className="font-bold text-slate-800">{job.createdBy?.fullName}</span> • Contact: {job.createdBy?.email}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <h3 className="font-poppins font-bold text-base text-slate-900">Role Description</h3>
                <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Dress Code & Vetting Guidelines */}
              <div className="space-y-3 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-slate-200">
                <h3 className="font-poppins font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-primary" /> Crew Guidelines &amp; Requirements
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                  <li><strong>Dress Code</strong>: Black business casual (collared shirt, trousers, black shoes) unless otherwise stated by supervisor.</li>
                  <li><strong>Arrival</strong>: Must report to site supervisor at venue exactly 15 minutes before shift start.</li>
                  <li><strong>Compliance</strong>: Zero tolerance for unscheduled breaks, mobile usage on floor, or safety violations.</li>
                  <li><strong>Payout</strong>: Earnings are disbursed to bank account within 24 hours of employer shift confirmation.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Widget (Rates & Apply) */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-900 shadow-premium space-y-6">
              <h3 className="font-poppins font-bold text-lg border-b border-slate-800 pb-3">Shift Financials</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Hourly Rate</span>
                  <span className="font-bold text-primary">₹{job.payRatePerHour} / Hr</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Duration</span>
                  <span>{job.durationHours} Hours</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-3">
                  <span className="text-slate-400 font-bold">Total Est. Earnings</span>
                  <span className="text-xl font-black text-primary">₹{totalPayout}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Date: {job.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Slots Left: {slotsLeft} of {job.slots}</span>
                </div>
              </div>

              <div className="pt-4">
                {applied ? (
                  <button
                    disabled
                    className="w-full bg-green-900 text-green-300 border border-green-800 py-3.5 rounded-xl font-bold text-sm text-center"
                  >
                    Application Submitted
                  </button>
                ) : job.status !== 'open' || slotsLeft <= 0 ? (
                  <button
                    disabled
                    className="w-full bg-slate-800 text-slate-500 py-3.5 rounded-xl font-bold text-sm text-center"
                  >
                    Shift Fully Booked
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {applying ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : !role ? (
                      'Sign In to Apply'
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" /> Apply for Shift
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
