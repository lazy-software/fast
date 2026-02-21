import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StatsScreen from './StatsScreen';
import { useFastApp } from '../hooks/useFastApp';

vi.mock('../hooks/useFastApp', () => ({
    useFastApp: vi.fn(),
}));

const mockUseFastApp = useFastApp as any;

describe('StatsScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with 0 fasts gracefully', () => {
        mockUseFastApp.mockReturnValue({
            fasts: [],
        });

        render(<StatsScreen />);

        expect(screen.getByText('Total Fasts')).toBeInTheDocument();
        const totalFastsVal = screen.getByText('Total Fasts').nextElementSibling;
        expect(totalFastsVal).toHaveTextContent('0');

        expect(screen.getByText('Total Time')).toBeInTheDocument();
        const totalTimeVal = screen.getByText('Total Time').nextElementSibling;
        expect(totalTimeVal).toHaveTextContent('0h');
    });

    it('calculates average, total, max, and p90 correctly', () => {
        mockUseFastApp.mockReturnValue({
            fasts: [
                { duration: 10 * 60 * 60 * 1000 }, // 10h
                { duration: 12 * 60 * 60 * 1000 }, // 12h
                { duration: 14 * 60 * 60 * 1000 }, // 14h
                { duration: 16 * 60 * 60 * 1000 }, // 16h
                { duration: 24 * 60 * 60 * 1000 }, // 24h
            ],
        });

        render(<StatsScreen />);

        // Total fasts = 5
        const totalFastsVal = screen.getByText('Total Fasts').nextElementSibling;
        expect(totalFastsVal).toHaveTextContent('5');

        // Total time = 10 + 12 + 14 + 16 + 24 = 76 hours
        const totalTimeVal = screen.getByText('Total Time').nextElementSibling;
        expect(totalTimeVal).toHaveTextContent('76h 0m');

        // Average frequency = 76 / 5 = 15.2 hours = 15h 12m
        const avgFastVal = screen.getByText('Average Fast').nextElementSibling;
        expect(avgFastVal).toHaveTextContent('15h 12m');

        // Max frequency = 24h
        const maxFastVal = screen.getByText('Longest Fast').nextElementSibling;
        expect(maxFastVal).toHaveTextContent('24h 0m');

        // p90 frequency = 24h (index 4 of [10, 12, 14, 16, 24]) - index = math.ceil(0.9 * 5) - 1 = 5 - 1 = 4
        const p90FastVal = screen.getByText('p90 Fast').nextElementSibling;
        expect(p90FastVal).toHaveTextContent('24h 0m');
    });

    it('formats durations correctly for minutes', () => {
        mockUseFastApp.mockReturnValue({
            fasts: [
                { duration: 30 * 60 * 1000 }, // 30m
            ],
        });

        render(<StatsScreen />);

        const totalTimeVal = screen.getByText('Total Time').nextElementSibling;
        expect(totalTimeVal).toHaveTextContent('30m');
    });
});
