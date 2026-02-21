import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useFastApp } from '../../hooks/useFastApp';

export default function DistributionChart() {
    const { fasts } = useFastApp();

    const data = useMemo(() => {
        if (!fasts || fasts.length === 0) return [];

        const distribution = {
            '< 12h': 0,
            '12h - 16h': 0,
            '16h - 20h': 0,
            '20h+': 0
        };

        fasts.forEach(fast => {
            const hours = fast.duration / (1000 * 60 * 60);
            if (hours < 12) distribution['< 12h']++;
            else if (hours < 16) distribution['12h - 16h']++;
            else if (hours < 20) distribution['16h - 20h']++;
            else distribution['20h+']++;
        });

        return [
            { name: '< 12h', value: distribution['< 12h'], color: '#93C5FD' }, // blue-300
            { name: '12h - 16h', value: distribution['12h - 16h'], color: '#60A5FA' }, // blue-400
            { name: '16h - 20h', value: distribution['16h - 20h'], color: '#3B82F6' }, // blue-500
            { name: '20h+', value: distribution['20h+'], color: '#1D4ED8' }       // blue-700
        ].filter(item => item.value > 0); // Only show segments that have data
    }, [fasts]);

    if (data.length === 0) {
        return null;
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-sm">
                    <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{data.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.value} {data.value === 1 ? 'fast' : 'fasts'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 mt-4 h-72">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Distribution</h3>
            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value, entry: any) => (
                                <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">{value} ({entry.payload.value})</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
