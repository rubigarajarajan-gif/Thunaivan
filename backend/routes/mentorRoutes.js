const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Mentor = require('../models/Mentor');
const College = require('../models/College');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Register mentor
router.post('/register', upload.single('approvalDocument'), async (req, res) => {
  try {
    const {
      name, email, password, collegeCode,
      year, medium, guidanceField,
      subjectsCanTeach, myStory
    } = req.body;

    // Check if mentor already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // Verify college code
    const college = await College.findOne({ collegeCode, isActive: true });
    if (!college) {
      return res.status(400).json({ message: 'Invalid college code!' });
    }

    // Check document uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload approval document!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = new Mentor({
      name,
      email,
      password: hashedPassword,
      collegeCode,
      collegeName: college.collegeName,
      district: college.district,
      year,
      medium,
      guidanceField,
      subjectsCanTeach: subjectsCanTeach.split(',').map(s => s.trim()),
      myStory,
      approvalDocument: req.file.filename,
      isApproved: true
    });

    await mentor.save();

    res.status(201).json({
      message: 'Mentor registered successfully!',
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        collegeName: mentor.collegeName
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering mentor', error });
  }
});

// Login mentor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const token = jwt.sign(
      { id: mentor._id, role: 'mentor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        collegeName: mentor.collegeName,
        assignedStudents: mentor.assignedStudents
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get mentor's assigned students
router.get('/my-students/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('assignedStudents', 'name email schoolName standard interest');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found!' });
    }
    res.json(mentor.assignedStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});


// Admin deletes a mentor
router.delete('/delete/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found!' });
    }

    const Student = require('../models/Student');
    // Unassign all students from this mentor
    await Student.updateMany(
      { assignedMentorId: mentor._id },
      { assignedMentorId: null }
    );

    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mentor removed successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting mentor', error: error.message });
  }
});

// Get all mentors (for admin)
router.get('/all', async (req, res) => {
  try {
    const mentors = await Mentor.find().populate('assignedStudents', 'name standard');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
});

// Get single mentor profile (full details)
router.get('/profile/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('assignedStudents', 'name email schoolName standard interest district');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found!' });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router;