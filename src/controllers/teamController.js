const Team = require('../models/Team');
const User = require('../models/User');

// Créer une nouvelle équipe
exports.createTeam = async (req, res) => {
  const { name } = req.body;

  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already exists' });
    }

    const newTeam = new Team({ 
      name, 
      admin: req.user.id,  // L'utilisateur connecté devient l'administrateur
      members: [req.user.id]  // Ajouter le créateur comme membre
    });
    await newTeam.save();

    res.status(201).json({ message: 'Team created successfully', team: newTeam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
};

// Ajouter un membre à une équipe
exports.addMember = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Vérifiez si l'utilisateur est déjà membre de l'équipe
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of the team' });
    }

    // Vérifiez si l'utilisateur qui envoie la requête est l'administrateur de l'équipe
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team admin can add members' });
    }

    // Ajoutez le membre
    team.members.push(userId);
    await team.save();

    res.status(200).json({ message: 'Member added successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error });
  }
};

// Retirer un membre d'une équipe
exports.removeMember = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Vérifiez si l'utilisateur qui envoie la requête est l'administrateur de l'équipe
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team admin can remove members' });
    }

    // Vérifiez si l'utilisateur est membre de l'équipe
    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }

    // Supprimez le membre
    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    res.status(200).json({ message: 'Member removed successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error });
  }
};

// Obtenir les détails d'une équipe
exports.getTeamDetails = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId).populate('members', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team details', error });
  }
};

exports.changeMemberRole = async (req, res) => {
  const { teamId, userId, newRole } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the admin can change member roles' });
    }

    const member = team.members.find(member => member.user.toString() === userId);
    if (!member) {
      return res.status(400).json({ message: 'User is not a member of the team' });
    }

    member.role = newRole;
    await team.save();

    res.status(200).json({ message: 'Member role updated successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error changing member role', error });
  }
};
