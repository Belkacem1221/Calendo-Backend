const mongoose = require('mongoose');

const teamCalendarSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

// Check if the model is already compiled
const TeamCalendar =
  mongoose.models.TeamCalendar || mongoose.model('TeamCalendar', teamCalendarSchema);

module.exports = TeamCalendar;
