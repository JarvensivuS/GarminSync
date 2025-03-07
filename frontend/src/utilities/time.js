export const timeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const timeToMinutes = (timeString) => {
  return timeToSeconds(timeString) / 60;
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculatePace = (timeString, distance) => {
  if (!timeString || !distance || distance === 0) return null;
  
  const totalSeconds = timeToSeconds(timeString);
  const paceSeconds = totalSeconds / distance;
  
  const paceMinutes = Math.floor(paceSeconds / 60);
  const remainingSeconds = Math.floor(paceSeconds % 60);
  
  return {
      paceMinutes,
      paceSeconds: remainingSeconds,
      totalSeconds: paceSeconds,
      formatted: `${paceMinutes}:${remainingSeconds.toString().padStart(2, '0')}/km`
  };
};

export const formatTime = (timeString) => {
  if (!timeString) return '00:00:00';
  // Remove any milliseconds from the time string
  return timeString.split('.')[0];
};

export const formatPace = (timeString, distance) => {
  const pace = calculatePace(timeString, distance);
  return pace ? pace.formatted : 'N/A';
};

// Helper function for sorting activities by pace
export const comparePaceActivities = (a, b) => {
  if (!a.elapsed_time || !a.distance || !b.elapsed_time || !b.distance) return 0;
  const paceA = timeToSeconds(a.elapsed_time) / a.distance;
  const paceB = timeToSeconds(b.elapsed_time) / b.distance;
  return paceA - paceB;
};

// Get pace components separately if needed
export const getPaceComponents = (timeString, distance) => {
  const pace = calculatePace(timeString, distance);
  if (!pace) return { minutes: 0, seconds: 0 };
  return {
      minutes: pace.paceMinutes,
      seconds: pace.paceSeconds
  };
};