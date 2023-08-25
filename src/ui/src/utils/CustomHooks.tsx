import * as lodash from 'lodash';
import * as React from 'react';

/**
 * Used in functional components to get access to `prevState` and/or `prevProps`.
 * More usage details can be found [here](https://usehooks.com/usePrevious/).
 * @param value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export interface WindowSize {
  height: number;
  width: number;
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const handleResize = React.useCallback(() => setWindowSize({
    height: window.innerHeight,
    width: window.innerWidth,
  }), []);

  const handleResizeThrottled = React.useCallback(lodash.throttle(handleResize, 100), [])

  React.useEffect(() => {
    window.addEventListener('resize', handleResizeThrottled);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResizeThrottled);
    }
  }, []);

  return windowSize;
}

export default { usePrevious };
