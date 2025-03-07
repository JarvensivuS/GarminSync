/**
 * Achievements Component
 * 
 * Analyzes activity data to identify and display personal records across
 * different performance categories. Presents achievements as visually
 * engaging cards with category-specific styling.
 * 
 * Categories include:
 * - Fastest Pace
 * - Peak Training Effect
 * - Maximum Calorie Burn
 * - Highest Heart Rate
 * - Best VO2 Max
 * 
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects to analyze
 * @param {Function} props.onActivityClick - Callback for achievement card clicks
 */
import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AchievementCard from './AchievementCard';
import './styles/styles.css';

const Achievements = ({ activities, onActivityClick }) => {
    /**
     * Analyze activities to identify personal records
     * Memo is used to avoid recalculating on every render
     */
    const achievements = useMemo(() => {
        if (!activities?.length) return [];

        // Initialize records for different categories
        let bestPace = null;
        let bestTrainingEffect = null;
        let maxCalories = null;
        let maxHeartRate = null;
        let bestVO2Max = null;

        activities.forEach(activity => {
            if (!activity) return;

            // Calculate pace (min/km)
            const pace = activity.elapsed_time && activity.distance ? 
                (timeToSeconds(activity.elapsed_time) / 60) / activity.distance : Infinity;

            // Best Pace
            if (pace !== Infinity && (!bestPace || pace < bestPace.pace)) {
                bestPace = {
                    ...activity,
                    pace,
                    achievementType: 'pace',
                    themeColor: 'rgb(59, 130, 246)', // Blue
                    title: 'Fastest Pace'
                };
            }

            // Best Training Effect
            if (activity.training_effect && (!bestTrainingEffect || activity.training_effect > bestTrainingEffect.training_effect)) {
                bestTrainingEffect = {
                    ...activity,
                    achievementType: 'training_effect',
                    themeColor: 'rgb(139, 92, 246)', // Purple
                    title: 'Peak Training Effect'
                };
            }

            // Max Calories
            if (activity.calories && (!maxCalories || activity.calories > maxCalories.calories)) {
                maxCalories = {
                    ...activity,
                    achievementType: 'calories',
                    themeColor: 'rgb(249, 115, 22)', // Orange
                    title: 'Maximum Calorie Burn'
                };
            }

            // Max Heart Rate
            if (activity.max_hr && (!maxHeartRate || activity.max_hr > maxHeartRate.max_hr)) {
                maxHeartRate = {
                    ...activity,
                    achievementType: 'heart_rate',
                    themeColor: 'rgb(239, 68, 68)', // Red
                    title: 'Highest Heart Rate'
                };
            }

            // Best VO2 Max
            if (activity.vO2MaxValue && (!bestVO2Max || activity.vO2MaxValue > bestVO2Max.vO2MaxValue)) {
                bestVO2Max = {
                    ...activity,
                    achievementType: 'vo2max',
                    themeColor: 'rgb(34, 197, 94)', // Green
                    title: 'Best VO2 Max'
                };
            }
        });

        // Return array of valid records
        return [bestPace, bestTrainingEffect, maxCalories, maxHeartRate, bestVO2Max]
            .filter(record => record !== null);
    }, [activities]);

    if (!activities?.length) {
        return null;
    }

    return (
        <Box className="achievements-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h4" className="achievements-title">
                    Personal Records
                </Typography>
            </motion.div>

            <Box className="achievements-grid">
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={`${achievement.activity_id}-${achievement.achievementType}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <AchievementCard
                            achievement={achievement}
                            onActivityClick={onActivityClick}
                        />
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

// Helper function to convert time string to seconds
const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

export default Achievements;