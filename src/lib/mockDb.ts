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
        name: 'Royal Wedding Reception Gala',
        date: '2026-06-15',
        time: '18:00',
        location: 'Taj Skyline, Ahmedabad',
        category: 'Wedding Staff',
        assignedStaff: [
          {
            _id: 'assign_1',
            staffName: 'Rahul Sharma',
            category: 'Wedding Staff',
            mobileNumber: '+91 99999 88888',
            userId: 'user_staff_1'
          }
        ],
        createdAt: new Date()
      },
      {
        _id: 'event_2',
        name: 'International Tech Summit 2026',
        date: '2026-06-18',
        time: '09:00',
        location: 'Exhibition Centre, Gandhinagar',
        category: 'Hospitality Staff',
        assignedStaff: [
          {
            _id: 'assign_2',
            staffName: 'Amit Patel',
            category: 'Hospitality Staff',
            mobileNumber: '+91 98888 77777',
            userId: 'user_staff_2',
            checkInTime: new Date('2026-06-05T09:05:00Z'),
            checkInLocation: '23.0225, 72.5714',
            checkInSelfie: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5CYII='
          }
        ],
        createdAt: new Date()
      },
      {
        _id: 'event_3',
        name: 'Annual Corporate Awards Night',
        date: '2026-06-01',
        time: '19:00',
        location: 'Karnavati Club, SG Highway',
        category: 'Security Staff',
        assignedStaff: [
          {
            _id: 'assign_3',
            staffName: 'Pooja Shah',
            category: 'Security Staff',
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
