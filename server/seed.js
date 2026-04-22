const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional, but good for a clean start)
    await User.deleteMany({ email: { $ne: 'admin@hirepro.com' } }); // Keep admin if exists
    await Job.deleteMany({});
    await Application.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create 10 Companies
    const companies = [];
    for (let i = 1; i <= 10; i++) {
      companies.push({
        name: `TechCorp ${i}`,
        email: `hr@techcorp${i}.com`,
        password: hashedPassword,
        role: 'company'
      });
    }
    const createdCompanies = await User.insertMany(companies);
    console.log('10 Companies created');

    // Create 5 Students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      students.push({
        name: `Student ${i}`,
        email: `student${i}@gmail.com`,
        password: hashedPassword,
        role: 'student'
      });
    }
    const createdStudents = await User.insertMany(students);
    console.log('5 Students created');

    // Create 5 Internships and 5 Full-time jobs
    const jobs = [];
    const categories = ['Engineering', 'Design', 'Marketing', 'Management'];
    
    for (let i = 0; i < 5; i++) {
      jobs.push({
        title: `Software Intern ${i+1}`,
        description: `Exciting internship opportunity at TechCorp ${i+1}. Learn MERN stack and cloud technologies.`,
        location: i % 2 === 0 ? 'Remote' : 'Bangalore',
        salary: '₹25,000/month',
        jobType: 'Internship',
        category: categories[i % categories.length],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        companyId: createdCompanies[i]._id
      });
    }

    for (let i = 5; i < 10; i++) {
      jobs.push({
        title: `Full Stack Developer ${i-4}`,
        description: `Join our core team at TechCorp ${i+1}. Build scalable enterprise solutions.`,
        location: 'Mumbai',
        salary: '₹12,00,000/year',
        jobType: 'Full-time',
        category: 'Engineering',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        companyId: createdCompanies[i]._id
      });
    }

    const createdJobs = await Job.insertMany(jobs);
    console.log('10 Jobs (5 Internships) created');

    // Create some Applications
    const applications = [];
    for (let i = 0; i < createdStudents.length; i++) {
      // Each student applies to 2 jobs
      applications.push({
        studentId: createdStudents[i]._id,
        jobId: createdJobs[i]._id,
        resume: 'uploads/sample_resume.pdf',
        status: 'Pending'
      });
      applications.push({
        studentId: createdStudents[i]._id,
        jobId: createdJobs[i+5]._id,
        resume: 'uploads/sample_resume.pdf',
        status: i % 2 === 0 ? 'Shortlisted' : 'Pending'
      });
    }

    await Application.insertMany(applications);
    console.log('10 Applications created');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
