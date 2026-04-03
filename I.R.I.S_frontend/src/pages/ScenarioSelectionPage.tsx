import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api'; 

// 1. The visual catalog of scenarios
const scenarios = [
  { id: 'phishing', title: 'Spear Phishing', desc: 'An executive received an urgent email demanding wire transfer details. Is it a scam?', tag: 'Social Engineering', icon: 'alternate_email', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/20', hoverBgClass: 'hover:bg-blue-500', tagClass: 'bg-blue-500/10 text-blue-500', locked: false },
  { id: 'ransomware', title: 'Ransomware Outbreak', desc: 'Critical workstations are locked down with a red screen demanding cryptocurrency.', tag: 'Encryption', icon: 'lock_person', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/20', hoverBgClass: 'hover:bg-rose-500', tagClass: 'bg-rose-500/10 text-rose-500', locked: false },
  { id: 'malware', title: 'Malware Detection', desc: 'Antivirus alerts are going off across the marketing department. Contain the spread!', tag: 'Endpoint Security', icon: 'bug_report', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/20', hoverBgClass: 'hover:bg-amber-500', tagClass: 'bg-amber-500/10 text-amber-500', locked: false },
  { id: 'data_loss', title: 'Data Loss Prevention', desc: 'Massive amounts of encrypted zip files are being uploaded to an unknown external IP.', tag: 'Exfiltration', icon: 'data_usage', colorClass: 'text-purple-500', bgClass: 'bg-purple-500/20', hoverBgClass: 'hover:bg-purple-500', tagClass: 'bg-purple-500/10 text-purple-500', locked: false },
  { id: 'denial_of_service', title: 'DDoS Attack', desc: 'The main customer portal is unresponsive and traffic is spiking 10,000% above normal.', tag: 'Network Performance', icon: 'speed', colorClass: 'text-orange-500', bgClass: 'bg-orange-500/20', hoverBgClass: 'hover:bg-orange-500', tagClass: 'bg-orange-500/10 text-orange-500', locked: false }
];

// Leaderboard Type
interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
}

const ScenarioSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATES ---
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState(location.state?.level || 'beginner');
  const [currentIndex, setCurrentIndex] = useState(0); 


  // 🚨 NEW LEADERBOARD STATES
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

  // FILTER LOGIC
  const filteredScenarios = scenarios.filter((s) => {
    if (activeLevel === 'beginner') return ['phishing', 'ransomware'].includes(s.id);
    if (activeLevel === 'intermediate') return ['malware'].includes(s.id);
    if (activeLevel === 'expert') return ['data_loss', 'denial_of_service'].includes(s.id);
    return true; 
  });

  useEffect(() => { setCurrentIndex(0); }, [activeLevel]);

  // --- FETCH DATA (Sessions & Leaderboard) ---
  useEffect(() => {
    
    // 1. Fetch Leaderboard Data
    const fetchLeaderboard = async () => {
      try {
        setIsLeaderboardLoading(true);
        const response = await fetchWithAuth('http://localhost:8000/api/gameplay/leaderboard/', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error("Server connection failed:", error);
      } finally {
        setIsLeaderboardLoading(false);
      }
    };

    // 🚨 2. THE MISSING PIECE: Fetch Active/Paused Sessions!
    const fetchSessions = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/api/sessions/', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setActiveSessions(data); // Fill the bucket!
        }
      } catch (error) {
        console.error("Failed to load active sessions:", error);
      }
    };

    // Run both fetches when the page loads
    fetchLeaderboard();
    fetchSessions();
    
  }, []);

  // --- ACTIONS ---
  const handleAbandonSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!window.confirm(`Are you sure you want to delete Operation #${sessionId}?`)) return;
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/abandon/${sessionId}/`, { method: 'POST' });
      if (response.ok) setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) { console.error(err); }
  };

  const handleStartScenario = async (incidentId: string) => {
    setLoadingCardId(incidentId);
    let safeDifficulty = incidentId === 'malware' ? 'medium' : (incidentId === 'data_loss' || incidentId === 'denial_of_service' ? 'hard' : 'easy');
    try {
      const response = await fetchWithAuth('http://localhost:8000/api/session/start/', {
        method: 'POST',
        body: JSON.stringify({ incident_type: incidentId, difficulty: safeDifficulty })
      });

      if (response.ok) {
        const data = await response.json();
        const selectedScenario = scenarios.find(s => s.id === incidentId);
        navigate(`/ScenarioBriefingPage/${data.session_id}`, { 
          state: { briefingData: data.scenario_json, difficulty: activeLevel, customTitle: selectedScenario?.title, customDesc: selectedScenario?.desc } 
        }); 
      } else {
        alert("Failed to start mission.");
      }
    } catch (error) { console.error(error); } 
    finally { setLoadingCardId(null); }
  };

  const handleLogout = async () => {
    try { await fetchWithAuth('http://localhost:8000/api/logout/', { method: 'POST' }); } catch (e) { console.error(e) }
    navigate('/');
  };

  const handleNext = () => setCurrentIndex((prev) => (prev === filteredScenarios.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? filteredScenarios.length - 1 : prev - 1));

  const activeScenario = filteredScenarios[currentIndex];

  const getGlowColor = (colorClass: string) => {
    if (colorClass.includes('blue')) return 'shadow-[0_0_40px_rgba(59,130,246,0.15)] border-blue-500/30';
    if (colorClass.includes('rose')) return 'shadow-[0_0_40px_rgba(244,63,94,0.15)] border-rose-500/30';
    if (colorClass.includes('amber')) return 'shadow-[0_0_40px_rgba(245,158,11,0.15)] border-amber-500/30';
    if (colorClass.includes('purple')) return 'shadow-[0_0_40px_rgba(168,85,247,0.15)] border-purple-500/30';
    if (colorClass.includes('orange')) return 'shadow-[0_0_40px_rgba(249,115,22,0.15)] border-orange-500/30';
    return 'shadow-lg border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c16] text-slate-900 dark:text-white flex flex-col font-['Space_Grotesk'] overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-600/10 bg-white/80 dark:bg-[#0a0c16]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="material-icons text-white">security</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SHIELD<span className="text-[#1337ec]">RESPONSE</span></span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold transition-all group">
            <span className="material-icons text-xl group-hover:rotate-180 transition-transform">logout</span>
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-12 flex-grow w-full flex flex-col">
        
        {/* Active Operations Section */}
        {activeSessions.length > 0 && (
          <div className="mb-10 bg-slate-200/50 dark:bg-[#151726]/80 p-6 rounded-2xl border border-blue-500/20">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-icons text-[#1337ec] animate-pulse">radar</span> Active Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.map((op) => (
                <div key={op.id} className="relative bg-white/50 dark:bg-[#151726]/60 border border-slate-300 dark:border-white/5 rounded-xl p-4 flex items-center justify-between group transition-all hover:border-blue-500/30">
                  <button onClick={(e) => handleAbandonSession(op.id, e)} className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 scale-75 group-hover:scale-100"><span className="material-icons text-[16px]">close</span></button>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Op #{op.id}: {op.incident_type.replace('_', ' ')}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${op.status === 'paused' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">Status: {op.status}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/play/${op.id}`, { state: { isResuming: true } })} className="px-5 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20">Resume</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🚨 THE SPLIT LAYOUT: Scenarios on Left, Leaderboard on Right */}
        <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
          
          {/* LEFT SIDE: Mission Carousel */}
          <div className="flex-1 w-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Select <span className="text-[#1337ec]">Scenario</span></h1>
                <p className="text-slate-500 dark:text-slate-400">Threats calibrated for <strong>{activeLevel}</strong> level.</p>
              </div>
              <div className="flex bg-slate-200 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 w-fit">
                {['beginner', 'intermediate', 'expert'].map((lvl) => (
                  <button key={lvl} onClick={() => setActiveLevel(lvl)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${activeLevel === lvl ? 'bg-[#1337ec] text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {activeScenario && (
              <div className="relative w-full flex items-center justify-center py-4">
                {filteredScenarios.length > 1 && (<button onClick={handlePrev} className="absolute left-0 md:-left-4 p-3 text-slate-400 hover:text-[#1337ec] hover:scale-110 transition-all z-20"><span className="material-icons text-5xl">chevron_left</span></button>)}
                
                <div className={`w-full max-w-3xl bg-white dark:bg-[#101322]/80 backdrop-blur-xl border-2 rounded-3xl p-8 md:p-12 transition-all duration-500 ease-in-out flex flex-col items-center text-center mx-12
                  ${activeScenario.locked ? 'opacity-60 grayscale border-dashed border-slate-300 dark:border-slate-800' : getGlowColor(activeScenario.colorClass)}`}>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${activeScenario.locked ? 'bg-slate-200 dark:bg-slate-800' : activeScenario.bgClass}`}>
                    <span className={`material-icons text-5xl ${loadingCardId === activeScenario.id ? 'animate-spin' : ''} ${activeScenario.locked ? 'text-slate-400' : activeScenario.colorClass}`}>{loadingCardId === activeScenario.id ? 'autorenew' : activeScenario.icon}</span>
                  </div>
                  <div className={`mb-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${activeScenario.tagClass}`}>{activeScenario.tag}</div>
                  <h3 className={`text-3xl md:text-4xl font-bold tracking-widest uppercase mb-6 ${activeScenario.locked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>{loadingCardId === activeScenario.id ? 'Initializing...' : activeScenario.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base md:text-xl mb-10 min-h-[80px] max-w-lg">{activeScenario.desc}</p>
                  <button onClick={() => !activeScenario.locked && !loadingCardId && handleStartScenario(activeScenario.id)} disabled={activeScenario.locked || loadingCardId === activeScenario.id} className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-95 border-2 ${activeScenario.locked ? 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed' : `bg-transparent hover:text-white text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:border-transparent ${activeScenario.hoverBgClass}`}`}>
                    {loadingCardId === activeScenario.id ? "Deploying..." : "Deploy Operator"}
                    <span className="material-icons text-lg">{loadingCardId === activeScenario.id ? "hourglass_empty" : "rocket_launch"}</span>
                  </button>
                </div>

                {filteredScenarios.length > 1 && (<button onClick={handleNext} className="absolute right-0 md:-right-4 p-3 text-slate-400 hover:text-[#1337ec] hover:scale-110 transition-all z-20"><span className="material-icons text-5xl">chevron_right</span></button>)}
              </div>
            )}
            
            {filteredScenarios.length > 1 && (
              <div className="flex justify-center gap-3 mt-4 z-10"><br/>
                {filteredScenarios.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIndex(idx)} className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 h-2 bg-[#1337ec]' : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'}`} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Compact Leaderboard Panel */}
          <div className="w-full xl:w-[380px] bg-white/50 dark:bg-[#101322]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-xl flex-shrink-0">
            {/* Header */}
            <div className="bg-slate-100 dark:bg-[#151726] p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1337ec] text-2xl">leaderboard</span>
              <div>
                <h3 className="font-bold tracking-widest uppercase text-sm">Global Rankings</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Top Operatives</p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 p-4 flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {isLeaderboardLoading && (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <span className="material-symbols-outlined animate-spin text-2xl mb-2">sync</span>
                  <p className="text-xs uppercase tracking-widest">Syncing Data...</p>
                </div>
              )}

              {!isLeaderboardLoading && leaderboard.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-500 uppercase tracking-widest">No data available</div>
              )}

              {!isLeaderboardLoading && leaderboard.map((player) => (
                <div key={player.rank} className={`flex items-center p-3 rounded-xl border transition-all ${
                  player.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                  player.rank === 2 ? 'bg-slate-300/10 border-slate-300/30 text-slate-300 dark:text-slate-400' :
                  player.rank === 3 ? 'bg-amber-600/10 border-amber-600/30 text-amber-600' :
                  'bg-white dark:bg-[#0a0c16] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="w-8 font-black text-sm text-center">
                    {player.rank === 1 ? <span className="material-symbols-outlined text-lg">star</span> : `#${player.rank}`}
                  </div>
                  <div className="flex-1 px-3 font-bold text-sm tracking-wide truncate">{player.name}</div>
                  <div className="font-mono font-bold text-sm">{player.points} <span className="text-[10px] opacity-60 font-sans">XP</span></div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-slate-100 dark:bg-[#151726] border-t border-slate-200 dark:border-slate-800 text-center">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest">Updates in real-time</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ScenarioSelectionPage;