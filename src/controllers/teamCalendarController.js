const TeamCalendar = require('../models/teamCalendarSchema');
const Event = require('../models/eventSchema');

// Create a new team calendar
exports.createTeamCalendar = async (req, res) => {
  const { teamId, userId } = req.body; // Assuming teamId and userId are provided

  try {
    const teamCalendar = new TeamCalendar({
      team: teamId,
      createdBy: userId,
    });

    await teamCalendar.save();
    res.status(201).json(teamCalendar);
  } catch (error) {
    res.status(500).json({ error: 'Error creating team calendar', details: error.message });
  }
};

// Get the events for a team calendar
exports.getTeamCalendarEvents = async (req, res) => {
  const { teamCalendarId } = req.params;

  try {
    const teamCalendar = await TeamCalendar.findById(teamCalendarId).populate('events');
    
    if (!teamCalendar) {
      return res.status(404).json({ error: 'Team calendar not found' });
    }

    res.status(200).json(teamCalendar.events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team calendar events', details: error.message });
  }
};

// Add an event to a team calendar
exports.addEventToTeamCalendar = async (req, res) => {
  const { teamCalendarId, eventId } = req.params;

  try {
    const teamCalendar = await TeamCalendar.findById(teamCalendarId);

    if (!teamCalendar) {
      return res.status(404).json({ error: 'Team calendar not found' });
    }

    teamCalendar.events.push(eventId);
    await teamCalendar.save();

    res.status(200).json(teamCalendar);
  } catch (error) {
    res.status(500).json({ error: 'Error adding event to team calendar', details: error.message });
  }
};
