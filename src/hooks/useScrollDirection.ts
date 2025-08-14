import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let timeoutId: NodeJS.Timeout;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
        setIsVisible(direction === 'up' || scrollY < 50);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    const onScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrollDirection, 25);
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [scrollDirection]);

  return { scrollDirection, isVisible };
};