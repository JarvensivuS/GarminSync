// utilities/activityAnimations.js

/**
 * Container animation variants for Framer Motion
 */
export const containerVariants = {
    hidden: {
        opacity: 0,
        y: 50
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.5,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.8
        }
    }
};

/**
 * Card animation variants for Framer Motion
 */
export const cardVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: (index) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1],
        },
    }),
    hover: {
        y: -8,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.15,
        },
    },
};

/**
 * Grid container animation variants
 */
export const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};