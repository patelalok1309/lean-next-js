import { useEffect, useState } from "react";

/**
 * A hook that debounces a value by a specified delay.
 *
 * @param {T} value - The value to debounce
 * @param {number} [delay=500] - The delay in milliseconds
 * @return {T} The debounced value
 */
export function useDeboune<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
