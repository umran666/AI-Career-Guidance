import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, setSidebarOpen } = useApp();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';

  return (
    <header className="sticky top-0 z-30 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {' '}
              <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent animate-fadeInUp">
                {displayName}
              </span>
              <span className="ml-2">👋</span>
            </h2>
            <p className="text-slate-300/80 text-sm md:text-base">
              Let's build your path to a career you love.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-sm">
            <span className="text-white font-medium">{displayName}</span>
            <span className="text-slate-400">{user?.email}</span>
          </div>
          
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm md:text-base">
            {getInitials(displayName)}
          </div>
          
          <button
            onClick={signOut}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};