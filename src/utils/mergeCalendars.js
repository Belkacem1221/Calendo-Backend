const moment = require('moment');

/**
 * Merge multiple team calendars into one.
 * @param {Array} teamEvents - Array of team member events.
 * @returns {Object} - Merged calendar with free/occupied slots.
 */
const mergeTeamCalendars = (teamEvents) => {
  const allEvents = [];

  // Flatten events from all team members
  teamEvents.forEach(({ memberId, events }) => {
    events.forEach((event) => {
      allEvents.push({
        memberId,
        startTime: moment(event.start.dateTime),
        endTime: moment(event.end.dateTime),
      });
    });
  });

  // Sort events by start time
  allEvents.sort((a, b) => a.startTime - b.startTime);

  // Merge and calculate free/occupied slots
  const mergedCalendar = [];
  let currentEnd = null;

  allEvents.forEach((event) => {
    if (!currentEnd || event.startTime.isAfter(currentEnd)) {
      // Free slot
      if (currentEnd) {
        mergedCalendar.push({ type: 'free', startTime: currentEnd, endTime: event.startTime });
      }
      // Occupied slot
      mergedCalendar.push({ type: 'occupied', ...event });
      currentEnd = event.endTime;
    } else if (event.endTime.isAfter(currentEnd)) {
      currentEnd = event.endTime;
    }
  });

  return mergedCalendar;
};

module.exports = mergeTeamCalendars;
