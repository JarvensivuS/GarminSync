/**
 * AchievementCard Component
 * 
 * Displays a highlighted achievement card for a notable activity accomplishment.
 * Features animated icons, custom color schemes based on achievement type,
 * and interactive hover effects.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.achievement - Achievement data with activity and achievement type
 * @param {Function} props.onActivityClick - Callback for when card is clicked
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
    DirectionsRun,
    Timeline,
    LocalDining,
    MonitorHeart,
    TrendingUp,
    Speed,
    Favorite
} from '@mui/icons-material';
import { timeToSeconds } from '../../../../utilities/time';

const AchievementCard = ({ achievement, onActivityClick }) => {  
    if (!achievement) return null;

    // Configuration for different achievement types
    const achievementConfig = {
        pace: {
            icon: DirectionsRun,
            color: '#3B82F6',
            getValue: (activity) => {
                if (!activity.elapsed_time || !activity.distance) return 'N/A';
                const totalSeconds = timeToSeconds(activity.elapsed_time);
                const paceSeconds = Math.round(totalSeconds / activity.distance);
                const paceMinutes = Math.floor(paceSeconds / 60);
                const remainingSeconds = Math.round(paceSeconds % 60);
                return `${paceMinutes}:${remainingSeconds.toString().padStart(2, '0')}/km`;
            },
            getSubValue: (activity) => `${activity.distance?.toFixed(2)} km in ${activity.elapsed_time}`
        },
        training_effect: {
            icon: Timeline,
            color: '#8B5CF6',
            getValue: (activity) => activity.training_effect?.toFixed(1),
            getSubValue: (activity) => `Training Load: ${activity.training_load || 0}`
        },
        calories: {
            icon: LocalDining,
            color: '#F97316',
            getValue: (activity) => activity.calories,
            getSubValue: () => 'kcal'
        },
        heart_rate: {
            icon: MonitorHeart,
            color: '#EF4444',
            getValue: (activity) => activity.max_hr,
            getSubValue: (activity) => `Avg HR: ${activity.avg_hr || 0} bpm`
        },
        vo2max: {
            icon: TrendingUp,
            color: '#22C55E',
            getValue: (activity) => activity.vO2MaxValue?.toFixed(1),
            getSubValue: () => 'ml/kg/min'
        }
    };

    // Get configuration for this achievement type
    const config = achievementConfig[achievement.achievementType];
    if (!config) return null;

    const Icon = config.icon;
    const themeColor = config.color;

    /**
     * Handle card click
     */
    const handleClick = () => {
        if (onActivityClick && typeof onActivityClick === 'function') {
            onActivityClick(achievement);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 30px ${themeColor}33`
            }}
            whileTap={{ scale: 0.98 }}
            className="achievement-card"
            onClick={handleClick} 
            style={{
                '--theme-color': themeColor,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${themeColor}22`,
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
        >
            <div className="card-header" style={{ 
                background: `linear-gradient(90deg, ${themeColor}33 0%, ${themeColor}11 100%)`,
                padding: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <Icon sx={{ 
                    color: themeColor,
                    filter: `drop-shadow(0 0 10px ${themeColor})`,
                    animation: 'iconPulse 2s infinite'
                }} />
                <span style={{ 
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}>
                    {achievement.title}
                </span>
            </div>

            <div style={{ padding: '1.5rem' }}>
                <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Icon sx={{ 
                        fontSize: '2.5rem',
                        marginRight: '1rem',
                        color: themeColor,
                        filter: `drop-shadow(0 0 15px ${themeColor})`,
                        animation: 'iconPulse 2s infinite'
                    }} />
                    <div>
                        <div style={{ 
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#fff',
                            lineHeight: 1,
                            textShadow: `0 0 20px ${themeColor}`
                        }}>
                            {config.getValue(achievement)}
                        </div>
                        <div style={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginTop: '0.25rem'
                        }}>
                            {config.getSubValue(achievement)}
                        </div>
                    </div>
                </div>

                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                }}>
                    <div className="metric">
                        <Speed sx={{ color: themeColor }} />
                        <span>{achievement.avg_speed || 0} km/h</span>
                    </div>
                    <div className="metric">
                        <Favorite sx={{ color: themeColor }} />
                        <span>{achievement.avg_hr || 0} bpm</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementCard;