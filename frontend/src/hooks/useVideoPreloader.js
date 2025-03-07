/**
 * useVideoPreloader Hook
 * 
 * Preloads video files to ensure smooth playback when needed.
 * Detects browser format support and handles loading errors.
 * 
 * @param {Object} sources - Map of video sources with multiple format options
 * @returns {Object} Loading state including:
 *   - loaded: Whether videos are loaded
 *   - error: Whether loading encountered errors
 *   - formats: Map of successfully loaded video URLs by key
 */

import { useState, useEffect } from 'react';

export const useVideoPreloader = (sources) => {
  const [loadingState, setLoadingState] = useState({
    loaded: false,
    error: false,
    formats: {},
  });

  useEffect(() => {
    const preloadVideos = async () => {
      try {
        // Test browser video format support
        const testVideo = document.createElement('video');
        const formatSupport = {
          webm: testVideo.canPlayType('video/webm; codecs="vp8, vorbis"'),
          mp4: testVideo.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),
        };

        // Create a map of promises for each video type
        const loadPromises = Object.entries(sources).map(([key, sourcePaths]) => {
          return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            
            // Select best supported format
            let sourceUrl = null;
            if (formatSupport.webm && sourcePaths.webm) {
              sourceUrl = sourcePaths.webm;
            } else if (formatSupport.mp4 && sourcePaths.mp4) {
              sourceUrl = sourcePaths.mp4;
            }

            if (!sourceUrl) {
              reject(new Error(`No supported format found for ${key}`));
              return;
            }

            // Set up event handlers
            const loadTimeout = setTimeout(() => {
              video.remove();
              reject(new Error(`Timeout loading ${key}`));
            }, 10000);

            video.onloadeddata = () => {
              clearTimeout(loadTimeout);
              video.remove();
              resolve({ key, url: sourceUrl });
            };

            video.onerror = () => {
              clearTimeout(loadTimeout);
              video.remove();
              reject(new Error(`Failed to load ${key}`));
            };

            // Start loading
            video.preload = 'auto';
            video.src = sourceUrl;
            video.load();
          });
        });

        // Wait for all videos to load
        const results = await Promise.allSettled(loadPromises);
        
        // Process results
        const successfulLoads = results
          .filter(result => result.status === 'fulfilled')
          .reduce((acc, result) => {
            const { key, url } = result.value;
            acc[key] = url;
            return acc;
          }, {});

        // Update state
        setLoadingState({
          loaded: true,
          error: Object.keys(successfulLoads).length === 0,
          formats: successfulLoads,
        });
      } catch (error) {
        console.error('Video preloading error:', error);
        setLoadingState(prev => ({
          ...prev,
          error: true,
        }));
      }
    };

    preloadVideos();
    
    return () => {
      const videos = document.querySelectorAll('video[data-preload="true"]');
      videos.forEach(video => video.remove());
    };
  }, [JSON.stringify(sources)]);

  return loadingState;
};
