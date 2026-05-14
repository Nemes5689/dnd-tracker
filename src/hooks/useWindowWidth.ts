import { useEffect, useState } from 'react';

export function useWindowWidth(): number {
  const getWidth = () => {
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth;
  };

  const [width, setWidth] = useState<number>(getWidth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export default useWindowWidth;
