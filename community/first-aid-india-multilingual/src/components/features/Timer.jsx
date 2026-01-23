import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

export function Timer({ duration = 60, label = "Timer" }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl text-center relative overflow-hidden">
            {/* Progress Background */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
            />

            <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-2">{label}</h3>
            <div className="text-5xl font-mono font-bold mb-6 tabular-nums">
                {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center space-x-4">
                <Button
                    onClick={toggleTimer}
                    variant={isActive ? "secondary" : "default"}
                    className={isActive ? "bg-yellow-500 hover:bg-yellow-600 text-black border-none" : "bg-green-600 hover:bg-green-700 text-white border-none"}
                >
                    {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    <span className="ml-2">{isActive ? "Pause" : "Start"}</span>
                </Button>
                <Button onClick={resetTimer} variant="ghost" className="text-slate-400 hover:text-white">
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
