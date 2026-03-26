import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ScenarioBriefingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // 1. Grab the data sent from ScenarioSelectionPage
  const rawDjangoData = location.state?.briefingData;
  const difficulty = location.state?.difficulty || 'easy';

  // 2. Map AI data to your UI layout
// 2. Map AI data to your UI layout with Smarter Storytelling
  const data = {
    title: rawDjangoData?.scenario_title || "Classified Incident",
    priority: "CRITICAL ALERT #9901",
    from: "System Sentinel <alerts@internal-monitor.local>",
    subject: `DETECTION: ${rawDjangoData?.scenario_title || 'Unauthorized Activity'}`,
    
    // --- IMPROVED BODY: Combines the Brief + the first AI Inject ---
    body: rawDjangoData 
      ? `${rawDjangoData.scenario_brief} \n\nDETAILED TELEMETRY: ${rawDjangoData.injects?.[0]?.text || ''}`
      : "A easy level phishing incident has been detected.",
    
    attachment: "threat_signature_analysis.exe",
    
    // Use the second inject (if it exists) as the hint, or a fallback
    hint: rawDjangoData?.injects?.[1]?.text || rawDjangoData?.injects?.[0]?.text || "Initial suspicious activity reported.",
    
    time: "20 MINS",
    xp: difficulty === 'hard' ? "2000 XP" : difficulty === 'medium' ? "1000 XP" : "500 XP"
  };

  const handleBeginInvestigation = () => {
    // Navigate to the dynamic play route we set up in App.tsx
    navigate(`/play/${id}`); 
  };

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] relative overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1337ec]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#1337ec 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <nav className="sticky top-0 z-50 border-b border-[#1337ec]/10 bg-[#0a0c16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white">security</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Cyber<span className="text-[#1337ec]">Quest</span></span>
          </div>
        </div>
      </nav>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 relative z-10">
        <div className="max-w-4xl w-full">
          
          {/* ⬅️ THE BACK ARROW IS BACK! */}
          <div 
            onClick={() => navigate('/ScenarioSelectionPage')} 
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#1337ec] transition-colors cursor-pointer group w-fit"
          >
            <span className="material-icons text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-medium uppercase tracking-wider">Back to Scenarios</span>
          </div>

          <div className="bg-slate-900/40 border border-[#1337ec]/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="bg-[#1337ec]/10 border-b border-white/10 p-6">
              <span className="text-[#1337ec] font-bold text-xs uppercase tracking-widest">{data.priority}</span>
              <h1 className="text-3xl font-bold">{data.title}</h1>
            </div>

            <div className="p-8 md:p-12">
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-8 mb-12">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-4 mb-4 text-sm">
                  <p><span className="text-slate-500">From:</span> {data.from}</p>
                  <p><span className="text-slate-500">Subject:</span> <span className="text-rose-400 font-bold">{data.subject}</span></p>
                </div>
                
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  {data.body}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-[#1337ec]">
                  <span className="material-icons text-sm">attach_file</span>
                  <span className="text-sm font-mono">{data.attachment}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={handleBeginInvestigation}
                  className="w-full md:w-auto px-12 py-5 bg-[#1337ec] hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(19,55,236,0.4)]"
                >
                  <span>BEGIN INVESTIGATION</span>
                  <span className="material-icons">play_arrow</span>
                </button>

                <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2"><span className="material-icons text-sm">schedule</span><span>{data.time}</span></div>
                  <div className="flex items-center gap-2"><span className="material-icons text-sm">trending_up</span><span>DIFFICULTY: {difficulty}</span></div>
                  <div className="flex items-center gap-2"><span className="material-icons text-sm">military_tech</span><span>{data.xp}</span></div>
                  <div className="flex items-center gap-2 text-blue-400"><span className="material-icons text-sm">memory</span><span>AI SCENARIO</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-slate-400 text-sm italic font-medium">
            "{data.hint}"
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScenarioBriefingPage;