/**
 * useScrollPosition Hook
 * 
 * Custom hook that tracks scroll position and provides values for
 * scroll-based animations and transitions.
 * 
 * @param {number} threshold - Scroll threshold to trigger visibility (0-1)
 * @returns {Object} Scroll state including:
 *   - scrollProgress: Current scroll progress (0-1)
 *   - isVisible: Whether scroll position passed threshold
 *   - opacity: Calculated opacity based on scroll position
 *   - transform: CSS transform value for parallax effects
 *   - visibleItemsCount: Number of items to show based on scroll depth
 */

import { useState, useEffect } from 'react';

export const useScrollPosition = (threshold = 0.3) => {
  const [scrollY, setScrollY] = useState(0);
  const [hasPassedThreshold, setHasPassedThreshold] = useState(false);
  const [visibleItemsCount, setVisibleItemsCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll percentage (0 to 1)
      const scrollPercentage = currentScroll / (documentHeight - windowHeight);
      
      setScrollY(currentScroll);
      setHasPassedThreshold(scrollPercentage > threshold);
      
      // Calculate number of items to show based on scroll position
      // Start showing items after threshold, add more as user scrolls
      if (scrollPercentage > threshold) {
        const additionalScroll = scrollPercentage - threshold;
        const itemsToShow = Math.floor(additionalScroll * 20);
        setVisibleItemsCount(Math.min(20, Math.max(0, itemsToShow)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollY, hasPassedThreshold, visibleItemsCount };
};