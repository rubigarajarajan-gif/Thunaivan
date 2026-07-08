const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Admin sends message
router.post('/send', async (req, res) => {
  try {
    const { toType, toId, toName, subject, messageText } = req.body;

    const message = new Message({
      toType,
      toId: toId || null,
      toName: toName || 'Everyone',
      subject,
      messageText
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully!', data: message });

  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get all messages sent by admin
router.get('/all', async (req, res) => {
  try {
    const messages = await Message.find().sort({ sentDate: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Get messages for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { toType: 'all' },
        { toType: 'allStudents' },
        { toType: 'specificStudent', toId: req.params.studentId }
      ]
    }).sort({ sentDate: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Get messages for a specific mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { toType: 'all' },
        { toType: 'allMentors' },
        { toType: 'specificMentor', toId: req.params.mentorId }
      ]
    }).sort({ sentDate: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

module.exports = router;