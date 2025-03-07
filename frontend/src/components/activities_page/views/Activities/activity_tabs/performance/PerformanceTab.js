/**
 * PerformanceTab Component
 * 
 * Visualizes the performance metrics of an activity by displaying
 * a line chart comparing speed and time data.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.activity - The activity data to be visualized
 */
import React from 'react';
import { SpeedTimeGraph } from '../ActivityGraphs';

const PerformanceTab = ({ activity }) => {
  /**
   * Formats activity data for the speed-time chart
   * @returns {Array} Formatted data points for the chart
   */
  const getSpeedTimeData = () => [
    { name: 'Average', speed: activity?.avg_speed || 0, elapsedTime: activity?.elapsed_time || 0 },
    { name: 'Maximum', speed: activity?.max_speed || 0, elapsedTime: activity?.elapsed_time || 0 }
  ];

  return <SpeedTimeGraph data={getSpeedTimeData()} />;
};

export default PerformanceTab;