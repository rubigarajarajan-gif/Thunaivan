const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  schoolCode: {
    type: String,
    required: true
  },
  schoolName: {
    type: String
  },
  district: {
    type: String
  },
  standard: {
    type: String,
    required: true
  },
  medium: {
    type: String,
    enum: ['Tamil', 'English'],
    required: true
  },
  interest: {
    type: String,
    enum: [
      'Engineering',
      'Medicine',
      'Arts & Science',
      'Law',
      'Government Jobs',
      'Business',
      'Teacher',
      'Not sure yet'
    ],
    default: 'Not sure yet'
  },
  assignedMentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    default: null
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  registeredDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);