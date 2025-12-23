import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import SetupPage from './components/setup/SetupPageNew';
import GrammarChecker from './components/grammar/GrammarChecker';
import LoadingSpinner from './components/common/LoadingSpinner';

function AppContent() {
  const { needsSetup, setNeedsSetup, isCheckingSetup } = useApp();

  if (isCheckingSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (needsSetup) {
    return <SetupPage onSetupComplete={() => setNeedsSetup(false)} />;
  }

  return <GrammarChecker />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
