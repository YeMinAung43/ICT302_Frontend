import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { feedback, nextStep, questions, score } = location.state || {};

// Safely check for both our custom flags and Django's real data
  const isCorrect = feedback?.is_correct || feedback?.answer_is_correct || false;
  const isTimeout = feedback?.is_timeout || false;
  
  // 💎 FIXED: Only use our strict XP from the backpack, ignore Django's score_change
  const xpEarned = feedback?.xp_earned || 0;

  // 🛡️ IMMERSIVE CYBER FALLBACKS
  let defaultExplanation = isCorrect 
    ? "Action successful. Threat neutralized and network integrity maintained. Excellent work, Operator."
    : "Critical error. The threat actor successfully bypassed defenses based on your response. Review SOC protocols immediately.";
  if (isTimeout) defaultExplanation = "Time limit exceeded. In active cyber warfare, hesitation results in system compromise. You must act faster.";

  // 🚨 USE DJANGO'S CRISIS EVENT FOR THE TEXT
  const explanation = feedback?.crisis_event || defaultExplanation;

  // 🏁 THE END-GAME CHECKER
  const isLastQuestion = nextStep >= (questions?.length || 3);

  const handleNext = () => {
    if (isLastQuestion) {
      navigate(`/debrief/${id}`, {
        state: { 
          score: score || 0,
          totalQuestions: questions?.length || 3
        }
      });
    } else {
      navigate(`/play/${id}`, {
        state: {
          nextStep: nextStep || 1,
          questions: questions,
          score: score || 0
        }
      });
    }
  };

  const themeColor = isCorrect ? 'text-emerald-500' : 'text-rose-500';
  const borderColor = isCorrect ? 'border-emerald-500/20' : 'border-rose-500/20';
  const glowColor = isCorrect ? 'shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'shadow-[0_0_30px_rgba(244,63,94,0.1)]';
  
  let headerText = isCorrect ? "THREAT MITIGATED" : "BREACH DETECTED";
  if (isTimeout) headerText = "RESPONSE TIMEOUT";

  let icon = isCorrect ? "check_circle" : "warning";
  if (isTimeout) icon = "timer_off";

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white flex flex-col items-center justify-center font-['Space_Grotesk'] relative overflow-hidden p-6">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 -z-10 ${isCorrect ? 'bg-emerald-600' : 'bg-rose-600'}`} />

      <div className={`w-full max-w-2xl bg-[#0a0c16]/80 backdrop-blur-xl border ${borderColor} rounded-3xl p-8 md:p-12 flex flex-col items-center text-center ${glowColor}`}>
        <div className={`w-20 h-20 rounded-full bg-[#0a0c16] border ${borderColor} flex items-center justify-center mb-6 shadow-inner`}>
          <span className={`material-icons text-4xl ${themeColor}`}>{icon}</span>
        </div>

        <h2 className={`text-xl md:text-2xl font-bold tracking-widest uppercase mb-8 ${themeColor}`}>
          {headerText}
        </h2>

        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <span className="material-icons text-slate-400 text-sm">memory</span>
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">AI Tactical Feedback</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {explanation}
          </p>
        </div>

        <div className="flex items-center gap-3 mb-10">
          <span className={`material-icons ${themeColor}`}>trending_up</span>
          <span className={`text-2xl font-bold tracking-widest ${themeColor}`}>+{xpEarned} XP</span>
        </div>

        <button 
          onClick={handleNext}
          className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 group"
        >
          {isLastQuestion ? "Complete Mission" : "Next Situation"}
          <span className="material-icons group-hover:translate-x-1 transition-transform">
            {isLastQuestion ? "flag" : "arrow_forward"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;