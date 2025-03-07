/**
 * ActivityIcon Component
 * 
 * Displays an appropriate icon based on the activity sport type.
 * Maps sport types to corresponding Material UI icons.
 * 
 * @param {Object} props - Component props
 * @param {string} props.sport - Sport type identifier
 * @returns {React.Component} - Material UI icon corresponding to the sport
 */
import React from 'react';
import { DirectionsRun, DirectionsBike, Pool, FitnessCenter } from '@mui/icons-material';

const ActivityIcon = ({ sport }) => {
  // Map sport types to appropriate icons
  switch (sport?.toLowerCase()) {
    case 'running':
      return <DirectionsRun />;
    case 'cycling':
      return <DirectionsBike />;
    case 'swimming':
      return <Pool />;
    case 'strength_training':
      return <FitnessCenter />;
    default:
      return null;
  }
};

export default ActivityIcon;