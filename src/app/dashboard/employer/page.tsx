'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Users, FileText, Check, X, Plus, Calendar, MapPin, DollarSign, Clock, LayoutDashboard, Sparkles, Building2, User } from 'lucide-react';

interface JobType {
  _id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  payRatePerHour: number;
  slots: number;
  filledSlots: number;
  status: string;
}

interface ApplicationType {
  _id: string;
  jobId: {
    _id: string;
    title: string;
  };
  workerId: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
  };
  workerProfile?: {
    experienceYears: string;
    rating: number;
    skills: string[];
    isVerified: boolean;
  };
  status: 'applied' | 'approved' | 'rejected';
  appliedAt: string;
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('hospitality');
  const [clientType, setClientType] = useState('Wedding Planner');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [payRatePerHour, setPayRatePerHour] = useState('');
  const [slots, setSlots] = useState('');

  const fetchDashboardData = async () => {
    try {
      // 1. Check auth
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      if (!authData.success || authData.user.role !== 'employer') {
        router.push('/login');
        return;
      }

      // 2. Fetch jobs posted by employer
      const jobsRes = await fetch('/api/jobs?status=all');
      const jobsData = await jobsRes.json();
      
      // Filter client-side based on creator
      if (jobsData.success) {
        const myJobs = jobsData.data.filter((j: any) => j.createdBy?._id === authData.user.id);
        setJobs(myJobs);
      }

      // 3. Fetch applications for posted jobs
      const appsRes = await fetch('/api/applications');
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve dashboard summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          clientType,
          location,
          date,
          durationHours: Number(durationHours),
          payRatePerHour: Number(payRatePerHour),
          slots: Number(slots)
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Gig posted successfully!');
        setTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setDurationHours('');
        setPayRatePerHour('');
        setSlots('');
        setShowPostForm(false);
        fetchDashboardData();
      } else {
        setError(data.error || 'Failed to post gig.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed.');
    } finally {
      setPosting(false);
    }
  };

  const handleUpdateStatus = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local items
        setApplications(prev =>
          prev.map(app => (app._id === appId ? { ...app, status } : app))
        );
        fetchDashboardData(); // Update slot counts on jobs list
      } else {
        alert(data.error || 'Failed to update application status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Opening Employer Hub...</p>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'applied');
  const activeJobs = jobs.filter(j => j.status === 'open');

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              <LayoutDashboard className="w-3.5 h-3.5" /> Employer Portal
            </div>
            <h1 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">
              Staffing Management Dashboard
            </h1>
            <p className="text-slate-500 text-xs md:text-sm">
              Publish gigs, evaluate worker profiles, and manage hires for your upcoming events.
            </p>
          </div>

          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-5 rounded-xl text-sm transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/15 shrink-0"
          >
            <Plus className="w-4 h-4" /> Post a Gig Shift
          </button>
        </header>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold">
            {success}
          </div>
        )}

        {/* Post Job Form Panel */}
        {showPostForm && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-poppins text-xl font-bold text-slate-900">Post New Event Gig</h2>
              <button onClick={() => setShowPostForm(false)} className="text-slate-400 hover:text-slate-655 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIP Dinner Silver Service Host"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description &amp; Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the responsibilities, dress code, credentials, and schedule..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-905"
                  >
                    <option value="hospitality">Hospitality</option>
                    <option value="security">Security</option>
                    <option value="logistics">Logistics</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Client Segment</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-905"
                  >
                    <option value="Wedding Planner">Wedding Planner</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Caterer">Caterer</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Event Company">Event Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Grand Ballroom, Hyatt Regency Ahmedabad"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hours Duration</label>
                  <input
                    type="number"
                    required
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    placeholder="8"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pay Rate (₹ / Hr)</label>
                  <input
                    type="number"
                    required
                    value={payRatePerHour}
                    onChange={(e) => setPayRatePerHour(e.target.value)}
                    placeholder="250"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Total Staff Required (Slots)</label>
                <input
                  type="number"
                  required
                  value={slots}
                  onChange={(e) => setSlots(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={posting}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all"
                >
                  {posting ? 'Posting Shift...' : 'Post Event Gig'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Gig Openings</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{activeJobs.length}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Applicants</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{pendingApps.length}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Hired Crew</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">
                {applications.filter(app => app.status === 'approved').length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard split lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Applications list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-poppins text-xl font-bold text-slate-950 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-primary" /> Candidate Applications
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold">
                      <th className="p-4">Candidate Profile</th>
                      <th className="p-4">Applied Job</th>
                      <th className="p-4">Details / Rating</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No workers have applied to your shifts yet. Open shifts will display in the marketplace.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-950">{app.workerId.fullName}</p>
                            <p className="text-[11px] text-slate-500">{app.workerId.mobileNumber}</p>
                            <p className="text-[11px] text-slate-400">{app.workerId.email}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-900">
                            <Link href={`/jobs/${app.jobId._id}`} className="hover:text-primary transition-colors">
                              {app.jobId.title}
                            </Link>
                          </td>
                          <td className="p-4 text-xs">
                            <p className="font-bold text-slate-850">Exp: {app.workerProfile?.experienceYears || '0'} Years</p>
                            <p className="text-slate-500 font-semibold">Rating: ⭐{app.workerProfile?.rating || '5.0'}</p>
                            <Link href={`/staff/${app.workerId._id}`} className="text-primary hover:underline font-bold text-[10px] uppercase tracking-wider block mt-1">
                              View Work CV
                            </Link>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                              app.status === 'applied' ? 'bg-yellow-50 text-yellow-750 border-yellow-200' :
                              app.status === 'approved' ? 'bg-green-50 text-green-750 border-green-200' :
                              'bg-red-50 text-red-750 border-red-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {app.status === 'applied' ? (
                              <div className="flex gap-1.5 justify-center">
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'approved')}
                                  className="p-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
                                  title="Approve / Hire Worker"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                  className="p-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 text-center font-bold uppercase">Decision Logged</p>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Jobs List sidebar */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xl font-bold text-slate-950 flex items-center gap-1.5">
              <Briefcase className="w-5 h-5 text-primary" /> Your Active Gigs
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-premium space-y-4">
              {jobs.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No jobs created. Start by posting a shift.</p>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-950 text-sm line-clamp-1">{job.title}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        job.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Date: {job.date}</span>
                      <span className="font-bold">₹{job.payRatePerHour}/hr</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Slots Booked:</span>
                      <span className="font-bold text-slate-800">{job.filledSlots} / {job.slots}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${(job.filledSlots / job.slots) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
