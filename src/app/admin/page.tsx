'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, FileText, Check, X, RefreshCw, 
  Trash2, Edit, Plus, Calendar, MapPin, Clock, Camera, 
  AlertCircle, LayoutDashboard, Download, Eye, Navigation, Crown, MessageSquare
} from 'lucide-react';

interface AssignedStaff {
  _id?: string;
  staffName: string;
  category: string;
  mobileNumber: string;
  userId?: string;
  checkInTime?: string;
  checkInLocation?: string;
  checkInSelfie?: string;
  checkOutTime?: string;
  checkOutLocation?: string;
  checkOutSelfie?: string;
}

interface EventType {
  _id: string;
  name: string;
  clientName: string;
  requiredStaffCount: number;
  date: string;
  time: string;
  location: string;
  category: 'Wedding Hospitality Staff' | 'Event Supervisors' | 'Hostess & Promoters' | 'Corporate Event Staff' | 'Technical Supervisors';
  assignedStaff: AssignedStaff[];
  createdAt?: string;
}

interface BookingType {
  _id: string;
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  staffCategory: string;
  staffCount: number;
  notes?: string;
  createdAt: string;
}

interface UserType {
  _id: string;
  email: string;
  role: 'admin' | 'staff';
  fullName: string;
  mobileNumber: string;
}

interface CandidateType {
  _id: string;
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  city: string;
  gender: string;
  age: number;
  category: string;
  experience: string;
  aadhaarPhoto: string;
  profilePhoto: string;
  createdAt: string;
}

interface ContactRequestType {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminConsole() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [contacts, setContacts] = useState<ContactRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'bookings' | 'attendance' | 'registrations' | 'contacts'>('overview');

  // Filter / Sorting / Pagination States for Candidates
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateCategoryFilter, setCandidateCategoryFilter] = useState('');
  const [candidateCityFilter, setCandidateCityFilter] = useState('');
  const [candidateExperienceFilter, setCandidateExperienceFilter] = useState('');
  const [candidateSortKey, setCandidateSortKey] = useState<'fullName' | 'createdAt' | 'experience'>('createdAt');
  const [candidateSortOrder, setCandidateSortOrder] = useState<'asc' | 'desc'>('desc');
  const [candidatePage, setCandidatePage] = useState(1);
  const candidatesPerPage = 10;

  // Filter / Pagination States for Contact Requests
  const [contactSearch, setContactSearch] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const contactsPerPage = 10;

  // Modal / Form States
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  
  // Event Form Inputs
  const [eventName, setEventName] = useState('');
  const [clientName, setClientName] = useState('');
  const [requiredStaffCount, setRequiredStaffCount] = useState(1);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'Wedding Hospitality Staff' | 'Event Supervisors' | 'Hostess & Promoters' | 'Corporate Event Staff' | 'Technical Supervisors'>('Wedding Hospitality Staff');
  
  // Staff Assigner Subform Inputs
  const [tempStaffName, setTempStaffName] = useState('');
  const [tempStaffCategory, setTempStaffCategory] = useState('Wedding Hospitality Staff');
  const [tempStaffMobile, setTempStaffMobile] = useState('');
  const [currentStaffList, setCurrentStaffList] = useState<AssignedStaff[]>([]);

  // Selfie / Upload Document Viewer Modal State
  const [activeSelfie, setActiveSelfie] = useState<string | null>(null);
  const [selfieTitle, setSelfieTitle] = useState('');

  const fetchSessionAndData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Get Auth Session
      const sessionRes = await fetch('/api/auth/me');
      const sessionData = await sessionRes.json();
      if (!sessionData.success) {
        router.push('/login');
        return;
      }

      if (sessionData.user.role !== 'admin') {
        router.push('/');
        return;
      }
      
      setCurrentUser(sessionData.user);

      // 2. Fetch Events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setEvents(eventsData.data);
      } else {
        setErrorMsg(eventsData.error || 'Failed to fetch events.');
      }

      // 3. Fetch Bookings
      const bookingsRes = await fetch('/api/bookings');
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }

      // 4. Fetch Candidates
      const candidatesRes = await fetch('/api/candidates');
      const candidatesData = await candidatesRes.json();
      if (candidatesData.success) {
        setCandidates(candidatesData.data);
      }

      // 5. Fetch Contacts
      const contactsRes = await fetch('/api/contacts');
      const contactsData = await contactsRes.json();
      if (contactsData.success) {
        setContacts(contactsData.data);
      }
      
      if (global.useMockDb) {
        setErrorMsg('Offline Mode Active: Currently operating on the In-Memory Mock Database.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error establishing connection to backend database. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndData();
  }, []);


  const resetForm = () => {
    setEventName('');
    setClientName('');
    setRequiredStaffCount(1);
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventCategory('Wedding Hospitality Staff');
    setCurrentStaffList([]);
    setTempStaffName('');
    setTempStaffCategory('Wedding Hospitality Staff');
    setTempStaffMobile('');
    setEditingEvent(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowEventModal(true);
  };

  const openEditModal = (event: EventType) => {
    setEditingEvent(event);
    setEventName(event.name);
    setClientName(event.clientName || '');
    setRequiredStaffCount(event.requiredStaffCount || 1);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventLocation(event.location);
    setEventCategory(event.category);
    setCurrentStaffList(event.assignedStaff || []);
    setTempStaffName('');
    setTempStaffCategory(event.category);
    setTempStaffMobile('');
    setShowEventModal(true);
  };

  // Convert an inquiry booking into an active event deployment
  const handleApproveBooking = (booking: BookingType) => {
    resetForm();
    setEventName(booking.eventName);
    setClientName(booking.companyName);
    setRequiredStaffCount(booking.staffCount);
    setEventDate(booking.eventDate);
    setEventLocation(booking.eventLocation);
    setEventCategory(booking.staffCategory as any);
    setTempStaffCategory(booking.staffCategory);
    setActiveTab('events');
    setShowEventModal(true);
  };

  // Delete Booking inquiry
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Delete this staffing inquiry?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Booking inquiry deleted successfully.');
        fetchSessionAndData();
      } else {
        setErrorMsg(data.error || 'Failed to delete booking.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    }
  };

  // Delete Candidate Onboarding Registration
  const handleDeleteCandidate = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this candidate registration?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/candidates?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Candidate registration deleted successfully.');
        fetchSessionAndData();
      } else {
        setErrorMsg(data.error || 'Failed to delete candidate.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    }
  };

  // Delete Contact Form Request
  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Delete this contact request?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Contact request deleted successfully.');
        fetchSessionAndData();
      } else {
        setErrorMsg(data.error || 'Failed to delete contact request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error.');
    }
  };


  // Staff Subform Helpers
  const addStaffToTempList = () => {
    if (!tempStaffName || !tempStaffMobile) {
      alert('Please fill out Staff Name and Mobile Number');
      return;
    }
    const newStaff: AssignedStaff = {
      staffName: tempStaffName,
      category: tempStaffCategory,
      mobileNumber: tempStaffMobile
    };
    setCurrentStaffList(prev => [...prev, newStaff]);
    setTempStaffName('');
    setTempStaffMobile('');
  };

  const removeStaffFromTempList = (idx: number) => {
    setCurrentStaffList(prev => prev.filter((_, i) => i !== idx));
  };

  // Create or Update Event Submit Action
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      id: editingEvent?._id,
      name: eventName,
      clientName,
      requiredStaffCount: Number(requiredStaffCount),
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      category: eventCategory,
      assignedStaff: currentStaffList
    };

    try {
      const url = '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(editingEvent ? 'Event updated successfully!' : 'Event created and staff assigned successfully!');
        setShowEventModal(false);
        resetForm();
        fetchSessionAndData();
      } else {
        alert(data.error || 'Failed to save event');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error occurred while saving the event.');
    }
  };

  // Delete Event Action
  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this event? This action will remove all check-in/out records.')) {
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Event deleted successfully.');
        fetchSessionAndData();
      } else {
        setErrorMsg(data.error || 'Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Connection error during deletion.');
    }
  };

  // CSV Attendance Exporter
  const handleCSVExport = () => {
    const headers = ['Event Name', 'Client Name', 'Staff Name', 'Category', 'Mobile', 'Check-In Time', 'GPS Check-In', 'Check-Out Time', 'GPS Check-Out', 'Attendance Status'];
    
    const rows = attendanceLogs.map(log => [
      log.eventName,
      log.clientName || 'N/A',
      log.staffName,
      log.category,
      log.mobileNumber,
      log.checkInTime ? new Date(log.checkInTime).toLocaleString() : 'N/A',
      log.checkInLocation || 'N/A',
      log.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : 'N/A',
      log.checkOutLocation || 'N/A',
      log.checkOutTime ? 'Checked Out' : (log.checkInTime ? 'Checked In' : 'Pending')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `manpower_attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Candidate Exporter
  const handleExportCandidatesCSV = () => {
    const headers = ['Name', 'Mobile', 'WhatsApp', 'Email', 'City', 'Category', 'Experience', 'Registration Date'];
    
    const rows = sortedCandidates.map(c => [
      c.fullName,
      c.mobileNumber,
      c.whatsAppNumber,
      c.email,
      c.city,
      c.category,
      c.experience,
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidates_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Candidate Exporter
  const handleExportCandidatesExcel = () => {
    const headers = ['Name', 'Mobile', 'WhatsApp', 'Email', 'City', 'Category', 'Experience', 'Registration Date'];
    
    const rows = sortedCandidates.map(c => [
      c.fullName,
      c.mobileNumber,
      c.whatsAppNumber,
      c.email,
      c.city,
      c.category,
      c.experience,
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'
    ]);

    let excelContent = "<table><tr>" + headers.map(h => `<th>${h}</th>`).join('') + "</tr>";
    rows.forEach(r => {
      excelContent += "<tr>" + r.map(v => `<td>${v}</td>`).join('') + "</tr>";
    });
    excelContent += "</table>";

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `candidates_report_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-xs">Loading Control Console...</p>
      </div>
    );
  }

  // Candidates filtering, sorting and pagination logic
  const uniqueCities = Array.from(new Set(candidates.map(c => c.city).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(candidates.map(c => c.category).filter(Boolean)));

  const filteredCandidates = candidates.filter(c => {
    const searchMatch = !candidateSearch || 
      c.fullName.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.mobileNumber.includes(candidateSearch) ||
      c.city.toLowerCase().includes(candidateSearch.toLowerCase());
      
    const categoryMatch = !candidateCategoryFilter || c.category === candidateCategoryFilter;
    const cityMatch = !candidateCityFilter || c.city === candidateCityFilter;
    const experienceMatch = !candidateExperienceFilter || c.experience === candidateExperienceFilter;
    
    return searchMatch && categoryMatch && cityMatch && experienceMatch;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let valA = a[candidateSortKey] || '';
    let valB = b[candidateSortKey] || '';
    
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    
    if (valA < valB) return candidateSortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return candidateSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalCandidatePages = Math.ceil(sortedCandidates.length / candidatesPerPage) || 1;
  const indexOfLastCandidate = candidatePage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = sortedCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  // Contacts filtering & pagination logic
  const filteredContacts = contacts.filter(c => {
    return !contactSearch ||
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.message.toLowerCase().includes(contactSearch.toLowerCase());
  });

  const totalContactPages = Math.ceil(filteredContacts.length / contactsPerPage) || 1;
  const indexOfLastContact = contactPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  // Statistics Calculations
  const totalEventsCount = events.length;
  const todayStr = new Date().toISOString().split('T')[0];
  
  const upcomingEvents = events.filter(e => e.date > todayStr);
  const activeEvents = events.filter(e => e.date === todayStr);
  const completedEvents = events.filter(e => e.date < todayStr);

  const totalAssignedStaff = events.reduce((sum, ev) => sum + (ev.assignedStaff?.length || 0), 0);

  const todayStartStr = new Date().toISOString().split('T')[0];
  const newRegistrationsToday = candidates.filter(c => {
    if (!c.createdAt) return false;
    const cDateStr = new Date(c.createdAt).toISOString().split('T')[0];
    return cDateStr === todayStartStr;
  }).length;

  // Flat list of check-ins/outs for attendance tracking tab
  const attendanceLogs: any[] = [];
  events.forEach(ev => {
    ev.assignedStaff?.forEach(staff => {
      if (staff.checkInTime || staff.checkOutTime) {
        attendanceLogs.push({
          eventId: ev._id,
          eventName: ev.name,
          clientName: ev.clientName,
          eventLocation: ev.location,
          staffName: staff.staffName,
          category: staff.category,
          mobileNumber: staff.mobileNumber,
          ...staff
        });
      }
    });
  });
  
  // Sort logs by newest check-in first
  attendanceLogs.sort((a, b) => {
    const timeA = new Date(b.checkInTime || 0).getTime();
    const timeB = new Date(a.checkInTime || 0).getTime();
    return timeA - timeB;
  });

  return (
    <div className="py-12 md:py-16 px-4 md:px-8 bg-slate-950 text-white min-h-[90vh] relative overflow-hidden">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Admin Control Console
            </div>
            <h1 className="font-poppins text-3xl font-black text-white tracking-tight">Deployment Command Center</h1>
            <p className="text-slate-400 mt-1 text-xs md:text-sm">
              Deploy event crew, verify live attendance logs, and manage incoming client staffing inquiries.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchSessionAndData} 
              className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold active:scale-95 transition-all text-slate-300 shadow-md rounded-xl"
            >
              <RefreshCw className="w-4 h-4" /> Sync System
            </button>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold active:scale-95 transition-all shadow-lg shadow-primary/20 rounded-xl"
            >
              <Plus className="w-4 h-4" /> Create &amp; Deploy Event
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="p-4 bg-yellow-950/40 border border-yellow-500/30 text-yellow-400 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-500 animate-pulse" />
            <div>
              <p className="font-bold">System Status Notice:</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-400 rounded-2xl text-xs font-bold">
            {successMsg}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 gap-6 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview Analytics
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-4 h-4" /> Manage Events ({totalEventsCount})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4" /> Staffing Inquiries ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'registrations' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Candidate Pool ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'contacts' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4" /> Contact Forms ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'attendance' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Attendance Board ({attendanceLogs.length})
          </button>
        </div>

        {/* -------------------- 1. OVERVIEW TAB -------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Event Deployments Statistics Row */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Event Deployments Statistics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Events</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{totalEventsCount}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Events</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{upcomingEvents.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card border-l-primary/30">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Events (Today)</p>
                  <h3 className="font-poppins text-3xl font-black text-primary mt-1">{activeEvents.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Events</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{completedEvents.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Staff</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{totalAssignedStaff} Crew</h3>
                </div>
              </div>
            </div>

            {/* Manpower Pool & Contacts Statistics Row */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Onboarding &amp; Inquiry Statistics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card border-l-primary/30">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registrations</p>
                  <h3 className="font-poppins text-3xl font-black text-primary mt-1">{candidates.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Categories</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{uniqueCategories.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contact Requests</p>
                  <h3 className="font-poppins text-3xl font-black text-white mt-1">{contacts.length}</h3>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card border-l-green-500/30">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Registrations Today</p>
                  <h3 className="font-poppins text-3xl font-black text-green-450 mt-1">{newRegistrationsToday}</h3>
                </div>
              </div>
            </div>


            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event categories chart representation */}
              <div className="lg:col-span-2 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card space-y-4">
                <h3 className="font-poppins font-bold text-lg text-white">Manpower Allocations by Vertical</h3>
                <div className="space-y-4 pt-2">
                  {['Wedding Hospitality Staff', 'Event Supervisors', 'Hostess & Promoters', 'Corporate Event Staff', 'Technical Supervisors'].map(cat => {
                    const allocatedCount = events
                      .filter(e => e.category === cat)
                      .reduce((sum, ev) => sum + (ev.assignedStaff?.length || 0), 0);
                    const percentage = totalAssignedStaff > 0 ? (allocatedCount / totalAssignedStaff) * 100 : 0;

                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-300">{cat}</span>
                          <span className="text-slate-400">{allocatedCount} Assigned ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-primary h-full transition-all duration-550" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active check-in feed quick view */}
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-2xl glass-card space-y-4">
                <h3 className="font-poppins font-bold text-lg text-white flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-primary animate-pulse" /> Live Check-Ins
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {attendanceLogs.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-8">No attendance records submitted yet today.</p>
                  ) : (
                    attendanceLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="text-xs border-b border-slate-800/80 last:border-0 pb-3 last:pb-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{log.staffName}</span>
                          <span className="text-slate-500 text-[10px]">
                            {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-400">
                          Checked-In at <span className="font-semibold text-slate-350">{log.eventName}</span>
                        </p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-green-950/20 text-green-400 border-green-500/25">
                          GPS &amp; Selfie Verified
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- 2. MANAGE EVENTS TAB -------------------- */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold border-b border-slate-800 select-none">
                      <th className="p-4">Event Name</th>
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Location</th>
                      <th className="p-4 text-center">Required / Assigned</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-500">
                          No events have been created yet. Click "Create &amp; Deploy Event" above.
                        </td>
                      </tr>
                    ) : (
                      events.map(ev => (
                        <tr key={ev._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-bold text-white">{ev.name}</td>
                          <td className="p-4 text-slate-300 font-semibold">{ev.clientName || 'N/A'}</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full uppercase border border-slate-800 bg-slate-950 text-slate-400">
                              {ev.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            <div className="font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" /> {ev.date}</div>
                            <div className="flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-primary" /> {ev.time}</div>
                          </td>
                          <td className="p-4 text-xs text-slate-400 max-w-xs truncate">
                            <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {ev.location}</div>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-300">
                            <span className="text-white">{ev.assignedStaff?.length || 0}</span> / <span className="text-slate-500">{ev.requiredStaffCount || 1}</span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button 
                                onClick={() => openEditModal(ev)}
                                className="p-1.5 border border-slate-800 bg-slate-950 rounded-lg hover:bg-slate-900 transition-colors text-slate-300 hover:text-white"
                                title="Edit Event &amp; Assignments"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(ev._id)}
                                className="p-1.5 border border-red-900/40 bg-slate-950 rounded-lg hover:bg-red-950/20 transition-colors text-red-400 hover:text-red-300"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}

        {/* -------------------- 3. BOOKINGS INQUIRIES TAB -------------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold border-b border-slate-800 select-none">
                      <th className="p-4">Company &amp; Contact</th>
                      <th className="p-4">Event Details</th>
                      <th className="p-4">Requested Manpower</th>
                      <th className="p-4">Notes &amp; Requirements</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          No direct client booking requests received yet.
                        </td>
                      </tr>
                    ) : (
                      bookings.map(b => (
                        <tr key={b._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{b.companyName}</p>
                            <p className="text-xs text-slate-400">{b.contactPerson} • {b.mobileNumber}</p>
                            <p className="text-[10px] text-slate-500">{b.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-white">{b.eventName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {b.eventLocation}</p>
                            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {b.eventDate}</p>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full uppercase border border-slate-800 bg-slate-950 text-slate-400">
                              {b.staffCategory}
                            </span>
                            <p className="text-xs font-semibold text-white mt-1">{b.staffCount} Staff Required</p>
                          </td>
                          <td className="p-4 text-xs text-slate-400 max-w-sm truncate" title={b.notes}>
                            {b.notes || <span className="text-slate-650 italic">None</span>}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button
                                onClick={() => handleApproveBooking(b)}
                                className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-md shadow-primary/10"
                                title="Approve &amp; Deploy Event"
                              >
                                Create Event
                              </button>
                              <button 
                                onClick={() => handleDeleteBooking(b._id)}
                                className="p-1.5 border border-red-900/40 bg-slate-950 rounded-lg hover:bg-red-950/20 transition-colors text-red-400 hover:text-red-300"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}

        {/* -------------------- 4. LIVE ATTENDANCE BOARD TAB -------------------- */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-3xl glass-card">
              <span className="text-xs text-slate-300 font-semibold">
                Generate structured CSV exports for audits, client billing, and compliance records.
              </span>
              <button 
                onClick={handleCSVExport}
                disabled={attendanceLogs.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all shadow-md shadow-primary/15"
              >
                <Download className="w-4 h-4" /> Export CSV Report
              </button>
            </div>

            <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold border-b border-slate-800 select-none">
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Deploy Event &amp; Client</th>
                      <th className="p-4">Check-In Details</th>
                      <th className="p-4">Check-Out Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {attendanceLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500">
                          No staff attendance check-ins or check-outs have been logged yet.
                        </td>
                      </tr>
                    ) : (
                      attendanceLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{log.staffName}</p>
                            <p className="text-xs text-slate-450">{log.category} • {log.mobileNumber}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-white">{log.eventName}</p>
                            <p className="text-xs text-slate-450 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {log.eventLocation}</p>
                            <p className="text-[10px] text-slate-500">Client: {log.clientName || 'N/A'}</p>
                          </td>
                          <td className="p-4 text-xs">
                            {log.checkInTime ? (
                              <div className="space-y-1">
                                <p className="text-green-400 font-bold flex items-center gap-1">
                                  <Check className="w-4 h-4 text-green-500" /> Checked-In
                                </p>
                                <p className="text-slate-400">{new Date(log.checkInTime).toLocaleString()}</p>
                                <div className="flex gap-2 mt-1">
                                  {log.checkInLocation && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${log.checkInLocation}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-[9px] font-bold text-slate-300 transition-colors"
                                    >
                                      <Navigation className="w-2.5 h-2.5 text-primary" /> Map GPS
                                    </a>
                                  )}
                                  {log.checkInSelfie && (
                                    <button 
                                      onClick={() => { setActiveSelfie(log.checkInSelfie); setSelfieTitle(`Check-In Selfie: ${log.staffName}`); }}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-[9px] font-bold text-slate-300 transition-colors"
                                    >
                                      <Camera className="w-2.5 h-2.5 text-primary" /> View Selfie
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-medium italic">Pending Check-In</span>
                            )}
                          </td>
                          <td className="p-4 text-xs">
                            {log.checkOutTime ? (
                              <div className="space-y-1">
                                <p className="text-green-400 font-bold flex items-center gap-1">
                                  <Check className="w-4 h-4 text-green-500" /> Checked-Out
                                </p>
                                <p className="text-slate-400">{new Date(log.checkOutTime).toLocaleString()}</p>
                                <div className="flex gap-2 mt-1">
                                  {log.checkOutLocation && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${log.checkOutLocation}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-[9px] font-bold text-slate-300 transition-colors"
                                    >
                                      <Navigation className="w-2.5 h-2.5 text-primary" /> Map GPS
                                    </a>
                                  )}
                                  {log.checkOutSelfie && (
                                    <button 
                                      onClick={() => { setActiveSelfie(log.checkOutSelfie); setSelfieTitle(`Check-Out Selfie: ${log.staffName}`); }}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded text-[9px] font-bold text-slate-300 transition-colors"
                                    >
                                      <Camera className="w-2.5 h-2.5 text-primary" /> View Selfie
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-medium italic">Pending Check-Out</span>
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
        )}

        {/* -------------------- 5. CANDIDATE REGISTRATIONS TAB -------------------- */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Controls & Exports */}
            <div className="bg-slate-900/40 p-6 border border-slate-800 rounded-3xl glass-card space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h3 className="font-poppins font-bold text-lg text-white">Candidates Onboarding Pool</h3>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <button 
                    onClick={handleExportCandidatesCSV}
                    disabled={sortedCandidates.length === 0}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4 text-primary" /> Export CSV
                  </button>
                  <button 
                    onClick={handleExportCandidatesExcel}
                    disabled={sortedCandidates.length === 0}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-all shadow-md shadow-primary/10 active:scale-95"
                  >
                    <Download className="w-4 h-4" /> Export Excel
                  </button>
                </div>
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                {/* Search */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Candidates</label>
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => { setCandidateSearch(e.target.value); setCandidatePage(1); }}
                    placeholder="Search by name, email, city..."
                    className="w-full px-3 py-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category Wise</label>
                  <select
                    value={candidateCategoryFilter}
                    onChange={(e) => { setCandidateCategoryFilter(e.target.value); setCandidatePage(1); }}
                    className="w-full px-3 py-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="Wedding Hospitality Staff">Wedding Hospitality Staff</option>
                    <option value="Welcome Girls">Welcome Girls</option>
                    <option value="Welcome Boys">Welcome Boys</option>
                    <option value="Event Supervisors">Event Supervisors</option>
                    <option value="Hostess">Hostess</option>
                    <option value="Promoters">Promoters</option>
                    <option value="Corporate Event Staff">Corporate Event Staff</option>
                    <option value="Registration Executives">Registration Executives</option>
                    <option value="Technical Supervisors">Technical Supervisors</option>
                    <option value="Sound Operators">Sound Operators</option>
                    <option value="Light Operators">Light Operators</option>
                    <option value="Camera Operators">Camera Operators</option>
                    <option value="Security Guards">Security Guards</option>
                    <option value="Bouncers">Bouncers</option>
                    <option value="VIP Security">VIP Security</option>
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">City Wise</label>
                  <select
                    value={candidateCityFilter}
                    onChange={(e) => { setCandidateCityFilter(e.target.value); setCandidatePage(1); }}
                    className="w-full px-3 py-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience Wise</label>
                  <select
                    value={candidateExperienceFilter}
                    onChange={(e) => { setCandidateExperienceFilter(e.target.value); setCandidatePage(1); }}
                    className="w-full px-3 py-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                  >
                    <option value="">All Experiences</option>
                    <option value="Fresher">Fresher (No Experience)</option>
                    <option value="Under 1 Year">Under 1 Year</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Expert / Lead)</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sort By</label>
                  <div className="flex gap-1">
                    <select
                      value={candidateSortKey}
                      onChange={(e) => setCandidateSortKey(e.target.value as any)}
                      className="flex-grow px-3 py-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                    >
                      <option value="createdAt">Registration Date</option>
                      <option value="fullName">Full Name</option>
                      <option value="experience">Experience</option>
                    </select>
                    <button
                      onClick={() => setCandidateSortOrder(p => p === 'asc' ? 'desc' : 'asc')}
                      className="px-2 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 hover:bg-slate-900 active:scale-95 transition-all font-bold"
                    >
                      {candidateSortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold border-b border-slate-800 select-none">
                      <th className="p-4">Profile</th>
                      <th className="p-4">Candidate Name</th>
                      <th className="p-4">Contact Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location &amp; Info</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4 text-center">Docs</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {currentCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-500">
                          No candidates found matching the active criteria.
                        </td>
                      </tr>
                    ) : (
                      currentCandidates.map(c => (
                        <tr key={c._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-full border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center shrink-0">
                              {c.profilePhoto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={c.profilePhoto} 
                                  alt={c.fullName} 
                                  onClick={() => { setActiveSelfie(c.profilePhoto); setSelfieTitle(`Profile Photo: ${c.fullName}`); }}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                                />
                              ) : (
                                <Users className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-white">
                            {c.fullName}
                          </td>
                          <td className="p-4 text-xs text-slate-350">
                            <div>Mobile: <span className="text-white font-semibold">{c.mobileNumber}</span></div>
                            <div>WhatsApp: <a href={`https://wa.me/91${c.whatsAppNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">{c.whatsAppNumber}</a></div>
                            <div className="text-[10px] text-slate-500">{c.email}</div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase border border-slate-800 bg-slate-950 text-slate-400">
                              {c.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400">
                            <div>City: <span className="text-white font-semibold">{c.city}</span></div>
                            <div className="text-[10px] text-slate-500">{c.gender} • Age: {c.age}</div>
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-300">
                            {c.experience}
                          </td>
                          <td className="p-4 text-center">
                            {c.aadhaarPhoto ? (
                              <button
                                onClick={() => { setActiveSelfie(c.aadhaarPhoto); setSelfieTitle(`Aadhaar Card: ${c.fullName}`); }}
                                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs rounded-lg text-primary font-bold active:scale-95 transition-all"
                              >
                                Aadhaar
                              </button>
                            ) : (
                              <span className="text-slate-600 text-xs italic">Missing</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteCandidate(c._id)}
                              className="p-1.5 border border-red-900/40 bg-slate-950 rounded-lg hover:bg-red-950/20 transition-colors text-red-400 hover:text-red-300"
                              title="Delete Candidate Onboarding"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalCandidatePages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-850 bg-slate-950 text-xs font-bold text-slate-400">
                  <button
                    disabled={candidatePage === 1}
                    onClick={() => setCandidatePage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg disabled:opacity-40 transition-colors active:scale-95"
                  >
                    Previous
                  </button>
                  <span>Page {candidatePage} of {totalCandidatePages} ({filteredCandidates.length} Total)</span>
                  <button
                    disabled={candidatePage === totalCandidatePages}
                    onClick={() => setCandidatePage(p => Math.min(totalCandidatePages, p + 1))}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg disabled:opacity-40 transition-colors active:scale-95"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- 6. CONTACT REQUESTS TAB -------------------- */}
        {activeTab === 'contacts' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Search */}
            <div className="bg-slate-900/40 p-4 border border-slate-800 rounded-3xl glass-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-poppins font-bold text-lg text-white">Contact Form Submissions</h3>
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => { setContactSearch(e.target.value); setContactPage(1); }}
                  placeholder="Search inquiries..."
                  className="w-full px-3.5 py-2.5 border border-slate-850 rounded-xl text-xs text-white bg-slate-950 outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold border-b border-slate-800 select-none">
                      <th className="p-4">Sender Info</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Message Inquiry</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {currentContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500">
                          No contact form requests logged yet.
                        </td>
                      </tr>
                    ) : (
                      currentContacts.map(req => (
                        <tr key={req._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{req.name}</p>
                            <p className="text-xs text-slate-450">{req.email}</p>
                          </td>
                          <td className="p-4 text-xs font-semibold text-white">
                            {req.subject}
                          </td>
                          <td className="p-4 text-xs text-slate-400 max-w-md break-words">
                            {req.message}
                          </td>
                          <td className="p-4 text-xs text-slate-500 font-bold">
                            {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteContact(req._id)}
                              className="p-1.5 border border-red-900/40 bg-slate-950 rounded-lg hover:bg-red-950/20 transition-colors text-red-400 hover:text-red-300"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalContactPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-850 bg-slate-950 text-xs font-bold text-slate-400">
                  <button
                    disabled={contactPage === 1}
                    onClick={() => setContactPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg disabled:opacity-40 transition-colors active:scale-95"
                  >
                    Previous
                  </button>
                  <span>Page {contactPage} of {totalContactPages} ({filteredContacts.length} Total)</span>
                  <button
                    disabled={contactPage === totalContactPages}
                    onClick={() => setContactPage(p => Math.min(totalContactPages, p + 1))}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg disabled:opacity-40 transition-colors active:scale-95"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6 glass-card border-t-primary/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-xl text-white">
                {editingEvent ? `Edit Deployment: ${editingEvent.name}` : 'Create New Event Deployment'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white text-2xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-6">
              
              {/* Event Info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. YOYO Concert Ahmedabad"
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Red Events Ltd"
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Required Staff Count</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={requiredStaffCount}
                    onChange={(e) => setRequiredStaffCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="Wedding Hospitality Staff">Wedding Hospitality Staff</option>
                    <option value="Event Supervisors">Event Supervisors</option>
                    <option value="Hostess & Promoters">Hostess & Promoters</option>
                    <option value="Corporate Event Staff">Corporate Event Staff</option>
                    <option value="Technical Supervisors">Technical Supervisors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Taj Skyline, Ahmedabad"
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Staff Assignments Sub-Form */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="font-poppins font-bold text-base text-white">Assign Event Manpower Crew</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Name</label>
                    <input
                      type="text"
                      value={tempStaffName}
                      onChange={(e) => setTempStaffName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs text-white bg-slate-950 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Category</label>
                    <select
                      value={tempStaffCategory}
                      onChange={(e) => setTempStaffCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs text-white bg-slate-950 outline-none focus:border-primary"
                    >
                      <option value="Wedding Hospitality Staff">Wedding Hospitality Staff</option>
                      <option value="Event Supervisors">Event Supervisors</option>
                      <option value="Hostess & Promoters">Hostess & Promoters</option>
                      <option value="Corporate Event Staff">Corporate Event Staff</option>
                      <option value="Technical Supervisors">Technical Supervisors</option>
                    </select>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-grow">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={tempStaffMobile}
                        onChange={(e) => setTempStaffMobile(e.target.value)}
                        placeholder="e.g. +91 99999 88888"
                        className="w-full px-3 py-2 border border-slate-800 rounded-lg text-xs text-white bg-slate-950 outline-none focus:border-primary"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={addStaffToTempList}
                      className="px-3.5 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold shrink-0 transition-colors h-[34px] active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Assigned Staff List */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentStaffList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No crew assigned to this event deployment yet.</p>
                  ) : (
                    currentStaffList.map((staff, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-950/40 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-white">{staff.staffName}</span> 
                          <span className="text-slate-500 ml-1.5">({staff.category} • {staff.mobileNumber})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeStaffFromTempList(idx)}
                          className="text-red-400 hover:text-red-350 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  {editingEvent ? 'Save Changes' : 'Create & Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELFIE VIEW MODAL */}
      {activeSelfie && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative flex flex-col items-center space-y-4 glass-card border-t-primary/20">
            <div className="flex items-center justify-between border-b border-slate-805 pb-2 w-full">
              <h4 className="font-poppins font-bold text-sm text-white">{selfieTitle}</h4>
              <button onClick={() => setActiveSelfie(null)} className="text-slate-400 hover:text-white text-xl font-bold">
                &times;
              </button>
            </div>
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeSelfie} alt="Selfie Verification" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setActiveSelfie(null)}
              className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
