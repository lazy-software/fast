import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LogScreen from './LogScreen';
import * as useFastAppHook from '../hooks/useFastApp';

// Mock the hook
vi.mock('../hooks/useFastApp');

describe('LogScreen', () => {
    const mockDeleteFast = vi.fn();
    const mockUpdateFast = vi.fn();
    const mockFasts = [
        {
            id: '1',
            startTime: new Date('2025-11-25T10:00:00').getTime(),
            endTime: new Date('2025-11-25T12:00:00').getTime(),
            duration: 7200000 // 2 hours
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation
        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: null,
            fasts: mockFasts,
            startFast: vi.fn(),
            endFast: vi.fn(),
            deleteFast: mockDeleteFast,
            updateFast: mockUpdateFast
        });
    });

    it('renders fasts correctly', () => {
        render(<LogScreen />);
        expect(screen.getByText(/2h 0m/)).toBeInTheDocument();
        // Check for date/time rendering (format depends on locale, checking partial match)
        expect(screen.getByText(/10:00/)).toBeInTheDocument();
        expect(screen.getByText(/12:00/)).toBeInTheDocument();
    });

    it('shows empty state when no fasts', () => {
        vi.spyOn(useFastAppHook, 'useFastApp').mockReturnValue({
            activeFast: null,
            fasts: [],
            startFast: vi.fn(),
            endFast: vi.fn(),
            deleteFast: mockDeleteFast,
            updateFast: mockUpdateFast
        });

        render(<LogScreen />);
        expect(screen.getByText('No fasts yet. Start one to see it here!')).toBeInTheDocument();
    });

    it('triggers delete confirmation', () => {
        render(<LogScreen />);

        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        const deleteButton = screen.getByTitle('Delete fast');
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockDeleteFast).toHaveBeenCalledWith('1');

        confirmSpy.mockRestore();
    });

    it('does not delete if cancelled', () => {
        render(<LogScreen />);

        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => false);

        const deleteButton = screen.getByTitle('Delete fast');
        fireEvent.click(deleteButton);

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockDeleteFast).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });

    it('enters edit mode when edit button clicked', async () => {
        render(<LogScreen />);

        const editButton = screen.getByTitle('Edit fast');
        fireEvent.click(editButton);

        // Check for input fields (there are 2 of each: start and end)
        const dateInputs = await screen.findAllByPlaceholderText('YYYY-MM-DD');
        expect(dateInputs).toHaveLength(2);

        const timeInputs = await screen.findAllByPlaceholderText('HH:MM');
        expect(timeInputs).toHaveLength(2);

        // Check for Save/Cancel buttons
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
});
