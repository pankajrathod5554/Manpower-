import mongoose from 'mongoose';

// Legacy inquiry models (unchanged for backward compatibility)
const EmployerInquirySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventLocation: { type: String, required: true },
  staffCount: { type: Number, required: true },
  staffCategory: { type: String, required: true },
  details: { type: String },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Fulfilled', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const JobSeekerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  experience: { type: String, default: 'Fresher' },
  experienceYears: { type: String, default: '0' },
  position: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Interviewing', 'Approved', 'Rejected'], default: 'Applied' },
  createdAt: { type: Date, default: Date.now }
});

// Authentication and user model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['employer', 'worker', 'admin', 'superadmin', 'staff_manager'], default: 'worker' },
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Job posting model
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['technical', 'logistics', 'security', 'hospitality'], required: true },
  clientType: { type: String, enum: ['Wedding Planner', 'Hotel', 'Caterer', 'Event Company', 'Corporate'], required: true },
  location: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  durationHours: { type: Number, required: true },
  payRatePerHour: { type: Number, required: true },
  slots: { type: Number, required: true },
  filledSlots: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Job application model
const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['applied', 'approved', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
});

// Extended worker profile model
const WorkerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  experienceYears: { type: String, default: '0' },
  skills: [{ type: String }],
  rating: { type: Number, default: 5.0 },
  completedJobsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  prevEvents: [{ type: String }]
});

export const EmployerInquiry = (mongoose.models.EmployerInquiry || mongoose.model('EmployerInquiry', EmployerInquirySchema)) as mongoose.Model<any>;
export const JobSeeker = (mongoose.models.JobSeeker || mongoose.model('JobSeeker', JobSeekerSchema)) as mongoose.Model<any>;
export const User = (mongoose.models.User || mongoose.model('User', UserSchema)) as mongoose.Model<any>;
export const Job = (mongoose.models.Job || mongoose.model('Job', JobSchema)) as mongoose.Model<any>;
export const JobApplication = (mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema)) as mongoose.Model<any>;
export const WorkerProfile = (mongoose.models.WorkerProfile || mongoose.model('WorkerProfile', WorkerProfileSchema)) as mongoose.Model<any>;
