import React from 'react';
import { User, TrendingUp, Target, CheckSquare, ExternalLink } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import TiltCard from '../Utils/TiltCard';

const MOCK_OPPORTUNITIES = {
  'web-development': {
    internships: [
      { title: 'Frontend Developer Intern', org: 'TechCorp', link: 'https://www.linkedin.com/jobs' },
      { title: 'Full Stack Intern', org: 'StartupXYZ', link: 'https://www.linkedin.com/jobs' }
    ],
    hackathons: [
      { title: 'Web Innovation Challenge', org: 'HackersUnite', link: 'https://devpost.com/hackathons' },
      { title: 'React Developer Contest', org: 'CodeFest', link: 'https://devpost.com/hackathons' }
    ],
    jobs: [
      { title: 'Junior Frontend Engineer', org: 'TechGiant', link: 'https://www.linkedin.com/jobs' }
    ]
  },
  'data-science': {
    internships: [
      { title: 'Data Analyst Intern', org: 'DataCorp', link: 'https://www.linkedin.com/jobs' },
      { title: 'ML Research Intern', org: 'AI Labs', link: 'https://www.linkedin.com/jobs' }
    ],
    hackathons: [
      { title: 'Data Science Challenge', org: 'Kaggle', link: 'https://www.kaggle.com/competitions' },
      { title: 'AI Innovation Hack', org: 'MLConf', link: 'https://devpost.com/hackathons' }
    ],
    jobs: [
      { title: 'Junior Data Scientist', org: 'Analytics Inc', link: 'https://www.linkedin.com/jobs' }
    ]
  }
};

export const Dashboard: React.FC = () => {
  const { profile, skills, setCurrentView } = useApp();

  const profileCompletion = profile?.profile_completion || 0;
  
  const averageSkillMastery = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + skill.mastery_level, 0) / skills.length)
    : 0;

  const isUnlocked = averageSkillMastery >= 70 || skills.some(skill => skill.mastery_level >= 80);

  const getPrimaryTrack = () => {
    const interests = profile?.career_interests?.map(i => i.toLowerCase()) || [];
    if (interests.some(i => i.includes('data') || i.includes('analytics'))) return 'data-science';
    return 'web-development';
  };

  const getNextStepsRecommendation = () => {
    if (profileCompletion < 100) {
      return 'Complete your profile to unlock personalized recommendations';
    }
    if (skills.length === 0) {
      return 'Add skills to start tracking your progress';
    }
    
    const interests = profile?.career_interests?.map(i => i.toLowerCase()) || [];
    if (interests.some(i => i.includes('web') || i.includes('frontend'))) {
      return 'Start with HTML/CSS fundamentals & build a portfolio website';
    }
    if (interests.some(i => i.includes('data'))) {
      return 'Begin with Python + Pandas and complete a data analysis project';
    }
    return 'Explore different career paths and choose your focus area';
  };

  const renderOpportunities = () => {
    if (!isUnlocked) {
      return ['Internships', 'Hackathons', 'Jobs'].map(section => (
        <div key={section} className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">{section}</h4>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              Locked
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Reach 70% average skill mastery to unlock curated {section.toLowerCase()}.
          </p>
        </div>
      ));
    }

    const track = getPrimaryTrack();
    const opportunities = MOCK_OPPORTUNITIES[track as keyof typeof MOCK_OPPORTUNITIES];

    return [
      { title: 'Internships', items: opportunities.internships },
      { title: 'Hackathons', items: opportunities.hackathons },
      { title: 'Jobs', items: opportunities.jobs }
    ].map(section => (
      <div key={section.title} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white">{section.title}</h4>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            New
          </span>
        </div>
        <ul className="space-y-2">
          {section.items.map((item, idx) => (
            <li key={idx} className="text-sm">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
              >
                <span>
                  <strong>{item.title}</strong> — {item.org}
                </span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TiltCard className="p-5 glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102 hover:shadow-xl hover:shadow-indigo-500/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-300">Profile Completion</span>
              <User className="h-5 w-5 text-indigo-300" />
            </div>
            <div className="space-y-2">
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-white">{profileCompletion}%</p>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="p-5 glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102 hover:shadow-xl hover:shadow-emerald-500/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-300">Average Skill Mastery</span>
              <TrendingUp className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="space-y-2">
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${averageSkillMastery}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-white">{averageSkillMastery}%</p>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="p-5 glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-300">Career Goals</span>
              <Target className="h-5 w-5 text-amber-300" />
            </div>
            <div className="text-sm text-slate-200">
              {profile?.career_interests?.length ? (
                <div>
                  <p className="text-slate-400">Target Roles:</p>
                  <p className="font-semibold text-white">{profile.career_interests.join(', ')}</p>
                  <p className="text-slate-400 mt-1">Timeline: {profile.timeline || 'Not specified'}</p>
                </div>
              ) : (
                'Set your career goals to see recommendations'
              )}
            </div>
          </div>
        </TiltCard>

        <TiltCard className="p-5 glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-300">Next Steps</span>
              <CheckSquare className="h-5 w-5 text-rose-300" />
            </div>
            <div className="text-sm text-slate-200">
              {getNextStepsRecommendation()}
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Opportunities */}
  <div className="p-6 rounded-2xl glass-card border border-white/8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Opportunities for You</h3>
            <p className="text-sm text-slate-300">
              {isUnlocked 
                ? 'Congratulations! Here are tailored opportunities based on your progress.'
                : 'Unlock internships, hackathons, and jobs by progressing your skills.'
              }
            </p>
          </div>
          {isUnlocked && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
              Unlocked
            </span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderOpportunities()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
  <div className="p-6 rounded-2xl glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Update Profile</h4>
              <p className="text-sm text-slate-300">Add your details to personalize everything.</p>
            </div>
            <button
              onClick={() => setCurrentView('profile')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-medium"
            >
              Edit
            </button>
          </div>
        </div>
        
  <div className="p-6 rounded-2xl glass-card border border-white/8 transform smooth-transition hover:-translate-y-1 hover:scale-102">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Log Progress</h4>
              <p className="text-sm text-slate-300">Track learning and projects.</p>
            </div>
            <button
              onClick={() => setCurrentView('skills')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-medium"
            >
              Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};