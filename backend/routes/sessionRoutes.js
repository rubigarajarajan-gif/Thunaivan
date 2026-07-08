const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Student shares availability
router.post('/availability', async (req, res) => {
  try {
    const { mentorId, studentId, studentAvailability } = req.body;

    const session = new Session({
      mentorId,
      studentId,
      sessionType: 'monthly',
      studentAvailability,
      status: 'pending',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });

    await session.save();
    res.status(201).json({ message: 'Availability shared successfully!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error sharing availability', error: error.message });
  }
});

// Student requests extra session
router.post('/request', async (req, res) => {
  try {
    const { mentorId, studentId, studentAvailability } = req.body;

    const session = new Session({
      mentorId,
      studentId,
      sessionType: 'requested',
      studentAvailability,
      status: 'pending',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });

    await session.save();
    res.status(201).json({ message: 'Session requested successfully!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error requesting session', error: error.message });
  }
});

// Mentor schedules session (adds Google Meet link)
router.put('/schedule/:id', async (req, res) => {
  try {
    const { scheduledDate, googleMeetLink } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { scheduledDate, googleMeetLink, status: 'scheduled' },
      { new: true }
    );

    res.json({ message: 'Session scheduled!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error scheduling session', error: error.message });
  }
});

// Mark session as completed
router.put('/complete/:id', async (req, res) => {
  try {
    const { role, sessionNotes } = req.body;

    const update = role === 'mentor'
      ? { mentorMarkedDone: true, sessionNotes }
      : { studentMarkedDone: true };

    const session = await Session.findByIdAndUpdate(
      req.params.id, update, { new: true }
    );

    if (session.mentorMarkedDone && session.studentMarkedDone) {
      session.status = 'completed';
      await session.save();
    }

    res.json({ message: 'Session updated!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error completing session', error: error.message });
  }
});

// Mark session as missed
router.put('/missed/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'missed' },
      { new: true }
    );

    const missedSessions = await Session.countDocuments({
      mentorId: session.mentorId,
      studentId: session.studentId,
      status: 'missed'
    });

    let warningLevel = 'none';
    if (missedSessions === 1) warningLevel = 'yellow';
    if (missedSessions === 2) warningLevel = 'red';
    if (missedSessions >= 4) warningLevel = 'reassign';

    res.json({ message: 'Session marked as missed', session, missedSessions, warningLevel });

  } catch (error) {
    res.status(500).json({ message: 'Error updating session', error: error.message });
  }
});

// Get sessions for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.params.studentId })
      .populate('mentorId', 'name collegeName')
      .sort({ createdDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Get sessions for a mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const sessions = await Session.find({ mentorId: req.params.mentorId })
      .populate('studentId', 'name schoolName standard district')
      .sort({ createdDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Get monthly session count for mentor-student pair
router.get('/monthly-count/:mentorId/:studentId', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const completedSessions = await Session.countDocuments({
      mentorId: req.params.mentorId,
      studentId: req.params.studentId,
      status: 'completed',
      month: currentMonth,
      year: currentYear
    });

    const missedSessions = await Session.countDocuments({
      mentorId: req.params.mentorId,
      studentId: req.params.studentId,
      status: 'missed'
    });

    let warningLevel = 'none';
    if (missedSessions === 1) warningLevel = 'yellow';
    if (missedSessions === 2) warningLevel = 'red';
    if (missedSessions >= 4) warningLevel = 'reassign';

    res.json({
      completedThisMonth: completedSessions,
      remainingThisMonth: Math.max(0, 2 - completedSessions),
      missedTotal: missedSessions,
      warningLevel
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching count', error: error.message });
  }
});

// Send message in session scheduling chat
router.post('/chat/:sessionId', async (req, res) => {
  try {
    const { senderId, senderType, senderName, text } = req.body;

    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found!' });

    session.schedulingChat.push({
      senderId,
      senderType,
      senderName,
      text,
      sentAt: new Date()
    });

    await session.save();
    res.json({ message: 'Message sent!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mentor confirms date and time
router.put('/confirm-timing/:sessionId', async (req, res) => {
  try {
    const { confirmedDate, confirmedTime, googleMeetLink } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      {
        confirmedDate,
        confirmedTime,
        googleMeetLink,
        status: 'scheduled'
      },
      { new: true }
    );

    res.json({ message: 'Session timing confirmed!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error confirming timing', error: error.message });
  }
});

// Mentor marks session as completed
router.put('/mark-complete/:sessionId', async (req, res) => {
  try {
    const { sessionNotes } = req.body;

    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      {
        status: 'completed',
        mentorMarkedDone: true,
        sessionNotes,
        googleMeetLink: ''  // Remove meet link after completion
      },
      { new: true }
    );

    res.json({ message: 'Session marked as completed!', session });

  } catch (error) {
    res.status(500).json({ message: 'Error completing session', error: error.message });
  }
});

// Get monthly completed session count
router.get('/month-check/:mentorId/:studentId', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const completed = await Session.countDocuments({
      mentorId: req.params.mentorId,
      studentId: req.params.studentId,
      status: 'completed',
      month: currentMonth,
      year: currentYear
    });

    res.json({
      completedThisMonth: completed,
      targetMet: completed >= 2,
      remaining: Math.max(0, 2 - completed)
    });

  } catch (error) {
    res.status(500).json({ message: 'Error checking monthly sessions', error: error.message });
  }
});

module.exports = router;