import { useState, useEffect } from 'react';
import type { AppState, Fast } from '../types';

const STORAGE_KEY = 'fast-app-data';

export function useFastApp() {
    const [state, setState] = useState<AppState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state', e);
            }
        }
        return { fasts: [], activeFast: null };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const startFast = () => {
        const newFast = {
            id: crypto.randomUUID(),
            startTime: Date.now()
        };
        setState(prev => ({
            ...prev,
            activeFast: newFast
        }));
    };

    const endFast = () => {
        if (!state.activeFast) return;

        const endTime = Date.now();
        const completedFast: Fast = {
            id: state.activeFast.id,
            startTime: state.activeFast.startTime,
            endTime: endTime,
            duration: endTime - state.activeFast.startTime
        };

        setState(prev => ({
            ...prev,
            fasts: [completedFast, ...prev.fasts],
            activeFast: null
        }));
    };

    const deleteFast = (id: string) => {
        setState(prev => ({
            ...prev,
            fasts: prev.fasts.filter(fast => fast.id !== id)
        }));
    };

    const updateFast = (id: string, updates: Partial<Fast>) => {
        setState(prev => ({
            ...prev,
            fasts: prev.fasts.map(fast => {
                if (fast.id === id) {
                    const updated = { ...fast, ...updates };
                    // Recalculate duration if start or end time changed
                    if (updates.startTime !== undefined || updates.endTime !== undefined) {
                        updated.duration = updated.endTime - updated.startTime;
                    }
                    return updated;
                }
                return fast;
            })
        }));
    };

    const updateActiveFast = (updates: { startTime?: number }) => {
        setState(prev => {
            if (!prev.activeFast) return prev;
            return {
                ...prev,
                activeFast: {
                    ...prev.activeFast,
                    ...updates
                }
            };
        });
    };

    return {
        activeFast: state.activeFast,
        fasts: state.fasts,
        startFast,
        endFast,
        deleteFast,
        updateFast,
        updateActiveFast
    };
}
