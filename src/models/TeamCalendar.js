const mongoose = require('mongoose');

const TeamCalendarSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],  // Array of event IDs
  mergedCalendar: [{                // Array to store merged calendar slots (free and occupied)
    type: { type: String, enum: ['free', 'occupied'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  }]
});

const TeamCalendar = mongoose.model('TeamCalendar', TeamCalendarSchema);
module.exports = TeamCalendar;
