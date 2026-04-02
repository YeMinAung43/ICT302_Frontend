import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ScenarioBriefingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // 1. Grab the rich text and AI data sent from the Dashboard
  const { briefingData, difficulty, customTitle, customDesc } = location.state || {};

  // 🚨 NEW: Intelligently grab the AI-generated story, or fallback to the static description
  const scenarioStory = briefingData?.scenario_brief || customDesc || "An unknown anomaly has been detected on the network. Review the telemetry and proceed with caution.";
  const initialTelemetry = briefingData?.injects?.[0]?.text; // Grabs the first piece of AI telemetry

  const handleBeginInvestigation = () => {
    navigate(`/play/${id}`, { state: { customTitle } });
  };

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] relative overflow-x-hidden">
      
      {/* Background FX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1337ec]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none -z-20 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#1337ec 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#1337ec]/10 bg-[#0a0c16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white">security</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Cyber<span className="text-[#1337ec]">Fanhouse</span></span>
          </div>
        </div>
      </nav>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 relative z-10">
        <div className="max-w-4xl w-full">
          
          {/* ⬅ THE BACK ARROW */}
          <div 
            onClick={() => navigate('/ScenarioSelectionPage')} 
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#1337ec] transition-colors cursor-pointer group w-fit"
          >
            <span className="material-icons text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-medium uppercase tracking-wider">Back to Scenarios</span>
          </div>

          {/* --- UPGRADED TACTICAL BRIEFING CARD --- */}
          <div className="bg-[#151726]/80 border border-[#1337ec]/20 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
            
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="material-icons text-rose-500">crisis_alert</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                    {/* Prioritize AI Title, fallback to Dashboard Title */}
                    {briefingData?.scenario_title || customTitle || 'Classified Incident'}
                  </h1>
                  <p className="text-[10px] text-blue-400 font-mono mt-1 tracking-widest uppercase">CRITICAL ALERT #9901 // INTERNAL_TELEMETRY</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-rose-500/20 flex items-center gap-2 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  ACTIVE THREAT
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="relative z-10 mb-10">
              
              {/* 🚨 THE UPGRADED AI TEXT BLOCK 🚨 */}
              <div className="text-slate-300 leading-relaxed text-lg mb-8 font-medium space-y-4">
                <p>{scenarioStory}</p>
                
                {/* Only shows up if the AI actually generated telemetry! */}
                {initialTelemetry && (
                  <p className="leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    <span className="text-rose-400 font-bold tracking-widest uppercase mr-3 text-sm flex items-center gap-2 mb-1">
                      <span className="material-icons text-[16px]">radar</span>
                      Detailed Telemetry:
                    </span>
                    <span className="text-cyan-300 font-mono text-sm leading-loose">
                      {initialTelemetry}
                    </span>
                  </p>
                )}
              </div>

              {/* Telemetry & Artifacts Box */}
              <div className="bg-[#0a0c16]/80 rounded-xl p-5 border border-white/5 flex items-start gap-4 shadow-inner">
                <span className="material-icons text-[#1337ec] mt-0.5">dataset</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Available Telemetry & Artifacts</h4>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-3 py-1.5 bg-[#1337ec]/10 text-[#1337ec] text-[11px] font-mono rounded-md border border-[#1337ec]/20 flex items-center gap-1.5">
                      <span className="material-icons text-[14px]">description</span> system_logs.dat
                    </span>
                    <span className="px-3 py-1.5 bg-[#1337ec]/10 text-[#1337ec] text-[11px] font-mono rounded-md border border-[#1337ec]/20 flex items-center gap-1.5">
                      <span className="material-icons text-[14px]">wifi_tethering</span> network_traffic.pcap
                    </span>
                    <span className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-[11px] font-mono rounded-md border border-rose-500/20 flex items-center gap-1.5">
                      <span className="material-icons text-[14px]">bug_report</span> suspicious_payload.exe
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="relative z-10 pt-6 border-t border-white/5 flex justify-center md:justify-start">
              <button 
                onClick={handleBeginInvestigation}
                className="w-full md:w-auto px-10 py-4 bg-[#1337ec] hover:bg-blue-600 text-white rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(19,55,236,0.3)] hover:shadow-[0_0_30px_rgba(19,55,236,0.5)]"
              >
                <span>Begin Investigation</span>
                <span className="material-icons">play_arrow</span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ScenarioBriefingPage;