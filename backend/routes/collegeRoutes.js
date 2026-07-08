const express = require('express');
const router = express.Router();
const College = require('../models/College');

// Admin creates college and generates college code
router.post('/create', async (req, res) => {
  try {
    const { collegeName, district, deanName, deanPhone, deanEmail } = req.body;

    const collegeCode = 'CLG' + Date.now();

    const college = new College({
      collegeName,
      district,
      deanName,
      deanPhone,
      deanEmail,
      collegeCode
    });

    await college.save();

    res.status(201).json({
      message: 'College registered successfully!',
      collegeCode: collegeCode,
      college: college
    });

  } catch (error) {
    console.log('COLLEGE CREATE ERROR:', error);
    res.status(500).json({ message: 'Error creating college', error: error.message });
  }
});

// Get all colleges
router.get('/all', async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colleges', error: error.message });
  }
});

// Verify college code
router.post('/verify-code', async (req, res) => {
  try {
    const { collegeCode } = req.body;
    const college = await College.findOne({ collegeCode, isActive: true });

    if (!college) {
      return res.status(404).json({ message: 'Invalid college code!' });
    }

    res.json({ message: 'Valid college code!', college });

  } catch (error) {
    res.status(500).json({ message: 'Error verifying code', error: error.message });
  }
});


// Admin deletes a college
// Admin deletes a college
router.delete('/delete/:id', async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    res.json({ message: 'College removed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting college', error: error.message });
  }
});

module.exports = router;