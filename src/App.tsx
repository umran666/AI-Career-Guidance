import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Profile } from './components/Profile/Profile';
import { Skills } from './components/Skills/Skills';
import { Roadmap } from './components/Roadmap/Roadmap';
import { Chat } from './components/Chat/Chat';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { currentView } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading AI Career Advisor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return <Profile />;
      case 'skills':
        return <Skills />;
      case 'roadmap':
        return <Roadmap />;
      case 'advisor':
        return <Chat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      </div>
      
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
};

const AppWithProviders: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <AuthForm />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppWithProviders />
    </AuthProvider>
  );
}

export default App;