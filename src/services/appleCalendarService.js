const fetch = require('node-fetch');

// Function to get Apple Calendar events
const getAppleCalendarEvents = async (accessToken) => {
  try {
    const response = await fetch('https://api.apple.com/calendar/events', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.events;
    } else {
      throw new Error('Failed to fetch Apple Calendar events');
    }
  } catch (error) {
    console.error('Error fetching Apple Calendar events:', error);
    throw new Error('Error fetching Apple Calendar events');
  }
};

module.exports = { getAppleCalendarEvents };
