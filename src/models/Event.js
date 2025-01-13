const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    votes: [{
      option: String,  // Option name, e.g., 'Chinese', 'Mexican'
      voters: [{
        type: mongoose.Schema.Types.ObjectId, // The user who voted
        ref: 'User'
      }]
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
