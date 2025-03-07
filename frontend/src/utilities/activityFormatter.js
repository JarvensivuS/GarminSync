// utilities/activityFormatter.js

/**
 * Formats elapsed time string into a consistent format
 * @param {string} time - Time string in format "HH:mm:ss"
 * @returns {string} Formatted time string
 */
export const formatElapsedTime = (time) => {
    if (!time) return '00:00:00';
    const [hours, minutes, seconds] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.split('.')[0].padStart(2, '0')}`;
};

/**
 * Formats activity metrics for display
 * @param {number} value - The value to format
 * @param {string} metric - Type of metric (speed, distance, etc.)
 * @returns {string} Formatted metric string
 */
export const formatActivityMetric = (value, metric) => {
    switch (metric) {
        case 'speed':
            return `${value?.toFixed(2) || 0} Km/h`;
        case 'distance':
            return `${value?.toFixed(2) || 0} km`;
        case 'calories':
            return `${Math.round(value) || 0}`;
        case 'heartRate':
            return `${Math.round(value) || 0} bpm`;
        default:
            return `${value || 0}`;
    }
};

/**
 * Formats location and sport title
 * @param {string} location - Activity location
 * @param {string} sport - Sport type
 * @returns {string} Formatted title
 */
export const formatActivityTitle = (location, sport) => {
    return `${location || 'Unknown Location'} - ${sport}`;
};