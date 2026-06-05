'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, MapPin, Clock, Camera, Check, 
  AlertCircle, LayoutDashboard, Navigation, UserCheck, RefreshCw, Crown
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
  category: string;
  assignedStaff: AssignedStaff[];
}

export default function StaffDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [assignedEvents, setAssignedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Attendance Modal States
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [attendanceAction, setAttendanceAction] = useState<'checkin' | 'checkout'>('checkin');
  
  // Camera & Location Input States
  const [gpsLocation, setGpsLocation] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchStaffData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch user auth & verify role
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();
      
      if (!authData.success || authData.user.role !== 'staff') {
        router.push('/login');
        return;
      }
      setCurrentUser(authData.user);

      // 2. Fetch assigned events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setAssignedEvents(eventsData.data);
      } else {
        setErrorMsg(eventsData.error || 'Failed to load assigned events.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to sync staff dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // Geolocation trigger
  const requestLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      setGpsLocation('23.0225, 72.5714 (Mock Location - Geolocation not supported)');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setGpsLocation(`${lat}, ${lng}`);
        setGpsLoading(false);
      },
      (error) => {
        console.error('Geolocation Error:', error);
        // Fallback mock coordinates
        setGpsLocation('23.0225, 72.5714 (Mock Location - Permission Denied)');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // HTML5 Webcam Control
  const startCamera = async () => {
    setCameraActive(true);
    setCameraError(false);
    setCapturedSelfie(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setCapturedSelfie(base64);
        stopCamera();
      }
    }
  };

  const handleMockSelfieSelect = () => {
    const mockSelfie = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=';
    setCapturedSelfie(mockSelfie);
    setCameraActive(false);
  };

  const openAttendanceModal = (event: EventType, action: 'checkin' | 'checkout') => {
    setActiveEvent(event);
    setAttendanceAction(action);
    setCapturedSelfie(null);
    setGpsLocation('');
    setCameraActive(false);
    setCameraError(false);
    setShowAttendanceModal(true);
    
    setTimeout(() => {
      requestLocation();
      startCamera();
    }, 150);
  };

  const closeAttendanceModal = () => {
    stopCamera();
    setShowAttendanceModal(false);
    setActiveEvent(null);
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;

    if (!gpsLocation) {
      alert('Please wait for GPS coordinates to resolve.');
      return;
    }
    if (!capturedSelfie) {
      alert('A verified selfie photo is required to submit attendance.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${activeEvent._id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: attendanceAction,
          location: gpsLocation,
          selfie: capturedSelfie
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Attendance ${attendanceAction === 'checkin' ? 'Check-In' : 'Check-Out'} logged successfully!`);
        closeAttendanceModal();
        fetchStaffData();
      } else {
        alert(data.error || 'Failed to submit attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Connection error occurred while logging attendance.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-medium text-xs">Synchronizing staff dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-slate-950 text-white min-h-[90vh] relative overflow-hidden">
      {/* Glow Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-primary animate-pulse" /> Staff Deployment Console
            </div>
            <h1 className="font-poppins text-3xl font-black text-white tracking-tight">
              My Active Shifts
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Review your assigned luxury events, client details, and report on-site attendance.
            </p>
          </div>
          <button
            onClick={fetchStaffData}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-all active:scale-95 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Data
          </button>
        </header>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl text-xs">
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-950/40 border border-green-500/30 text-green-400 rounded-2xl text-xs font-bold">
            {successMsg}
          </div>
        )}

        {/* Assigned Events Panel */}
        <div className="space-y-4">
          <h3 className="font-poppins text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> My Assignments ({assignedEvents.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedEvents.length === 0 ? (
              <div className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 glass-card">
                You are not assigned to any events yet. Check with your Admin for deployment schedules.
              </div>
            ) : (
              assignedEvents.map((ev) => {
                const assignment = ev.assignedStaff?.find(s => 
                  s.userId === currentUser?._id || 
                  s.mobileNumber === currentUser?.mobileNumber
                );

                const hasCheckedIn = !!assignment?.checkInTime;
                const hasCheckedOut = !!assignment?.checkOutTime;

                return (
                  <div key={ev._id} className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-6 glass-card border-t-primary/5">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase border border-slate-800 bg-slate-950 text-slate-400">
                          {ev.category}
                        </span>
                        {hasCheckedIn && !hasCheckedOut && (
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" title="On-Duty" />
                        )}
                      </div>
                      
                      <h4 className="font-poppins text-xl font-bold text-white">{ev.name}</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-medium">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Client Name</span>
                          <span className="text-white font-bold">{ev.clientName || 'N/A'}</span>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Crew Needed</span>
                          <span className="text-white font-bold">{ev.requiredStaffCount || 1} Staff</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs text-slate-300 font-medium">
                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {ev.date}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {ev.time} Start</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {ev.location}</div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-4 space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Check-In Status:</span>
                        {hasCheckedIn ? (
                          <span className="text-green-500 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" /> Checked-In</span>
                        ) : (
                          <span className="text-slate-500 italic">Pending</span>
                        )}
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider border-b border-slate-805 pb-2">
                        <span className="text-slate-500">Check-Out Status:</span>
                        {hasCheckedOut ? (
                          <span className="text-green-500 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" /> Checked-Out</span>
                        ) : (
                          <span className="text-slate-500 italic">Pending</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          disabled={hasCheckedIn}
                          onClick={() => openAttendanceModal(ev, 'checkin')}
                          className="bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Check In
                        </button>
                        <button
                          disabled={!hasCheckedIn || hasCheckedOut}
                          onClick={() => openAttendanceModal(ev, 'checkout')}
                          className="bg-slate-950 hover:bg-slate-900 text-white py-3 rounded-xl border border-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" /> Check Out
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ATTENDANCE CAPTURE MODAL */}
      {showAttendanceModal && activeEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5 glass-card border-t-primary/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary animate-pulse" /> 
                {attendanceAction === 'checkin' ? 'Check-In Verification' : 'Check-Out Verification'}
              </h3>
              <button onClick={closeAttendanceModal} className="text-slate-400 hover:text-white text-xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              
              {/* Event Info Header */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 text-xs">
                <p className="font-bold text-white">{activeEvent.name}</p>
                <p className="text-slate-400 mt-1">{activeEvent.location}</p>
              </div>

              {/* Webcam Video Container */}
              <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
                {cameraActive && !capturedSelfie && (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {capturedSelfie && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={capturedSelfie} alt="Captured Selfie" className="w-full h-full object-cover" />
                )}

                {!cameraActive && !capturedSelfie && (
                  <div className="text-center p-4">
                    {cameraError ? (
                      <div className="space-y-2">
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
                        <p className="text-xs font-bold text-red-400">Webcam blocked or unavailable.</p>
                        <button 
                          type="button" 
                          onClick={handleMockSelfieSelect}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-xl text-[10px] font-bold transition-all active:scale-95"
                        >
                          Use Mock Verification
                        </button>
                      </div>
                    ) : (
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    )}
                  </div>
                )}

                {cameraActive && !capturedSelfie && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    Capture Selfie
                  </button>
                )}

                {capturedSelfie && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="absolute bottom-3 bg-slate-900/90 hover:bg-slate-950 border border-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    Retake Photo
                  </button>
                )}
              </div>

              {/* Hidden Canvas helper */}
              <canvas ref={canvasRef} className="hidden" />

              {/* GPS Coordinates Section */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Satellite GPS Coordinates
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-grow relative">
                    <Navigation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="text"
                      readOnly
                      required
                      value={gpsLocation}
                      placeholder="Resolving GPS Telemetry..."
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-800 rounded-xl text-xs bg-slate-950 text-white focus:outline-none font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={gpsLoading}
                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold shrink-0 transition-colors h-[38px] flex items-center justify-center"
                    title="Refresh GPS"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-300 ${gpsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={closeAttendanceModal}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-350 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
                >
                  Submit Attendance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
