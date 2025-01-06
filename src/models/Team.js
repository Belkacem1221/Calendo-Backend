const mongoose = require('mongoose');
const TeamCalendar = require('./teamCalendar');  // Import TeamCalendar model

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Le nom de l'équipe est unique
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur qui a créé l'équipe
    required: true
  },
  members: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['admin', 'moderator', 'member'], 
      default: 'member' 
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// Pre-save hook to automatically create a team calendar when a team is created
teamSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Create team calendar when a new team is saved
    const teamCalendar = new TeamCalendar({
      team: this._id,
      createdBy: this.admin, // The team admin is the creator
    });

    // Save the team calendar
    await teamCalendar.save();
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
