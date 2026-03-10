import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MissionCompletePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Format the ID for display (e.g., 'phishing' -> 'The Suspicious Email')
  const scenarioTitle = id === 'phishing' ? 'The Suspicious Email' : id?.replace('-', ' ');

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-[#0a0c16] text-slate-900 dark:text-white font-['Space_Grotesk'] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white/80 dark:bg-[#0a0c16]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="text-[#1337ec]">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Cyber Quest</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Alex Chen</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Level 12 Tech</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#1337ec]/20 border border-[#1337ec]/50 flex items-center justify-center overflow-hidden">
                 <span className="material-symbols-outlined text-[#1337ec]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-[960px] mx-auto w-full">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/10 text-green-500 mb-6 ring-4 ring-green-500/5 animate-bounce">
              <span className="material-symbols-outlined text-6xl">verified_user</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2 uppercase italic">Mission Complete</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Scenario: {scenarioTitle}</p>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Final Grade</p>
              <div className="text-8xl font-bold text-[#1337ec]">A+</div>
              <p className="mt-4 text-xl font-semibold">95% Overall Score</p>
            </div>

            <div className="grid grid-cols-1 gap-4 h-full">
              {[
                { icon: 'check_circle', label: 'Accuracy', val: '98%', color: 'text-green-500', bg: 'bg-green-500/10' },
                { icon: 'timer', label: 'Time Taken', val: '02:45', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: 'military_tech', label: 'XP Earned', val: '+1,250', color: 'text-amber-500', bg: 'bg-amber-500/10' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${item.label === 'XP Earned' ? 'text-amber-500' : ''}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluator Feedback */}
          <div className="w-full p-6 rounded-xl bg-[#1337ec]/5 border border-[#1337ec]/20 mb-12 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1337ec]">auto_awesome</span>
              Evaluator Feedback
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              Outstanding work, Agent! You correctly identified the phishing attempt and took the proper containment steps. Your focus on hidden metadata was particularly sharp.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={() => navigate('/ScenarioSelectionPage')}
              className="flex-1 py-4 px-6 rounded-xl bg-[#1337ec] hover:bg-blue-700 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1337ec]/20"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Return to Dashboard
            </button>
            <button className="flex-1 py-4 px-6 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-lg transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">history_edu</span>
              Review Mistakes
            </button>
          </div>
        </main>

        <footer className="mt-auto py-8 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
          <p>© 2026 CyberQuest Incident Response Labs</p>
        </footer>
      </div>
    </div>
  );
};

export default MissionCompletePage;