/**
 * Activity Graph Components
 * 
 * This module provides a collection of reusable chart components for visualizing
 * different aspects of fitness activities, including speed, heart rate, calories,
 * and overall performance metrics.
 */
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { formatValue } from '../../../../../utilities/valueFormatter';

/**
 * Speed-Time Line Chart
 * Displays speed and elapsed time on separate axes
 */
export const SpeedTimeGraph = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
      <Tooltip />
      <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="elapsedTime" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
);

/**
 * Heart Rate Bar Chart
 * Visualizes heart rate metrics as vertical bars
 */
export const HeartRateGraph = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

/**
 * Calories and Training Load Pie Chart
 * Shows the relationship between calories burned and training load
 */
export const CaloriesLoadGraph = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={index % 2 ? '#82ca9d' : '#8884d8'} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

/**
 * Activity Overview Radar Chart
 * Provides a multi-dimensional view of activity performance metrics
 */
export const OverviewGraph = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
      <PolarGrid gridType="circle" />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
      <Radar name="Activity Overview" dataKey="normalizedValue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      <Tooltip formatter={(value, name, props) => [formatValue(props.payload.originalValue, props.payload.subject), props.payload.subject]} />
    </RadarChart>
  </ResponsiveContainer>
);