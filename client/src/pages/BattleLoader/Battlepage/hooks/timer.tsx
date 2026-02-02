import React, { useEffect, useMemo, useRef, useState } from "react";
import "./timer.css";

interface TimerProps {
    initialSeconds: number;
    won?: boolean;
    onComplete?: () => void;
    startTime: number; // epoch seconds from backend
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onComplete, startTime, won = false }) => {
    const completedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    const computeRemaining = useMemo(() => {
        return () => {
            const nowSec = Math.floor(Date.now() / 1000);
            const elapsed = nowSec - startTime
            return Math.max(0, initialSeconds - elapsed);
        };
    }, [initialSeconds, startTime]);

    const [seconds, setSeconds] = useState<number>(() => computeRemaining());

    useEffect(() => {
        if (won) return;
        completedRef.current = false;

        const tick = () => {
            const remaining = computeRemaining();
            setSeconds(remaining);

            if (remaining === 0 && !completedRef.current) {
                completedRef.current = true;
                onCompleteRef.current?.();
            }
        };

        tick(); // update immediately on mount/refresh
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [computeRemaining]);

    const tenSec = seconds <= 10;

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div>
            <p className={`${tenSec ? "tenSeconds" : ""}, ${won ? "won" : ""}`}>{formatTime(seconds)}</p>
        </div>
    );
};

export default Timer;