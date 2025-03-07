/**
 * ParallaxEffect Component
 * 
 * Creates a parallax scrolling effect with multiple background layers
 * that move at different speeds as the user scrolls, creating depth.
 * 
 * Features:
 * - Multiple parallax layers (background videos, overlays)
 * - Scroll-based animations with transform and opacity
 * - Smooth transitions between scroll positions
 * 
 * @param {Object} props - Component props 
 * @param {React.ReactNode} props.children - Content to display with parallax effect
 * @param {number} props.scrollY - Current scroll position
 * @param {string} props.transitionPhase - Current transition phase
 */
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxEffect = ({ children, scrollY = 0, transitionPhase }) => {
    // Get scroll position using framer-motion's useScroll hook
    const { scrollY: scrollValue } = useScroll();
    const windowHeight = window.innerHeight;
    
    // Transform values based on scroll position
    const landingOpacity = useTransform(
        scrollValue,
        [0, windowHeight * 0.4],
        [1, 0]
    );

    const landingScale = useTransform(
        scrollValue,
        [0, windowHeight],
        [1, 1.1]
    );

    const landingTranslateY = useTransform(
        scrollValue,
        [0, windowHeight],
        [0, windowHeight * 0.2]
    );

    const activityOpacity = useTransform(
        scrollValue,
        [windowHeight * 0.3, windowHeight * 0.8],
        [0, 1]
    );

    const contentOpacity = useTransform(
        scrollValue,
        [0, windowHeight * 0.3],
        [1, 0]
    );

    const contentScale = useTransform(
        scrollValue,
        [0, windowHeight * 0.3],
        [1, 0.95]
    );

    return (
        <>
            {/* Landing Background */}
            <motion.div 
                className="landing-background-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div 
                    className="video-wrapper"
                    style={{
                        y: landingTranslateY,
                        scale: landingScale,
                        opacity: landingOpacity
                    }}
                >
                    <video
                        className="background-video"
                        autoPlay
                        muted
                        playsInline
                        loop
                    >
                        <source src="/videos/landing_bg.webm" type="video/webm" />
                    </video>
                    <motion.div 
                        className="background-overlay"
                        style={{
                            opacity: useTransform(
                                scrollValue,
                                [0, windowHeight * 0.4],
                                [0.4, 0.7]
                            )
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Activities Background */}
            <motion.div 
                className="activities-background-container"
                initial={{ opacity: 0 }}
                style={{ opacity: activityOpacity }}
            >
                <div className="video-wrapper">
                    <video
                        className="background-video"
                        autoPlay
                        muted
                        playsInline
                        loop
                    >
                        <source src="/videos/activity_bg.webm" type="video/webm" />
                    </video>
                    <div className="background-overlay activities-overlay" />
                </div>
            </motion.div>

            {/* Content */}
            <motion.div 
                className="hero-section"
                style={{ 
                    opacity: contentOpacity,
                    scale: contentScale
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

export default React.memo(ParallaxEffect);