'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Users, FileText, Check, X, RefreshCw, 
  Trash2, Edit, Plus, Calendar, MapPin, Clock, Camera, 
  AlertCircle, LayoutDashboard, SlidersHorizontal, Eye, Navigation 
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
  date: string;
  time: string;
  location: string;
  category: 'Wedding Staff' | 'Hospitality Staff' | 'Security Staff' | 'Technical Staff' | 'Logistics Staff';
  assignedStaff: AssignedStaff[];
  createdAt?: string;
}

interface UserType {
  _id: string;
  email: string;
  role: 'admin' | 'staff';
  fullName: string;
  mobileNumber: string;
}

export default function AdminConsole() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'attendance'>('overview');

  // Modal / Form States
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  
  // Event Form Inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'Wedding Staff' | 'Hospitality Staff' | 'Security Staff' | 'Technical Staff' | 'Logistics Staff'>('Wedding Staff');
  
  // Staff Assigner Subform Inputs
  const [tempStaffName, setTempStaffName] = useState('');
  const [tempStaffCategory, setTempStaffCategory] = useState('Wedding Staff');
  const [tempStaffMobile, setTempStaffMobile] = useState('');
  const [currentStaffList, setCurrentStaffList] = useState<AssignedStaff[]>([]);

  // Selfie Modal State
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
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setEventCategory('Wedding Staff');
    setCurrentStaffList([]);
    setTempStaffName('');
    setTempStaffCategory('Wedding Staff');
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

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading Control Console...</p>
      </div>
    );
  }

  // Statistics Calculations
  const totalEventsCount = events.length;
  const todayStr = new Date().toISOString().split('T')[0];
  
  const upcomingEvents = events.filter(e => e.date > todayStr);
  const activeEvents = events.filter(e => e.date === todayStr);
  const completedEvents = events.filter(e => e.date < todayStr);

  const totalAssignedStaff = events.reduce((sum, ev) => sum + (ev.assignedStaff?.length || 0), 0);

  // Flat list of check-ins/outs for attendance tracking tab
  const attendanceLogs: any[] = [];
  events.forEach(ev => {
    ev.assignedStaff?.forEach(staff => {
      if (staff.checkInTime || staff.checkOutTime) {
        attendanceLogs.push({
          eventId: ev._id,
          eventName: ev.name,
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
    <div className="py-12 md:py-16 px-4 md:px-8 bg-slate-50 min-h-[90vh]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-slate-350 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Admin Control Console
            </div>
            <h1 className="font-poppins text-3xl font-black text-slate-900 tracking-tight">Deployment Command Center</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Deploy event staff across wedding, hospitality, security, logistics, and technical verticals and monitor on-site attendance logs.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchSessionAndData} 
              className="flex items-center gap-2 px-4 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold active:scale-95 transition-all text-slate-700 shadow-sm rounded-xl"
            >
              <RefreshCw className="w-4 h-4" /> Refresh System
            </button>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold active:scale-95 transition-all shadow-md rounded-xl"
            >
              <Plus className="w-4 h-4" /> Create &amp; Deploy Event
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="p-4 bg-yellow-50 border border-yellow-250 text-yellow-800 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-750" />
            <div>
              <p className="font-bold">Database Status Warning:</p>
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
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-905'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview Analytics
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-905'}`}
          >
            <FileText className="w-4 h-4" /> Manage Events ({totalEventsCount})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 shrink-0 ${activeTab === 'attendance' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-905'}`}
          >
            <Users className="w-4 h-4" /> Live Attendance Board ({attendanceLogs.length})
          </button>
        </div>

        {/* -------------------- 1. OVERVIEW TAB -------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</p>
                <h3 className="font-poppins text-3xl font-black text-slate-905 mt-1">{totalEventsCount}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
                <h3 className="font-poppins text-3xl font-black text-slate-905 mt-1">{upcomingEvents.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium border-l-primary/30">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Events (Today)</p>
                <h3 className="font-poppins text-3xl font-black text-primary mt-1">{activeEvents.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Events</p>
                <h3 className="font-poppins text-3xl font-black text-slate-905 mt-1">{completedEvents.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Staff</p>
                <h3 className="font-poppins text-3xl font-black text-slate-905 mt-1">{totalAssignedStaff} Crew</h3>
              </div>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event categories chart representation */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-4">
                <h3 className="font-poppins font-bold text-lg text-slate-900">Manpower Allocations by Vertical</h3>
                <div className="space-y-4 pt-4">
                  {['Wedding Staff', 'Hospitality Staff', 'Security Staff', 'Technical Staff', 'Logistics Staff'].map(cat => {
                    const allocatedCount = events
                      .filter(e => e.category === cat)
                      .reduce((sum, ev) => sum + (ev.assignedStaff?.length || 0), 0);
                    const percentage = totalAssignedStaff > 0 ? (allocatedCount / totalAssignedStaff) * 100 : 0;

                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-700">{cat}</span>
                          <span className="text-slate-500">{allocatedCount} Assigned ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-550" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active check-in feed quick view */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-4">
                <h3 className="font-poppins font-bold text-lg text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-primary" /> Live Check-Ins
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {attendanceLogs.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-8">No attendance records submitted yet today.</p>
                  ) : (
                    attendanceLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="text-xs border-b border-slate-100 last:border-0 pb-3 last:pb-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{log.staffName}</span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          Checked-In at <span className="font-semibold text-slate-700">{log.eventName}</span>
                        </p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border bg-green-50 text-green-700 border-green-200">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold select-none">
                      <th className="p-4">Event Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Location</th>
                      <th className="p-4 text-center">Staff Count</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400">
                          No events have been created yet. Click "Create &amp; Deploy Event" above to create one.
                        </td>
                      </tr>
                    ) : (
                      events.map(ev => (
                        <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-905">{ev.name}</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full uppercase border border-slate-200 bg-slate-50 text-slate-700">
                              {ev.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-650">
                            <div className="font-bold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ev.date}</div>
                            <div className="flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" /> {ev.time}</div>
                          </td>
                          <td className="p-4 text-xs text-slate-650 font-medium max-w-xs truncate">
                            <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location}</div>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-700">{ev.assignedStaff?.length || 0} assigned</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button 
                                onClick={() => openEditModal(ev)}
                                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-650 hover:text-slate-900"
                                title="Edit Event &amp; Assignments"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteEvent(ev._id)}
                                className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-500 hover:text-red-700"
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

        {/* -------------------- 3. LIVE ATTENDANCE BOARD TAB -------------------- */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white font-poppins font-semibold select-none">
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Deploy Event</th>
                      <th className="p-4">Check-In Details</th>
                      <th className="p-4">Check-Out Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400">
                          No staff attendance check-ins or check-outs have been logged yet.
                        </td>
                      </tr>
                    ) : (
                      attendanceLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-905">{log.staffName}</p>
                            <p className="text-xs text-slate-450">{log.category} • {log.mobileNumber}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{log.eventName}</p>
                            <p className="text-xs text-slate-450 flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {log.eventLocation}</p>
                          </td>
                          <td className="p-4 text-xs">
                            {log.checkInTime ? (
                              <div className="space-y-1">
                                <p className="text-slate-700 font-bold flex items-center gap-1">
                                  <Check className="w-4 h-4 text-green-500" /> Checked-In
                                </p>
                                <p className="text-slate-500">{new Date(log.checkInTime).toLocaleString()}</p>
                                <div className="flex gap-2 mt-1">
                                  {log.checkInLocation && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${log.checkInLocation}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                    >
                                      <Navigation className="w-2.5 h-2.5" /> Map Location
                                    </a>
                                  )}
                                  {log.checkInSelfie && (
                                    <button 
                                      onClick={() => { setActiveSelfie(log.checkInSelfie); setSelfieTitle(`Check-In Selfie: ${log.staffName}`); }}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                    >
                                      <Camera className="w-2.5 h-2.5" /> View Selfie
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium italic">Pending Check-In</span>
                            )}
                          </td>
                          <td className="p-4 text-xs">
                            {log.checkOutTime ? (
                              <div className="space-y-1">
                                <p className="text-slate-700 font-bold flex items-center gap-1">
                                  <Check className="w-4 h-4 text-green-500" /> Checked-Out
                                </p>
                                <p className="text-slate-500">{new Date(log.checkOutTime).toLocaleString()}</p>
                                <div className="flex gap-2 mt-1">
                                  {log.checkOutLocation && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${log.checkOutLocation}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                    >
                                      <Navigation className="w-2.5 h-2.5" /> Map Location
                                    </a>
                                  )}
                                  {log.checkOutSelfie && (
                                    <button 
                                      onClick={() => { setActiveSelfie(log.checkOutSelfie); setSelfieTitle(`Check-Out Selfie: ${log.staffName}`); }}
                                      className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                    >
                                      <Camera className="w-2.5 h-2.5" /> View Selfie
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium italic">Pending Check-Out</span>
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

      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-bold text-xl text-slate-900">
                {editingEvent ? `Edit Deployment: ${editingEvent.name}` : 'Create New Event Deployment'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-6">
              
              {/* Event Info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Royal Wedding Reception Gala"
                    className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm text-slate-900 bg-white"
                  >
                    <option value="Wedding Staff">Wedding Staff</option>
                    <option value="Hospitality Staff">Hospitality Staff</option>
                    <option value="Security Staff">Security Staff</option>
                    <option value="Technical Staff">Technical Staff</option>
                    <option value="Logistics Staff">Logistics Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Taj Skyline, Ahmedabad"
                    className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Staff Assignments Sub-Form */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="font-poppins font-bold text-base text-slate-800">Assign Event Manpower Crew</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Name</label>
                    <input
                      type="text"
                      value={tempStaffName}
                      onChange={(e) => setTempStaffName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Staff Category</label>
                    <select
                      value={tempStaffCategory}
                      onChange={(e) => setTempStaffCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                    >
                      <option value="Wedding Staff">Wedding Staff</option>
                      <option value="Hospitality Staff">Hospitality Staff</option>
                      <option value="Security Staff">Security Staff</option>
                      <option value="Technical Staff">Technical Staff</option>
                      <option value="Logistics Staff">Logistics Staff</option>
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
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={addStaffToTempList}
                      className="px-3.5 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold shrink-0 transition-colors h-[34px]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Assigned Staff List */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentStaffList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No crew assigned to this event deployment yet.</p>
                  ) : (
                    currentStaffList.map((staff, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{staff.staffName}</span> 
                          <span className="text-slate-400 ml-1.5">({staff.category} • {staff.mobileNumber})</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeStaffFromTempList(idx)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-905 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-250 max-w-sm w-full shadow-2xl relative flex flex-col items-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-2 w-full">
              <h4 className="font-poppins font-bold text-sm text-slate-900">{selfieTitle}</h4>
              <button onClick={() => setActiveSelfie(null)} className="text-slate-400 hover:text-slate-650 text-xl font-bold">
                &times;
              </button>
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeSelfie} alt="Selfie Verification" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setActiveSelfie(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
