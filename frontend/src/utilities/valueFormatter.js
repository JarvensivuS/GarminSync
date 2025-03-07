export const formatValue = (value, subject) => {
  if (value === undefined || value === null) return 'N/A';

  // Debug logging to see what's coming in
  console.log('Formatting:', { value, subject });

  // Handle time strings for Duration
  if (subject === 'Duration') {
    if (typeof value === 'string' && value.includes(':')) {
      return value; // Already formatted time string
    }
    // Convert seconds to HH:mm:ss
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'N/A';

  // Simplified case matching
  switch (subject) {
    case 'Distance':
      return `${numValue.toFixed(2)} km`;

    case 'Speed':
    case 'Avg Speed':
    case 'Max Speed':
      return `${numValue.toFixed(2)} km/h`;

    case 'Calories':
      return `${Math.round(numValue)}`;

    case 'VO2 Max':
    case 'VO2':    // Add alternate name
      return `${numValue.toFixed(1)} ml/kg/min`;

    case 'Steps':
      return `${Math.round(numValue)}`;

    case 'HR':     // Add the simple HR case
    case 'Heart Rate':
    case 'Avg HR':
    case 'Max HR':
      return `${Math.round(numValue)} bpm`;

    case 'Training Effect':
    case 'Training Load':
      return numValue.toFixed(2);

    default:
      console.log('Using default formatter for:', subject);
      return numValue.toFixed(2);
  }
};

// Optional: Add a helper to normalize subject names
export const normalizeSubject = (subject) => {
  // Strip spaces and convert to lowercase for consistent matching
  const normalized = subject.toLowerCase().replace(/\s+/g, '');
  
  // Map of normalized names to standardized names
  const subjectMap = {
    'hr': 'HR',
    'heartrate': 'HR',
    'avghr': 'HR',
    'maxhr': 'HR',
    'speed': 'Speed',
    'avgspeed': 'Speed',
    'maxspeed': 'Speed',
    'vo2max': 'VO2 Max',
    'vo2': 'VO2 Max',
  };

  return subjectMap[normalized] || subject;
};