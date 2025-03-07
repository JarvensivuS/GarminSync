import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import ActivitiesPage from '../components/activities_page/ActivitiesPage';
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const preloadVideos = async () => {
            try {
                await Promise.all([
                    preloadVideo('/videos/landing_bg.webm'),
                    preloadVideo('/videos/activity_bg.webm')
                ]);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load videos:', error);
                setIsLoading(false);
            }
        };

        preloadVideos();
    }, []);

    const preloadVideo = (src) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.onloadeddata = () => resolve();
            video.onerror = () => reject();
            video.src = src;
        });
    };

    return (
        <div className="App">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        className="loading-container"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CircularProgress size={60} />
                        <div className="loading-text">
                            Loading...
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ActivitiesPage />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;