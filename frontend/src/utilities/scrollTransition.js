// utilities/scrollTransition.js
import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook to handle scroll-based transitions
 * @param {number} threshold - Scroll threshold to trigger transition (0-1)
 * @returns {Object} Scroll state information
 */
export const useScrollTransition = (threshold = 0.3) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollTop / windowHeight, 1);
        
        setScrollProgress(progress);
        setIsVisible(progress >= threshold);
    }, [threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return {
        scrollProgress,
        isVisible,
        opacity: Math.min((scrollProgress - threshold) / (1 - threshold), 1),
        transform: `translateY(${Math.max(0, (1 - scrollProgress) * 50)}px)`
    };
};