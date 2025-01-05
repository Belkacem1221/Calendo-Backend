const express = require('express');
const { getCalendarEvents, createCalendarEvent, updateCalendarEvent } = require('../controllers/googleCalendarController');
const router = express.Router();

router.get('/events', getCalendarEvents);

router.post('/create-event', createCalendarEvent);

router.put('/update-event/:eventId', updateCalendarEvent);

module.exports = router;
