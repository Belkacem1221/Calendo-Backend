const mongoose = require('mongoose');

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence aux utilisateurs membres de l'équipe
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema);
