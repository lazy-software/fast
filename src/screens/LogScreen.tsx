export default function LogScreen() {
    return (
        <div className="p-4 pb-12 max-w-md mx-auto w-full">
            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Yesterday</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">16 hours • 8:00 PM - 12:00 PM</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900/30">
                        Completed
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Monday</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">18 hours • 6:00 PM - 12:00 PM</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900/30">
                        Completed
                    </div>
                </div>

                <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                    No more history
                </div>
            </div>
        </div>
    );
}
