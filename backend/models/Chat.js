const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      senderType: {
        type: String,
        enum: ['student', 'mentor'],
        required: true
      },
      senderName: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      sentAt: {
        type: Date,
        default: Date.now
      },
      isRead: {
        type: Boolean,
        default: false
      }
    }
  ],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);