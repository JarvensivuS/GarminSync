/**
 * OverviewTab Component
 * 
 * Displays a comparative performance radar chart showing how the current activity
 * compares to the user's personal bests across multiple metrics, alongside quick stats.
 * 
 * @component
 */
import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { formatValue } from '../../../../../../utilities/valueFormatter';
import { timeToSeconds } from '../../../../../../utilities/time';
import axios from 'axios';
import './styles/styles.css';

/**
 * OverviewTab displays performance metrics compared to personal best records
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.activity - The current activity data to display
 * @returns {JSX.Element} The rendered component
 */
const OverviewTab = ({ activity }) => {
  // State to store maximum values for comparison
  const [maxValues, setMaxValues] = useState({
    Distance: 0,
    Duration: 0,
    'Avg Speed': 0,
    Calories: 0,
    'Max HR': 0
  });

  // Fetch maximum values from API on component mount
  useEffect(() => {
    const fetchMaxValues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/activities');
        const activities = response.data;
        
        // Calculate max values from all activities
        const calculatedMaxValues = activities.reduce((max, act) => ({
          Distance: Math.max(max.Distance, act.distance || 0),
          Duration: Math.max(max.Duration, timeToSeconds(act.elapsed_time) || 0),
          'Avg Speed': Math.max(max['Avg Speed'], act.avg_speed || 0),
          Calories: Math.max(max.Calories, act.calories || 0),
          'Max HR': Math.max(max['Max HR'], act.max_hr || 0)
        }), {
          Distance: 0,
          Duration: 0,
          'Avg Speed': 0,
          Calories: 0,
          'Max HR': 0
        });

        setMaxValues(calculatedMaxValues);
      } catch (error) {
        console.error('Error fetching activities for max values:', error);
      }
    };

    fetchMaxValues();
  }, []);

  /**
   * Prepare data for the radar chart
   * 
   * @returns {Array} Array of data points for the radar chart
   */
  const getOverviewData = () => {
    if (!activity || !maxValues) return [];

    /**
     * Calculate percentage of performance compared to personal best
     * 
     * @param {number} value - Current activity value
     * @param {number} maxValue - Personal best value
     * @returns {number} Percentage (0-100) of performance
     */
    const calculatePerformancePercentage = (value, maxValue) => {
      if (!value || !maxValue) return 0;
      const percentage = (Number(value) / Number(maxValue)) * 100;
      return Math.min(Math.round(percentage), 100); // Round and cap at 100%
    };

    return [
      {
        subject: 'Distance',
        value: activity.distance,
        maxValue: maxValues.Distance,
        percentage: calculatePerformancePercentage(activity.distance, maxValues.Distance)
      },
      {
        subject: 'Duration',
        value: activity.elapsed_time,
        maxValue: maxValues.Duration,
        percentage: calculatePerformancePercentage(
          timeToSeconds(activity.elapsed_time),
          maxValues.Duration
        )
      },
      {
        subject: 'Speed',
        value: activity.avg_speed,
        maxValue: maxValues['Avg Speed'],
        percentage: calculatePerformancePercentage(activity.avg_speed, maxValues['Avg Speed'])
      },
      {
        subject: 'Calories',
        value: activity.calories,
        maxValue: maxValues.Calories,
        percentage: calculatePerformancePercentage(activity.calories, maxValues.Calories)
      },
      {
        subject: 'Peak HR',
        value: activity.max_hr,
        maxValue: maxValues['Max HR'],
        percentage: calculatePerformancePercentage(activity.max_hr, maxValues['Max HR'])
      }
    ];
  };

  /**
   * Custom tooltip component for the radar chart
   * 
   * @param {Object} props - Tooltip props from Recharts
   * @returns {JSX.Element|null} Tooltip component or null if inactive
   */
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-title">{data.subject}</div>
        <div className="tooltip-content">
          Current: {formatValue(data.value, data.subject)}
        </div>
        <div className="tooltip-pb">
          Personal Best: {formatValue(data.maxValue, data.subject)}
        </div>
        <div className="tooltip-percentage">
          {Math.round(data.percentage)}% of PB
        </div>
      </div>
    );
  };

  /**
   * Get color based on performance percentage
   * 
   * @param {number} percentage - Performance percentage
   * @returns {string} Color value
   */
  const getQuickStatColor = (percentage) => {
    if (percentage >= 90) return 'var(--success-color)';
    if (percentage >= 70) return '#FFB020';
    return '#FF6B6B';
  };

  return (
    <Grid container spacing={3}>
      {/* Radar Chart Section */}
      <Grid item xs={12} md={8}>
        <div className="overview-container">
          <div className="overview-header">
            <h2 className="overview-title">Performance vs Personal Best</h2>
            <MuiTooltip 
              title="This graph shows how the current activity compares to your personal best performances. Each axis represents a percentage of your best achievement in that category."
              arrow
              placement="top"
            >
              <IconButton size="small" className="info-button">
                <InfoOutlined />
              </IconButton>
            </MuiTooltip>
          </div>
          
          <div className="radar-container">
            <ResponsiveContainer>
              <RadarChart 
                data={getOverviewData()}
                margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
              >
                <PolarGrid 
                  gridType="polygon"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth={1}
                  gridRadius={5}
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: '#e2e8f0',
                    fontSize: 14,
                    fontFamily: 'Monument Extended',
                    letterSpacing: '0.05em',
                    dy: 14
                  }}
                  stroke="rgba(255, 255, 255, 0.2)"
                />
                <PolarRadiusAxis 
                  angle={90}
                  domain={[0, 100]}
                  tick={{ 
                    fill: '#e2e8f0',
                    fontSize: 12,
                    fontFamily: 'Monument Extended'
                  }}
                  stroke="rgba(255, 255, 255, 0.2)"
                  tickCount={5}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                />
                <Radar
                  name="Activity Performance"
                  dataKey="percentage"
                  className="radar-shape"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={false}
                  wrapperStyle={{ outline: 'none' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Grid>

      {/* Quick Stats Section */}
      <Grid item xs={12} md={4}>
        <div className="quick-stats-container">
          <h3 className="quick-stats-title">Quick Stats</h3>
          
          {getOverviewData().map((metric) => (
            <div key={metric.subject} className="stat-item">
              <span className="stat-label">{metric.subject}</span>
              <div className="stat-value-container">
                <span className="stat-value">
                  {formatValue(metric.value, metric.subject)}
                </span>
                <span 
                  className="stat-percentage"
                  style={{ 
                    color: getQuickStatColor(metric.percentage),
                    backgroundColor: `${getQuickStatColor(metric.percentage)}15`
                  }}
                >
                  {Math.round(metric.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default OverviewTab;