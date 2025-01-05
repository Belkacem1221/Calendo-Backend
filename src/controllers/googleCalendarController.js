const { google } = require('googleapis');

// Fetch calendar events
exports.getCalendarEvents = async (oauth2Client) => {
  try {
    const events = await google.calendar({ version: 'v3', auth: oauth2Client }).events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return events.data.items;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Error fetching events');
  }
};

// Create a new calendar event
exports.createCalendarEvent = async (oauth2Client, eventData) => {
  try {
    const event = {
      summary: eventData.summary,
      location: eventData.location,
      description: eventData.description,
      start: {
        dateTime: eventData.startTime,
        timeZone: eventData.timeZone || 'UTC', 
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: eventData.timeZone || 'UTC',
      },
    };

    const createdEvent = await google.calendar({ version: 'v3', auth: oauth2Client }).events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return createdEvent.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Error creating event');
  }
};
