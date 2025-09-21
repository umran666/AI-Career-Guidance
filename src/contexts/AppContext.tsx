import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id?: string;
  full_name: string;
  age: number | null;
  education: string;
  timeline: string;
  current_skills: string[];
  career_interests: string[];
  profile_completion: number;
}

export interface Skill {
  id?: string;
  skill_name: string;
  mastery_level: number;
}

export interface ProgressLog {
  id?: string;
  skill_name: string;
  progress_amount: number;
  notes: string | null;
  created_at: string;
}

interface AppContextType {
  profile: UserProfile | null;
  skills: Skill[];
  progressLogs: ProgressLog[];
  currentView: string;
  sidebarOpen: boolean;
  loading: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateSkillProgress: (skillName: string, masteryLevel: number) => Promise<void>;
  logProgress: (skillName: string, progressAmount: number, notes?: string) => Promise<void>;
  setCurrentView: (view: string) => void;
  setSidebarOpen: (open: boolean) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setProfile(null);
      setSkills([]);
      setProgressLogs([]);
      setLoading(false);
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchSkills(), fetchProgressLogs()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
  };

  const fetchSkills = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return;
    }

    setSkills(data || []);
  };

  const fetchProgressLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching progress logs:', error);
      return;
    }

    setProgressLogs(data || []);
  };

  const calculateProfileCompletion = (profileData: Partial<UserProfile>): number => {
    let completed = 0;
    const total = 6;
    
    if (profileData.full_name?.trim()) completed++;
    if (profileData.age) completed++;
    if (profileData.education) completed++;
    if (profileData.timeline) completed++;
    if (profileData.current_skills?.length) completed++;
    if (profileData.career_interests?.length) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    const updatedProfile = {
      ...profileData,
      profile_completion: calculateProfileCompletion(profileData),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...updatedProfile,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    setProfile(data);

    // Update skills based on current_skills
    if (profileData.current_skills) {
      await syncSkills(profileData.current_skills);
    }
  };

  const syncSkills = async (skillNames: string[]) => {
    if (!user) return;

    // Get existing skills
    const { data: existingSkills } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id);

    const existingSkillNames = existingSkills?.map(s => s.skill_name) || [];

    // Add new skills
    const newSkills = skillNames.filter(name => !existingSkillNames.includes(name));
    if (newSkills.length > 0) {
      const { error } = await supabase
        .from('skills')
        .insert(
          newSkills.map(name => ({
            user_id: user.id,
            skill_name: name,
            mastery_level: 0,
          }))
        );

      if (error) {
        console.error('Error adding new skills:', error);
      }
    }

    // Remove skills not in current_skills
    const skillsToRemove = existingSkillNames.filter(name => !skillNames.includes(name));
    if (skillsToRemove.length > 0) {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('user_id', user.id)
        .in('skill_name', skillsToRemove);

      if (error) {
        console.error('Error removing skills:', error);
      }
    }

    await fetchSkills();
  };

  const updateSkillProgress = async (skillName: string, masteryLevel: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('skills')
      .update({ 
        mastery_level: Math.max(0, Math.min(100, masteryLevel)),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('skill_name', skillName);

    if (error) {
      console.error('Error updating skill progress:', error);
      throw error;
    }

    await fetchSkills();
  };

  const logProgress = async (skillName: string, progressAmount: number, notes?: string) => {
    if (!user) return;

    // Log the progress
    const { error: logError } = await supabase
      .from('progress_logs')
      .insert({
        user_id: user.id,
        skill_name: skillName,
        progress_amount: Math.max(0, Math.min(100, progressAmount)),
        notes: notes || null,
      });

    if (logError) {
      console.error('Error logging progress:', logError);
      throw logError;
    }

    // Update skill mastery level
    await updateSkillProgress(skillName, progressAmount);
    await fetchProgressLogs();
  };

  const value = {
    profile,
    skills,
    progressLogs,
    currentView,
    sidebarOpen,
    loading,
    updateProfile,
    updateSkillProgress,
    logProgress,
    setCurrentView,
    setSidebarOpen,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};