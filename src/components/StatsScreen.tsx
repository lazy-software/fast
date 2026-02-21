import { useFastApp } from '../hooks/useFastApp';

export default function StatsScreen() {
    const { fasts } = useFastApp();

    const formatDuration = (ms: number) => {
        if (ms === 0) return '0h';
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours === 0) return `${minutes}m`;
        return `${hours}h ${minutes}m`;
    };

    const calculateStats = () => {
        if (fasts.length === 0) {
            return {
                totalFasts: 0,
                totalDuration: 0,
                averageDuration: 0,
                maxDuration: 0,
                p90Duration: 0,
            };
        }

        const durations = fasts.map((f) => f.duration).sort((a, b) => a - b);
        const totalDuration = durations.reduce((sum, curr) => sum + curr, 0);

        const getPercentile = (percentile: number) => {
            const index = Math.ceil((percentile / 100) * durations.length) - 1;
            return durations[index];
        };

        return {
            totalFasts: fasts.length,
            totalDuration,
            averageDuration: totalDuration / fasts.length,
            maxDuration: durations[durations.length - 1],
            p90Duration: getPercentile(90),
        };
    };

    const stats = calculateStats();

    const StatCard = ({ title, value }: { title: string; value: string | number }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    );

    return (
        <div className="p-4 max-w-md mx-auto w-full pb-24">

            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    title="Total Fasts"
                    value={stats.totalFasts}
                />
                <StatCard
                    title="Total Time"
                    value={formatDuration(stats.totalDuration)}
                />
                <StatCard
                    title="Average Fast"
                    value={formatDuration(stats.averageDuration)}
                />
                <StatCard
                    title="Longest Fast"
                    value={formatDuration(stats.maxDuration)}
                />
                <StatCard
                    title="p90 Fast"
                    value={formatDuration(stats.p90Duration)}
                />
            </div>
        </div>
    );
}
