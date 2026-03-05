import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 1. Data Structure
const scenarios = [
  {
    id: 'phishing',
    title: 'The Suspicious Email',
    desc: 'Someone in Finance received a strange invoice. Is it phishing or a real request?',
    tag: 'Communication',
    icon: 'alternate_email',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/20',
    hoverBgClass: 'group-hover:bg-blue-500',
    tagClass: 'bg-blue-500/10 text-blue-500',
    locked: false,
  },
  {
    id: 'ransomware',
    title: 'Locked Computer',
    desc: 'A workstation has been encrypted with a demand for payment. Act fast!',
    tag: 'Ransomware',
    icon: 'lock_person',
    colorClass: 'text-rose-500',
    bgClass: 'bg-rose-500/20',
    hoverBgClass: 'group-hover:bg-rose-500',
    tagClass: 'bg-rose-500/10 text-rose-500',
    locked: false,
  },
  {
    id: 'usb',
    title: 'The Mystery USB',
    desc: 'A flash drive was found in the parking lot. Someone just plugged it in.',
    tag: 'Physical Security',
    icon: 'usb',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/20',
    hoverBgClass: 'group-hover:bg-amber-500',
    tagClass: 'bg-amber-500/10 text-amber-500',
    recommended: true,
    locked: false,
  },
  {
    id: 'login',
    title: 'Unknown Login',
    desc: 'New login detected from a location your CEO has never visited.',
    tag: 'Authentication',
    icon: 'manage_accounts',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/20',
    hoverBgClass: 'group-hover:bg-emerald-500',
    tagClass: 'bg-emerald-500/10 text-emerald-500',
    locked: false,
  },
  {
    id: 'wifi',
    title: 'The Wi-Fi Ghost',
    desc: "A rogue access point is broadcasting 'Corporate_Guest'. It's not ours.",
    tag: 'Network',
    icon: 'wifi_tethering_off',
    colorClass: 'text-indigo-500',
    bgClass: 'bg-indigo-500/20',
    hoverBgClass: 'group-hover:bg-indigo-500',
    tagClass: 'bg-indigo-500/10 text-indigo-500',
    locked: false,
  },
  {
    id: 'leak',
    title: 'Leaked Secrets',
    desc: 'A developer accidentally pushed API keys to a public GitHub repo.',
    tag: 'Data Leak',
    icon: 'code_off',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/20',
    hoverBgClass: 'group-hover:bg-purple-500',
    tagClass: 'bg-purple-500/10 text-purple-500',
    locked: false,
  },
  {
    id: 'ddos',
    title: 'Server Overload',
    desc: 'Website traffic is spiking 5000% higher than usual. Is it a sale or a DDoS?',
    tag: 'Performance',
    icon: 'speed',
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-500/20',
    hoverBgClass: 'group-hover:bg-orange-500',
    tagClass: 'bg-orange-500/10 text-orange-500',
    locked: false,
  },
  {
    id: 'expert',
    title: 'Zero Day Hero',
    desc: 'Reach Level 5 to unlock this expert-tier incident response scenario.',
    tag: 'Locked',
    icon: 'psychology',
    colorClass: 'text-slate-500',
    bgClass: 'bg-slate-200 dark:bg-slate-800',
    hoverBgClass: '',
    tagClass: 'bg-slate-200 dark:bg-slate-800 text-slate-500',
    locked: false,
  }
];

const ScenarioSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. STATE: This tracks which difficulty button is clicked
  const [activeLevel, setActiveLevel] = useState(location.state?.level || 'beginner');

  // 3. FILTER LOGIC: Updates automatically when activeLevel changes
  const filteredScenarios = scenarios.filter((s) => {
    if (activeLevel === 'beginner') {
      return ['phishing', 'usb', 'login'].includes(s.id);
    }
    if (activeLevel === 'intermediate') {
      return s.locked === false;
    }
    return true; // Expert sees all
  });

  const handleLogout = () => navigate('/');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c16] text-slate-900 dark:text-white flex flex-col font-['Space_Grotesk']">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-600/10 bg-white/80 dark:bg-[#0a0c16]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="material-icons text-white">security</span>
            </div>
            <span className="text-xl font-bold tracking-tight">CYBER<span className="text-[#1337ec]">QUEST</span></span>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 font-bold transition-all group">
            <span className="material-icons text-xl group-hover:rotate-180 transition-transform">logout</span>
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </nav>

      {/* Header & Difficulty Switcher */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Select <span className="text-[#1337ec]">Scenario</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              Currently showing threats calibrated for <strong>{activeLevel}</strong> level.
            </p>
          </div>

          {/* THE 3 BUTTON SWITCHER */}
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
              onClick={() => !s.locked && navigate(`/ScenarioBriefingPage/${s.id}`)}
              className={`group relative overflow-hidden bg-white dark:bg-[#151726] border-2 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300
                ${s.locked 
                  ? 'cursor-not-allowed opacity-60 grayscale border-dashed border-slate-300 dark:border-slate-800' 
                  : 'cursor-pointer border-slate-100 dark:border-slate-800 hover:border-[#1337ec]/50 hover:-translate-y-2'
                }`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 
                ${s.locked ? 'bg-slate-200 dark:bg-slate-800' : `${s.bgClass} ${s.hoverBgClass}`}
              `}>
                <span className={`material-icons text-4xl transition-colors
                  ${s.locked ? 'text-slate-400' : `${s.colorClass} group-hover:text-white`}
                `}>
                  {s.icon}
                </span>
              </div>

              <h3 className={`text-2xl font-bold mb-3 ${s.locked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {s.title}
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