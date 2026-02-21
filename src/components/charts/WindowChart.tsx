import { useMemo } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    Cell
} from 'recharts';
import { useFastApp } from '../../hooks/useFastApp';

export default function WindowChart() {
    const { fasts } = useFastApp();

    const data = useMemo(() => {
        if (!fasts || fasts.length === 0) return [];

        const sortedFasts = [...fasts].sort((a, b) => a.startTime - b.startTime);

        return sortedFasts.map(fast => {
            const startDate = new Date(fast.startTime);
            const endDate = new Date(fast.endTime);

            // Calculate hours as a decimal (e.g., 14:30 -> 14.5)
            const startHour = startDate.getHours() + startDate.getMinutes() / 60;
            let endHour = endDate.getHours() + endDate.getMinutes() / 60;

            // Handle fasts that cross midnight
            if (endHour < startHour) {
                endHour += 24;
            }

            return {
                id: fast.id,
                date: startDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                dateObj: startDate,
                startHour,
                endHour,
                duration: Number((fast.duration / (1000 * 60 * 60)).toFixed(1)),
                // We plot the midpoint of the fast on the Y axis for the scatter point
                midHour: startHour + ((endHour - startHour) / 2)
            };
        });
    }, [fasts]);

    if (data.length === 0) {
        return null;
    }

    const formatHour = (decimalHour: number) => {
        const h = Math.floor(decimalHour) % 24;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}${ampm}`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-sm">
                    <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{data.date}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {formatHour(data.startHour)} - {formatHour(data.endHour)}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {data.duration}h duration
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 mt-4 h-72">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Window</h3>
            <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                        <XAxis
                            type="category"
                            dataKey="date"
                            name="Date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            type="number"
                            dataKey="midHour"
                            name="Time"
                            domain={[0, 24]}
                            tickFormatter={formatHour}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dx={10}
                            ticks={[0, 6, 12, 18, 24]}
                        />
                        <ZAxis type="number" dataKey="duration" range={[100, 500]} name="Duration" />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#9CA3AF' }} />
                        <Scatter data={data} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.duration >= 16 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(147, 197, 253, 0.6)'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>

                {/* Overlay exact ranges as vertical lines behind the scatter points */}
                <div className="absolute inset-0 pointer-events-none" style={{ left: '40px', right: '10px', top: '10px', bottom: '26px' }}>
                    {data.map(() => {
                        // X position is tricky to match exactly with Recharts category axis without exposing internals,
                        // so relying on the scatter points mostly, but this adds a nice range effect if properly aligned.
                        // We'll skip the complex CSS overlay for now and let the Scatter bubble size represent duration
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
