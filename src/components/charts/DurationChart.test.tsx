import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DurationChart from './DurationChart';
import { useFastApp } from '../../hooks/useFastApp';

vi.mock('../../hooks/useFastApp', () => ({
    useFastApp: vi.fn(),
}));

// Recharts components rely heavily on DOM sizing which JSDOM doesn't support well by default.
// Mocking ResponsiveContainer to render children directly instead.
vi.mock('recharts', async () => {
    const OriginalRechartsModule = await vi.importActual('recharts') as any;
    return {
        ...OriginalRechartsModule,
        ResponsiveContainer: ({ children }: any) => (
            <div style={{ width: 800, height: 400 }}>{children}</div>
        ),
    };
});

const mockUseFastApp = useFastApp as any;

describe('DurationChart', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when there are no fasts', () => {
        mockUseFastApp.mockReturnValue({
            fasts: [],
        });

        const { container } = render(<DurationChart />);
        expect(container.firstChild).toBeNull();
    });

    it('renders chart with data', () => {
        const mockFasts = [
            { id: '1', startTime: 1709280000000, endTime: 1709337600000, duration: 16 * 60 * 60 * 1000 },
        ];

        mockUseFastApp.mockReturnValue({
            fasts: mockFasts,
        });

        render(<DurationChart />);

        expect(screen.getByText('Duration')).toBeInTheDocument();
        // The Recharts DOM is quite complex, verifying the title is present is a good simple check
    });
});
