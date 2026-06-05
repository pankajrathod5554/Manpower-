'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Star, Award, ShieldCheck, Mail, Phone, Calendar, Briefcase, Zap, Info } from 'lucide-react';

interface UserType {
  fullName: string;
  email: string;
  mobileNumber: string;
}

interface ProfileType {
  bio: string;
  experienceYears: string;
  skills: string[];
  prevEvents: string[];
  rating: number;
  completedJobsCount: number;
  isVerified: boolean;
}

export default function WorkerProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/worker/profile?userId=${params.id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          setError('Worker profile not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch worker profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-550 font-medium text-sm">Opening Work CV...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Profile Not Found</h3>
        <p className="text-slate-500 mt-2 text-sm">{error || 'This worker profile is private or does not exist.'}</p>
        <Link href="/" className="mt-6 inline-block font-bold text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Console
        </button>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-slate-950 relative flex items-end px-6 pb-4">
            <div className="absolute top-4 right-4 flex gap-2">
              {profile?.isVerified && (
                <span className="bg-green-500 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 fill-white text-green-500" /> Crew Verified
                </span>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="p-6 md:p-8 space-y-6 relative">
            
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 -mt-16 sm:-mt-20">
              <div className="space-y-2">
                <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-primary border-4 border-white flex items-center justify-center font-poppins text-3xl sm:text-4xl font-black text-white shadow-md">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <h1 className="font-poppins text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                    {user.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Event &amp; Hospitality Crew
                  </p>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-center self-stretch sm:self-auto flex sm:flex-col justify-between items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-primary font-black text-lg">
                  <Star className="w-5 h-5 fill-primary" />
                  <span>{profile?.rating || '5.0'}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worker Rating</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 text-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                <h4 className="font-poppins text-xl font-bold text-slate-850 mt-1">{profile?.experienceYears || '0'} Years</h4>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Shifts</p>
                <h4 className="font-poppins text-xl font-bold text-slate-850 mt-1">{profile?.completedJobsCount || '0'} Shifts</h4>
              </div>
            </div>

            {/* Bio / Work Intro */}
            <div className="space-y-2.5">
              <h3 className="font-poppins font-bold text-base text-slate-950">About Me</h3>
              <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line">
                {profile?.bio || 'This worker has not updated their bio yet.'}
              </p>
            </div>

            {/* Contact Specs */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-poppins font-bold text-sm text-slate-950">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{user.mobileNumber}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <h3 className="font-poppins font-bold text-sm text-slate-950">Skills &amp; Proficiencies</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-xl uppercase">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No specific skills listed.</span>
                )}
              </div>
            </div>

            {/* Previous Deployments */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <h3 className="font-poppins font-bold text-sm text-slate-950">Recent Deployed Events</h3>
              <div className="space-y-2">
                {profile?.prevEvents && profile.prevEvents.length > 0 ? (
                  profile.prevEvents.map((evt, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                      <Award className="w-4.5 h-4.5 text-primary shrink-0" />
                      <span className="font-semibold">{evt}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No previous deployment history registered.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
