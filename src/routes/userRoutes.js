const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers'); // Assuming the controller handles user logic

// Example route for creating a new user
router.post('/register', UserController.createUser); // Handles creating new users

// Example route for getting all users
router.get('/', UserController.getAllUsers); // Handles fetching all users

module.exports = router;
