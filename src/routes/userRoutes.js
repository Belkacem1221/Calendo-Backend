const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers'); // Assuming the controller handles user logic
const authenticateToken = require('../middlewares/authMiddleware'); // Import the JWT middleware

// Route for creating a new user (public)
router.post('/register', UserController.createUser); // Handles creating new users

// Route for getting all users (protected) FOR ADMIN
router.get('/', authenticateToken, UserController.getAllUsers); // Only authenticated users can access this

module.exports = router;
