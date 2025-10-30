'use client';

import { useEffect } from 'react';

export function SwipeNavigation() {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      // Left swipe (go forward)
      if (swipeDistance < -minSwipeDistance) {
        window.history.forward();
      }
      // Right swipe (go back) 
      else if (swipeDistance > minSwipeDistance) {
        window.history.back();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
}
