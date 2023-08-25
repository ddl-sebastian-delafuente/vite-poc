import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null, runImmediately = false) => {
  const savedCallback = useRef<typeof callback>();

  // remember the latest function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up the interval
  useEffect(() => {
    function tick() {
      if (typeof savedCallback.current === 'function') {
        savedCallback.current();
      }
    }

    if (runImmediately) {
      tick();
    }

    if (delay !== null) {
      const id = setInterval(() => {
        try {
          tick();
        } catch (e) {
          clearInterval(id);
        }
      }, delay);
      return () => {
        if (id) {
          clearInterval(id)
        }
      };
    }

    return;
  }, [delay, runImmediately]);
};
