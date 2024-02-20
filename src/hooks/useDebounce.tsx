import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number = 500) => {
    // Takes in the original search input value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Creates a new timeout
        // This timeout sets the debounced value in this hook with value passed in, AFTER a certain delay.
        // If value changes again before the code in the timeout has executed, the cleanup function will clear the previous timeout and create a new one.
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)

        // Cleanup timeout
        return () => {
            clearTimeout(timeout);
        }
    }, [value, delay])
    return debouncedValue;
}

export default useDebounce;