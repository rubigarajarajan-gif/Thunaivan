const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');

// Student posts a doubt
router.post('/ask', async (req, res) => {
  try {
    const { studentId, subject, standard, questionText } = req.body;

    const doubt = new Doubt({
      studentId,
      subject,
      standard,
      questionText
    });

    await doubt.save();
    res.status(201).json({ message: 'Doubt posted successfully!', doubt });

  } catch (error) {
    res.status(500).json({ message: 'Error posting doubt', error });
  }
});

// Get all pending doubts (for mentors)
router.get('/pending', async (req, res) => {
  try {
    const doubts = await Doubt.find({ status: 'pending' })
      .populate('studentId', 'name schoolName standard');
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doubts', error });
  }
});

// Mentor answers a doubt
router.put('/answer/:id', async (req, res) => {
  try {
    const { mentorId, answerText } = req.body;

    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      {
        mentorId,
        answerText,
        status: 'answered',
        answeredDate: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'Doubt answered successfully!', doubt });

  } catch (error) {
    res.status(500).json({ message: 'Error answering doubt', error });
  }
});

// Get doubts by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const doubts = await Doubt.find({ studentId: req.params.studentId })
      .populate('mentorId', 'name collegeName');
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doubts', error });
  }
});

module.exports = router;