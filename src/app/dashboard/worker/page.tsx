'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Calendar, MapPin, DollarSign, Clock, LayoutDashboard, UserCheck, Star, Award, ShieldCheck, Save, ClipboardList, CheckCircle2, User } from 'lucide-react';

interface ApplicationType {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    location: string;
    date: string;
    durationHours: number;
    payRatePerHour: number;
    createdBy: {
      fullName: string;
      email: string;
      mobileNumber: string;
    };
  };
  status: 'applied' | 'approved' | 'rejected';
  appliedAt: string;
}

interface WorkerProfileType {
  bio: string;
  experienceYears: string;
  skills: string[];
  prevEvents: string[];
  rating: number;
  completedJobsCount: number;
  isVerified: boolean;
}

export default function WorkerDashboard() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [profile, setProfile] = useState<WorkerProfileType | null>(null);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [prevEventsText, setPrevEventsText] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const fetchWorkerData = async () => {
    try {
      // 1. Fetch user auth & verify role
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      
      if (!authData.success || authData.user.role !== 'worker') {
        router.push('/login');
        return;
      }

      setFullName(authData.user.fullName);
      setMobileNumber(authData.user.mobileNumber);

      // 2. Fetch worker profile details
      const profileRes = await fetch('/api/worker/profile');
      const profileData = await profileRes.json();
      if (profileData.success && profileData.profile) {
        const prof = profileData.profile;
        setProfile(prof);
        setBio(prof.bio || '');
        setExperienceYears(prof.experienceYears || '0');
        setSkillsText(prof.skills?.join(', ') || '');
        setPrevEventsText(prof.prevEvents?.join(', ') || '');
      }

      // 3. Fetch applications submitted by this worker
      const appsRes = await fetch('/api/applications');
      const appsData = await appsRes.json();
      if (appsData.success) {
        setApplications(appsData.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch worker dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/worker/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          bio,
          experienceYears,
          skills: skillsText,
          prevEvents: prevEventsText
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Profile updated successfully!');
        fetchWorkerData();
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error during save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Opening Worker Dashboard...</p>
      </div>
    );
  }

  // Calculate metrics based on approved jobs
  const approvedApps = applications.filter(app => app.status === 'approved');
  const hoursWorked = approvedApps.reduce((acc, app) => acc + (app.jobId?.durationHours || 0), 0);
  const totalEarnings = approvedApps.reduce((acc, app) => acc + ((app.jobId?.durationHours || 0) * (app.jobId?.payRatePerHour || 0)), 0);

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              <LayoutDashboard className="w-3.5 h-3.5" /> Worker Console
            </div>
            <h1 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">
              My Shift Console
            </h1>
            <p className="text-slate-500 text-xs md:text-sm">
              Track your pending applications, log completed work hours, and keep your CV up to date.
            </p>
          </div>

          <Link href="/jobs">
            <button className="bg-slate-950 hover:bg-slate-905 text-white font-bold py-3.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2 active:scale-95 shadow-md">
              <Briefcase className="w-4 h-4 text-primary" /> Browse Open Shifts
            </button>
          </Link>
        </header>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold">
            {successMsg}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Shifts</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{approvedApps.length}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours Completed</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{hoursWorked} Hrs</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Earnings</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">₹{totalEarnings}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Rating</p>
              <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">⭐ {profile?.rating || '5.0'}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard split lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Applications list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-poppins text-xl font-bold text-slate-955 flex items-center gap-1.5">
              <ClipboardList className="w-5 h-5 text-primary" /> Application History
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold">
                      <th className="p-4">Gig / Shift Title</th>
                      <th className="p-4">Date &amp; Venue</th>
                      <th className="p-4">Rate &amp; Duration</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">
                          You haven't applied to any shifts yet. Browse the shift marketplace to find events!
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => {
                        const job = app.jobId;
                        if (!job) return null;
                        return (
                          <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-950">{job.title}</p>
                              <p className="text-[10px] text-slate-450">Posted by: {job.createdBy?.fullName}</p>
                            </td>
                            <td className="p-4 text-xs text-slate-700">
                              <p className="font-semibold">{job.date}</p>
                              <p className="text-slate-500 truncate max-w-xs">{job.location}</p>
                            </td>
                            <td className="p-4 text-xs">
                              <p className="font-bold text-slate-850">₹{job.payRatePerHour} / Hr</p>
                              <p className="text-slate-500">{job.durationHours} Hours (Est. ₹{job.durationHours * job.payRatePerHour})</p>
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
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Profile Editor */}
          <div className="space-y-4">
            <h3 className="font-poppins text-xl font-bold text-slate-955 flex items-center gap-1.5">
              <User className="w-5 h-5 text-primary" /> Update Work Profile
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bio / Work Intro</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your hospitality background, languages spoken..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exp Years</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-2">
                    <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified Crew
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="e.g. Hosting, Ushering, Billing, AV Setup"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Previous Events (comma-separated)</label>
                  <input
                    type="text"
                    value={prevEventsText}
                    onChange={(e) => setPrevEventsText(e.target.value)}
                    placeholder="e.g. Luxury Wedding, Energy Summit"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-slate-950 hover:bg-slate-905 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 mt-4"
                >
                  <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
