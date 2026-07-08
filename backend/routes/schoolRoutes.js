const express = require('express');
const router = express.Router();
const School = require('../models/School');

// Admin creates school and generates school code
router.post('/create', async (req, res) => {
  try {
    const { schoolName, district, headmasterName, headmasterPhone } = req.body;

    // Generate unique school code
    const schoolCode = 'SCH' + Date.now();

    const school = new School({
      schoolName,
      district,
      headmasterName,
      headmasterPhone,
      schoolCode
    });

    await school.save();

    res.status(201).json({
      message: 'School registered successfully!',
      schoolCode: schoolCode,
      school: school
    });

  } catch (error) {
    console.log('SCHOOL CREATE ERROR:', error);
    res.status(500).json({ message: 'Error creating school', error: error.message });
  }
});

// Get all schools
router.get('/all', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools', error });
  }
});

// Verify school code
router.post('/verify-code', async (req, res) => {
  try {
    const { schoolCode } = req.body;
    const school = await School.findOne({ schoolCode, isActive: true });

    if (!school) {
      return res.status(404).json({ message: 'Invalid school code!' });
    }

    res.json({ message: 'Valid school code!', school });

  } catch (error) {
    res.status(500).json({ message: 'Error verifying code', error });
  }
});

// Get overall platform stats
router.get('/stats/overview', async (req, res) => {
  try {
    const Student = require('../models/Student');
    const Mentor = require('../models/Mentor');
    const College = require('../models/College');

    const totalSchools = await School.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalMentors = await Mentor.countDocuments();

    res.json({
      totalSchools,
      totalColleges,
      totalStudents,
      totalMentors
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Admin deletes a school
router.delete('/delete/:id', async (req, res) => {
  try {
    await School.findByIdAndDelete(req.params.id);
    res.json({ message: 'School removed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting school', error: error.message });
  }
});

module.exports = router;