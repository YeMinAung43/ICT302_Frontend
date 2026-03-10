import { useNavigate, useParams } from 'react-router-dom';

const IncorrectFeedbackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#0a0c16] font-['Space_Grotesk'] overflow-x-hidden">
      {/* Custom Red Glow for Incorrect State */}
      <style dangerouslySetInnerHTML={{ __html: ".glow-danger { text-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }" }} />
      
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-blue-600/20 px-6 md:px-10 py-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center bg-[#1337ec] rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">shield</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Cyber Quest</h2>
          </div>
          <button 
            onClick={() => navigate('/ScenarioSelectionPage')}
            className="flex w-10 h-10 items-center justify-center rounded-full bg-slate-200 dark:bg-blue-600/20 text-slate-700 dark:text-white hover:bg-red-500/20 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-[600px] mx-auto w-full">
          {/* Danger Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500 text-red-500">
              <span className="material-symbols-outlined text-5xl font-bold">close</span>
            </div>
          </div>

          {/* Main Feedback */}
          <h1 className="text-red-500 tracking-tight text-5xl md:text-6xl font-bold text-center mb-4 glow-danger uppercase italic">
            INCORRECT
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium text-center mb-10">
            Phishing emails often use <span className="text-red-500 font-bold">urgent language</span> to trick you into clicking malicious links. Always verify the sender's email address manually before taking action.
          </p>

          {/* Penalty Card */}
          <div className="w-full mb-10">
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-8 bg-slate-100 dark:bg-red-900/10 border border-slate-200 dark:border-red-500/20 relative overflow-hidden group">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">Penalty</p>
              <div className="flex items-baseline gap-2">
                <span className="text-red-500 text-6xl font-bold glow-danger">-10 XP</span>
              </div>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-red-500/20 rounded-full">
                <span className="material-symbols-outlined text-red-500 text-sm font-bold">trending_down</span>
                <p className="text-red-500 text-sm font-bold uppercase">Streak Lost</p>
              </div>
            </div>
          </div>

          {/* Progress Bar (Showing no movement) */}
          <div className="w-full flex flex-col gap-3 mb-10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <p className="text-slate-900 dark:text-white text-sm font-bold">Level 4: Security Guardian</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">1,230 / 1,500 XP to next level</p>
              </div>
              <p className="text-[#1337ec] text-sm font-bold">80%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#1337ec] transition-all duration-1000 opacity-50" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Actions - Only Next Scenario */}
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => navigate('/ScenarioSelectionPage')}
              className="w-full h-14 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Next Scenario
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </main>

        {/* Footer Stats (Streak reset to 0) */}
        <footer className="mt-auto p-6 flex justify-center gap-8 border-t border-slate-200 dark:border-red-500/10">
          <div className="flex items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-slate-500">local_fire_department</span>
            <span className="text-sm font-bold dark:text-slate-400">0 Day Streak</span>
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

export default IncorrectFeedbackPage;