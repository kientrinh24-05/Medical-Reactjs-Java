import { useState, useEffect } from 'react';


export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (also on delay change or unmount)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}



export const useWindowDimensions = () => {
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window
        return { width, height }
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        const handleResize = () => setWindowDimensions(getWindowDimensions())

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return windowDimensions
}

