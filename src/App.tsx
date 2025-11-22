import { useState } from 'react';
import FastScreen from './screens/FastScreen';
import LogScreen from './screens/LogScreen';
import BottomNav from './components/BottomNav';

type Screen = 'fast' | 'log';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('fast');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative transition-colors duration-200 pb-24">
        <main className="pt-4 h-full">
          {currentScreen === 'fast' ? <FastScreen /> : <LogScreen />}
        </main>

        <BottomNav activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </div>
    </div>
  );
}

export default App;
