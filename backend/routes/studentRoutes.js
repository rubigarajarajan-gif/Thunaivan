const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const School = require('../models/School');
const Mentor = require('../models/Mentor');

// Register student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, schoolCode, standard, medium, interest } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // Verify school code
    const school = await School.findOne({ schoolCode, isActive: true });
    if (!school) {
      return res.status(400).json({ message: 'Invalid school code!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      schoolCode,
      schoolName: school.schoolName,
      district: school.district,
      standard,
      medium,
      interest,
      isApproved: true
    });

    await student.save();

    // Auto assign mentor
    // Auto assign mentor based on interest only
    // Find new mentor based on interest only
    const newMentor = await Mentor.findOne({
      guidanceField: student.interest,
      isApproved: true,
      _id: { $ne: oldMentorId },
      $expr: { $lt: [{ $size: '$assignedStudents' }, '$maxStudents'] }
    });
    // If no mentor found for that interest, find any available mentor
    if (!mentor) {
      const anyMentor = await Mentor.findOne({
        isApproved: true,
        $expr: { $lt: [{ $size: '$assignedStudents' }, '$maxStudents'] }
      });
      if (anyMentor) {
        student.assignedMentorId = anyMentor._id;
        await student.save();
        anyMentor.assignedStudents.push(student._id);
        await anyMentor.save();
      }
    }

    if (mentor) {
      student.assignedMentorId = mentor._id;
      await student.save();

      mentor.assignedStudents.push(student._id);
      await mentor.save();
    }

    res.status(201).json({
      message: 'Student registered successfully!',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        schoolName: student.schoolName,
        assignedMentor: mentor ? mentor.name : 'Will be assigned soon'
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error });
  }
});

// Login student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        schoolName: student.schoolName,
        standard: student.standard,
        assignedMentorId: student.assignedMentorId
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get student profile
router.get('/profile/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('assignedMentorId', 'name email collegeName department');
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Admin deletes a student
router.delete('/delete/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    if (student.assignedMentorId) {
      await Mentor.findByIdAndUpdate(student.assignedMentorId, {
        $pull: { assignedStudents: student._id }
      });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// Get all students (for admin)
router.get('/all', async (req, res) => {
  try {
    const students = await Student.find().populate('assignedMentorId', 'name collegeName');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Admin manually assigns mentor to student
router.put('/assign-mentor/:studentId', async (req, res) => {
  try {
    const { mentorId } = req.body;

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    // Remove from old mentor if exists
    if (student.assignedMentorId) {
      await Mentor.findByIdAndUpdate(student.assignedMentorId, {
        $pull: { assignedStudents: student._id }
      });
    }

    // Assign new mentor
    student.assignedMentorId = mentorId;
    await student.save();

    await Mentor.findByIdAndUpdate(mentorId, {
      $push: { assignedStudents: student._id }
    });

    res.json({ message: 'Mentor assigned successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Error assigning mentor', error: error.message });
  }
});

module.exports = router;