import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FastScreen from './FastScreen';
import * as useFastAppHook from '../hooks/useFastApp';

// Mock the hook
vi.mock('../hooks/useFastApp');

describe('FastScreen', () => {
    const mockStartFast = vi.fn();
    const mockEndFast = vi.fn();
    const mockUpdateActiveFast = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Use fake timers to test interval
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders start button when not fasting', () => {
        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: null,
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        expect(screen.getByText('Start Fast')).toBeInTheDocument();
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });

    it('renders end button and correct time when fasting', () => {
        const startTime = Date.now() - 3600000; // 1 hour ago

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);

        // Verify timer initializes correctly (not 00:00:00) (1.0.0 change)
        expect(screen.getByText('01:00:00')).toBeInTheDocument();
        expect(screen.getByText('End Fast')).toBeInTheDocument();
    });

    it('updates timer every second', () => {
        const startTime = Date.now();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        expect(screen.getByText('00:00:00')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('00:00:01')).toBeInTheDocument();
    });

    it('calls startFast when start button clicked', () => {
        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: null,
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        fireEvent.click(screen.getByText('Start Fast'));
        expect(mockStartFast).toHaveBeenCalled();
    });

    it('calls endFast when end button clicked', () => {
        const startTime = Date.now();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        fireEvent.click(screen.getByText('End Fast'));
        expect(mockEndFast).toHaveBeenCalled();
    });

    it('switches to edit mode when start time clicked', () => {
        const startTime = new Date('2023-01-01T12:00:00').getTime();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);

        // Find the container that has the click handler (it's the parent of "Started" text)
        // Since we don't have a reliable test id, we'll click the element containing the time
        fireEvent.click(screen.getByText(/12:00 PM/i));

        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('12:00')).toBeInTheDocument();
    });

    it('saves changes when save button clicked', () => {
        const startTime = new Date('2023-01-01T12:00:00').getTime();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        fireEvent.click(screen.getByText(/12:00 PM/i));

        const timeInput = screen.getByLabelText(/start time/i);
        fireEvent.change(timeInput, { target: { value: '13:00' } });

        fireEvent.click(screen.getByText('Save'));

        expect(mockUpdateActiveFast).toHaveBeenCalledWith({
            startTime: new Date('2023-01-01T13:00:00').getTime()
        });
        expect(screen.queryByLabelText(/start time/i)).not.toBeInTheDocument();
    });

    it('cancels changes when cancel button clicked', () => {
        const startTime = new Date('2023-01-01T12:00:00').getTime();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        fireEvent.click(screen.getByText(/12:00 PM/i));

        const timeInput = screen.getByLabelText(/start time/i);
        fireEvent.change(timeInput, { target: { value: '13:00' } });

        fireEvent.click(screen.getByText('Cancel'));

        expect(mockUpdateActiveFast).not.toHaveBeenCalled();
        expect(screen.queryByLabelText(/start time/i)).not.toBeInTheDocument();
    });

    it('saves changes when Enter key pressed', () => {
        const startTime = new Date('2023-01-01T12:00:00').getTime();

        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: { id: '1', startTime },
            fasts: [],
            startFast: mockStartFast,
            endFast: mockEndFast,
            deleteFast: vi.fn(),
            updateFast: vi.fn(),
            updateActiveFast: mockUpdateActiveFast
        });

        render(<FastScreen />);
        fireEvent.click(screen.getByText(/12:00 PM/i));

        const timeInput = screen.getByLabelText(/start time/i);
        fireEvent.change(timeInput, { target: { value: '13:00' } });

        fireEvent.keyDown(timeInput, { key: 'Enter', code: 'Enter' });

        expect(mockUpdateActiveFast).toHaveBeenCalledWith({
            startTime: new Date('2023-01-01T13:00:00').getTime()
        });
        expect(screen.queryByLabelText(/start time/i)).not.toBeInTheDocument();
    });
});
