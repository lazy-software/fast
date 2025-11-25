import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFastApp } from './useFastApp';

describe('useFastApp', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        // Mock crypto.randomUUID
        Object.defineProperty(globalThis, 'crypto', {
            value: {
                randomUUID: () => 'test-uuid'
            }
        });
    });

    it('should initialize with empty state', () => {
        const { result } = renderHook(() => useFastApp());
        expect(result.current.fasts).toEqual([]);
        expect(result.current.activeFast).toBeNull();
    });

    it('should start a fast', () => {
        const { result } = renderHook(() => useFastApp());

        act(() => {
            result.current.startFast();
        });

        expect(result.current.activeFast).not.toBeNull();
        expect(result.current.activeFast?.id).toBe('test-uuid');
        expect(result.current.activeFast?.startTime).toBeDefined();
    });

    it('should end a fast', () => {
        const { result } = renderHook(() => useFastApp());

        act(() => {
            result.current.startFast();
        });

        act(() => {
            result.current.endFast();
        });

        expect(result.current.activeFast).toBeNull();
        expect(result.current.fasts).toHaveLength(1);
        expect(result.current.fasts[0].id).toBe('test-uuid');
        expect(result.current.fasts[0].duration).toBeDefined();
    });

    it('should delete a fast', () => {
        const { result } = renderHook(() => useFastApp());

        act(() => {
            result.current.startFast();
        });

        act(() => {
            result.current.endFast();
        });

        expect(result.current.fasts).toHaveLength(1);

        act(() => {
            result.current.deleteFast('test-uuid');
        });

        expect(result.current.fasts).toHaveLength(0);
    });

    it('should update a fast', () => {
        const { result } = renderHook(() => useFastApp());

        act(() => {
            result.current.startFast();
        });

        act(() => {
            result.current.endFast();
        });

        const fastId = result.current.fasts[0].id;
        const newStartTime = Date.now() - 10000;
        const newEndTime = Date.now();

        act(() => {
            result.current.updateFast(fastId, {
                startTime: newStartTime,
                endTime: newEndTime
            });
        });

        expect(result.current.fasts[0].startTime).toBe(newStartTime);
        expect(result.current.fasts[0].endTime).toBe(newEndTime);
        expect(result.current.fasts[0].duration).toBe(newEndTime - newStartTime);
    });
});
