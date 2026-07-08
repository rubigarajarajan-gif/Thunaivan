const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromAdmin: {
    type: Boolean,
    default: true
  },
  toType: {
    type: String,
    enum: ['all', 'allStudents', 'allMentors', 'specificStudent', 'specificMentor'],
    required: true
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  toName: {
    type: String,
    default: 'Everyone'
  },
  subject: {
    type: String,
    required: true
  },
  messageText: {
    type: String,
    required: true
  },
  sentDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);