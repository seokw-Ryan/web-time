import { DateTime } from 'luxon';

// Convert UTC time to user's local time
export const utcToLocal = (utcDateString, userTimeZone) => {
    return DateTime.fromISO(utcDateString, { zone: 'utc' })
        .setZone(userTimeZone)
        .toISO();
};

// Convert user's local time to UTC
export const localToUtc = (localDateString, userTimeZone) => {
    return DateTime.fromISO(localDateString, { zone: userTimeZone })
        .toUTC()
        .toISO();
};

// Format date and time for display
export const formatDateTime = (dateString, userTimeZone, format = 'yyyy-MM-dd HH:mm') => {
    return DateTime.fromISO(dateString)
        .setZone(userTimeZone)
        .toFormat(format);
};

// Get user's current time zone
export const getUserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Check if a date is today in the user's time zone
export const isToday = (dateString, userTimeZone) => {
    const userDateTime = DateTime.fromISO(dateString, { zone: userTimeZone });
    const now = DateTime.now().setZone(userTimeZone);
    return userDateTime.hasSame(now, 'day');
};
