import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MaybeFeedbackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#0a0c16] font-['Space_Grotesk'] overflow-x-hidden">
      {/* Custom Amber Glow for Warning/Hint State */}
      <style dangerouslySetInnerHTML={{ __html: ".glow-warning { text-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }" }} />
      
      <div className="layout-container flex h-full grow flex-col">
        {/* Header (Unified Theme) */}
        <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-blue-600/20 px-6 md:px-10 py-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-[#1337ec] rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">shield</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Cyber Quest</h2>
          </div>
          <button 
            onClick={() => navigate('/ScenarioSelectionPage')}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-slate-200 dark:bg-blue-600/20 text-slate-700 dark:text-white hover:bg-amber-500/20 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-[600px] mx-auto w-full">
          {/* Warning/Hint Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border-4 border-amber-500 text-amber-500">
              <span className="material-symbols-outlined text-5xl font-bold">lightbulb</span>
            </div>
          </div>

          {/* Main Feedback */}
          <h1 className="text-amber-500 tracking-tight text-5xl md:text-6xl font-bold text-center mb-4 glow-warning uppercase italic">
            ALMOST THERE...
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium text-center mb-10">
            You are on the right track, but missed a crucial detail. Checking the sender's domain is good, but you must also verify the <span className="text-amber-500 font-bold">link destination</span>.
          </p>

          {/* Penalty/Hint Card */}
          <div className="w-full mb-6">
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-8 bg-slate-100 dark:bg-amber-900/10 border border-slate-200 dark:border-amber-500/30 relative overflow-hidden group">
              <p className="text-slate-500 dark:text-amber-500/70 text-sm font-semibold uppercase tracking-widest">Hint Penalty</p>
              <div className="flex items-baseline gap-2">
                <span className="text-amber-500 text-6xl font-bold glow-warning">-5 XP</span>
              </div>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-amber-500/20 rounded-full">
                <span className="material-symbols-outlined text-amber-500 text-sm font-bold">info</span>
                <p className="text-amber-500 text-sm font-bold uppercase">Partial Credit</p>
              </div>
            </div>
          </div>

          {/* Pro Tip Box (Adapted from your design) */}
          <div className="w-full p-1 rounded-xl bg-gradient-to-br from-[#1337ec]/40 to-transparent mb-10">
            <div className="flex flex-col items-start gap-4 rounded-lg border border-slate-200 dark:border-[#1337ec]/30 bg-white dark:bg-[#0a0c16] p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1337ec]/10 text-[#1337ec]">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <p className="text-slate-900 dark:text-white text-lg font-bold">Pro Tip: Link Hovering</p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Attackers often mask malicious URLs behind legitimate-looking text. Always hover over a link without clicking to reveal the true destination address in your browser's status bar.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex flex-col gap-3 mb-10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <p className="text-slate-900 dark:text-white text-sm font-bold">Level 4: Security Guardian</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">1,235 / 1,500 XP to next level</p>
              </div>
              <p className="text-amber-500 text-sm font-bold">80%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Actions - Only Next Scenario */}
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => navigate('/ScenarioSelectionPage')}
              className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20"
            >
              Next Scenario
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </main>

        {/* Footer Stats (Unified Theme) */}
        <footer className="mt-auto p-6 flex justify-center gap-8 border-t border-slate-200 dark:border-blue-600/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
            <span className="text-sm font-bold dark:text-white">5 Day Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1337ec]">military_tech</span>
            <span className="text-sm font-bold dark:text-white">Top 15% Today</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MaybeFeedbackPage;