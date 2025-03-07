/**
 * ActivityDetail Component
 * 
 * Modal component that displays detailed information about a selected activity.
 * Includes multiple tabs for different aspects of the activity data:
 * - Overview (performance radar chart)
 * - Performance (speed & pace metrics)
 * - Physiological (heart rate & calories)
 * - Map (GPS route visualization)
 * 
 * The component fetches additional data like GPS coordinates when opened.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useMediaQuery, Modal, Box, Typography, IconButton, Tabs, Tab, CircularProgress, Fade, Alert } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import ActivityIcon from './ActivityIcon';
import './styles/styles.css';
import OverviewTab from './activity_tabs/overview/OverviewTab';
import PerformanceTab from './activity_tabs/performance/PerformanceTab';
import PhysiologicalTab from './activity_tabs/physiological/PhysiologicalTab';
import MapTab from './activity_tabs/map/MapTab';

const ActivityDetail = ({ activity, isOpen, onClose }) => {
  // State for tab selection and data loading
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isMaxValuesLoading, setMaxValuesLoading] = useState(true);
  const [gpsData, setGpsData] = useState([]);
  const [error, setError] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [maxValues, setMaxValues] = useState({
    Distance: 50,
    Duration: 10800,
    'Avg Speed': 30,
    Calories: 2000,
    'Avg HR': 200
  });

  /**
   * Fetch maximum values for performance comparisons
   * Try to use cached values first, then fetch from API
   */
  const fetchMaxValues = useCallback(async () => {
    setMaxValuesLoading(true);
    try {
      const storedMaxValues = localStorage.getItem('maxValues');
      if (storedMaxValues) {
        const parsedValues = JSON.parse(storedMaxValues);
        console.log("Stored max values:", parsedValues);
        setMaxValues(parsedValues);
      } else {
        const response = await axios.get('http://localhost:5000/api/activities/max_values');
        console.log("Fetched max values:", response.data);
        setMaxValues(response.data);
        localStorage.setItem('maxValues', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching max values:", error);
      setError("Failed to fetch maximum values. Using default values.");
    } finally {
      setMaxValuesLoading(false);
    }
  }, []);

  /**
   * Fetch GPS data for the selected activity
   */
  const fetchGpsData = useCallback(async () => {
    if (!activity) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/activities/${activity.activity_id}/gps`);
      setGpsData(response.data);
    } catch (error) {
      console.error("Error fetching GPS data:", error);
      setGpsData([]);
      setError("Failed to fetch GPS data. Map view might not be available.");
    } finally {
      setLoading(false);
    }
  }, [activity]);

  // Fetch data when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchGpsData();
      fetchMaxValues();
    }
  }, [isOpen, activity, fetchGpsData, fetchMaxValues]);

  /**
   * Handle tab changes
   */
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  /**
   * Render the active tab content
   */
  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return <OverviewTab activity={activity} maxValues={maxValues} />;
      case 1:
        return <PerformanceTab activity={activity} />;
      case 2:
        return <PhysiologicalTab activity={activity} />;
      case 3:
        return <MapTab gpsData={gpsData} />;
      default:
        return null;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} closeAfterTransition>
      <Fade in={isOpen}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '95%' : '80%',
          height: isSmallScreen ? '95%' : '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflow: 'auto'
        }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ActivityIcon sport={activity?.sport} sx={{ mr: 1 }} />
            {activity?.locationName} - {activity?.sport}
          </Typography>

          <Typography variant="body1" gutterBottom>
            Date: {activity?.start_time ? new Date(activity.start_time).toLocaleString() : 'N/A'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {isLoading || isMaxValuesLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={2}>
              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="activity details tabs">
                <Tab label="Overview" />
                <Tab label="Performance" />
                <Tab label="Physiological" />
                <Tab label="Map" />
              </Tabs>
              <Box mt={2}>{renderTabContent()}</Box>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ActivityDetail;