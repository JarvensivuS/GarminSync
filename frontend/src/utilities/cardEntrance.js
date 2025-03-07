import { useEffect, useState } from 'react';

export const useCardEntrance = (isVisible, index, delay = 0.1) => {
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        if (isVisible && !hasEntered) {
            const timer = setTimeout(() => {
                setHasEntered(true);
            }, index * (delay * 1000));

            return () => clearTimeout(timer);
        }
    }, [isVisible, index, delay, hasEntered]);

    return {
        opacity: hasEntered ? 1 : 0,
        transform: `translateY(${hasEntered ? 0 : 20}px)`,
        transition: `opacity 0.5s ease-out ${index * delay}s, transform 0.5s ease-out ${index * delay}s`
    };
};