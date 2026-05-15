const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Grade = require('./models/Grade');
const Notification = require('./models/Notification');
const Fee = require('./models/Fee');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await Grade.deleteMany({});
    await Notification.deleteMany({});
    await Fee.deleteMany({});
    console.log('Cleared existing data.');

    // --- Create Users ---
    const admin = await User.create({
      name: 'Galgotias Admin', email: 'admin@galgotias.edu', password: 'admin123',
      role: 'Admin', department: 'Central Administration',
    });
    
    // Faculty
    const f1 = await User.create({ name: 'Dr. Amit Sharma', email: 'faculty1@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Computing Science', facultyId: 'GU-FAC-101' });
    const f2 = await User.create({ name: 'Prof. Sunita Gupta', email: 'faculty2@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Basic Sciences', facultyId: 'GU-FAC-102' });
    const f3 = await User.create({ name: 'Dr. Vikram Malhotra', email: 'faculty3@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Business', facultyId: 'GU-FAC-103' });
    const f4 = await User.create({ name: 'Prof. Anjali Rao', email: 'faculty4@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Engineering', facultyId: 'GU-FAC-104' });
    const f5 = await User.create({ name: 'Dr. Sameer Khan', email: 'faculty5@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Humanities', facultyId: 'GU-FAC-105' });
    const f6 = await User.create({ name: 'Dr. Preeti Singh', email: 'faculty6@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Life Sciences', facultyId: 'GU-FAC-106' });
    const f7 = await User.create({ name: 'Prof. Manish Verma', email: 'faculty7@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Law', facultyId: 'GU-FAC-107' });
    const f8 = await User.create({ name: 'Dr. Kavita Sharma', email: 'faculty8@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Media & Communication', facultyId: 'GU-FAC-108' });
    const f9 = await User.create({ name: 'Prof. Sanjay Gupta', email: 'faculty9@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Architecture', facultyId: 'GU-FAC-109' });
    const f10 = await User.create({ name: 'Dr. Neha Jha', email: 'faculty10@galgotias.edu', password: 'faculty123', role: 'Faculty', department: 'School of Education', facultyId: 'GU-FAC-110' });

    // Students
    const studentList = [
      { name: 'Aryan Malhotra', email: 'student1@galgotias.edu', studentId: 'GU24-CSE-001', department: 'School of Computing Science' },
      { name: 'Ishita Verma', email: 'student2@galgotias.edu', studentId: 'GU24-CSE-002', department: 'School of Computing Science' },
      { name: 'Rahul Singh', email: 'student3@galgotias.edu', studentId: 'GU24-MAT-001', department: 'School of Basic Sciences' },
      { name: 'Sneha Reddy', email: 'student4@galgotias.edu', studentId: 'GU24-MAT-002', department: 'School of Basic Sciences' },
      { name: 'Vikram Das', email: 'student5@galgotias.edu', studentId: 'GU24-CSE-003', department: 'School of Computing Science' },
      { name: 'Pooja Hegde', email: 'student6@galgotias.edu', studentId: 'GU24-BUS-001', department: 'School of Business' },
      { name: 'Karan Mehra', email: 'student7@galgotias.edu', studentId: 'GU24-BUS-002', department: 'School of Business' },
      { name: 'Ananya Panday', email: 'student8@galgotias.edu', studentId: 'GU24-ENG-001', department: 'School of Engineering' },
      { name: 'Rohan Joshi', email: 'student9@galgotias.edu', studentId: 'GU24-ENG-002', department: 'School of Engineering' },
      { name: 'Megha Gupta', email: 'student10@galgotias.edu', studentId: 'GU24-HUM-001', department: 'School of Humanities' },
      { name: 'Arjun Kapoor', email: 'student11@galgotias.edu', studentId: 'GU24-CSE-004', department: 'School of Computing Science' },
      { name: 'Sana Khan', email: 'student12@galgotias.edu', studentId: 'GU24-CSE-005', department: 'School of Computing Science' },
      { name: 'Varun Dhawan', email: 'student13@galgotias.edu', studentId: 'GU24-MAT-003', department: 'School of Basic Sciences' },
      { name: 'Kiara Advani', email: 'student14@galgotias.edu', studentId: 'GU24-BUS-003', department: 'School of Business' },
      { name: 'Siddharth Roy', email: 'student15@galgotias.edu', studentId: 'GU24-ENG-003', department: 'School of Engineering' },
      { name: 'Siddharth Malhotra', email: 'student16@galgotias.edu', studentId: 'GU24-CSE-006', department: 'School of Computing Science' },
      { name: 'Riya Sen', email: 'student17@galgotias.edu', studentId: 'GU24-MAT-004', department: 'School of Basic Sciences' },
      { name: 'Kabir Singh', email: 'student18@galgotias.edu', studentId: 'GU24-BUS-004', department: 'School of Business' },
      { name: 'Aisha Ahmed', email: 'student19@galgotias.edu', studentId: 'GU24-ENG-004', department: 'School of Engineering' },
      { name: 'Rajveer Singh', email: 'student20@galgotias.edu', studentId: 'GU24-HUM-002', department: 'School of Humanities' },
      { name: 'Tanya Bakshi', email: 'student21@galgotias.edu', studentId: 'GU24-CSE-007', department: 'School of Computing Science' },
      { name: 'Nikhil Gupta', email: 'student22@galgotias.edu', studentId: 'GU24-MAT-005', department: 'School of Basic Sciences' },
      { name: 'Simran Kaur', email: 'student23@galgotias.edu', studentId: 'GU24-BUS-005', department: 'School of Business' },
      { name: 'Armaan Malik', email: 'student24@galgotias.edu', studentId: 'GU24-ENG-005', department: 'School of Engineering' },
      { name: 'Zara Khan', email: 'student25@galgotias.edu', studentId: 'GU24-HUM-003', department: 'School of Humanities' },
    ];
    
    const students = [];
    for (const s of studentList) {
      const student = await User.create({ ...s, password: 'student123', role: 'Student' });
      students.push(student);
    }
    console.log(`Seeded ${11 + students.length} users.`);

    // --- Create Courses ---
    const c1 = await Course.create({
      courseCode: 'CSE101', title: 'Data Structures & Algorithms', description: 'Advanced problem solving using DSA.',
      credits: 4, department: 'School of Computing Science', faculty: f1._id, maxCapacity: 60,
      schedule: { days: ['Monday', 'Wednesday', 'Friday'], startTime: '09:00', endTime: '10:00', room: 'C-Block 101' },
      status: 'In_Progress', semester: 'Fall', year: 2026,
      enrolledStudents: [students[0]._id, students[1]._id, students[4]._id, students[10]._id, students[11]._id],
    });
    
    const c2 = await Course.create({
      courseCode: 'MAT201', title: 'Discrete Mathematics', description: 'Mathematical logic and structures.',
      credits: 3, department: 'School of Basic Sciences', faculty: f2._id, maxCapacity: 40,
      schedule: { days: ['Tuesday', 'Thursday'], startTime: '11:00', endTime: '12:30', room: 'A-Block 203' },
      status: 'In_Progress', semester: 'Fall', year: 2026,
      enrolledStudents: [students[2]._id, students[3]._id, students[0]._id, students[12]._id],
    });
    
    const c3 = await Course.create({
      courseCode: 'BUS301', title: 'Financial Management', description: 'Fundamentals of corporate finance.',
      credits: 4, department: 'School of Business', faculty: f3._id, maxCapacity: 50,
      schedule: { days: ['Monday', 'Wednesday'], startTime: '10:30', endTime: '12:00', room: 'B-Block 305' },
      status: 'In_Progress', semester: 'Fall', year: 2026,
      enrolledStudents: [students[5]._id, students[6]._id, students[13]._id],
    });
    
    const c4 = await Course.create({
      courseCode: 'ENG202', title: 'Thermodynamics', description: 'Laws of thermodynamics and applications.',
      credits: 4, department: 'School of Engineering', faculty: f4._id, maxCapacity: 50,
      schedule: { days: ['Tuesday', 'Thursday'], startTime: '14:00', endTime: '15:30', room: 'D-Block Lab 102' },
      status: 'In_Progress', semester: 'Fall', year: 2026,
      enrolledStudents: [students[7]._id, students[8]._id, students[14]._id],
    });

    const c5 = await Course.create({
      courseCode: 'HUM105', title: 'Sociology 101', description: 'Understanding social structures.',
      credits: 3, department: 'School of Humanities', faculty: f5._id, maxCapacity: 45,
      status: 'Enrollment_Open', semester: 'Spring', year: 2026,
      enrolledStudents: [students[9]._id],
    });
    
    const c6 = await Course.create({
      courseCode: 'CSE302', title: 'Artificial Intelligence', description: 'Introduction to AI and ML.',
      credits: 4, department: 'School of Computing Science', faculty: f1._id, maxCapacity: 40,
      status: 'Published', semester: 'Spring', year: 2026,
    });

    const c7 = await Course.create({
      courseCode: 'LAW101', title: 'Constitutional Law', description: 'Introduction to the Constitution of India.',
      credits: 4, department: 'School of Law', faculty: f7._id, maxCapacity: 60,
      status: 'Enrollment_Open', semester: 'Fall', year: 2026,
      enrolledStudents: [students[17]._id, students[18]._id],
    });

    const c8 = await Course.create({
      courseCode: 'BIO201', title: 'Molecular Biology', description: 'Study of biological molecules.',
      credits: 4, department: 'School of Life Sciences', faculty: f6._id, maxCapacity: 40,
      status: 'In_Progress', semester: 'Fall', year: 2026,
      enrolledStudents: [students[15]._id, students[16]._id],
    });

    const courses = [c1, c2, c3, c4, c5, c6, c7, c8];
    console.log(`Seeded ${courses.length} courses.`);

    // --- Seed Attendance ---
    let attCount = 0;
    const statuses = ['Present', 'Present', 'Present', 'Absent', 'Late', 'Present', 'Excused'];
    for (let dayOffset = 1; dayOffset <= 15; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const course of [c1, c2, c3, c4, c7, c8]) {
        for (const sid of course.enrolledStudents) {
          await Attendance.create({
            student: sid, course: course._id, date,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            markedBy: course.faculty,
          });
          attCount++;
        }
      }
    }
    console.log(`Seeded ${attCount} attendance records.`);

    // --- Seed Grades ---
    let gradeCount = 0;
    for (const course of [c1, c2, c3, c4, c7, c8]) {
      for (const sid of course.enrolledStudents) {
        await Grade.create({
          student: sid, course: course._id, gradedBy: course.faculty,
          assignments: [
            { title: 'Assignment 1', score: 70 + Math.floor(Math.random() * 30), maxScore: 100, weight: 30 },
            { title: 'Quiz 1', score: 65 + Math.floor(Math.random() * 35), maxScore: 100, weight: 20 },
            { title: 'Project', score: 75 + Math.floor(Math.random() * 25), maxScore: 100, weight: 50 },
          ],
          midterm: { score: 60 + Math.floor(Math.random() * 40), maxScore: 100 },
          final: { score: 55 + Math.floor(Math.random() * 45), maxScore: 100 },
        });
        gradeCount++;
      }
    }
    console.log(`Seeded ${gradeCount} grade records.`);

    // --- Seed Notifications ---
    const notices = [
      { title: 'Welcome to Galgotias University!', message: 'Academic session 2026-27 begins soon.', type: 'Announcement', targetRole: 'All', priority: 'High' },
      { title: 'Examination Form Deadline', message: 'Submit your exam forms by Friday to avoid late fees.', type: 'Alert', targetRole: 'Student', priority: 'High' },
      { title: 'Guest Lecture: Future of AI', message: 'Join us at the Main Auditorium on Wednesday, 2 PM.', type: 'Announcement', targetRole: 'All', priority: 'Medium' },
      { title: 'Faculty Meeting', message: 'Mandatory meeting for all faculty in VC Office.', type: 'Alert', targetRole: 'Faculty', priority: 'Medium' },
      { title: 'Sports Meet 2026', message: 'Registrations are open for the annual sports event.', type: 'Announcement', targetRole: 'Student', priority: 'Low' },
    ];
    
    for (const n of notices) {
      const recipients = n.targetRole === 'All' ? [...students.map(s => s._id), f1._id, f2._id, f3._id, f4._id, f5._id, f6._id, f7._id, f8._id, f9._id, f10._id] :
                         n.targetRole === 'Student' ? students.map(s => s._id) : [f1._id, f2._id, f3._id, f4._id, f5._id, f6._id, f7._id, f8._id, f9._id, f10._id];
      await Notification.create({ ...n, sender: admin._id, recipients });
    }
    console.log(`Seeded ${notices.length} notifications.`);

    // --- Seed Fees ---
    const feeRecords = [];
    for (let i = 0; i < 5; i++) {
      const student = students[i];
      // Fee due in 5 days (to trigger reminder)
      const dueDateNear = new Date();
      dueDateNear.setDate(dueDateNear.getDate() + 5);
      
      feeRecords.push({
        student: student._id,
        title: 'Semester 3 Tuition Fee',
        amount: 45000,
        dueDate: dueDateNear,
        status: 'Unpaid',
      });
    }

    // Add some already paid fees
    for (let i = 5; i < 8; i++) {
      const student = students[i];
      const dueDatePast = new Date();
      dueDatePast.setDate(dueDatePast.getDate() - 30);

      feeRecords.push({
        student: student._id,
        title: 'Semester 2 Hostel Fee',
        amount: 35000,
        dueDate: dueDatePast,
        status: 'Paid',
        paymentDetails: {
          transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          paymentDate: new Date(dueDatePast.getTime() + 86400000),
          method: 'Card',
          lastFour: '4444',
        },
        receiptNumber: 'REC' + (10000000 + i),
      });
    }

    await Fee.insertMany(feeRecords);
    console.log(`Seeded ${feeRecords.length} fee records.`);

    console.log('\n✅ Massive database seeding completed for Galgotias University!');
    console.log('Credentials:');
    console.log('  Admin:   admin@galgotias.edu / admin123');
    console.log('  Faculty: faculty1@galgotias.edu / faculty123');
    console.log('  Student: student1@galgotias.edu / student123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
