import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Job, JobApplication, WorkerProfile } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const userId = user.id || user._id;

      if (user.role === 'worker') {
        const workerApps = mockDb.applications.filter((app: any) => app.workerId === userId);
        const enriched = workerApps.map((app: any) => {
          const job = mockDb.jobs.find((j: any) => j._id === app.jobId);
          let populatedJob = null;
          if (job) {
            const creator = mockDb.users.find((u: any) => u._id === job.createdBy);
            populatedJob = {
              ...job,
              createdBy: creator ? { fullName: creator.fullName, email: creator.email, mobileNumber: creator.mobileNumber } : null
            };
          }
          return {
            ...app,
            jobId: populatedJob
          };
        });
        return NextResponse.json({ success: true, data: enriched });
      } else if (user.role === 'employer') {
        const employerJobs = mockDb.jobs.filter((j: any) => j.createdBy === userId);
        const jobIds = employerJobs.map((j: any) => j._id);
        const apps = mockDb.applications.filter((app: any) => jobIds.includes(app.jobId));

        const enriched = apps.map((app: any) => {
          const job = employerJobs.find((j: any) => j._id === app.jobId);
          const workerUser = mockDb.users.find((u: any) => u._id === app.workerId);
          const workerProfile = mockDb.workerProfiles.find((p: any) => p.userId === app.workerId);
          return {
            ...app,
            jobId: job || null,
            workerId: workerUser ? { _id: workerUser._id, fullName: workerUser.fullName, email: workerUser.email, mobileNumber: workerUser.mobileNumber } : null,
            workerProfile: workerProfile || null
          };
        });
        return NextResponse.json({ success: true, data: enriched });
      } else if (user.role === 'admin') {
        const enriched = mockDb.applications.map((app: any) => {
          const job = mockDb.jobs.find((j: any) => j._id === app.jobId);
          const workerUser = mockDb.users.find((u: any) => u._id === app.workerId);
          return {
            ...app,
            jobId: job || null,
            workerId: workerUser ? { _id: workerUser._id, fullName: workerUser.fullName, email: workerUser.email, mobileNumber: workerUser.mobileNumber } : null
          };
        });
        return NextResponse.json({ success: true, data: enriched });
      }
    }

    if (user.role === 'worker') {
      // Find applications submitted by this worker
      const applications = await JobApplication.find({ workerId: user._id })
        .populate({
          path: 'jobId',
          populate: { path: 'createdBy', select: 'fullName email mobileNumber' }
        })
        .sort({ appliedAt: -1 });

      return NextResponse.json({ success: true, data: applications });
    } else if (user.role === 'employer') {
      // Find jobs created by this employer
      const employerJobs = await Job.find({ createdBy: user._id });
      const jobIds = employerJobs.map(job => job._id);

      // Find applications for these jobs
      const applications = await JobApplication.find({ jobId: { $in: jobIds } })
        .populate('jobId')
        .populate({
          path: 'workerId',
          select: 'fullName email mobileNumber'
        })
        .sort({ appliedAt: -1 });

      // Fetch worker profiles for additional info (rating, experience, skills)
      const workerIds = applications.map(app => app.workerId._id);
      const profiles = await WorkerProfile.find({ userId: { $in: workerIds } });
      
      const enrichedApplications = applications.map(app => {
        const profile = profiles.find(p => p.userId.toString() === app.workerId._id.toString());
        return {
          ...app.toObject(),
          workerProfile: profile || null
        };
      });

      return NextResponse.json({ success: true, data: enrichedApplications });
    } else if (user.role === 'admin') {
      // Admin gets all applications
      const applications = await JobApplication.find({})
        .populate('jobId')
        .populate('workerId', 'fullName email mobileNumber')
        .sort({ appliedAt: -1 });
      return NextResponse.json({ success: true, data: applications });
    }

    return NextResponse.json({ success: false, error: 'Invalid user role' }, { status: 400 });
  } catch (error: any) {
    console.error('GET Applications Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    if (user.role !== 'worker') {
      return NextResponse.json({ success: false, error: 'Only workers can apply for jobs.' }, { status: 403 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const { jobId } = await req.json();
      if (!jobId) {
        return NextResponse.json({ success: false, error: 'Job ID is required.' }, { status: 400 });
      }
      const job = mockDb.jobs.find((j: any) => j._id === jobId);
      if (!job) {
        return NextResponse.json({ success: false, error: 'Job not found.' }, { status: 404 });
      }
      if (job.status !== 'open') {
        return NextResponse.json({ success: false, error: 'This job is already filled or closed.' }, { status: 400 });
      }
      const userId = user.id || user._id;
      const alreadyApplied = mockDb.applications.some((app: any) => app.jobId === jobId && app.workerId === userId);
      if (alreadyApplied) {
        return NextResponse.json({ success: false, error: 'You have already applied for this job.' }, { status: 400 });
      }
      const newApp = {
        _id: 'app_' + Math.random().toString(36).substring(2, 9),
        jobId,
        workerId: userId,
        status: 'applied',
        appliedAt: new Date()
      };
      mockDb.applications.push(newApp);
      return NextResponse.json({ success: true, data: newApp }, { status: 201 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required.' }, { status: 400 });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found.' }, { status: 404 });
    }

    if (job.status !== 'open') {
      return NextResponse.json({ success: false, error: 'This job is already filled or closed.' }, { status: 400 });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({ jobId, workerId: user._id });
    if (existingApplication) {
      return NextResponse.json({ success: false, error: 'You have already applied for this job.' }, { status: 400 });
    }

    const application = await JobApplication.create({
      jobId,
      workerId: user._id,
      status: 'applied'
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error: any) {
    console.error('POST Application Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please login.' }, { status: 401 });
    }

    if (global.useMockDb) {
      const { mockDb } = require('@/lib/mockDb');
      const { applicationId, status } = await req.json();
      if (!applicationId || !status) {
        return NextResponse.json({ success: false, error: 'Application ID and status are required.' }, { status: 400 });
      }
      if (!['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status update.' }, { status: 400 });
      }
      const application = mockDb.applications.find((app: any) => app._id === applicationId);
      if (!application) {
        return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
      }
      const job = mockDb.jobs.find((j: any) => j._id === application.jobId);
      if (!job) {
        return NextResponse.json({ success: false, error: 'Associated Job not found.' }, { status: 404 });
      }

      const userId = user.id || user._id;
      if (job.createdBy !== userId && user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized to update this application.' }, { status: 403 });
      }

      if (application.status === 'approved' && status === 'approved') {
        return NextResponse.json({ success: false, error: 'Application is already approved.' }, { status: 400 });
      }

      application.status = status;

      if (status === 'approved') {
        job.filledSlots += 1;
        if (job.filledSlots >= job.slots) {
          job.status = 'closed';
        }
        const profile = mockDb.workerProfiles.find((p: any) => p.userId === application.workerId);
        if (profile) {
          profile.completedJobsCount += 1;
        }
      }

      return NextResponse.json({ success: true, data: application });
    }

    const { applicationId, status } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json({ success: false, error: 'Application ID and status are required.' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status update.' }, { status: 400 });
    }

    // Find the application
    const application = await JobApplication.findById(applicationId).populate('jobId');
    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
    }

    const job = application.jobId as any;

    // Enforce that only the employer who created the job (or admin) can update application status
    if (job.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized to update this application.' }, { status: 403 });
    }

    // Check if status is already approved/rejected
    if (application.status === 'approved' && status === 'approved') {
      return NextResponse.json({ success: false, error: 'Application is already approved.' }, { status: 400 });
    }

    // Update status
    application.status = status;
    await application.save();

    // If approved, update job slots
    if (status === 'approved') {
      job.filledSlots += 1;
      if (job.filledSlots >= job.slots) {
        job.status = 'closed';
      }
      await job.save();

      // Increment completed count for worker profile
      await WorkerProfile.findOneAndUpdate(
        { userId: application.workerId },
        { $inc: { completedJobsCount: 1 } }
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    console.error('PUT Application Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
