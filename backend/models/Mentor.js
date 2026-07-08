const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
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
  collegeCode: {
    type: String,
    required: true
  },
  collegeName: {
    type: String
  },
  department: {
    type: String
  },
  year: {
    type: String,
    required: true
  },
  district: {
    type: String
  },
  medium: {
    type: String,
    enum: ['Tamil', 'English']
  },
  guidanceField: {
    type: String,
    enum: [
      'Engineering',
      'Medicine',
      'Arts & Science',
      'Law',
      'Government Jobs',
      'Business',
      'Teacher',
      'General'
    ]
  },
  subjectsCanTeach: {
    type: [String],
    default: []
  },
  myStory: {
    type: String
  },
  approvalDocument: {
    type: String,
    default: ''
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  maxStudents: {
    type: Number,
    default: 5
  },
  rating: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Mentor', mentorSchema);