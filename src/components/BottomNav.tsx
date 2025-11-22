type Tab = 'fast' | 'log';

interface BottomNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around p-4 pb-6 shadow-lg z-10 transition-colors duration-200">
            <button
                onClick={() => onTabChange('fast')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'fast'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                Fast
            </button>
            <div className="w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>
            <button
                onClick={() => onTabChange('log')}
                className={`flex-1 py-2 text-center font-medium rounded-lg transition-colors ${activeTab === 'log'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                Log
            </button>
        </div>
    );
}
