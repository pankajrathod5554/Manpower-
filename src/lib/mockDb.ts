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
        _id: 'user_admin_1',
        email: 'admin@crewconnect.com',
        passwordHash,
        role: 'admin',
        fullName: 'System Admin',
        mobileNumber: '+91 90000 11111',
        createdAt: new Date()
      },
      {
        _id: 'user_staff_1',
        email: 'staff@crewconnect.com',
        passwordHash,
        role: 'staff',
        fullName: 'Rahul Sharma',
        mobileNumber: '+91 99999 88888',
        createdAt: new Date()
      },
      {
        _id: 'user_staff_2',
        email: 'staff2@crewconnect.com',
        passwordHash,
        role: 'staff',
        fullName: 'Amit Patel',
        mobileNumber: '+91 98888 77777',
        createdAt: new Date()
      },
      {
        _id: 'user_staff_3',
        email: 'staff3@crewconnect.com',
        passwordHash,
        role: 'staff',
        fullName: 'Pooja Shah',
        mobileNumber: '+91 97777 55555',
        createdAt: new Date()
      }
    ],
    events: [
      {
        _id: 'event_1',
        name: 'Ambani Wedding Reception',
        clientName: 'Elite Planners',
        requiredStaffCount: 12,
        date: '2026-06-15',
        time: '18:00',
        location: 'Taj Skyline, Ahmedabad',
        category: 'Wedding Hospitality Staff',
        assignedStaff: [
          {
            _id: 'assign_1',
            staffName: 'Rahul Sharma',
            category: 'Wedding Hospitality Staff',
            mobileNumber: '+91 99999 88888',
            userId: 'user_staff_1'
          }
        ],
        createdAt: new Date()
      },
      {
        _id: 'event_2',
        name: 'YOYO Concert Ahmedabad',
        clientName: 'Red Events Ltd',
        requiredStaffCount: 5,
        date: '2026-06-18',
        time: '19:00',
        location: 'Exhibition Centre, Gandhinagar',
        category: 'Technical Supervisors',
        assignedStaff: [
          {
            _id: 'assign_2',
            staffName: 'Amit Patel',
            category: 'Technical Supervisors',
            mobileNumber: '+91 98888 77777',
            userId: 'user_staff_2',
            checkInTime: new Date('2026-06-05T19:05:00Z'),
            checkInLocation: '23.0225, 72.5714',
            checkInSelfie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII='
          }
        ],
        createdAt: new Date()
      },
      {
        _id: 'event_3',
        name: 'Annual Corporate Awards Night',
        clientName: 'Tata Group',
        requiredStaffCount: 8,
        date: '2026-06-01',
        time: '19:00',
        location: 'Karnavati Club, SG Highway',
        category: 'Corporate Event Staff',
        assignedStaff: [
          {
            _id: 'assign_3',
            staffName: 'Pooja Shah',
            category: 'Corporate Event Staff',
            mobileNumber: '+91 97777 55555',
            userId: 'user_staff_3',
            checkInTime: new Date('2026-06-01T18:45:00Z'),
            checkInLocation: '23.0225, 72.5714',
            checkInSelfie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=',
            checkOutTime: new Date('2026-06-02T02:15:00Z'),
            checkOutLocation: '23.0226, 72.5715',
            checkOutSelfie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII='
          }
        ],
        createdAt: new Date()
      }
    ],
    bookings: [
      {
        _id: 'booking_1',
        companyName: 'Genesis Corporate Solutions',
        contactPerson: 'Vikram Malhotra',
        mobileNumber: '+91 98989 12345',
        email: 'vikram@genesis.in',
        eventName: 'Tech Innovation Summit 2026',
        eventDate: '2026-06-25',
        eventLocation: 'GIFT City Club, Gandhinagar',
        staffCategory: 'Corporate Event Staff',
        staffCount: 6,
        notes: 'Need fluent English speakers and concierge experience.',
        createdAt: new Date()
      }
    ],
    candidates: [
      {
        _id: 'candidate_1',
        fullName: 'Karan Malhotra',
        mobileNumber: '9725705554',
        whatsAppNumber: '9725705554',
        email: 'karan.m@gmail.com',
        city: 'Ahmedabad',
        gender: 'Male',
        age: 24,
        category: 'Event Supervisors',
        experience: '2 Years',
        aadhaarPhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=',
        profilePhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=',
        createdAt: new Date()
      },
      {
        _id: 'candidate_2',
        fullName: 'Sneha Patel',
        mobileNumber: '9898989898',
        whatsAppNumber: '9898989898',
        email: 'sneha.patel@yahoo.com',
        city: 'Baroda',
        gender: 'Female',
        age: 22,
        category: 'Welcome Girls',
        experience: '1 Year',
        aadhaarPhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=',
        profilePhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII=',
        createdAt: new Date()
      }
    ],
    contactRequests: [
      {
        _id: 'contact_1',
        name: 'Rajesh Mehta',
        email: 'rajesh@mehtaplanners.com',
        subject: 'Manpower requirement for corporate launch',
        message: 'We are looking for 15 registration executives and 5 coordinators for an upcoming launch in Ahmedabad. Please send us your quotation.',
        createdAt: new Date()
      }
    ],
    // Legacy placeholders to prevent failures in unmodified code
    jobs: [],
    applications: [],
    employerInquiries: [],
    jobSeekers: [],
    workerProfiles: []
  };
}

export const mockDb = global.mockDatabase;
export const useMockDb = global.useMockDb;


