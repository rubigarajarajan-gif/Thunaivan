const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  standard: {
    type: String
  },
  questionText: {
    type: String,
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    default: null
  },
  answerText: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'answered'],
    default: 'pending'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  answeredDate: {
    type: Date
  }
});

module.exports = mongoose.model('Doubt', doubtSchema);