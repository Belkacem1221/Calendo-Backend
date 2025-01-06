const express = require('express');
const { createTeamCalendar, getTeamCalendarEvents, addEventToTeamCalendar } = require('../controllers/teamCalendarController');
const router = express.Router();

// Route to create a team calendar
router.post('/create', createTeamCalendar);

// Route to get all events for a team calendar
router.get('/:teamCalendarId/events', getTeamCalendarEvents);

// Route to add an event to a team calendar
router.post('/:teamCalendarId/events/:eventId', addEventToTeamCalendar);

module.exports = router;
