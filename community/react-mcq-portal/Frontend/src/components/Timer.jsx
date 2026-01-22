import { useState, useEffect } from 'react';

function Timer({ durationInMinutes, startTime, onTimeUp }) {
  if (!durationInMinutes || !startTime) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const endTime = new Date(new Date(startTime).getTime() + durationInMinutes * 60 * 1000);

  const calculateRemainingTime = () => {
    const now = new Date();
    const difference = endTime.getTime() - now.getTime();
    return difference > 0 ? difference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);
    
    if (remainingTime <= 0) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime > 0 && remainingTime < 1000) {
      if (onTimeUp) {
        onTimeUp();
      }
    }
  }, [remainingTime, onTimeUp]);

  const hours = Math.floor(remainingTime / 1000 / 60 / 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  // Color coding based on remaining time
  const getTimerColor = () => {
    const totalSeconds = remainingTime / 1000;
    const totalMinutes = totalSeconds / 60;
    
    if (totalMinutes < 5) return 'text-red-600 bg-red-100 border-red-200';
    if (totalMinutes < 15) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg border-2 ${getTimerColor()} font-mono font-bold text-sm sm:text-base`}>
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="hidden sm:inline-block text-xs">Time Left:</span>
      <span className="text-base sm:text-lg tabular-nums">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default Timer;
