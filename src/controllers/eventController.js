const { notifyClients } = require('../socket/socket');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const TeamCalendar = require('../models/teamCalendar');

exports.createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, participants, location, description, teamId, createdBy } = req.body;

    // Ensure the necessary fields are provided
    if (!teamId || !createdBy) {
      return res.status(400).json({ message: 'teamId and createdBy are required' });
    }

    // Create the event
    const newEvent = new Event({
      title,
      startTime,
      endTime,
      participants,
      location,
      description,
      createdBy, // Adding createdBy field here
    });

    // Save the event
    await newEvent.save();

    // Find or create the team calendar
    let teamCalendar = await TeamCalendar.findOne({ team: teamId });
    if (teamCalendar) {
      teamCalendar.events.push(newEvent._id);
    } else {
      teamCalendar = new TeamCalendar({
        team: teamId,
        createdBy,
        events: [newEvent._id],
      });
    }

    // Save or update the team calendar
    await teamCalendar.save();

    return res.status(201).json({
      message: 'Event successfully added',
      event: newEvent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating event' });
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

exports.addVoteToEvent = async (req, res) => {
  const { eventId } = req.params;
  const { option } = req.body;
  const userId = req.user.id;  // The user making the vote

  // Validation: Check if the option is valid
  if (!option) {
    return res.status(400).json({ message: 'Option is required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already in the list of voters for this option
    const existingVote = event.votes.find(vote => vote.option === option);
    if (existingVote) {
      // Check if the user has already voted for this option
      if (existingVote.voters.includes(userId)) {
        return res.status(400).json({ message: 'You have already voted for this option' });
      }
      // Add the user to the voters array
      existingVote.voters.push(userId);
    } else {
      // If no vote exists for this option, create a new one
      event.votes.push({
        option: option,
        voters: [userId]
      });
    }

    await event.save();
    res.status(200).json({ message: 'Vote added successfully', event });
  } catch (error) {
    console.error('Error voting on event:', error);
    res.status(500).json({ message: 'Error voting on event', error });
  }
};

exports.getVotesForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId)
      .populate('votes.voters', 'name email');  // Populate voter details (name, email)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Respond with the votes and the users who voted for each option
    const votes = event.votes.map(vote => ({
      option: vote.option,
      voters: vote.voters.map(voter => ({
        name: voter.name,
        email: voter.email
      }))
    }));

    res.status(200).json({ votes });
  } catch (error) {
    console.error('Error retrieving event votes:', error);
    res.status(500).json({ message: 'Error retrieving event votes', error });
  }
};
