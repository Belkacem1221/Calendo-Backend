const mongoose = require('mongoose');

const teamCalendarSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamCalendar', teamCalendarSchema);
