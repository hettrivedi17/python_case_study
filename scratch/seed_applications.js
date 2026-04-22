const mongoose = require('mongoose');
const User = require('../server/models/User');
const Job = require('../server/models/Job');
const Application = require('../server/models/Application');
require('dotenv').config({ path: '../server/.env' });

const seedApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const students = await User.find({ role: 'student' });
    const jobListings = await Job.find({ jobType: 'Full-time' });
    const internshipListings = await Job.find({ jobType: 'Internship' });

    console.log(`Found ${students.length} students, ${jobListings.length} jobs, ${internshipListings.length} internships`);

    // Clear existing applications to avoid duplicates for this specific task
    await Application.deleteMany({});
    console.log('Cleared existing applications');

    const applications = [];

    // Add 5 records for Job applications
    for (let i = 0; i < 5; i++) {
      applications.push({
        studentId: students[i % students.length]._id,
        jobId: jobListings[i % jobListings.length]._id,
        resume: 'uploads/sample_resume.pdf',
        status: 'Pending'
      });
    }

    // Add 5 records for Internship applications
    for (let i = 0; i < 5; i++) {
      applications.push({
        studentId: students[(i + 1) % students.length]._id,
        jobId: internshipListings[i % internshipListings.length]._id,
        resume: 'uploads/sample_resume.pdf',
        status: 'Pending'
      });
    }

    await Application.insertMany(applications);
    console.log('Successfully added 5 job and 5 internship applications!');
    process.exit();
  } catch (error) {
    console.error('Error seeding applications:', error);
    process.exit(1);
  }
};

seedApplications();
