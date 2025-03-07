/**
 * AnimatedActivityGrid Component
 * 
 * Displays a grid of activity cards with staggered animations.
 * Cards appear in sequence as the user scrolls down the page,
 * creating a dynamic and engaging user experience.
 * 
 * Features:
 * - Intersection observer for scroll-based animations
 * - Staggered entrance animations
 * - Tilt effect on cards for depth
 * 
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity objects to display
 * @param {Function} props.onCardClick - Callback for card click events
 * @param {number} props.visibleItemsCount - Number of items to show
 * @param {string} props.transitionPhase - Current transition state
 */
import React, { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import TiltCard from './TiltCard';
import { CardContent, CardHeader, IconText } from './Card';
import {
    Speed,
    AccessTime,
    LocalDining,
    Favorite,
    DirectionsRun
} from '@mui/icons-material';

const AnimatedActivityGrid = ({ activities, onCardClick, visibleItemsCount, transitionPhase }) => {
    // Reference for intersection observer
    const gridRef = useRef(null);
    // Track when grid enters viewport
    const isInView = useInView(gridRef, { once: false, amount: 0.2 });
    // Only show grid when in view and in correct transition phase
    const shouldShow = isInView && transitionPhase === 'forest';

  // Container animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Item animation variants with custom delays based on index
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }),
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  // Don't render if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={gridRef}
      className="cards-grid"
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activities[0]?.activity_id}
          className="cards-grid-inner"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activities.slice(0, visibleItemsCount).map((activity, index) => (
            activity && (
              <motion.div
                key={activity.activity_id}
                variants={itemVariants}
                custom={index}
              >
                <TiltCard
                  className="activity-card"
                  tiltAmount={10}           // More pronounced tilt
                  perspective={2000}         // More dramatic perspective
                  scale={1.05}             // Slightly larger hover scale
                  transitionDuration={300}
                  glareOpacity={0.15}      // Subtle glare effect
                  glareSize={120}          // Larger glare area
                >
                  <div onClick={() => onCardClick(activity)} style={{ height: '100%' }}>
                    <CardHeader
                      className="card-header"
                      title={`${activity.locationName || 'Unknown Location'} - ${activity.sport || 'Unknown Activity'}`}
                    />
                    <CardContent>
                      <IconText Icon={AccessTime} text="Time" value={activity.elapsed_time || '00:00:00'} />
                      <IconText Icon={Speed} text="Avg Speed" value={`${activity.avg_speed || 0} Km/h`} />
                      <IconText Icon={DirectionsRun} text="Distance" value={`${activity.distance || 0} km`} />
                      <IconText Icon={LocalDining} text="Calories" value={activity.calories || 0} />
                      <IconText Icon={Favorite} text="Avg HR" value={activity.avg_hr || 0} />
                    </CardContent>
                  </div>
                </TiltCard>
              </motion.div>
            )
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedActivityGrid;