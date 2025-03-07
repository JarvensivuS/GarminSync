/**
 * LoadingOverlay Component
 * 
 * Full-screen overlay with loading indicator and progress bar.
 * 
 * @param {Object} props
 * @param {number} props.progress - Loading progress (0-100)
 * @returns {React.Component} Animated loading overlay
 */

import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = ({ progress }) => (
    <motion.div 
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        <motion.h1 
            className="text-6xl mb-8"
            style={{ 
                fontFamily: 'Monument Extended',
                color: 'white',
                letterSpacing: '0.15em'
            }}
        >
            LAKESIDE
        </motion.h1>
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>
    </motion.div>
);

export default LoadingOverlay;