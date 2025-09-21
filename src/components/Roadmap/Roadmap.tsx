import React from 'react';
import { MapPin, Clock, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const CAREER_ROADMAPS = {
  'web-development': [
    {
      phase: 'Foundation',
      duration: '2-3 months',
      steps: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'Responsive Design', 'Git & Version Control']
    },
    {
      phase: 'Intermediate',
      duration: '3-4 months',
      steps: ['React Framework', 'Node.js & Express', 'Database Basics (SQL)', 'API Development']
    },
    {
      phase: 'Advanced',
      duration: '2-3 months',
      steps: ['Full Stack Projects', 'Testing & Deployment', 'Performance Optimization', 'State Management']
    },
    {
      phase: 'Job Preparation',
      duration: '1-2 months',
      steps: ['Portfolio Development', 'Data Structures & Algorithms', 'Interview Preparation', 'Job Applications']
    }
  ],
  'data-science': [
    {
      phase: 'Foundation',
      duration: '3-4 months',
      steps: ['Python Programming', 'Statistics & Probability', 'Pandas & NumPy', 'Data Visualization']
    },
    {
      phase: 'Intermediate',
      duration: '4-5 months',
      steps: ['Machine Learning Algorithms', 'Scikit-learn', 'SQL & Databases', 'Data Cleaning & EDA']
    },
    {
      phase: 'Advanced',
      duration: '3-4 months',
      steps: ['Deep Learning Basics', 'TensorFlow/PyTorch', 'MLOps Fundamentals', 'Model Deployment']
    },
    {
      phase: 'Job Preparation',
      duration: '1-2 months',
      steps: ['Kaggle Competitions', 'Portfolio Projects', 'Case Study Preparation', 'Technical Interviews']
    }
  ],
  'ai-ml': [
    {
      phase: 'Foundation',
      duration: '3-4 months',
      steps: ['Mathematics for ML', 'Python Programming', 'Statistics & Linear Algebra', 'Data Preprocessing']
    },
    {
      phase: 'Intermediate',
      duration: '4-6 months',
      steps: ['Machine Learning', 'Neural Networks', 'TensorFlow/PyTorch', 'Computer Vision Basics']
    },
    {
      phase: 'Advanced',
      duration: '4-5 months',
      steps: ['Deep Learning Architecture', 'NLP & Transformers', 'Reinforcement Learning', 'Model Optimization']
    },
    {
      phase: 'Job Preparation',
      duration: '2 months',
      steps: ['Research Projects', 'Paper Implementation', 'Open Source Contributions', 'Technical Interviews']
    }
  ]
};

export const Roadmap: React.FC = () => {
  const { profile, skills } = useApp();

  const getPrimaryTrack = () => {
    const interests = profile?.career_interests?.map(i => i.toLowerCase()) || [];
    if (interests.some(i => i.includes('ai') || i.includes('ml') || i.includes('machine learning'))) {
      return 'ai-ml';
    }
    if (interests.some(i => i.includes('data') || i.includes('analytics') || i.includes('science'))) {
      return 'data-science';
    }
    return 'web-development';
  };

  const getSkillCompletion = (stepName: string) => {
    const relatedSkills = skills.filter(skill => 
      stepName.toLowerCase().includes(skill.skill_name.toLowerCase()) ||
      skill.skill_name.toLowerCase().includes(stepName.toLowerCase().split(' ')[0])
    );
    
    if (relatedSkills.length === 0) return 0;
    
    const avgMastery = relatedSkills.reduce((sum, skill) => sum + skill.mastery_level, 0) / relatedSkills.length;
    return avgMastery;
  };

  const isStepCompleted = (stepName: string) => {
    return getSkillCompletion(stepName) >= 80;
  };

  const getPhaseProgress = (steps: string[]) => {
    const completedSteps = steps.filter(step => isStepCompleted(step)).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  if (!profile?.career_interests?.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-amber-300" />
          <h2 className="text-2xl font-bold text-white">Career Roadmap</h2>
        </div>

        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
          <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
          <p className="text-slate-300">
            Add your career interests to generate a personalized roadmap that guides your learning journey.
          </p>
        </div>
      </div>
    );
  }

  const track = getPrimaryTrack();
  const roadmap = CAREER_ROADMAPS[track];
  const trackTitle = {
    'web-development': 'Web Development',
    'data-science': 'Data Science',
    'ai-ml': 'AI/Machine Learning'
  }[track];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MapPin className="h-8 w-8 text-amber-300" />
        <div>
          <h2 className="text-2xl font-bold text-white">Career Roadmap</h2>
          <p className="text-slate-300">Personalized path for {trackTitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {roadmap.map((phase, phaseIndex) => {
          const phaseProgress = getPhaseProgress(phase.steps);
          const isCurrentPhase = phaseIndex === 0 || (phaseIndex > 0 && getPhaseProgress(roadmap[phaseIndex - 1].steps) >= 80);
          
          return (
            <div key={phaseIndex} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${phaseProgress >= 80 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrentPhase 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-white/10 text-slate-400'
                    }
                  `}>
                    {phaseProgress >= 80 ? <CheckCircle className="h-5 w-5" /> : phaseIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Phase {phaseIndex + 1}: {phase.phase}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock className="h-4 w-4" />
                      <span>{phase.duration}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium">{phaseProgress}% Complete</span>
                    </div>
                  </div>
                </div>
                
                {isCurrentPhase && phaseProgress < 80 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Current Phase
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`
                      h-2 rounded-full transition-all duration-700 ease-out
                      ${phaseProgress >= 80 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : 'bg-gradient-to-r from-indigo-500 to-sky-400'
                      }
                    `}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {phase.steps.map((step, stepIndex) => {
                  const stepCompletion = getSkillCompletion(step);
                  const isCompleted = isStepCompleted(step);
                  
                  return (
                    <div key={stepIndex} className={`
                      flex items-center gap-3 p-3 rounded-lg transition-all
                      ${isCompleted 
                        ? 'bg-emerald-500/10 border border-emerald-500/30' 
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className={`font-medium ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                          {step}
                        </span>
                        {stepCompletion > 0 && stepCompletion < 80 && (
                          <div className="mt-1">
                            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                                style={{ width: `${stepCompletion}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">{Math.round(stepCompletion)}% progress</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
        <h3 className="text-lg font-bold text-indigo-300 mb-2">💡 Pro Tip</h3>
        <p className="text-slate-300 text-sm">
          Focus on completing one phase at a time. Log your progress in the Skills Tracker to see your roadmap update automatically. 
          Aim for 80% mastery in each step before moving to the next phase.
        </p>
      </div>
    </div>
  );
};