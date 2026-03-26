import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const FeedbackPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Retrieve the data we passed from the Game Screen
  const feedbackData = location.state?.feedback || {};
  const isLastQuestion = location.state?.isLastQuestion || false;

  // 2. Map the AI's grading data
  // (We use fallbacks just in case the backend names the variables slightly differently)
  const aiExplanation = feedbackData.feedback || feedbackData.explanation || feedbackData.message || "The AI recorded your action and updated the network telemetry.";
  const isCorrect = feedbackData.is_correct; // Usually true, false, or undefined
  const scoreChange = feedbackData.score_change || feedbackData.points || 0;

  // 3. Dynamic Styling based on whether the choice was right or wrong!
  const theme = {
    color: isCorrect === true ? 'text-emerald-400' : isCorrect === false ? 'text-rose-400' : 'text-[#1337ec]',
    bg: isCorrect === true ? 'bg-emerald-500/10' : isCorrect === false ? 'bg-rose-500/10' : 'bg-[#1337ec]/10',
    border: isCorrect === true ? 'border-emerald-500/30' : isCorrect === false ? 'border-rose-500/30' : 'border-[#1337ec]/30',
    glow: isCorrect === true ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' : isCorrect === false ? 'shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'shadow-[0_0_30px_rgba(19,55,236,0.2)]',
    icon: isCorrect === true ? 'verified_user' : isCorrect === false ? 'gpp_bad' : 'policy',
    title: isCorrect === true ? 'THREAT MITIGATED' : isCorrect === false ? 'SECURITY BREACH' : 'ACTION LOGGED'
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // If the AI says we are done, jump to the final debrief!
      navigate(`/MissionCompletePage/${id}`);
    } else {
      // Otherwise, jump back into the game for the next question!
      navigate(`/play/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] flex flex-col relative overflow-hidden">
      
      {/* Background Glows mapped to the theme color */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${theme.bg} rounded-full blur-[150px] -z-10`} />
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Nav */}
      <nav className="w-full border-b border-white/5 bg-[#0a0c16]/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white text-sm">security</span>
            </div>
            <span className="text-lg font-bold tracking-tight">SHIELD<span className="text-[#1337ec]">RESPONSE</span></span>
          </div>
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-widest uppercase">
            Analysis Mode
          </div>
        </div>
      </nav>

      {/* Main Feedback Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full py-12 z-10">
        
        <div className={`w-full bg-slate-900/60 backdrop-blur-xl border ${theme.border} ${theme.glow} rounded-3xl p-8 md:p-12 flex flex-col items-center text-center transition-all duration-500`}>
          
          {/* Status Icon */}
          <div className={`w-24 h-24 ${theme.bg} rounded-full flex items-center justify-center mb-6 border ${theme.border}`}>
            <span className={`material-icons text-5xl ${theme.color}`}>{theme.icon}</span>
          </div>

          <h2 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${theme.color}`}>
            {theme.title}
          </h2>

          {/* AI Explanation Text */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-8 w-full text-left">
            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
              <span className="material-icons text-slate-400 text-sm">memory</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">AI Tactical Feedback</span>
            </div>
            <p className="text-slate-200 text-lg leading-relaxed">
              {aiExplanation}
            </p>
          </div>

          {/* Score Impact (Only shows if points were awarded/deducted) */}
          {scoreChange !== 0 && (
            <div className={`flex items-center gap-2 text-xl font-bold mb-8 ${scoreChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className="material-icons">{scoreChange > 0 ? 'trending_up' : 'trending_down'}</span>
              <span>{scoreChange > 0 ? '+' : ''}{scoreChange} XP</span>
            </div>
          )}

          {/* Continue Button */}
          <button 
            onClick={handleNext}
            className="w-full md:w-auto px-12 py-5 bg-white text-black hover:bg-slate-200 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl"
          >
            <span>{isLastQuestion ? 'CONCLUDE INVESTIGATION' : 'NEXT SITUATION'}</span>
            <span className="material-icons">arrow_forward</span>
          </button>

        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;