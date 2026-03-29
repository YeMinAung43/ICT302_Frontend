import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const DebriefPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 3 };
  
  const maxScore = totalQuestions * 10;
  const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

// --- NEW: AI FEEDBACK STATES ---
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  
  // 🔒 THE LOCK: Stop React's double-fire!
  const hasFetched = useRef(false);

  useEffect(() => {
    // If we already sent the request, STOP and do nothing!
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDebrief = async () => {
      try {
        const token = localStorage.getItem('access') || localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:8000/api/debrief/${id}/`, {
          method: 'POST', 
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' 
          }
        });

        // ... (the rest of your fetch logic stays exactly the same!) ...

        if (response.ok) {
          const data = await response.json();
          // Assuming the backend sends { "feedback": "..." } or something similar
          setAiReport(data.feedback || data.response || data.debrief || "No feedback generated.");
        } else {
          console.error("Failed to fetch AI Debrief");
          setAiReport("The AI Instructor was unable to generate a report for this session.");
        }
      } catch (error) {
        console.error("Server error:", error);
        setAiReport("Connection to the AI Instructor was lost.");
      } finally {
        setIsGenerating(false);
      }
    };

    fetchDebrief();
  }, [id]);

  // Helper function to format the AI's raw text into nice paragraphs/bullets
  const formatFeedback = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return <li key={index} className="ml-4 mb-2 text-slate-300 list-disc">{line.substring(1).trim()}</li>;
      }
      if (line.trim() === '') return <br key={index} />;
      return <p key={index} className="mb-2 text-slate-300">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white flex flex-col items-center py-12 px-6 font-['Space_Grotesk'] relative overflow-x-hidden">
      
      {/* Background Cyber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 -z-10 bg-[#1337ec]" />

      <div className="w-full max-w-4xl bg-[#0a0c16]/80 backdrop-blur-xl border border-[#1337ec]/30 rounded-3xl p-8 md:p-12 flex flex-col items-center shadow-[0_0_50px_rgba(19,55,236,0.1)] z-10 my-auto">
        
        {/* Header Section */}
        <div className="w-20 h-20 rounded-full bg-[#1337ec]/10 border border-[#1337ec]/50 flex items-center justify-center mb-6 shadow-inner">
          <span className="material-icons text-4xl text-[#1337ec]">military_tech</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase mb-2 text-white text-center">
          Simulation Complete
        </h1>
        <p className="text-slate-400 tracking-widest uppercase text-xs mb-10">Session ID: #{id}</p>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center transition-transform hover:scale-105">
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Total XP Earned</span>
            <span className="text-4xl font-bold text-[#1337ec]">{score}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center transition-transform hover:scale-105">
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">Accuracy Rate</span>
            <span className="text-4xl font-bold text-cyan-400">{accuracy}%</span>
          </div>
        </div>

        {/* 🤖 AI INSTRUCTOR REPORT SECTION */}
        <div className="w-full bg-[#0a0c16] border border-white/10 rounded-2xl p-6 md:p-8 mb-10 relative overflow-hidden">
          {/* Subtle grid background for the report box */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className={`material-icons text-sm ${isGenerating ? 'text-amber-400 animate-spin' : 'text-[#1337ec]'}`}>
                {isGenerating ? 'autorenew' : 'psychology'}
              </span>
              <span className="text-sm font-bold tracking-widest uppercase text-white">
                AI Instructor Report
              </span>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8 opacity-70">
                <span className="w-12 h-1 bg-[#1337ec]/50 rounded mb-4 overflow-hidden relative">
                  <span className="absolute top-0 left-0 h-full bg-[#1337ec] w-1/3 animate-[slide_1s_ease-in-out_infinite_alternate]" />
                </span>
                <p className="text-xs tracking-widest text-slate-400 uppercase animate-pulse">Analyzing player telemetry & generating feedback...</p>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }` }} />
              </div>
            ) : (
              <div className="text-sm leading-relaxed">
                {aiReport ? <ul>{formatFeedback(aiReport)}</ul> : <p className="text-slate-500 italic">No feedback available.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Button */}
        <button 
          onClick={() => navigate('/ScenarioSelectionPage')}
          className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold tracking-widest uppercase transition-all flex items-center gap-3 group"
        >
          <span className="material-icons text-slate-400 group-hover:text-white transition-colors">dashboard</span>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DebriefPage;