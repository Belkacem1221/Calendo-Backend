const { google } = require('googleapis');

// Initialize the Google Calendar API client
const calendar = google.calendar('v3');

/**
 * Get the events of a user from their Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @returns {Promise<Object>} - List of events.
 */
const getCalendarEvents = async (oauth2Client) => {
  try {
    const events = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'primary', // 'primary' refers to the main Google Calendar
      timeMin: (new Date()).toISOString(), // Only events after the current time
      maxResults: 10, // Get the first 10 events
      singleEvents: true, // Get events that repeat
      orderBy: 'startTime',
    });

    return events.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Error fetching calendar events');
  }
};

/**
 * Create an event on the user's Google Calendar.
 * @param {Object} oauth2Client - The authenticated OAuth2 client.
 * @param {Object} eventData - Event data to be created.
 * @returns {Promise<Object>} - Created event details.
 */
const createCalendarEvent = async (oauth2Client, eventData) => {
  try {
    const event = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary', // 'primary' refers to the main Google Calendar
      resource: eventData,
    });

    return event.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Error creating calendar event');
  }
};

module.exports = { getCalendarEvents, createCalendarEvent };
