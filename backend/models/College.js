const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  deanName: {
    type: String,
    required: true
  },
  deanPhone: {
    type: String,
    required: true
  },
  deanEmail: {
    type: String,
    required: true
  },
  collegeCode: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registeredDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('College', collegeSchema);