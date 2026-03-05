import { useParams, useNavigate } from 'react-router-dom';
import { SCENARIO_QUESTIONS } from '../data/scenarioData';

const CorrectFeedbackPage = () => {
  const { id, step } = useParams();
  const navigate = useNavigate();

  const currentStepIndex = parseInt(step || '0');
  
  // You would import or define the same SCENARIO_QUESTIONS object here
  // to know how many questions exist for this scenario.
  const totalQuestions = SCENARIO_QUESTIONS[id as keyof typeof SCENARIO_QUESTIONS]?.length || 1;
  
  // Check if we are on the very last question
  const isLastQuestion = currentStepIndex >= totalQuestions - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      // If it's the last question, go back to the selection screen (or a final score screen!)
      navigate('/ScenarioSelectionPage');
    } else {
      // If there are more questions, go to the NEXT step (currentStepIndex + 1)
      navigate(`/IncidentChoicePage/${id}/${currentStepIndex + 1}`);
    }
  };
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#0a0c16] font-['Space_Grotesk'] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ".glow-success { text-shadow: 0 0 20px rgba(11, 218, 101, 0.4); }" }} />
      
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
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500 text-green-500">
              <span className="material-symbols-outlined text-5xl font-bold">check</span>
            </div>
          </div>

          {/* Main Feedback */}
          <h1 className="text-green-500 tracking-tight text-5xl md:text-6xl font-bold text-center mb-4 glow-success uppercase italic">
            CORRECT!
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium text-center mb-10">
            Excellent work. Identifying the <span className="text-[#1337ec] dark:text-blue-400 font-bold">sender's domain</span> is the most critical first step in verifying email authenticity.
          </p>

          {/* XP Card */}
          <div className="w-full mb-10">
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl p-8 bg-slate-100 dark:bg-blue-600/10 border border-slate-200 dark:border-blue-600/20 relative overflow-hidden group">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">Points Earned</p>
              <div className="flex items-baseline gap-2">
                <span className="text-green-500 text-6xl font-bold glow-success">+10 XP</span>
              </div>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-500/20 rounded-full">
                <span className="material-symbols-outlined text-green-500 text-sm font-bold">trending_up</span>
                <p className="text-green-500 text-sm font-bold uppercase">Streak Bonus: +2 XP</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex flex-col gap-3 mb-10">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <p className="text-slate-900 dark:text-white text-sm font-bold">Level 4: Security Guardian</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">1,240 / 1,500 XP to next level</p>
              </div>
              <p className="text-[#1337ec] text-sm font-bold">80%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#1337ec] transition-all duration-1000" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
          <button onClick={handleNext} className="...">
      {isLastQuestion ? "Complete Scenario" : "Next Question"}
      <span className="material-symbols-outlined">
        {isLastQuestion ? "done_all" : "arrow_forward"}
      </span>
    </button>
          </div>
        </main>

        {/* Footer Stats */}
        <footer className="mt-auto p-6 flex justify-center gap-8 border-t border-slate-200 dark:border-blue-600/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
            <span className="text-sm font-bold dark:text-white">5 Day Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1337ec]">military_tech</span>
            <span className="text-sm font-bold dark:text-white">Top 5% Today</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CorrectFeedbackPage;