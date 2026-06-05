'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, CheckCircle2, AlertCircle, Camera, Upload, Send } from 'lucide-react';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Wedding Hospitality Staff',
  'Welcome Girls',
  'Welcome Boys',
  'Event Supervisors',
  'Hostess',
  'Promoters',
  'Corporate Event Staff',
  'Registration Executives',
  'Technical Supervisors',
  'Sound Operators',
  'Light Operators',
  'Camera Operators',
  'Security Guards',
  'Bouncers',
  'VIP Security'
];

export default function JoinTeamModal({ isOpen, onClose }: JoinTeamModalProps) {
  // Form input states
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [experience, setExperience] = useState('Fresher');
  const [aadhaarPhoto, setAadhaarPhoto] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [aadhaarFileName, setAadhaarFileName] = useState('');
  const [profileFileName, setProfileFileName] = useState('');

  if (!isOpen) return null;

  // File to base64 converter
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'aadhaar' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB to avoid mongo payload issues)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please select a file smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (fileType === 'aadhaar') {
          setAadhaarPhoto(reader.result);
          setAadhaarFileName(file.name);
        } else {
          setProfilePhoto(reader.result);
          setProfileFileName(file.name);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!aadhaarPhoto) {
      setErrorMsg('Please upload your Aadhaar Card photo.');
      setIsSubmitting(false);
      return;
    }
    if (!profilePhoto) {
      setErrorMsg('Please upload your Profile photo.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          whatsAppNumber,
          email,
          city,
          gender,
          age: Number(age),
          category,
          experience,
          aadhaarPhoto,
          profilePhoto
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit registration. Please check inputs.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello CrewConnect, I have registered as a candidate (Name: ${fullName}, Category: ${category}) and would like to join the team.`);
    window.open(`https://wa.me/919725705554?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:9725705554');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative space-y-6 glass-card border-t-primary/20 animate-fadeIn">
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold bg-slate-950/40 w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-slate-850 active:scale-90 transition-all"
        >
          &times;
        </button>

        {!showSuccess ? (
          <>
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-primary border border-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Manpower Onboarding
              </div>
              <h3 className="font-poppins text-2xl md:text-3xl font-black text-white tracking-tight">Join Our Premium Crew</h3>
              <p className="text-slate-400 text-xs mt-1">
                Register as a premium event staff candidate and get deployed at high-end venues, luxury weddings, and VIP events.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/35 text-red-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Core Information Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-slate-850 pb-1.5">1. Candidate Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Kumar Sharma"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10 digit number"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      placeholder="10 digit number"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@email.com"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ahmedabad"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="60"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 22"
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Profile Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-slate-850 pb-1.5">2. Staff Profile &amp; Experience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Skill Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience Level</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-800 rounded-xl text-xs text-white bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    >
                      <option value="Fresher">Fresher (No Experience)</option>
                      <option value="Under 1 Year">Under 1 Year</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="2-3 Years">2-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years (Expert / Lead)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Documents Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-slate-850 pb-1.5">3. Verification Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Aadhaar Photo */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 relative hover:border-primary/50 transition-colors">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-[10px] font-bold text-white">Upload Aadhaar Card (Front/Back)</span>
                    <span className="text-[9px] text-slate-500">Image format only (max 5MB)</span>
                    {aadhaarFileName && (
                      <span className="text-[9px] font-semibold text-green-400 block truncate max-w-full px-2">
                        Selected: {aadhaarFileName}
                      </span>
                    )}
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'aadhaar')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Profile Photo */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 relative hover:border-primary/50 transition-colors">
                    <Camera className="w-5 h-5 text-slate-500" />
                    <span className="text-[10px] font-bold text-white">Upload Profile Photo (Close-up)</span>
                    <span className="text-[9px] text-slate-500">Image format only (max 5MB)</span>
                    {profileFileName && (
                      <span className="text-[9px] font-semibold text-green-400 block truncate max-w-full px-2">
                        Selected: {profileFileName}
                      </span>
                    )}
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profile')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end border-t border-slate-850 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-40 transition-all"
                >
                  {isSubmitting ? 'Registering...' : 'Submit Registration'} <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          </>
        ) : (
          /* SUCCESS SCREEN */
          <div className="text-center py-8 px-4 space-y-6 flex flex-col items-center justify-center animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
            <div className="space-y-2">
              <h3 className="font-poppins text-3xl font-black text-white tracking-tight">Thank You For Registering</h3>
              <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
                We have received your details. Our team will contact you soon. Please connect with us directly on WhatsApp or call for faster verification.
              </p>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4 justify-center">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-green-650 hover:bg-green-700 text-white rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-950/20"
              >
                {/* Simple embedded WhatsApp Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-3.535l.393.233c1.524.905 3.284 1.382 5.083 1.383 5.485 0 9.948-4.464 9.952-9.95.002-2.656-1.03-5.153-2.905-7.03C17.203 3.228 14.71 2.196 12.015 2.196c-5.495 0-9.96 4.467-9.964 9.953-.001 1.887.498 3.73 1.442 5.361l.26.45-1.006 3.67 3.76-.986zm11.548-7.534c-.31-.156-1.834-.905-2.11-.1-.278.1-.482.4-.592.526-.11.127-.22.19-.53.033-.31-.157-1.309-.483-2.493-1.54-.922-.82-1.544-1.833-1.725-2.146-.18-.313-.02-.482.137-.638.14-.14.31-.362.465-.544.156-.18.208-.31.31-.517.105-.207.053-.388-.026-.544-.08-.156-.731-1.761-1.002-2.41-.264-.636-.53-.55-.731-.56-.19-.01-.408-.01-.622-.01-.214 0-.564.08-.86.4-.296.32-1.131 1.106-1.131 2.697 0 1.59 1.157 3.129 1.317 3.345.16.216 2.277 3.478 5.516 4.88 2.698 1.168 3.25 1.05 3.967.92.716-.13 1.833-.748 2.093-1.434.26-.687.26-1.277.182-1.433-.078-.156-.285-.25-.595-.406z"/>
                </svg>
                WhatsApp Us
              </button>
              <button 
                onClick={handleCall}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </button>
            </div>
            
            <button 
              onClick={() => { setShowSuccess(false); onClose(); }}
              className="px-4 py-2 text-slate-500 hover:text-slate-400 text-xs font-semibold underline underline-offset-4 pt-6"
            >
              Back to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
