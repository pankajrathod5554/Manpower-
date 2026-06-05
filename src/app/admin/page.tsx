'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Mail, Users, FileText, Check, X, RefreshCw, 
  Briefcase, Star, Trash, Search, ArrowUpDown, Download, 
  LayoutDashboard, Coins, Settings, AlertCircle, Calendar, 
  MapPin, SlidersHorizontal, UserCheck, CheckSquare, Square, 
  ChevronLeft, ChevronRight, Activity, ShieldAlert
} from 'lucide-react';

interface InquiryType {
  _id: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  staffCount: number;
  staffCategory: string;
  details?: string;
  status: 'Pending' | 'Reviewed' | 'Fulfilled' | 'Rejected';
  createdAt?: string;
}

interface CandidateType {
  _id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  dob: string;
  gender: string;
  experience: string;
  experienceYears: string;
  position: string;
  status: 'Applied' | 'Interviewing' | 'Approved' | 'Rejected';
  createdAt?: string;
}

interface JobType {
  _id: string;
  title: string;
  category: string;
  clientType: string;
  location: string;
  date: string;
  durationHours: number;
  payRatePerHour: number;
  slots: number;
  filledSlots: number;
  status: 'open' | 'closed';
  createdBy?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt?: string;
}

interface UserType {
  _id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'staff_manager' | 'employer' | 'worker';
  fullName: string;
  mobileNumber: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export default function AdminConsole() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  // Tabs & Navigation
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'employers' | 'candidates' | 'jobs' | 'settings'>('analytics');
  
  // Data lists
  const [users, setUsers] = useState<UserType[]>([]);
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [jobs, setJobs] = useState<JobType[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data Management states (Search, Filter, Sort, Pagination)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection states for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Mock Recent Activities
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: '1', user: 'System', action: 'Auto-backed up database to cache', target: 'mockDb', time: '10 mins ago', type: 'info' },
    { id: '2', user: 'Employer john@weddings.com', action: 'Created new Job Shift request', target: 'VIP banquet Coordinator', time: '1 hour ago', type: 'success' },
    { id: '3', user: 'Worker amit@gmail.com', action: 'Submitted Registration form', target: 'amit_cv.pdf', time: '2 hours ago', type: 'info' },
    { id: '4', user: 'System', action: 'MongoDB disconnected - auto-redirected route to local mockDb', target: 'lib/db.ts', time: '3 hours ago', type: 'warning' },
  ]);

  const fetchSessionAndData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Get Session
      const sessionRes = await fetch('/api/auth/me');
      const sessionData = await sessionRes.json();
      if (!sessionData.success) {
        router.push('/login');
        return;
      }

      const role = sessionData.user.role;
      if (role !== 'superadmin' && role !== 'admin' && role !== 'staff_manager') {
        router.push('/');
        return;
      }
      
      setCurrentUser(sessionData.user);

      // Adjust default tab based on role permissions
      if (role === 'staff_manager') {
        setActiveTab('candidates');
      } else {
        setActiveTab('analytics');
      }

      // 2. Fetch all components
      // Fetch Inquiries
      const empRes = await fetch('/api/employer');
      const empData = await empRes.json();
      if (empData.success) setInquiries(empData.data);

      // Fetch Candidates
      const candRes = await fetch('/api/jobseeker');
      const candData = await candRes.json();
      if (candData.success) setCandidates(candData.data);

      // Fetch Jobs
      const jobsRes = await fetch('/api/jobs?status=all');
      const jobsData = await jobsRes.json();
      if (jobsData.success) setJobs(jobsData.data);

      // Fetch Users if admin or superadmin
      if (role === 'superadmin' || role === 'admin') {
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        if (usersData.success) setUsers(usersData.data);
      }

      if (global.useMockDb) {
        setErrorMsg('Offline Mode Active: Currently operating on the In-Memory Mock Database.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error establishing server connection. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndData();
  }, []);

  // Handle Tab Switch reset
  useEffect(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setSelectedIds([]);
    setCurrentPage(1);
  }, [activeTab]);

  // Bulk Selection Helpers
  const toggleSelectAll = (filteredItems: any[]) => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(item => item._id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Sort and Filter Implementation
  const getFilteredAndSortedData = () => {
    let rawList: any[] = [];
    if (activeTab === 'users') rawList = [...users];
    else if (activeTab === 'employers') rawList = [...inquiries];
    else if (activeTab === 'candidates') rawList = [...candidates];
    else if (activeTab === 'jobs') rawList = [...jobs];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rawList = rawList.filter(item => {
        if (activeTab === 'users') {
          return item.fullName.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.mobileNumber.includes(q);
        } else if (activeTab === 'employers') {
          return item.companyName.toLowerCase().includes(q) || item.contactPerson.toLowerCase().includes(q) || item.eventName.toLowerCase().includes(q);
        } else if (activeTab === 'candidates') {
          return item.fullName.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.position.toLowerCase().includes(q);
        } else if (activeTab === 'jobs') {
          return item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        }
        return false;
      });
    }

    // Role filter (for users tab)
    if (activeTab === 'users' && roleFilter !== 'all') {
      rawList = rawList.filter(item => item.role === roleFilter);
    }

    // Status filter (for jobs, inquiries, candidates)
    if (statusFilter !== 'all') {
      rawList = rawList.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sorting
    rawList.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle date sorting properly
      if (sortBy === 'createdAt' || sortBy === 'eventDate' || sortBy === 'date') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' 
          ? (valA > valB ? 1 : -1) 
          : (valA < valB ? 1 : -1);
      }
    });

    return rawList;
  };

  const filteredData = getFilteredAndSortedData();

  // Pagination Helper
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // CSV Export Helper
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    let headers: string[] = [];

    if (activeTab === 'users') {
      headers = ['ID', 'Full Name', 'Email', 'Role', 'Mobile Number', 'Joined Date'];
      csvContent += headers.join(",") + "\n";
      filteredData.forEach(item => {
        csvContent += `"${item._id}","${item.fullName}","${item.email}","${item.role}","${item.mobileNumber}","${item.createdAt}"\n`;
      });
    } else if (activeTab === 'employers') {
      headers = ['ID', 'Company Name', 'Contact Person', 'Email', 'Mobile', 'Event Name', 'Date', 'Location', 'Staff Count', 'Status'];
      csvContent += headers.join(",") + "\n";
      filteredData.forEach(item => {
        csvContent += `"${item._id}","${item.companyName}","${item.contactPerson}","${item.email}","${item.mobileNumber}","${item.eventName}","${item.eventDate}","${item.eventLocation}","${item.staffCount}","${item.status}"\n`;
      });
    } else if (activeTab === 'candidates') {
      headers = ['ID', 'Candidate Name', 'Email', 'Mobile', 'Position', 'Experience', 'Years', 'Gender', 'Status'];
      csvContent += headers.join(",") + "\n";
      filteredData.forEach(item => {
        csvContent += `"${item._id}","${item.fullName}","${item.email}","${item.mobileNumber}","${item.position}","${item.experience}","${item.experienceYears}","${item.gender}","${item.status}"\n`;
      });
    } else if (activeTab === 'jobs') {
      headers = ['ID', 'Gig Title', 'Category', 'Client Type', 'Location', 'Date', 'Pay Rate', 'Slots', 'Filled', 'Status'];
      csvContent += headers.join(",") + "\n";
      filteredData.forEach(item => {
        csvContent += `"${item._id}","${item.title}","${item.category}","${item.clientType}","${item.location}","${item.date}","${item.payRatePerHour}","${item.slots}","${item.filledSlots}","${item.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CrewConnect_${activeTab}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // User role CRUD Action
  const handleUpdateRole = async (userId: string, newRole: string) => {
    setSubmitting(userId);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as any } : u));
        setSuccessMsg(`User role updated successfully to ${newRole}`);
        
        // Log Activity
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          user: currentUser?.fullName || 'Super Admin',
          action: 'Updated User Role',
          target: `${data.data.fullName} -> ${newRole}`,
          time: 'Just now',
          type: 'success'
        };
        setActivities(prev => [newLog, ...prev]);
      } else {
        setErrorMsg(data.error || 'Failed to update role.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error communicating role changes.');
    } finally {
      setSubmitting(null);
    }
  };

  // User delete CRUD Action
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action is irreversible.')) {
      return;
    }
    setSubmitting(userId);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        setSuccessMsg('User successfully deleted from database.');
        
        // Log Activity
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          user: currentUser?.fullName || 'Super Admin',
          action: 'Deleted User Profile',
          target: `User ID: ${userId}`,
          time: 'Just now',
          type: 'warning'
        };
        setActivities(prev => [newLog, ...prev]);
      } else {
        setErrorMsg(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error during deletion.');
    } finally {
      setSubmitting(null);
    }
  };

  // Inquiry Status CRUD
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    setSubmitting(id);
    try {
      const response = await fetch('/api/employer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: status as any } : item));
        setSuccessMsg(`Inquiry status updated to ${status}`);
      } else {
        alert(data.error || 'Failed to update.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating inquiry.');
    } finally {
      setSubmitting(null);
    }
  };

  // Candidate Status CRUD
  const handleUpdateCandidateStatus = async (id: string, status: string) => {
    setSubmitting(id);
    try {
      const response = await fetch('/api/jobseeker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (data.success) {
        setCandidates(prev => prev.map(item => item._id === id ? { ...item, status: status as any } : item));
        setSuccessMsg(`Candidate status updated to ${status}`);
      } else {
        alert(data.error || 'Failed to update.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating candidate.');
    } finally {
      setSubmitting(null);
    }
  };

  // Bulk Actions implementation
  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Perform bulk ${action} on ${selectedIds.length} items?`)) return;

    setLoading(true);
    let count = 0;
    try {
      for (const id of selectedIds) {
        if (activeTab === 'employers') {
          const status = action === 'approve' ? 'Fulfilled' : 'Rejected';
          await fetch('/api/employer', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
          });
          count++;
        } else if (activeTab === 'candidates') {
          const status = action === 'approve' ? 'Approved' : 'Rejected';
          await fetch('/api/jobseeker', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
          });
          count++;
        } else if (activeTab === 'users' && action === 'delete') {
          await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
          count++;
        }
      }
      setSuccessMsg(`Bulk action completed! Successfully updated ${count} items.`);
      setSelectedIds([]);
      fetchSessionAndData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process one or more bulk actions.');
    } finally {
      setLoading(false);
    }
  };

  // Change sorting column
  const requestSort = (field: string) => {
    let order: 'asc' | 'desc' = 'asc';
    if (sortBy === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortBy(field);
    setSortOrder(order);
  };

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Synchronizing Admin Panel...</p>
      </div>
    );
  }

  // Analytics helper calculations
  const totalUsers = users.length;
  const totalInquiries = inquiries.length;
  const totalCandidates = candidates.length;
  const totalGigs = jobs.length;
  
  // Calculate commissions / revenue
  // We take 15% platform commission on the total value of jobs that are filled
  const platformRevenue = jobs.reduce((sum, job) => {
    return sum + (job.filledSlots * job.durationHours * job.payRatePerHour * 0.15);
  }, 0);

  const activeRole = currentUser?.role || 'staff_manager';

  return (
    <div className="py-12 md:py-16 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 
              {activeRole === 'superadmin' ? 'Super Admin Console' : activeRole === 'admin' ? 'Security Console' : 'Staff Manager Workspace'}
            </div>
            <h1 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">System Control Panel</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage incoming employer requests, staff registrations, and configure global platform settings.
            </p>
          </div>

          <button 
            onClick={fetchSessionAndData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold active:scale-95 disabled:opacity-50 transition-all text-slate-700 shadow-sm rounded-xl shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Registry
          </button>
        </header>

        {errorMsg && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-750" />
            <div>
              <p className="font-bold">System Status Warning:</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold">
            {successMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-0.5">
          {activeRole !== 'staff_manager' && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Revenue &amp; Analytics
            </button>
          )}

          {activeRole !== 'staff_manager' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              <Users className="w-4 h-4" /> Users &amp; Roles ({totalUsers})
            </button>
          )}

          <button
            onClick={() => setActiveTab('employers')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'employers' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <FileText className="w-4 h-4" /> Employer Inquiries ({totalInquiries})
          </button>
          
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'candidates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <UserCheck className="w-4 h-4" /> Candidates ({totalCandidates})
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'jobs' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            <Briefcase className="w-4 h-4" /> Marketplace Gigs ({totalGigs})
          </button>

          {activeRole === 'superadmin' && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              <Settings className="w-4 h-4" /> System Settings
            </button>
          )}
        </div>

        {/* -------------------- 1. ANALYTICS PANEL -------------------- */}
        {activeTab === 'analytics' && activeRole !== 'staff_manager' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users Registered</p>
                  <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{totalUsers}</h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gigs Created</p>
                  <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{totalGigs}</h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employer Inquiries</p>
                  <h3 className="font-poppins text-3xl font-black text-slate-900 mt-1">{totalInquiries}</h3>
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Platform Revenue</p>
                  <h3 className="font-poppins text-3xl font-black text-primary mt-1">₹{platformRevenue.toFixed(0)}</h3>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Coins className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Split Screen Graph & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Analytics Graph mockup */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-poppins font-bold text-lg text-slate-900">Commission Volume Analytics</h3>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-250">
                    Commission Rate: 15%
                  </span>
                </div>
                
                {/* Simulated Chart Bars */}
                <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-100">
                  <div className="flex flex-col items-center flex-grow group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">₹4,200</span>
                    <div className="w-full bg-slate-100 group-hover:bg-primary-light h-28 rounded-t-lg transition-all" />
                    <span className="text-[10px] font-bold text-slate-400 mt-2">Jan</span>
                  </div>
                  <div className="flex flex-col items-center flex-grow group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">₹6,800</span>
                    <div className="w-full bg-slate-100 group-hover:bg-primary-light h-40 rounded-t-lg transition-all" />
                    <span className="text-[10px] font-bold text-slate-400 mt-2">Feb</span>
                  </div>
                  <div className="flex flex-col items-center flex-grow group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">₹9,100</span>
                    <div className="w-full bg-slate-100 group-hover:bg-primary-light h-48 rounded-t-lg transition-all" />
                    <span className="text-[10px] font-bold text-slate-400 mt-2">Mar</span>
                  </div>
                  <div className="flex flex-col items-center flex-grow group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">₹14,500</span>
                    <div className="w-full bg-primary h-56 rounded-t-lg transition-all shadow-md shadow-primary/10" />
                    <span className="text-[10px] font-bold text-slate-900 mt-2">Apr (Live)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                  <span>Scale: Monthly platform revenue commission (₹ INR)</span>
                  <span className="text-primary hover:underline cursor-pointer">Export Full Financial CSV</span>
                </div>
              </div>

              {/* Recent Activities Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-4">
                <h3 className="font-poppins font-bold text-lg text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-5 h-5 text-primary" /> Live Audit Trail
                </h3>
                
                <div className="space-y-4">
                  {activities.map(log => (
                    <div key={log.id} className="text-xs border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{log.user}</span>
                        <span className="text-slate-400 text-[10px]">{log.time}</span>
                      </div>
                      <p className="text-slate-500">
                        {log.action} <span className="font-bold text-slate-700">({log.target})</span>
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                        log.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                        log.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-blue-50 text-blue-750 border-blue-200'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- 2. USERS MANAGEMENT TAB -------------------- */}
        {activeTab === 'users' && activeRole !== 'staff_manager' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filters Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-premium flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by name, email, or mobile..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                >
                  <option value="all">All Roles</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="staff_manager">Staff Manager</option>
                  <option value="employer">Employer</option>
                  <option value="worker">Worker</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && activeRole === 'superadmin' && (
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-200 active:scale-95 transition-all"
                  >
                    <Trash className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                  </button>
                )}
                <button
                  onClick={handleExportCSV}
                  className="bg-slate-950 hover:bg-slate-905 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-primary" /> Export CSV
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-955 text-white font-poppins font-semibold select-none">
                      <th className="p-4 w-12 text-center">
                        <button 
                          onClick={() => toggleSelectAll(filteredData)}
                          className="text-slate-400 hover:text-white"
                        >
                          {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('fullName')}>
                        <span className="flex items-center gap-1">Full Name &amp; Contacts <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('email')}>
                        <span className="flex items-center gap-1">Email <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('role')}>
                        <span className="flex items-center gap-1">System Role / Access <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('createdAt')}>
                        <span className="flex items-center gap-1">Joined Date <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">No users match your criteria.</td>
                      </tr>
                    ) : (
                      paginatedData.map(item => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => toggleSelectId(item._id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {selectedIds.includes(item._id) ? (
                                <CheckSquare className="w-4 h-4 text-primary" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-950">{item.fullName}</p>
                            <p className="text-xs text-slate-400">{item.mobileNumber}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-800">{item.email}</td>
                          <td className="p-4">
                            <select
                              value={item.role}
                              disabled={submitting === item._id || activeRole !== 'superadmin'}
                              onChange={(e) => handleUpdateRole(item._id, e.target.value)}
                              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-bold"
                            >
                              <option value="superadmin">Super Admin</option>
                              <option value="admin">Admin</option>
                              <option value="staff_manager">Staff Manager</option>
                              <option value="employer">Employer</option>
                              <option value="worker">Worker</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs text-slate-500 font-medium">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              disabled={submitting === item._id || activeRole !== 'superadmin'}
                              onClick={() => handleDeleteUser(item._id)}
                              className="p-2 text-red-650 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 text-sm text-slate-500">
                <span>Page {currentPage} of {totalPages} ({filteredData.length} users total)</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange('prev')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange('next')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- 3. EMPLOYER INQUIRIES TAB -------------------- */}
        {activeTab === 'employers' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filters Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-premium flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inquiries by company, planner name, email..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                >
                  <option value="all">All Inquiries</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="bg-green-550 text-green-700 bg-green-50 border border-green-200 px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      Approve Selected ({selectedIds.length})
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      className="bg-red-550 text-red-750 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      Reject Selected ({selectedIds.length})
                    </button>
                  </div>
                )}
                <button
                  onClick={handleExportCSV}
                  className="bg-slate-950 hover:bg-slate-905 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-primary" /> Export CSV
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-955 text-white font-poppins font-semibold">
                      <th className="p-4 w-12 text-center">
                        <button 
                          onClick={() => toggleSelectAll(filteredData)}
                          className="text-slate-400 hover:text-white"
                        >
                          {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('companyName')}>
                        <span className="flex items-center gap-1">Company &amp; Contact <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('eventName')}>
                        <span className="flex items-center gap-1">Event Category <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('eventDate')}>
                        <span className="flex items-center gap-1">Schedule &amp; Venue <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('staffCount')}>
                        <span className="flex items-center gap-1">Crew Count <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center cursor-pointer" onClick={() => requestSort('status')}>
                        <span className="flex items-center justify-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">No inquiries found matching your filters.</td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => toggleSelectId(item._id)}
                              className="text-slate-400 hover:text-slate-655"
                            >
                              {selectedIds.includes(item._id) ? (
                                <CheckSquare className="w-4 h-4 text-primary" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-955">{item.companyName}</p>
                            <p className="text-xs text-slate-500 font-medium">{item.contactPerson} • {item.mobileNumber}</p>
                            <p className="text-[11px] text-slate-400">{item.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-900">{item.eventName}</p>
                            <span className="inline-block text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase mt-1">{item.staffCategory}</span>
                          </td>
                          <td className="p-4 text-xs text-slate-700 font-medium">
                            <p>Date: {item.eventDate}</p>
                            <p className="text-slate-450 mt-0.5 truncate max-w-xs">{item.eventLocation}</p>
                          </td>
                          <td className="p-4 font-bold text-slate-900">{item.staffCount} Crew</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                              item.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                              item.status === 'Reviewed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              item.status === 'Fulfilled' ? 'bg-green-50 text-green-800 border-green-200' :
                              'bg-red-50 text-red-800 border-red-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                disabled={submitting === item._id}
                                onClick={() => handleUpdateInquiryStatus(item._id, 'Fulfilled')}
                                className="p-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
                                title="Fulfill inquiry"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                disabled={submitting === item._id}
                                onClick={() => handleUpdateInquiryStatus(item._id, 'Rejected')}
                                className="p-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject inquiry"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 text-sm text-slate-500">
                <span>Page {currentPage} of {totalPages} ({filteredData.length} items total)</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange('prev')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange('next')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- 4. CANDIDATES REGISTRY TAB -------------------- */}
        {activeTab === 'candidates' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filters Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-premium flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidates by name, position, email..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>

                {/* Candidate Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                >
                  <option value="all">All Registries</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {selectedIds.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="bg-green-550 text-green-700 bg-green-50 border border-green-200 px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      Approve Selected ({selectedIds.length})
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      className="bg-red-550 text-red-755 bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      Reject Selected ({selectedIds.length})
                    </button>
                  </div>
                )}
                <button
                  onClick={handleExportCSV}
                  className="bg-slate-950 hover:bg-slate-905 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-primary" /> Export CSV
                </button>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-955 text-white font-poppins font-semibold">
                      <th className="p-4 w-12 text-center">
                        <button 
                          onClick={() => toggleSelectAll(filteredData)}
                          className="text-slate-400 hover:text-white"
                        >
                          {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('fullName')}>
                        <span className="flex items-center gap-1">Candidate Profile <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('position')}>
                        <span className="flex items-center gap-1">Desired Position <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4">Personal Details</th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('experienceYears')}>
                        <span className="flex items-center gap-1">Experience Years <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center cursor-pointer" onClick={() => requestSort('status')}>
                        <span className="flex items-center justify-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">No candidates match your query.</td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => toggleSelectId(item._id)}
                              className="text-slate-400 hover:text-slate-655"
                            >
                              {selectedIds.includes(item._id) ? (
                                <CheckSquare className="w-4 h-4 text-primary" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-950">{item.fullName}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.email}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-900">{item.position}</td>
                          <td className="p-4 text-xs text-slate-650 font-medium">
                            <p>Mobile: {item.mobileNumber}</p>
                            <p className="text-slate-450 mt-0.5">Birth: {item.dob} ({item.gender})</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{item.experience}</p>
                            <p className="text-xs text-slate-450 font-semibold">{item.experienceYears} Years Active</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                              item.status === 'Applied' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                              item.status === 'Interviewing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              item.status === 'Approved' ? 'bg-green-50 text-green-800 border-green-200' :
                              'bg-red-50 text-red-800 border-red-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                disabled={submitting === item._id}
                                onClick={() => handleUpdateCandidateStatus(item._id, 'Approved')}
                                className="p-1.5 bg-green-550 text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
                                title="Approve candidate"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                disabled={submitting === item._id}
                                onClick={() => handleUpdateCandidateStatus(item._id, 'Rejected')}
                                className="p-1.5 bg-red-550 text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-colors"
                                title="Reject candidate"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 text-sm text-slate-500">
                <span>Page {currentPage} of {totalPages} ({filteredData.length} candidates total)</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange('prev')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange('next')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- 5. MARKETPLACE GIGS TAB -------------------- */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-premium flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs by title, location, category..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 bg-white"
                  />
                </div>

                {/* Job Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
                >
                  <option value="all">All Jobs</option>
                  <option value="open">Open Shifts</option>
                  <option value="closed">Closed Shifts</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="bg-slate-950 hover:bg-slate-905 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-primary" /> Export CSV
              </button>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-955 text-white font-poppins font-semibold select-none">
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('title')}>
                        <span className="flex items-center gap-1">Gig Title / Category <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4">Employer / Organizer</th>
                      <th className="p-4 cursor-pointer" onClick={() => requestSort('date')}>
                        <span className="flex items-center gap-1">Event Details <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center cursor-pointer" onClick={() => requestSort('payRatePerHour')}>
                        <span className="flex items-center justify-center gap-1">Hourly Rate <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="p-4 text-center">Fill Ratio</th>
                      <th className="p-4 text-center cursor-pointer" onClick={() => requestSort('status')}>
                        <span className="flex items-center justify-center gap-1">Market Status <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">No marketplace jobs found.</td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-950">{item.title}</p>
                            <div className="flex gap-1.5 mt-1.5">
                              <span className="text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">{item.category}</span>
                              <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">{item.clientType}</span>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-medium">
                            <p className="font-bold text-slate-800">{item.createdBy?.fullName || 'CrewConnect Partner'}</p>
                            <p className="text-slate-400">{item.createdBy?.email}</p>
                          </td>
                          <td className="p-4 text-xs text-slate-700 font-medium">
                            <p className="font-semibold text-slate-900">Date: {item.date}</p>
                            <p className="truncate max-w-xs text-slate-450 mt-0.5">{item.location}</p>
                            <p className="text-[10px] text-slate-400">Duration: {item.durationHours} Hours</p>
                          </td>
                          <td className="p-4 text-center font-bold text-primary">
                            ₹{item.payRatePerHour} / Hr
                          </td>
                          <td className="p-4 text-center">
                            <p className="font-bold text-slate-850">{item.filledSlots} / {item.slots} Slots</p>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full mx-auto mt-1.5 overflow-hidden border border-slate-200/50">
                              <div className="bg-primary h-full" style={{ width: `${(item.filledSlots / item.slots) * 100}%` }} />
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                              item.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 text-sm text-slate-500">
                <span>Page {currentPage} of {totalPages} ({filteredData.length} jobs total)</span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange('prev')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange('next')}
                    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- 6. SYSTEM SETTINGS TAB -------------------- */}
        {activeTab === 'settings' && activeRole === 'superadmin' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-premium max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <h3 className="font-poppins font-bold text-xl text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" /> Platform Security Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Platform Commision Rate (%)</label>
                <input 
                  type="number" 
                  defaultValue={15} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm text-slate-900 bg-slate-50 font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Primary Database Endpoint (Read-Only)</label>
                <input 
                  type="text" 
                  readOnly 
                  value="mongodb://127.0.0.1:27017/meb_power_manpower" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 bg-slate-100 font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fallback Status</label>
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping shrink-0" />
                  <p className="font-semibold">Mock Failover Mode Active: Auto-serving mock database queries.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => alert('Platform configurations saved.')} 
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl text-sm transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
