// utilities/activitySorter.js

/**
 * Sort activities based on different criteria
 * @param {Array} activities - Array of activity objects
 * @param {string} sortOption - Sort criteria
 * @returns {Array} Sorted activities array
 */
export const sortActivities = (activities, sortOption) => {
    if (!activities?.length) return [];
    
    return [...activities].sort((a, b) => {
        switch (sortOption) {
            case 'date':
                return new Date(b.start_time) - new Date(a.start_time);
            case 'duration':
                return (b.elapsed_time || '').localeCompare(a.elapsed_time || '');
            case 'distance':
                return (b.distance || 0) - (a.distance || 0);
            case 'calories':
                return (b.calories || 0) - (a.calories || 0);
            case 'avgSpeed':
                return (b.avg_speed || 0) - (a.avg_speed || 0);
            default:
                return 0;
        }
    });
};

/**
 * Get available sort options
 * @returns {Array} Array of sort option objects
 */
export const getSortOptions = () => [
    { value: 'date', label: 'Date' },
    { value: 'duration', label: 'Duration' },
    { value: 'distance', label: 'Distance' },
    { value: 'calories', label: 'Calories' },
    { value: 'avgSpeed', label: 'Average Speed' }
];