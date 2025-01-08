const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const TeamCalendar = require('../models/TeamCalendar'); 
const { notifyClients } = require('../socket/socket');

exports.createEvent = async (req, res) => {
  const { title, startTime, endTime, participants, teamId } = req.body;

  // Validation for missing fields
  if (!startTime || !endTime || !teamId) {
    return res.status(400).json({ message: 'startTime, endTime, and teamId are required.' });
  }

  // Ensure startTime and endTime are valid Date objects
  if (isNaN(new Date(startTime)) || isNaN(new Date(endTime))) {
    return res.status(400).json({ message: 'Invalid startTime or endTime format' });
  }

  try {
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res.status(400).json({ message: 'Invalid participant IDs' });
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    // Check for any conflicts in the team calendar (e.g., overlapping events)
    const teamCalendar = await TeamCalendar.findOne({ teamId });
    if (!teamCalendar) {
      // If no team calendar exists, create a new one
      const newTeamCalendar = new TeamCalendar({ teamId, events: [] });
      await newTeamCalendar.save({ session });
    }

    // Check for event time conflicts with existing events in the team calendar
    const conflictingEvent = teamCalendar.events.find(eventId => {
      const event = Event.findById(eventId);
      return (new Date(startTime) < event.endTime && new Date(endTime) > event.startTime);
    });

    if (conflictingEvent) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'There is a conflict with an existing event' });
    }

    // Create the event
    const event = new Event({
      title,
      startTime,
      endTime,
      createdBy: req.user.id, // The user creating the event
      participants: [req.user.id, ...participants], // Add the creator as a participant
    });

    // Save the event
    await event.save({ session });

    // Add the event to the team calendar
    teamCalendar.events.push(event._id);
    await teamCalendar.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Notify clients about the new event
    notifyClients(event);

    res.status(201).json({ message: 'Event created and added to team calendar', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};


// Get all events for a user
exports.getUserEvents = async (req, res) => {
  const userId = req.params.userId;

  try {
    const events = await Event.find({ participants: userId })
      .populate('createdBy', 'name email') // Populate event creator details
      .populate('participants', 'name email'); // Populate participant details
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Error fetching user events', error });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, date, participants } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the event creator can update the event' });
    }

    // Validate participants, if provided
    if (participants) {
      const validParticipants = await User.find({ _id: { $in: participants } });
      if (validParticipants.length !== participants.length) {
        return res.status(400).json({ message: 'Invalid participant IDs' });
      }
    }

    event.title = title || event.title;
    event.date = date || event.date;
    event.participants = participants || event.participants;

    await event.save();
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the event creator can delete the event' });
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
