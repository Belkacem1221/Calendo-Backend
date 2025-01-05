const express = require('express');
const router = express.Router();
const { getGoogleAuthURL, handleGoogleCallback } = require('../controllers/googleAuthController');
const { getCalendarEvents, createCalendarEvent } = require('../services/googleCalendarService');

// Route to get Google Auth URL
router.get('/auth-url', getGoogleAuthURL);

// Route to handle Google OAuth callback
router.get('/oauth2callback', handleGoogleCallback);

// Route to get calendar events
router.get('/events', async (req, res) => {
  try {
    // Assuming you have the OAuth2 client stored in the session or DB for the user
    const oauth2Client = req.user.oauth2Client; // Retrieve the OAuth2 client (this should be set when the user is authenticated)
    
    const events = await getCalendarEvents(oauth2Client);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching calendar events' });
  }
});

// Route to create a new event
router.post('/create-event', async (req, res) => {
  try {
    const oauth2Client = req.user.oauth2Client; // Retrieve the OAuth2 client
    
    const eventData = req.body; // The event data passed in the request body
    const createdEvent = await createCalendarEvent(oauth2Client, eventData);
    res.json(createdEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating calendar event' });
  }
});

module.exports = router;
