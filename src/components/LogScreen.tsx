import { useState } from 'react';
import { useFastApp } from '../hooks/useFastApp';
import type { Fast } from '../types';

export default function LogScreen() {
    const { fasts, deleteFast, updateFast } = useFastApp();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');

    const formatDuration = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
        }
    };

    const formatTimeRange = (startTime: number, endTime: number) => {
        const start = new Date(startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const end = new Date(endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        return `${start} - ${end}`;
    };

    const toDateTimeLocal = (timestamp: number) => {
        const date = new Date(timestamp);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const handleEdit = (fast: Fast) => {
        setEditingId(fast.id);
        setEditStartTime(toDateTimeLocal(fast.startTime));
        setEditEndTime(toDateTimeLocal(fast.endTime));
    };

    const handleSave = (id: string) => {
        const startTime = new Date(editStartTime).getTime();
        const endTime = new Date(editEndTime).getTime();
        updateFast(id, { startTime, endTime });
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };



    const handleDelete = (fast: Fast) => {
        const duration = formatDuration(fast.duration);
        const date = formatDate(fast.startTime);
        if (window.confirm(`Delete ${duration} fast from ${date}?`)) {
            deleteFast(fast.id);
        }
    };

    return (
        <div className="p-4 pb-12 max-w-md mx-auto w-full">
            <div className="space-y-3">
                {fasts.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                        No fasts yet. Start one to see it here!
                    </p>
                ) : (
                    fasts.map((fast) => (
                        <div key={fast.id} className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                            {editingId === fast.id ? (
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="block text-sm text-gray-600 dark:text-gray-400">Start Date</label>
                                            <input
                                                type="text"
                                                value={editStartTime.split('T')[0]}
                                                onChange={(e) => setEditStartTime(`${e.target.value}T${editStartTime.split('T')[1] || '00:00'}`)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm text-gray-600 dark:text-gray-400">Start Time</label>
                                            <input
                                                type="text"
                                                value={editStartTime.split('T')[1]?.slice(0, 5) || '00:00'}
                                                onChange={(e) => setEditStartTime(`${editStartTime.split('T')[0]}T${e.target.value}`)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="HH:MM"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="block text-sm text-gray-600 dark:text-gray-400">End Date</label>
                                            <input
                                                type="text"
                                                value={editEndTime.split('T')[0]}
                                                onChange={(e) => setEditEndTime(`${e.target.value}T${editEndTime.split('T')[1] || '00:00'}`)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm text-gray-600 dark:text-gray-400">End Time</label>
                                            <input
                                                type="text"
                                                value={editEndTime.split('T')[1]?.slice(0, 5) || '00:00'}
                                                onChange={(e) => setEditEndTime(`${editEndTime.split('T')[0]}T${e.target.value}`)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="HH:MM"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave(fast.id)}
                                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-white">{formatDate(fast.startTime)}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDuration(fast.duration)} • {formatTimeRange(fast.startTime, fast.endTime)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(fast)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit fast"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(fast)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete fast"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
