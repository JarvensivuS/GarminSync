/**
 * OverviewGraph Component
 * 
 * A radar chart component that displays performance metrics for an activity.
 * Includes custom tooltip formatting to show original values alongside normalized scores.
 */
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { formatValue } from '../../../utilities/valueFormatter';

/**
 * Custom tooltip component that displays the metric name, current value, and maximum value
 */
const OverviewGraph = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    // Only render tooltip when hovering over data
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #666',
        padding: '12px',
        borderRadius: '4px',
      }}>
        <div style={{ 
          color: '#fff',
          marginBottom: '4px',
          fontWeight: 'bold'
        }}>
          {data.subject}
        </div>
        <div style={{ color: '#fff' }}>
          Current: {formatValue(data.value, data.subject)}
        </div>
        <div style={{ color: '#8884d8' }}>
          Max: {formatValue(data.max, data.subject)}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="70%" 
        data={data}
      >
        <PolarGrid 
          gridType="polygon"
          stroke="rgba(255, 255, 255, 0.3)"
        />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ 
            fill: '#fff',
            fontSize: 12,
            fontWeight: 500
          }}
          stroke="rgba(255, 255, 255, 0.3)"
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]}
          tick={{ 
            fill: '#fff',
            fontSize: 10 
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          tickFormatter={(value) => `${value}%`}
        />
        <Radar
          name="Activity"
          dataKey="normalizedValue"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default OverviewGraph;