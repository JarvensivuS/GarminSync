/**
 * LandingPage Component
 * 
 * Creates an engaging, animated landing page with parallax effects.
 * This is the first screen users see when accessing the application,
 * featuring a dramatic title animation and scroll guidance.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onGetStarted - Callback for the "Get Started" action
 * @param {string} props.transitionPhase - Current transition phase for animations
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';
import ParallaxEffect from './ParallaxEffect';
import './styles/LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
    // Track scroll position for animation effects
    const [scrollY, setScrollY] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);

    /**
     * Handle scroll events to update component state
     */
    const handleScroll = useCallback(() => {
        const newScrollY = window.scrollY;
        setScrollY(newScrollY);
        setIsAtTop(newScrollY === 0);
    }, []);

    // Set up scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Animation variants for title elements
    const titleVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            filter: "blur(10px)"
        },
        visible: { 
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="landing-page-wrapper">
            <ParallaxEffect scrollY={scrollY}>
                <motion.div
                    className="title-wrapper"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.3 }}
                >
                    <motion.div
                        variants={titleVariants}
                        className="subtitle-text upper-subtitle"
                    >
                        BIOMETRIC ANALYSIS PLATFORM
                    </motion.div>

                    <motion.div
                        variants={titleVariants}
                        className="main-title"
                    >
                        PROJECT VITALINK
                    </motion.div>

                    <motion.div
                        variants={titleVariants}
                        className="subtitle-text lower-subtitle"
                    >
                        Decoding Human Performance
                    </motion.div>

                    <motion.div
                        className="path-line"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ 
                            scaleX: 1, 
                            opacity: 1,
                            transition: {
                                duration: 1.5,
                                ease: "easeOut",
                                delay: 0.5
                            }
                        }}
                    />
                </motion.div>

                <AnimatePresence>
                    {isAtTop && (
                        <motion.div 
                            className="scroll-indicator"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="scroll-text">INITIALIZE ANALYSIS</div>
                            <motion.div 
                                animate={{
                                    y: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <ArrowDownCircle 
                                    size={32}
                                    className="scroll-arrow"
                                    onClick={onGetStarted}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ParallaxEffect>
        </div>
    );
};

export default React.memo(LandingPage);