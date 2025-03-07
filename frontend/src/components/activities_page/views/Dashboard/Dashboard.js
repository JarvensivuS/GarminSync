/**
 * Dashboard Component
 * 
 * Displays summary statistics and visualizations for user activities
 * based on the selected time period.
 */
import React, { useMemo, useState } from 'react';
import { Sync } from '@mui/icons-material'; 
import { motion } from 'framer-motion';
import { 
    Typography, 
    Grid, 
    Box,
    Button,
    Menu,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { 
    DirectionsRun, 
    Favorite, 
    LocalFireDepartment, 
    Timer,
    CalendarToday,
    KeyboardArrowDown 
} from '@mui/icons-material';
import { Card, CardContent, CardHeader } from '../../../ui/Card';
import { 
    LineChart, 
    Line, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    Radar, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis 
} from 'recharts';
import './styles/styles.css';

// Time period options for filtering data
const TIME_PERIODS = {
    WEEK: { days: 7, label: 'Last 7 Days' },
    MONTH: { days: 30, label: 'Last 30 Days' },
    QUARTER: { days: 90, label: 'Last 90 Days' }
};

/**
 * Dashboard component that displays activity metrics and charts
 * 
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects
 * @param {Function} props.onSyncActivities - Function to trigger data sync
 */
const Dashboard = ({ activities, onSyncActivities }) => {
    // State for time period selection
    const [timePeriod, setTimePeriod] = useState(TIME_PERIODS.WEEK);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Menu event handlers
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePeriodSelect = (period) => {
        setTimePeriod(period);
        handleClose();
    };

    // Process activity data based on selected time period
    const metrics = useMemo(() => {
        if (!activities?.length) return null;
        setIsLoading(true);

        // Calculate cutoff date based on selected time period
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timePeriod.days);

        // Filter and sort activities
        const periodActivities = activities
            .filter(activity => new Date(activity.start_time) > cutoffDate)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        // Calculate summary metrics
        const result = {
            recentActivities: periodActivities,
            summary: {
                avgHeartRate: periodActivities.length ? Math.round(
                    periodActivities.reduce((acc, act) => acc + (act.avg_hr || 0), 0) / 
                    periodActivities.length
                ) : 0,
                totalDistance: Math.round(
                    periodActivities.reduce((acc, act) => acc + (act.distance || 0), 0)
                ),
                totalCalories: Math.round(
                    periodActivities.reduce((acc, act) => acc + (act.calories || 0), 0)
                ),
                // Get the most recent activity
                lastActivity: periodActivities.length ? 
                    periodActivities[periodActivities.length - 1] : null
            }
        };

        setIsLoading(false);
        return result;
    }, [activities, timePeriod]);

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // No metrics available
    if (!metrics) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary">
                    No activities found
                </Typography>
            </Box>
        );
    }

    // No activities for selected period
    if (metrics.recentActivities.length === 0) {
        return (
            <Box sx={{ 
                p: 3,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
            }}>
                <Box sx={{ 
                    textAlign: 'center',
                    maxWidth: 600
                }}>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: '#4ade80',
                            mb: 4,
                            fontWeight: 500,
                            letterSpacing: '0.5px'
                        }}
                    >
                        No activities found for the selected period
                    </Typography>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center',
                        mt: 2
                    }}>
                        {/* Time period selector */}
                        <Button
                            variant="outlined"
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDown />}
                            sx={{
                                borderColor: 'rgba(74, 222, 128, 0.5)',
                                color: '#4ade80',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                '&:hover': {
                                    borderColor: '#4ade80',
                                    backgroundColor: 'rgba(74, 222, 128, 0.1)'
                                },
                                textTransform: 'none',
                                minWidth: '150px'
                            }}
                        >
                            {timePeriod.label}
                        </Button>
                        
                        {/* Sync button */}
                        <Button
                            variant="contained"
                            onClick={onSyncActivities}
                            startIcon={<Sync />}
                            sx={{
                                backgroundColor: '#4ade80',
                                color: '#000',
                                '&:hover': {
                                    backgroundColor: '#22c55e'
                                },
                                textTransform: 'none',
                                minWidth: '150px'
                            }}
                        >
                            Sync Activities
                        </Button>

                        {/* Time period menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(74, 222, 128, 0.2)',
                                    borderRadius: '8px',
                                    mt: 1
                                },
                                '& .MuiMenuItem-root': {
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: 'rgba(74, 222, 128, 0.1)'
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(74, 222, 128, 0.2)'
                                    }
                                }
                            }}
                        >
                            {Object.values(TIME_PERIODS).map((period) => (
                                <MenuItem 
                                    key={period.days}
                                    onClick={() => handlePeriodSelect(period)}
                                    selected={period.days === timePeriod.days}
                                >
                                    {period.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Box>
            </Box>
        );
    }

    const { summary } = metrics;

    // Define summary cards configuration
    const summaryCards = [
        {
            icon: Favorite,
            title: 'Avg Heart Rate',
            value: `${summary.avgHeartRate} BPM`,
            color: '#ff6b6b'
        },
        {
            icon: DirectionsRun,
            title: 'Total Distance',
            value: `${summary.totalDistance} km`,
            color: '#4ecdc4'
        },
        {
            icon: LocalFireDepartment,
            title: 'Total Calories',
            value: summary.totalCalories,
            color: '#ffd93d'
        },
        {
            icon: Timer,
            title: 'Last Activity',
            value: summary.lastActivity?.elapsed_time || '00:00:00',
            color: '#6c5ce7'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Period Selector */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                }}>
                    <CalendarToday sx={{ fontSize: 'inherit' }} />
                    Activity Dashboard
                </Typography>
                
                <Box>
                    <Button
                        variant="outlined"
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDown />}
                        startIcon={<CalendarToday />}
                    >
                        {timePeriod.label}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {Object.values(TIME_PERIODS).map((period) => (
                            <MenuItem 
                                key={period.days}
                                onClick={() => handlePeriodSelect(period)}
                                selected={period.days === timePeriod.days}
                            >
                                {period.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Box>

            {/* Display date range */}
            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
                {`${new Date(Date.now() - timePeriod.days * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`}
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} mb={4}>
                {summaryCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={card.title}>
                        <motion.div
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="dashboard-card">
                                <CardContent>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 2 
                                    }}>
                                        <card.icon 
                                            sx={{ 
                                                mr: 1, 
                                                color: card.color 
                                            }} 
                                        />
                                        <Typography variant="h6">
                                            {card.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Heart Rate Trends */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        variants={cardVariants}
                        custom={4}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="dashboard-card">
                            <CardHeader title="Heart Rate Trends" />
                            <CardContent>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer>
                                        <LineChart 
                                            data={metrics.recentActivities.map(activity => ({
                                                date: new Date(activity.start_time).toLocaleDateString(),
                                                avgHr: activity.avg_hr,
                                                maxHr: activity.max_hr
                                            }))}
                                        >
                                            <XAxis 
                                                dataKey="date" 
                                                tickMargin={10}
                                            />
                                            <YAxis 
                                                domain={['dataMin - 5', 'dataMax + 5']}
                                                label={{ 
                                                    value: 'Heart Rate (BPM)', 
                                                    angle: -90, 
                                                    position: 'insideLeft' 
                                                }}
                                            />
                                            <Tooltip />
                                            <Line 
                                                type="monotone" 
                                                dataKey="avgHr" 
                                                stroke="#8884d8" 
                                                name="Avg HR" 
                                                dot={true}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="maxHr" 
                                                stroke="#82ca9d" 
                                                name="Max HR" 
                                                dot={true}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Performance Overview */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        variants={cardVariants}
                        custom={5}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="dashboard-card">
                            <CardHeader title="Performance Overview" />
                            <CardContent>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer>
                                        <RadarChart 
                                            data={[
                                                {
                                                    subject: 'Speed',
                                                    name: 'Average Speed',
                                                    value: Math.min(100, (summary.lastActivity?.avg_speed || 0) * 10),
                                                    actual: `${summary.lastActivity?.avg_speed || 0} km/h`
                                                },
                                                {
                                                    subject: 'Distance',
                                                    name: 'Total Distance',
                                                    value: Math.min(100, (summary.lastActivity?.distance || 0) * 5),
                                                    actual: `${summary.lastActivity?.distance || 0} km`
                                                },
                                                {
                                                    subject: 'Heart Rate',
                                                    name: 'Average Heart Rate',
                                                    value: Math.min(100, (summary.lastActivity?.avg_hr || 0) / 2),
                                                    actual: `${summary.lastActivity?.avg_hr || 0} BPM`
                                                },
                                                {
                                                    subject: 'Calories',
                                                    name: 'Calories Burned',
                                                    value: Math.min(100, (summary.lastActivity?.calories || 0) / 10),
                                                    actual: `${summary.lastActivity?.calories || 0} kcal`
                                                },
                                                {
                                                    subject: 'VO2 Max',
                                                    name: 'VO2 Max',
                                                    value: Math.min(100, (summary.lastActivity?.vO2MaxValue || 0)),
                                                    actual: `${summary.lastActivity?.vO2MaxValue || 0}`
                                                }
                                            ]}
                                        >
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <Radar 
                                                name="Performance Metrics"
                                                dataKey="value" 
                                                fill="#8884d8" 
                                                fillOpacity={0.6} 
                                            />
                                            <Tooltip 
                                                formatter={(value, name, props) => [
                                                    props.payload.actual,
                                                    props.payload.name
                                                ]}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;