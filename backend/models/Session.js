const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['monthly', 'requested'],
    default: 'monthly'
  },

  // Scheduling chat messages inside the session
  schedulingChat: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId },
      senderType: { type: String, enum: ['student', 'mentor'] },
      senderName: { type: String },
      text: { type: String },
      sentAt: { type: Date, default: Date.now }
    }
  ],

  // Confirmed timing after chat discussion
  confirmedDate: { type: String, default: '' },
  confirmedTime: { type: String, default: '' },

  // Google Meet link (only shown before completion)
  googleMeetLink: { type: String, default: '' },

  // After completion
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'missed'],
    default: 'pending'
  },
  mentorMarkedDone: { type: Boolean, default: false },
  studentMarkedDone: { type: Boolean, default: false },
  sessionNotes: { type: String, default: '' },

  // Tracking
  month: { type: Number },
  year: { type: Number },
  missedCount: { type: Number, default: 0 },
  reminderSent: { type: Boolean, default: false },

  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);