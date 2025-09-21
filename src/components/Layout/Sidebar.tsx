import React from 'react';
import { 
  Home, 
  User, 
  TrendingUp, 
  MapPin, 
  MessageCircle,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'profile', name: 'My Profile', icon: User },
  { id: 'skills', name: 'Skills Tracker', icon: TrendingUp },
  { id: 'roadmap', name: 'Career Roadmap', icon: MapPin },
  { id: 'advisor', name: 'Talk to Advisor', icon: MessageCircle },
];

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-black/20 backdrop-blur-xl border-r border-white/10
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center logo-hop logo-primary logo-stroke-16">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">AI Career Advisor</h1>
              <p className="text-xs text-slate-300/70">Your Path to Success</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
                  transform smooth-transition duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-sky-400/8 text-white border border-white/20 shadow-md' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5 hover:-translate-y-0.5'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-300'} transition-colors`} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-300/80">
              <span className="font-semibold text-indigo-300">Pro Tip:</span> Complete your profile and log progress to unlock personalized career opportunities!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};