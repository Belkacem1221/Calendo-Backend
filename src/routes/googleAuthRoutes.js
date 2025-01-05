const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuthController');

// Routes for Google OAuth
router.get('/google/auth-url', googleAuthController.getGoogleAuthURL);
router.get('/google/oauth2callback', googleAuthController.handleGoogleCallback);

module.exports = router;
