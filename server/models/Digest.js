const mongoose = require('mongoose');

const digestSchema = new mongoose.Schema({
  notes: {
    type: String,
    required: true,
  },
  decisions: [String],
  actionItems: [
    {
      task: String,
      owner: String,
    },
  ],
  openQuestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Digest', digestSchema);