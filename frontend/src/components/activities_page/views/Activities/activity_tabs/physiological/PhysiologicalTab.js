/**
 * PhysiologicalTab Component
 * 
 * Visualizes physiological metrics such as heart rate and calories/training load
 * from an activity. Displays multiple graphs to show different aspects of the
 * body's response to the activity.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.activity - The activity data to visualize
 */
import React from 'react';
import { Grid } from '@mui/material';
import { HeartRateGraph, CaloriesLoadGraph } from '../ActivityGraphs';;

const PhysiologicalTab = ({ activity }) => {
  /**
   * Formats heart rate data for visualization
   * @returns {Array} Formatted heart rate data
   */
  const getHeartRateData = () => [
    { name: 'Average HR', value: activity?.avg_hr || 0 },
    { name: 'Max HR', value: activity?.max_hr || 0 }
  ];

  /**
   * Formats calories and training load data for visualization
   * @returns {Array} Formatted calories and training load data
   */
  const getCaloriesLoadData = () => [
    { name: 'Calories', value: activity?.calories || 0 },
    { name: 'Training Load', value: activity?.training_load || 0 }
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <HeartRateGraph data={getHeartRateData()} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CaloriesLoadGraph data={getCaloriesLoadData()} />
      </Grid>
    </Grid>
  );
};

export default PhysiologicalTab;