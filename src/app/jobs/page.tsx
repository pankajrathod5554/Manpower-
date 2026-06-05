'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Clock, DollarSign, Users, Filter, HardHat, ShieldCheck, Hammer, Sparkles, Building2, Briefcase } from 'lucide-react';

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
    fullName: string;
    email: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [clientType, setClientType] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (clientType) params.append('clientType', clientType);
      if (location) params.append('location', location);
      params.append('status', 'open');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, clientType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Shift Marketplace
          </div>
          <h1 className="font-poppins text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Available Gigs &amp; Shifts
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Apply to open positions with premium wedding planners, hotels, and event firms. Get paid hourly with direct bank transfers.
          </p>
        </header>

        {/* Filter bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Text search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search job title, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Location search */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="City or venue location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white text-slate-900 font-medium"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  setClientType('');
                  setLocation('');
                  setTimeout(() => fetchJobs(), 50);
                }}
                className="px-4 py-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-655 font-bold rounded-xl text-sm transition-all"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Quick Categories & Client types */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-sm">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {[
                { val: '', label: 'All' },
                { val: 'hospitality', label: 'Hospitality' },
                { val: 'security', label: 'Security' },
                { val: 'logistics', label: 'Logistics' },
                { val: 'technical', label: 'Technical' }
              ].map(cat => (
                <button
                  key={cat.val}
                  onClick={() => setCategory(cat.val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    category === cat.val
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Client Types */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Client Segment:
              </span>
              {[
                { val: '', label: 'All' },
                { val: 'Wedding Planner', label: 'Wedding' },
                { val: 'Hotel', label: 'Hotel' },
                { val: 'Caterer', label: 'Catering' },
                { val: 'Corporate', label: 'Corporate' }
              ].map(type => (
                <button
                  key={type.val}
                  onClick={() => setClientType(type.val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    clientType === type.val
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Searching open roles...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-premium">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-poppins text-xl font-bold text-slate-900">No Open Gigs Found</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              There are currently no active listings matching your filters. Try clearing your search parameters or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              // Category icons and colors
              let icon = <Briefcase className="w-5 h-5" />;
              let badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
              if (job.category === 'hospitality') {
                icon = <Sparkles className="w-5 h-5 text-orange-600" />;
                badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
              } else if (job.category === 'security') {
                icon = <ShieldCheck className="w-5 h-5 text-green-600" />;
                badgeColor = 'bg-green-50 text-green-700 border-green-200';
              } else if (job.category === 'logistics') {
                icon = <Hammer className="w-5 h-5 text-indigo-600" />;
                badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
              } else if (job.category === 'technical') {
                icon = <HardHat className="w-5 h-5 text-cyan-600" />;
                badgeColor = 'bg-cyan-50 text-cyan-700 border-cyan-200';
              }

              const slotsLeft = job.slots - job.filledSlots;

              return (
                <article key={job._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium hover:border-primary/50 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    {/* Header: Category Badge & Client Type */}
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase border ${badgeColor}`}>
                        {icon}
                        {job.category}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase">
                        {job.clientType}
                      </span>
                    </div>

                    {/* Title & Creator */}
                    <div className="space-y-1">
                      <h3 className="font-poppins text-lg font-bold text-slate-950 group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Posted by {job.createdBy?.fullName || 'CrewConnect Partner'}
                      </p>
                    </div>

                    {/* Details: Date, Location, Clock */}
                    <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-105 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Date: {job.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Shift: {job.durationHours} Hours</span>
                      </div>
                    </div>

                    {/* Payout & Slots Info */}
                    <div className="flex justify-between items-center text-sm pt-1">
                      <div className="flex items-center text-primary font-black">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>₹{job.payRatePerHour}/hr</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span className={slotsLeft <= 2 ? 'text-red-500' : 'text-slate-600'}>
                          {slotsLeft} / {job.slots} Vacant
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6">
                    <Link href={`/jobs/${job._id}`} className="block">
                      <button className="w-full bg-slate-950 hover:bg-slate-900 group-hover:bg-primary group-hover:hover:bg-primary-hover text-white text-center py-3 rounded-xl font-bold text-xs transition-all active:scale-95">
                        View &amp; Apply
                      </button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
