const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, date, participants } = req.body;

  try {
    const event = new Event({
      title,
      date,
      createdBy: req.user.id, // The user creating the event
      participants: [req.user.id, ...participants] // Add the creator as a participant
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Get all events for a user
exports.getUserEvents = async (req, res) => {
  const userId = req.params.userId;

  try {
    const events = await Event.find({ participants: userId })
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');
    res.status(200).json({ events });
  } catch (error) {
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
  
      event.title = title || event.title;
      event.date = date || event.date;
      event.participants = participants || event.participants;
  
      await event.save();
      res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
      res.status(500).json({ message: 'Error updating event', error });
    }
  };
  
  // Delete an event
  exports.deleteEvent = async (req, res) => {
    const { eventId } = req.params;
    
    try {
      // Find the event by its ID
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Check if the logged-in user is the event creator
      if (event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Only the event creator can delete the event' });
      }
  
      // Delete the event using findByIdAndDelete
      await Event.findByIdAndDelete(eventId);
  
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.log(error); // Log error for more details
      res.status(500).json({ message: 'Error deleting event', error });
    }
  };
  