import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const { profile, skills } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial AI message
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI Career Advisor. I can help you with career guidance, skill recommendations, learning paths, and interview preparation. What would you like to discuss today?",
        role: 'assistant',
        timestamp: new Date(),
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on user profile and skills
    const userSkills = skills.map(s => s.skill_name.toLowerCase());
    const userInterests = profile?.career_interests?.map(i => i.toLowerCase()) || [];
    
    if (message.includes('roadmap') || message.includes('path')) {
      if (userInterests.length === 0) {
        return "I'd love to help you create a roadmap! First, please complete your profile and specify your career interests. This will help me generate a personalized learning path just for you.";
      }
      return `Based on your interests in ${userInterests.join(', ')}, I recommend focusing on the current phase in your roadmap. Would you like me to break down the next steps into a weekly schedule?`;
    }
    
    if (message.includes('skill') || message.includes('learn')) {
      if (userSkills.length === 0) {
        return "Start by adding your current skills to your profile! This helps me understand your background and suggest the most relevant next steps for your career goals.";
      }
      const lowestSkill = skills.reduce((min, skill) => skill.mastery_level < min.mastery_level ? skill : min, skills[0]);
      return `I notice your ${lowestSkill?.skill_name} skill could use some improvement. Focus on daily practice - even 30-60 minutes can make a big difference. What specific aspect would you like to work on?`;
    }
    
    if (message.includes('job') || message.includes('interview') || message.includes('career')) {
      const avgSkillLevel = skills.length > 0 
        ? skills.reduce((sum, skill) => sum + skill.mastery_level, 0) / skills.length 
        : 0;
        
      if (avgSkillLevel < 70) {
        return "You're making great progress! To unlock more job opportunities, aim to get your average skill mastery above 70%. Focus on your foundational skills first, then build projects to demonstrate your abilities.";
      }
      return "Great! Your skills are at a good level for job applications. Make sure to build a strong portfolio with 2-3 solid projects. Practice explaining your projects clearly - this is key for interviews.";
    }
    
    if (message.includes('portfolio') || message.includes('project')) {
      return "A strong portfolio should showcase 2-3 projects that demonstrate different skills. Include: 1) A description of the problem solved, 2) Technologies used, 3) Challenges overcome, and 4) Live demo links. Quality over quantity!";
    }
    
    if (message.includes('motivation') || message.includes('stuck') || message.includes('difficult')) {
      return "Learning can be challenging, but you're not alone! Try breaking big goals into smaller, daily tasks. Celebrate small wins, and remember that consistency beats intensity. What specific challenge are you facing right now?";
    }
    
    if (message.includes('salary') || message.includes('pay') || message.includes('money')) {
      return "Salary depends on location, experience, and skills. Focus first on building solid fundamentals and a portfolio. Entry-level positions in tech typically offer good growth potential. Your skills and projects matter more than years of experience.";
    }
    
    if (message.includes('remote') || message.includes('work from home')) {
      return "Remote opportunities are abundant in tech! Build a strong online presence through GitHub, LinkedIn, and a personal website. Many companies now offer remote-first positions, especially for developers and data professionals.";
    }
    
    // Default responses
    const responses = [
      "That's a great question! Can you provide more details about your specific situation?",
      "I'm here to help with your career journey. What aspect would you like to focus on - skills, roadmap, or job preparation?",
      "Based on your profile, I can give you more personalized advice. What's your biggest challenge right now?",
      "Let's work together to advance your career. What would you like to achieve in the next 3 months?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5 glass-card smooth-transition hover:scale-105 logo-hop">
          <MessageCircle className="h-8 w-8 text-indigo-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Career Advisor</h2>
          <p className="text-slate-300">Get personalized career guidance and advice</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto rounded-xl p-4 bg-black/30 border border-white/8 mb-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div className={`
                max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-lg smooth-transition
                ${message.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white/6 border border-white/8 text-white rounded-bl-none'
                }
              `}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your career, skills, or job search..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "What should I learn next?",
            "Help me with interview prep",
            "Review my career roadmap",
            "How to build a portfolio?",
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};