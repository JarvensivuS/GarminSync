/**
 * Activities Component
 * 
 * Main component for displaying a grid of activity cards with sorting, filtering,
 * and pagination capabilities. Serves as a hub for browsing and selecting activities.
 * 
 * Features:
 * - Sort activities by different metrics (date, duration, distance, etc.)
 * - Paginate through multiple activities
 * - Open detailed activity information in a modal
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, IconText } from '../../../ui/Card';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Container, Pagination } from '@mui/material';
import { Speed, AccessTime, LocalDining, Favorite, DirectionsRun } from '@mui/icons-material';
import ActivityDetail from './ActivityDetail';
import './styles/styles.css';

/**
 * Format time string for display (HH:MM:SS)
 * @param {string} time - Time string to format
 * @return {string} Formatted time string
 */
const formatElapsedTime = (time) => {
  const [hours, minutes, seconds] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.split('.')[0].padStart(2, '0')}`;
};

// Number of activities to display per page
const ACTIVITIES_PER_PAGE = 9;

const Activities = () => {
  // State management
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load activities on component mount
  useEffect(() => {
    fetchActivities();
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = 'none';
    };
  }, []);

  /**
   * Fetch activities from the API
   */
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/activities");
      setActivities(response.data);
      setTotalPages(Math.ceil(response.data.length / ACTIVITIES_PER_PAGE));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  /**
   * Sort activities based on the selected criterion
   * @param {string} option - Sort criterion
   */
  const handleSort = (option) => {
    setSortOption(option);
    const sortedActivities = [...activities].sort((a, b) => {
      switch (option) {
        case 'date':
          return new Date(b.start_time) - new Date(a.start_time);
        case 'duration':
          return convertToSeconds(b.elapsed_time) - convertToSeconds(a.elapsed_time);
        case 'distance':
          return b.distance - a.distance;
        case 'calories':
          return b.calories - a.calories;
        case 'avgSpeed':
          return b.avg_speed - a.avg_speed;
        default:
          return 0;
      }
    });
    setActivities(sortedActivities);
    setPage(1);
  };

  /**
   * Convert time string to seconds for comparison
   * @param {string} time - Time string in HH:MM:SS format
   * @return {number} Total seconds
   */
  const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  /**
   * Open modal with details for a specific activity
   * @param {Object} activity - Activity to display
   */
  const handleOpenModal = (activity) => {
    console.log("Opening modal with activity:", activity);
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  /**
   * Close the activity detail modal
   */
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedActivity(null);
  };

  /**
   * Handle pagination changes
   * @param {Event} event - Event object
   * @param {number} value - New page number
   */
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get activities for the current page
  const paginatedActivities = activities.slice(
    (page - 1) * ACTIVITIES_PER_PAGE,
    page * ACTIVITIES_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Garmin Activities
      </Typography>

      <FormControl fullWidth sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1 }}>
        <InputLabel id="sort-select-label">Sort by</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          label="Sort by"
          onChange={(e) => handleSort(e.target.value)}
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="duration">Duration</MenuItem>
          <MenuItem value="distance">Distance</MenuItem>
          <MenuItem value="calories">Calories</MenuItem>
          <MenuItem value="avgSpeed">Average Speed</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {paginatedActivities.map((activity) => (
          <Card 
            key={activity.activity_id}
            onClick={() => handleOpenModal(activity)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
              },
            }}
          >
            <CardHeader
              title={`${activity.locationName} - ${activity.sport}`}
              sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', pb: 1 }}
            />
            <CardContent>
              <IconText Icon={AccessTime} text="Time" value={formatElapsedTime(activity.elapsed_time)} />
              <IconText Icon={Speed} text="Avg Speed" value={`${activity.avg_speed} Km/h`} />
              <IconText Icon={DirectionsRun} text="Distance" value={`${activity.distance} km`} />
              <IconText Icon={LocalDining} text="Calories" value={activity.calories} />
              <IconText Icon={Favorite} text="Avg HR" value={activity.avg_hr} />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
          sx={{ '& .MuiPaginationItem-root': { color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' } }}
        />
      </Box>

      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
};

export default Activities;