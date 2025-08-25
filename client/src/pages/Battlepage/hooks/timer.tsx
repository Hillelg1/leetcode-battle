import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds: number;
  onComplete?: ()=>void;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onComplete }) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [tenSec,setTenSec] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
      }
      if(prevSeconds <=10){setTenSec(true)}
        return prevSeconds - 1;
      });
    }, 1000); // Update every 1 second (1000ms)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [initialSeconds]); // Empty dependency array ensures the effect runs only once on mount

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <p className = {tenSec ? "tenSeconds" : ""}>{formatTime(seconds)}</p>
    </div>
  );
};

export default Timer;