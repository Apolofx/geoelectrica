import { useRef, useEffect, useState } from "react";

export function useElementHeight<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (elementRef.current) {
      const updateHeight = () => {
        const height = elementRef.current?.offsetHeight || 0;
        setHeight(height);
      };

      // Initial measurement
      updateHeight();

      // Re-measure on window resize
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

  return { elementRef, height };
} 