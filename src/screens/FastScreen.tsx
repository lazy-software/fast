import { useState, useEffect } from 'react';

export default function FastScreen() {
    const [isFasting, setIsFasting] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let interval: number;
        if (isFasting && startTime) {
            interval = setInterval(() => {
                setElapsed(Date.now() - startTime);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isFasting, startTime]);

    const toggleFast = () => {
        if (isFasting) {
            setIsFasting(false);
            setStartTime(null);
            setElapsed(0);
            // TODO: Save log
        } else {
            setIsFasting(true);
            setStartTime(Date.now());
        }
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 pb-12 max-w-md mx-auto w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-2">
                    <div className="text-7xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">
                        {formatTime(elapsed)}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 font-medium">
                        {isFasting ? 'Fasting Time' : ''}
                    </div>
                </div>

                <button
                    onClick={toggleFast}
                    className={`w-full max-w-xs py-4 rounded-xl text-lg font-semibold transition-all transform active:scale-95 shadow-sm ${isFasting
                        ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/30'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 dark:bg-blue-600 dark:hover:bg-blue-500'
                        }`}
                >
                    {isFasting ? 'End Fast' : 'Start Fast'}
                </button>

                {isFasting && startTime && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 w-full max-w-xs shadow-sm">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Started</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
