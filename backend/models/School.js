const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  headmasterName: {
    type: String,
    required: true
  },
  headmasterPhone: {
    type: String,
    required: true
  },
  schoolCode: {
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

module.exports = mongoose.model('School', schoolSchema);