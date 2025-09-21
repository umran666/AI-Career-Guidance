import React, { useState, useEffect } from 'react';
import { Save, User, BookOpen, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Profile: React.FC = () => {
  const { profile, updateProfile, loading } = useApp();
  
  const [formData, setFormData] = useState({
    full_name: '',
    age: null as number | null,
    education: '',
    timeline: '',
    current_skills: [] as string[],
    career_interests: [] as string[],
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age,
        education: profile.education || '',
        timeline: profile.timeline || '',
        current_skills: profile.current_skills || [],
        career_interests: profile.career_interests || [],
      });
      setSkillsInput((profile.current_skills || []).join(', '));
      setInterestsInput((profile.career_interests || []).join(', '));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const skills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      
      const interests = interestsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await updateProfile({
        ...formData,
        current_skills: skills,
        career_interests: interests,
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-indigo-300" />
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-indigo-300" />
            <h3 className="text-xl font-bold text-white">Personal Information</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your age"
                min="16"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Education & Timeline */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-5 w-5 text-emerald-300" />
            <h3 className="text-xl font-bold text-white">Education & Career Timeline</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Education Level
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select your education level</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Career Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select your timeline</option>
                <option value="6-months">6 months</option>
                <option value="1-year">1 year</option>
                <option value="2-years">2 years</option>
                <option value="3-years">3+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-amber-300" />
            <h3 className="text-xl font-bold text-white">Skills & Interests</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., HTML, CSS, JavaScript, Python, React"
              />
              <p className="text-xs text-slate-400 mt-2">
                Separate multiple skills with commas. These will be tracked in your Skills Tracker.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Career Interests (comma separated)
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., Web Development, Data Science, AI/ML, Mobile Development"
              />
              <p className="text-xs text-slate-400 mt-2">
                Your interests help us create a personalized career roadmap.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};