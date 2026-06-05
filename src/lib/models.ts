import mongoose from 'mongoose';

// User Schema (restricted to admin and staff roles)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Event Schema (incorporating staff assignments and attendance check-in/out records)
const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clientName: { type: String, required: true },
  requiredStaffCount: { type: Number, required: true, default: 1 },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:MM
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Wedding Hospitality Staff', 
      'Event Supervisors', 
      'Hostess & Promoters', 
      'Corporate Event Staff', 
      'Technical Supervisors'
    ], 
    required: true 
  },
  assignedStaff: [{
    staffName: { type: String, required: true },
    category: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Attendance Tracking
    checkInTime: { type: Date },
    checkInLocation: { type: String }, // Format: "latitude, longitude"
    checkInSelfie: { type: String },   // base64 image data
    
    checkOutTime: { type: Date },
    checkOutLocation: { type: String }, // Format: "latitude, longitude"
    checkOutSelfie: { type: String }    // base64 image data
  }],
  createdAt: { type: Date, default: Date.now }
});

// Booking Schema for client inquiries
const BookingSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventLocation: { type: String, required: true },
  staffCategory: { 
    type: String, 
    enum: [
      'Wedding Hospitality Staff', 
      'Event Supervisors', 
      'Hostess & Promoters', 
      'Corporate Event Staff', 
      'Technical Supervisors'
    ], 
    required: true 
  },
  staffCount: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const User = (mongoose.models.User || mongoose.model('User', UserSchema)) as mongoose.Model<any>;
export const Event = (mongoose.models.Event || mongoose.model('Event', EventSchema)) as mongoose.Model<any>;
export const Booking = (mongoose.models.Booking || mongoose.model('Booking', BookingSchema)) as mongoose.Model<any>;

// Export placeholders for deleted models to prevent compiler issues in unmodified files temporarily
export const Job = (mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}))) as mongoose.Model<any>;
export const JobApplication = (mongoose.models.JobApplication || mongoose.model('JobApplication', new mongoose.Schema({}))) as mongoose.Model<any>;
export const WorkerProfile = (mongoose.models.WorkerProfile || mongoose.model('WorkerProfile', new mongoose.Schema({}))) as mongoose.Model<any>;
export const EmployerInquiry = (mongoose.models.EmployerInquiry || mongoose.model('EmployerInquiry', new mongoose.Schema({}))) as mongoose.Model<any>;
export const JobSeeker = (mongoose.models.JobSeeker || mongoose.model('JobSeeker', new mongoose.Schema({}))) as mongoose.Model<any>;

