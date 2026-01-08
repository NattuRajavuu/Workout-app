
import React, { useState, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import History from './components/History';
import Profile from './components/Profile';
import { useWorkoutData } from './hooks/useWorkoutData';
import { useRecoveryData } from './hooks/useRecoveryData';
import { ChartBarIcon, ClipboardListIcon, HomeIcon, UserIcon } from './components/Icons';
import type { WorkoutLog, RecoveryLog } from './types';
import { storageService } from './services/storageService';
import { generateUUID } from './utils/helpers';

type View = 'dashboard' | 'log' | 'history' | 'profile';

const getOwnerId = (): string => {
  let ownerId = storageService.getItem<string>('lifttrack-owner-id');
  if (!ownerId) {
    ownerId = generateUUID();
    storageService.setItem('lifttrack-owner-id', ownerId);
  }
  return ownerId;
};


const App: React.FC = () => {
  const [ownerId] = useState(getOwnerId);
  const [activeClientId, setActiveClientId] = useState<string>(ownerId);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const isCoachMode = useMemo(() => activeClientId !== ownerId, [activeClientId, ownerId]);

  const { workouts, addWorkout } = useWorkoutData(activeClientId);
  const { recoveryLogs, addRecoveryLog } = useRecoveryData(activeClientId);

  const handleLoadClient = (clientId: string) => {
    if (clientId && clientId.trim() !== '') {
        setActiveClientId(clientId.trim());
        setCurrentView('dashboard');
    }
  };

  const handleExitCoachMode = () => {
      setActiveClientId(ownerId);
      setCurrentView('profile');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard workouts={workouts} recoveryLogs={recoveryLogs} addRecoveryLog={addRecoveryLog} />;
      case 'log':
        return <WorkoutLogger onWorkoutComplete={(workout) => {
          addWorkout(workout);
          setCurrentView('dashboard');
        }} />;
      case 'history':
        return <History workouts={workouts} />;
      case 'profile':
        return <Profile 
                  ownerId={ownerId} 
                  isCoachMode={isCoachMode}
                  activeClientId={activeClientId}
                  onLoadClient={handleLoadClient}
                  onExitCoachMode={handleExitCoachMode}
                />;
      default:
        return <Dashboard workouts={workouts} recoveryLogs={recoveryLogs} addRecoveryLog={addRecoveryLog} />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-400">LiftTrack AI</h1>
          {isCoachMode && <p className="text-xs text-yellow-400 -mt-1">Coach Mode: Viewing Client {activeClientId.substring(0, 8)}...</p>}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6 mb-20">
        {renderView()}
      </main>

      {currentView !== 'log' && (
        <div className="fixed bottom-20 right-4 z-20">
            <button
              onClick={() => setCurrentView('log')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full p-4 shadow-lg transition-transform transform hover:scale-105"
              aria-label="Log new workout"
            >
              <ClipboardListIcon className="w-8 h-8" />
            </button>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-10">
        <nav className="container mx-auto flex justify-around">
          <NavItem
            label="Dashboard"
            icon={<HomeIcon className="w-6 h-6" />}
            isActive={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem
            label="History"
            icon={<ChartBarIcon className="w-6 h-6" />}
            isActive={currentView === 'history'}
            onClick={() => setCurrentView('history')}
          />
          <NavItem
            label="Profile"
            icon={<UserIcon className="w-6 h-6" />}
            isActive={currentView === 'profile'}
            onClick={() => setCurrentView('profile')}
          />
        </nav>
      </footer>
    </div>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-emerald-400';
  const inactiveClasses = 'text-gray-400 hover:text-white';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default App;
