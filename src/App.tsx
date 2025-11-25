import { useState, useRef, useEffect } from 'react';
import FastScreen from './components/FastScreen';
import LogScreen from './components/LogScreen';
import BottomNav from './components/BottomNav';

type Screen = 'fast' | 'log';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('fast');
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentScreen]);

  return (
    <div className="h-[100dvh] bg-gray-100 dark:bg-gray-950 transition-colors duration-200 flex flex-col overflow-hidden">
      <div className="max-w-md mx-auto w-full h-full bg-white dark:bg-gray-900 shadow-2xl relative transition-colors duration-200 flex flex-col overflow-hidden">

        {/* Main Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto pt-4">
          {currentScreen === 'fast' ? <FastScreen /> : <LogScreen />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </div>
    </div>
  );
}

export default App;
