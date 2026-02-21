import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useFastApp } from '../../hooks/useFastApp';

export default function DurationChart() {
    const { fasts } = useFastApp();

    const data = useMemo(() => {
        if (!fasts || fasts.length === 0) return [];

        // Sort fasts by start time (oldest first)
        const sortedFasts = [...fasts].sort((a, b) => a.startTime - b.startTime);

        return sortedFasts.map(fast => {
            const date = new Date(fast.startTime);
            return {
                date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                durationHours: Number((fast.duration / (1000 * 60 * 60)).toFixed(1)),
            };
        });
    }, [fasts]);

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 mt-6 h-64">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Duration</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dx={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                color: '#111827'
                            }}
                            formatter={(value: any) => [`${value}h`, 'Duration']}
                            labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                        />
                        <Bar dataKey="durationHours" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.durationHours >= 16 ? '#3B82F6' : '#93C5FD'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
