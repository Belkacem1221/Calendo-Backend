const express = require('express');
const { createTeam, addMember, removeMember, getTeamDetails } = require('../controllers/teamController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Créer une équipe (accessible à tous les utilisateurs authentifiés)
router.post('/create', authenticateToken, createTeam);

// Ajouter un membre à une équipe (seulement l'administrateur de l'équipe peut le faire)
router.post('/add-member', authenticateToken, addMember);

// Retirer un membre d'une équipe (seulement l'administrateur de l'équipe peut le faire)
router.delete('/remove-member', authenticateToken, removeMember);

// Obtenir les détails d'une équipe
router.get('/:teamId', authenticateToken, getTeamDetails);

module.exports = router;