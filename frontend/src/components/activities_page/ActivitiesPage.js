/**
 * ActivitiesPage Component
 * 
 * Main container component for the activities section of the application.
 * Handles data fetching, view switching, and UI coordination for all
 * activity-related features.
 * 
 * Features:
 * - View navigation (Dashboard, Activities, Achievements)
 * - Data synchronization with backend
 * - Loading state management
 * - Transition animations between views
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CircularProgress, 
    Container, 
    Box,
    ButtonGroup,
    Button
} from '@mui/material';
import { Analytics, ViewList, EmojiEvents } from '@mui/icons-material';
import Dashboard from './views/Dashboard/Dashboard';
import Activities from './views/Activities/Activities';
import Achievements from './views/Achievements/Achievements';
import LandingPage from '../landing_page/LandingPage';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import axios from 'axios';
import './ActivitiesPage.css';

// View identifiers
const VIEWS = {
    DASHBOARD: 'dashboard',
    ACTIVITIES: 'activities',
    ACHIEVEMENTS: 'achievements'
};

const ActivitiesPage = () => {
    // State management
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
    const [transitionPhase, setTransitionPhase] = useState('landing');
    
    const windowHeight = window.innerHeight;
    const { hasPassedThreshold } = useScrollPosition(0.3);

    // Fetch activities data from the API on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/activities');
                setActivities(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load activities data');
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    /**
     * Handles the "Get Started" action from landing page
     * Smoothly scrolls down to the activities section
     */
    const handleGetStarted = () => {
        window.scrollTo({
            top: windowHeight,
            behavior: 'smooth'
        });
    };

    /**
     * Triggers data synchronization with the Garmin Connect API
     * Updates the local state with fresh activity data
     */
    const handleSync = async () => {
        try {
            setIsLoading(true);
            // First trigger sync on the backend
            await axios.post('http://localhost:5000/api/activities/sync');
            // Then fetch the updated activities
            const response = await axios.get('http://localhost:5000/api/activities');
            setActivities(response.data);
        } catch (err) {
            console.error('Error syncing activities:', err);
            setError('Failed to sync activities');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Renders the appropriate view component based on the current view state
     * @returns {React.Component} The view component to display
     */
    const renderView = () => {
        switch (currentView) {
            case VIEWS.DASHBOARD:
                return <Dashboard 
                    activities={activities} 
                    onSyncActivities={handleSync}
                />;
            case VIEWS.ACTIVITIES:
                return <Activities activities={activities} />;
            case VIEWS.ACHIEVEMENTS:
                return <Achievements activities={activities} />;
            default:
                return <Dashboard 
                    activities={activities} 
                    onSyncActivities={handleSync}
                />;
        }
    };

    // Display loading spinner while fetching initial data
    if (isLoading) {
        return (
            <div className="loading-container">
                <CircularProgress size={60} />
                <div className="loading-text">
                    {activities.length ? 'Syncing activities...' : 'Loading activities...'}
                </div>
            </div>
        );
    }

    // Display error message if data fetching fails
    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="activities-page-container">
            {/* Landing page with parallax effects */}
            <LandingPage 
                onGetStarted={handleGetStarted}
                transitionPhase={transitionPhase}
            />

            {/* Main activities section - appears when scrolled down */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hasPassedThreshold ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="activities-section"
            >
                <Container maxWidth="lg">
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        pt: 4,
                        minHeight: '100vh'
                    }}>
                        {/* View navigation buttons */}
                        <ButtonGroup 
                            variant="contained" 
                            className="view-navigation"
                        >
                            {Object.entries(VIEWS).map(([key, value]) => (
                                <Button
                                    key={value}
                                    startIcon={
                                        value === VIEWS.DASHBOARD ? <Analytics /> :
                                        value === VIEWS.ACTIVITIES ? <ViewList /> :
                                        <EmojiEvents />
                                    }
                                    onClick={() => setCurrentView(value)}
                                    className={currentView === value ? 'active' : ''}
                                >
                                    {value}
                                </Button>
                            ))}
                        </ButtonGroup>

                        {/* View content with transition animations */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentView}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                {renderView()}
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                </Container>
            </motion.div>
        </div>
    );
};

export default ActivitiesPage;