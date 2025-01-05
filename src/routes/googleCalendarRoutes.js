const express = require('express');
const { getCalendarEvents, createCalendarEvent } = require('../controllers/googleCalendarController');
const oauthMiddleware = require('../middlewares/oauthMiddleware');

const router = express.Router();

// Apply the OAuth middleware to all routes
router.use(oauthMiddleware);

// Route to fetch events
router.get('/events', async (req, res) => {
  try {
    const events = await getCalendarEvents(req.oauth2Client);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new event
router.post('/create-event', async (req, res) => {
  try {
    const event = await createCalendarEvent(req.oauth2Client, req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
