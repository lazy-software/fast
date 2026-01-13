import { useState, useEffect } from 'react';
import { useFastApp } from '../hooks/useFastApp';

export default function FastScreen() {
    const { activeFast, startFast, endFast, updateActiveFast } = useFastApp();
    const [editStartTime, setEditStartTime] = useState('');
    const [isEditingStart, setIsEditingStart] = useState(false);
    const [elapsed, setElapsed] = useState(() => {
        if (activeFast?.startTime) {
            return Date.now() - activeFast.startTime;
        }
        return 0;
    });

    const isFasting = activeFast !== null;
    const startTime = activeFast?.startTime ?? null;

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
            endFast();
            setElapsed(0);
        } else {
            startFast();
        }
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const toDateTimeLocal = (timestamp: number) => {
        const date = new Date(timestamp);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const handleEditStart = () => {
        if (startTime) {
            setEditStartTime(toDateTimeLocal(startTime));
            setIsEditingStart(true);
        }
    };

    const handleSaveStart = () => {
        const newStartTime = new Date(editStartTime).getTime();
        if (!isNaN(newStartTime)) {
            updateActiveFast({ startTime: newStartTime });
        }
        setIsEditingStart(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveStart();
        }
    };

    return (
        <div className="p-4 pb-12 max-w-md mx-auto w-full h-full flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-2">
                    <div className="text-7xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">
                        {formatTime(elapsed)}
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
                    <div className="w-full max-w-xs transition-all duration-300">
                        {isEditingStart ? (
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label htmlFor="start-date" className="block text-sm text-gray-600 dark:text-gray-400">Start Date</label>
                                        <input
                                            id="start-date"
                                            type="text"
                                            value={editStartTime.split('T')[0]}
                                            onChange={(e) => setEditStartTime(`${e.target.value}T${editStartTime.split('T')[1] || '00:00'}`)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="YYYY-MM-DD"
                                        />

                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="start-time" className="block text-sm text-gray-600 dark:text-gray-400">Start Time</label>
                                        <input
                                            id="start-time"
                                            type="text"
                                            value={editStartTime.split('T')[1]?.slice(0, 5) || '00:00'}
                                            onChange={(e) => setEditStartTime(`${editStartTime.split('T')[0]}T${e.target.value}`)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="HH:MM"
                                        />

                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveStart}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditingStart(false)}
                                        className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={handleEditStart}>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Started</span>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
