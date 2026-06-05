import bcrypt from 'bcryptjs';

// Declare global properties for TypeScript compiler
declare global {
  var mockDatabase: any;
  var useMockDb: boolean | undefined;
}

if (!global.mockDatabase) {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);
  
  global.mockDatabase = {
    users: [
      {
        _id: 'user_employer_1',
        email: 'employer@crewconnect.com',
        passwordHash,
        role: 'employer',
        fullName: 'John Planners (Elite Weddings)',
        mobileNumber: '+91 98765 43210',
        createdAt: new Date()
      },
      {
        _id: 'user_worker_1',
        email: 'worker@crewconnect.com',
        passwordHash,
        role: 'worker',
        fullName: 'Rahul Sharma (VIP Staff)',
        mobileNumber: '+91 99999 88888',
        createdAt: new Date()
      },
      {
        _id: 'user_admin_1',
        email: 'admin@crewconnect.com',
        passwordHash,
        role: 'admin',
        fullName: 'CrewConnect Admin System',
        mobileNumber: '+91 90000 11111',
        createdAt: new Date()
      },
      {
        _id: 'user_superadmin_1',
        email: 'superadmin@crewconnect.com',
        passwordHash,
        role: 'superadmin',
        fullName: 'System Super Admin',
        mobileNumber: '+91 99999 00000',
        createdAt: new Date()
      },
      {
        _id: 'user_manager_1',
        email: 'manager@crewconnect.com',
        passwordHash,
        role: 'staff_manager',
        fullName: 'Staff Manager (Operations)',
        mobileNumber: '+91 98888 77777',
        createdAt: new Date()
      }
    ],
    workerProfiles: [
      {
        _id: 'profile_worker_1',
        userId: 'user_worker_1',
        bio: 'Polished front-desk coordinator and billing supervisor with 4+ years of wedding hospitality experience.',
        experienceYears: '4',
        skills: ['Reception', 'Billing', 'Guest Relations', 'Fluent English', 'QR Ticketing'],
        rating: 4.9,
        completedJobsCount: 14,
        isVerified: true,
        prevEvents: ['MEB Energy Summit 2025', 'Ultra Luxe Wedding Ahmedabad 2026']
      }
    ],
    jobs: [
      {
        _id: 'job_1',
        title: 'VIP Banquet Hostess / Coordinator',
        description: 'We need 5 polished, bilingual hostesses for checking in high-profile VIP guests at a luxury wedding reception. Black business formal dress required.',
        category: 'hospitality',
        clientType: 'Wedding Planner',
        location: 'Taj Skyline, Ahmedabad',
        date: '2026-06-15',
        durationHours: 8,
        payRatePerHour: 300,
        slots: 5,
        filledSlots: 1,
        status: 'open',
        createdBy: 'user_employer_1',
        createdAt: new Date()
      },
      {
        _id: 'job_2',
        title: 'Bouncer / VIP Security Crew',
        description: 'Elite bouncer deployment for concert crowd security and green room protection. Must be physically fit (min height 6ft) with black security polo dress code.',
        category: 'security',
        clientType: 'Event Company',
        location: 'Karnavati Club, SG Highway',
        date: '2026-06-18',
        durationHours: 6,
        payRatePerHour: 400,
        slots: 8,
        filledSlots: 0,
        status: 'open',
        createdBy: 'user_employer_1',
        createdAt: new Date()
      },
      {
        _id: 'job_3',
        title: 'Staging & AV Light Setup Technicians',
        description: 'Stage lighting setup technicians needed for overnight corporate stage assembly. Electrician certification or sound engineering background preferred.',
        category: 'technical',
        clientType: 'Corporate',
        location: 'Exhibition Centre, Gandhinagar',
        date: '2026-06-20',
        durationHours: 10,
        payRatePerHour: 350,
        slots: 3,
        filledSlots: 0,
        status: 'open',
        createdBy: 'user_employer_1',
        createdAt: new Date()
      }
    ],
    applications: [
      {
        _id: 'app_1',
        jobId: 'job_1',
        workerId: 'user_worker_1',
        status: 'applied',
        appliedAt: new Date()
      }
    ],
    employerInquiries: [
      {
        _id: 'inq_1',
        companyName: 'Corporate Gala Inc.',
        contactPerson: 'Siddharth Mehta',
        mobileNumber: '+91 95555 12345',
        email: 'sid@corporategala.com',
        eventName: 'Annual Tech Summit 2026',
        eventDate: '2026-07-10',
        eventLocation: 'Exhibition Hall, Ahmedabad',
        staffCount: 15,
        staffCategory: 'Hospitality',
        details: 'Need hosts for reception registrations desk.',
        status: 'Pending',
        createdAt: new Date()
      }
    ],
    jobSeekers: [
      {
        _id: 'seeker_1',
        fullName: 'Amit Patel',
        mobileNumber: '+91 97777 55555',
        email: 'amit@gmail.com',
        dob: '2001-08-12',
        gender: 'Male',
        experience: 'Experienced',
        experienceYears: '2',
        position: 'Hospitality Usher',
        status: 'Applied',
        createdAt: new Date()
      }
    ]
  };
}

export const mockDb = global.mockDatabase;
