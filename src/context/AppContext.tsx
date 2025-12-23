import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkSetupStatus } from '../services/setupService';

interface AppContextType {
  needsSetup: boolean;
  setNeedsSetup: (value: boolean) => void;
  isCheckingSetup: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState<boolean>(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSetupStatus();
        setNeedsSetup(status.needsSetup);
      } catch (error) {
        console.error('Error checking setup status:', error);
      } finally {
        setIsCheckingSetup(false);
      }
    };

    checkStatus();
  }, []);

  const value: AppContextType = {
    needsSetup,
    setNeedsSetup,
    isCheckingSetup
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
