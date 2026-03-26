import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 1. The visual catalog of scenarios (The actual briefing text will come from Django!)
const scenarios = [
  { 
    id: 'phishing', 
    title: 'Spear Phishing', 
    desc: 'An executive received an urgent email demanding wire transfer details. Is it a scam?', 
    tag: 'Social Engineering', icon: 'alternate_email', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/20', hoverBgClass: 'group-hover:bg-blue-500', tagClass: 'bg-blue-500/10 text-blue-500', locked: false 
  },
  { 
    id: 'ransomware', 
    title: 'Ransomware Outbreak', 
    desc: 'Critical workstations are locked down with a red screen demanding cryptocurrency.', 
    tag: 'Encryption', icon: 'lock_person', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/20', hoverBgClass: 'group-hover:bg-rose-500', tagClass: 'bg-rose-500/10 text-rose-500', locked: false 
  },
  { 
    id: 'malware', 
    title: 'Malware Detection', 
    desc: 'Antivirus alerts are going off across the marketing department. Contain the spread!', 
    tag: 'Endpoint Security', icon: 'bug_report', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/20', hoverBgClass: 'group-hover:bg-amber-500', tagClass: 'bg-amber-500/10 text-amber-500', locked: false 
  },
  { 
    id: 'data_loss', 
    title: 'Data Loss Prevention', 
    desc: 'Massive amounts of encrypted zip files are being uploaded to an unknown external IP.', 
    tag: 'Exfiltration', icon: 'data_usage', colorClass: 'text-purple-500', bgClass: 'bg-purple-500/20', hoverBgClass: 'group-hover:bg-purple-500', tagClass: 'bg-purple-500/10 text-purple-500', locked: false 
  },
  { 
    id: 'denial_of_service', 
    title: 'DDoS Attack', 
    desc: 'The main customer portal is unresponsive and traffic is spiking 10,000% above normal.', 
    tag: 'Network Performance', icon: 'speed', colorClass: 'text-orange-500', bgClass: 'bg-orange-500/20', hoverBgClass: 'group-hover:bg-orange-500', tagClass: 'bg-orange-500/10 text-orange-500', locked: false 
  }
];

const ScenarioSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- THE MISSING FIX: Added the loadingCardId state back! ---
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);

  // UI STATE
  const [activeLevel, setActiveLevel] = useState(location.state?.level || 'beginner');

  // FILTER LOGIC
  const filteredScenarios = scenarios.filter((s) => {
    if (activeLevel === 'beginner') return ['phishing', 'ransomware'].includes(s.id);
    if (activeLevel === 'intermediate') return s.locked === false;
    return true; 
  });

  // Fetch Active/Paused Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/sessions/', {
          method: 'GET',
          credentials: 'include', 
        });
        if (response.ok) {
          const data = await response.json();
          setActiveSessions(data);
        }
      } catch (error) {
        console.error("Failed to load active sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  // --- THE NEW BACKEND-DRIVEN FLOW ---
  const handleStartScenario = async (incidentId: string) => {
    setLoadingCardId(incidentId);

    const difficultyMap: Record<string, string> = {
      'beginner': 'easy',
      'intermediate': 'medium',
      'expert': 'hard'
    };
    const djangoDifficulty = difficultyMap[activeLevel];

    try {
      const response = await fetch('http://localhost:8000/api/session/start/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_type: incidentId,
          difficulty: djangoDifficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // --- LOG THE DATA TO CONSOLE FOR DEBUGGING ---
        console.log("Django AI Data:", data);

        navigate(`/ScenarioBriefingPage/${data.session_id}`, { 
          state: { 
            briefingData: data.scenario_json, 
            difficulty: djangoDifficulty 
          } 
        }); 
      } else {
        const errorData = await response.json();
        alert(`Failed to start: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Server connection failed:", error);
    } finally {
      setLoadingCardId(null);
    }
  };

  const handleLogout = async () => {
    try {
        await fetch('http://localhost:8000/api/logout/', { method: 'POST', credentials: 'include' });
    } catch (e) { console.error(e) }
    navigate('/');
  };

  // 1. Add this function inside your ScenarioSelectionPage component
const handleAbandonSession = async (sessionId: number, e: React.MouseEvent) => {
  e.stopPropagation(); // Prevents the card click from firing
  
  if (!window.confirm(`Are you sure you want to delete Operation #${sessionId}?`)) return;

  try {
    const response = await fetch(`http://localhost:8000/api/abandon/${sessionId}/`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      // This line removes the card from the UI immediately without refreshing
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  } catch (err) {
    console.error("Failed to close session:", err);
  }
};

// 2. Update the "Active Operations" mapping in your JSX:
{activeSessions.map((op) => (
  <div key={op.id} className="relative bg-[#151726] border border-white/5 rounded-xl p-4 flex items-center justify-between group">
    
    {/* --- THE NEW CLOSE BUTTON --- */}
    <button 
      onClick={(e) => handleAbandonSession(op.id, e)}
      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:bg-rose-500"
    >
      <span className="material-icons text-[14px] text-white">close</span>
    </button>

    <div>
      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Op #{op.id}: {op.incident_type}</h4>
      <p className="text-[10px] text-slate-500">Status: {op.status}</p>
    </div>
    
    <button 
      onClick={() => navigate(`/play/${op.id}`)}
      className="px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
    >
      Resume
    </button>
  </div>
))}


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c16] text-slate-900 dark:text-white flex flex-col font-['Space_Grotesk']">
      
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

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        
        {/* Active Operations Section */}
        {activeSessions.length > 0 && (
          <div className="mb-12 bg-slate-200/50 dark:bg-[#151726]/80 p-6 rounded-2xl border border-blue-500/20">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-icons text-[#1337ec] animate-pulse">radar</span> 
              Active Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {activeSessions.map((op) => (
    <div 
      key={op.id} 
      className="relative bg-[#151726]/60 border border-white/5 rounded-xl p-4 flex items-center justify-between group transition-all hover:border-blue-500/30"
    >
      
      {/* 🔴 THE CLOSE BUTTON: This will appear on the top-right when you hover */}
      <button 
        onClick={(e) => handleAbandonSession(op.id, e)}
        className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 scale-75 group-hover:scale-100"
        title="Remove Operation"
      >
        <span className="material-icons text-[16px]">close</span>
      </button>

      <div className="flex flex-col gap-1">
        <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">
          Op #{op.id}: {op.incident_type.replace('_', ' ')}
        </h4>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-[10px] text-slate-400 font-medium">Status: {op.status}</p>
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/play/${op.id}`)}
        className="px-5 py-2 bg-blue-600/10 text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
      >
        Resume
      </button>
    </div>
  ))}
</div>
          </div>
        )}

        {/* Header & Difficulty Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Select <span className="text-[#1337ec]">Scenario</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              Currently showing threats calibrated for <strong>{activeLevel}</strong> level.
            </p>
          </div>

          <div className="flex bg-slate-200 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 w-fit self-start md:self-auto">
            {['beginner', 'intermediate', 'expert'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                  activeLevel === lvl
                    ? 'bg-[#1337ec] text-white shadow-xl shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredScenarios.map((s) => (
            <div 
              key={s.id}
              onClick={() => {
                if (!s.locked && !loadingCardId) handleStartScenario(s.id);
              }}
              className={`group relative overflow-hidden bg-white dark:bg-[#151726] border-2 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300
                ${s.locked 
                  ? 'cursor-not-allowed opacity-60 grayscale border-dashed border-slate-300 dark:border-slate-800' 
                  : loadingCardId === s.id 
                    ? 'border-[#1337ec] opacity-80' // Loading state style
                    : 'cursor-pointer border-slate-100 dark:border-slate-800 hover:border-[#1337ec]/50 hover:-translate-y-2'
                }`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 
                ${s.locked ? 'bg-slate-200 dark:bg-slate-800' : `${s.bgClass} ${s.hoverBgClass}`}
              `}>
                <span className={`material-icons text-4xl transition-colors
                  ${s.locked ? 'text-slate-400' : `${s.colorClass} group-hover:text-white`}
                  ${loadingCardId === s.id ? 'animate-spin' : ''}
                `}>
                  {loadingCardId === s.id ? 'autorenew' : s.icon}
                </span>
              </div>

              <h3 className={`text-2xl font-bold mb-3 ${s.locked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {loadingCardId === s.id ? 'Initializing...' : s.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                {s.desc}
              </p>
              
              <div className={`mt-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.tagClass}`}>
                {s.tag}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ScenarioSelectionPage;