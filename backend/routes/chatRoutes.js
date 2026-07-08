const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get or create chat between student and mentor
router.get('/:studentId/:mentorId', async (req, res) => {
  try {
    let chat = await Chat.findOne({
      studentId: req.params.studentId,
      mentorId: req.params.mentorId
    });

    if (!chat) {
      chat = new Chat({
        studentId: req.params.studentId,
        mentorId: req.params.mentorId,
        messages: []
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { studentId, mentorId, senderId, senderType, senderName, text } = req.body;

    let chat = await Chat.findOne({ studentId, mentorId });

    if (!chat) {
      chat = new Chat({ studentId, mentorId, messages: [] });
    }

    chat.messages.push({
      senderId,
      senderType,
      senderName,
      text,
      sentAt: new Date(),
      isRead: false
    });

    chat.lastMessage = text;
    chat.lastMessageAt = new Date();

    await chat.save();
    res.status(201).json({ message: 'Message sent!', chat });

  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mark messages as read
router.put('/read/:studentId/:mentorId/:readerType', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      studentId: req.params.studentId,
      mentorId: req.params.mentorId
    });

    if (!chat) return res.status(404).json({ message: 'Chat not found!' });

    // Mark messages from the other person as read
    const otherType = req.params.readerType === 'student' ? 'mentor' : 'student';
    chat.messages.forEach(msg => {
      if (msg.senderType === otherType) msg.isRead = true;
    });

    await chat.save();
    res.json({ message: 'Messages marked as read!' });

  } catch (error) {
    res.status(500).json({ message: 'Error marking as read', error: error.message });
  }
});

// Get unread message count
router.get('/unread/:studentId/:mentorId/:readerType', async (req, res) => {
  try {
    const chat = await Chat.findOne({
      studentId: req.params.studentId,
      mentorId: req.params.mentorId
    });

    if (!chat) return res.json({ unreadCount: 0 });

    const otherType = req.params.readerType === 'student' ? 'mentor' : 'student';
    const unreadCount = chat.messages.filter(
      msg => msg.senderType === otherType && !msg.isRead
    ).length;

    res.json({ unreadCount });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

module.exports = router;