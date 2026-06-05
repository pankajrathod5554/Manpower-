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
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:MM
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Wedding Staff', 'Hospitality Staff', 'Security Staff', 'Technical Staff', 'Logistics Staff'], 
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

export const User = (mongoose.models.User || mongoose.model('User', UserSchema)) as mongoose.Model<any>;
export const Event = (mongoose.models.Event || mongoose.model('Event', EventSchema)) as mongoose.Model<any>;

// Export placeholders for deleted models to prevent compiler issues in unmodified files temporarily
export const Job = (mongoose.models.Job || mongoose.model('Job', new mongoose.Schema({}))) as mongoose.Model<any>;
export const JobApplication = (mongoose.models.JobApplication || mongoose.model('JobApplication', new mongoose.Schema({}))) as mongoose.Model<any>;
export const WorkerProfile = (mongoose.models.WorkerProfile || mongoose.model('WorkerProfile', new mongoose.Schema({}))) as mongoose.Model<any>;
export const EmployerInquiry = (mongoose.models.EmployerInquiry || mongoose.model('EmployerInquiry', new mongoose.Schema({}))) as mongoose.Model<any>;
export const JobSeeker = (mongoose.models.JobSeeker || mongoose.model('JobSeeker', new mongoose.Schema({}))) as mongoose.Model<any>;
