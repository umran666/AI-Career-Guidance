import React, { useState } from 'react';
import { TrendingUp, Plus, BarChart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const Skills: React.FC = () => {
  const { skills, progressLogs, logProgress, loading } = useApp();
  
  const [selectedSkill, setSelectedSkill] = useState('');
  const [progressAmount, setProgressAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [logging, setLogging] = useState(false);

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkill || !progressAmount) {
      alert('Please select a skill and enter progress amount.');
      return;
    }

    setLogging(true);
    try {
      await logProgress(selectedSkill, parseInt(progressAmount), notes.trim() || undefined);
      setSelectedSkill('');
      setProgressAmount('');
      setNotes('');
      alert(`Progress logged for ${selectedSkill}: ${progressAmount}%`);
    } catch (error) {
      console.error('Error logging progress:', error);
      alert('Failed to log progress. Please try again.');
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-emerald-300" />
        <h2 className="text-2xl font-bold text-white">Skills Tracker</h2>
      </div>

      {/* Current Skills */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="h-5 w-5 text-emerald-300" />
          <h3 className="text-xl font-bold text-white">Your Skills</h3>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">No skills tracked yet.</p>
            <p className="text-slate-400 text-sm">
              Add skills to your profile to start tracking progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">{skill.skill_name}</span>
                  <span className="text-emerald-300 font-semibold">{skill.mastery_level}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
                    style={{ width: `${skill.mastery_level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Progress */}
      {skills.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="h-5 w-5 text-indigo-300" />
            <h3 className="text-xl font-bold text-white">Log New Progress</h3>
          </div>

          <form onSubmit={handleLogProgress} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select a skill</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.skill_name}>
                      {skill.skill_name} (Current: {skill.mastery_level}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Mastery Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressAmount}
                  onChange={(e) => setProgressAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="What did you learn?"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={logging}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logging ? 'Logging Progress...' : 'Log Progress'}
            </button>
          </form>
        </div>
      )}

      {/* Recent Progress */}
      {progressLogs.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Recent Progress</h3>
          <div className="space-y-3">
            {progressLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <span className="font-medium text-white">{log.skill_name}</span>
                  {log.notes && <p className="text-sm text-slate-400 mt-1">{log.notes}</p>}
                </div>
                <div className="text-right">
                  <div className="text-emerald-300 font-semibold">{log.progress_amount}%</div>
                  <div className="text-xs text-slate-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};