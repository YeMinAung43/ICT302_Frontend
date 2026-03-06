import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DifficultySelectionPage = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');

  const handleStartMission = () => {
    console.log(`Starting mission with difficulty: ${selectedDifficulty}`);
    // This will lead to the Scenario Selection page we made earlier
    navigate('/ScenarioSelectionPage', { state: { level: selectedDifficulty } });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#0a0c16] text-slate-900 dark:text-white font-['Space_Grotesk']">
      <div className="flex h-full grow flex-col">
        
        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="text-[#1337ec]">
              <span className="material-symbols-outlined text-3xl">shield_lock</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight uppercase italic">
              Cyber Response
            </h2>
          </div>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 hover:bg-[#1337ec]/20 transition-colors">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">settings</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="max-w-[800px] w-full flex flex-col items-center">
            
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
                Choose Your Mission
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                Select the intensity of the cyber threat simulation you want to tackle today.
              </p>
            </div>

            {/* Difficulty Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
              
              {/* Beginner Card */}
              <label className="group relative cursor-pointer">
                <input
                  className="peer absolute opacity-0"
                  name="difficulty"
                  type="radio"
                  value="beginner"
                  checked={selectedDifficulty === 'beginner'}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
                <div className="flex flex-col h-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-[#1337ec] peer-checked:bg-white dark:peer-checked:bg-slate-800 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm">
                  <div className="mb-6 h-32 w-full rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-emerald-500 text-5xl">child_care</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Beginner</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Perfect for your first day. Basic guided tasks and simple fixes.
                  </p>
                </div>
              </label>

              {/* Intermediate Card */}
              <label className="group relative cursor-pointer">
                <input
                  className="peer absolute opacity-0"
                  name="difficulty"
                  type="radio"
                  value="intermediate"
                  checked={selectedDifficulty === 'intermediate'}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
                <div className="flex flex-col h-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-[#1337ec] peer-checked:bg-white dark:peer-checked:bg-slate-800 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm">
                  <div className="mb-6 h-32 w-full rounded-lg bg-amber-500/10 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-amber-500 text-5xl">bolt</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Intermediate</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    The standard shift. Handle common threats with minimal help.
                  </p>
                </div>
              </label>

              {/* Expert Card */}
              <label className="group relative cursor-pointer">
                <input
                  className="peer absolute opacity-0"
                  name="difficulty"
                  type="radio"
                  value="expert"
                  checked={selectedDifficulty === 'expert'}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                />
                <div className="flex flex-col h-full p-6 bg-slate-50 dark:bg-slate-900 border-2 border-transparent peer-checked:border-[#1337ec] peer-checked:bg-white dark:peer-checked:bg-slate-800 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm">
                  <div className="mb-6 h-32 w-full rounded-lg bg-red-500/10 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-red-500 text-5xl">local_fire_department</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Expert</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Emergency protocols. Full-scale attacks requiring rapid response.
                  </p>
                </div>
              </label>

            </div>

            {/* Footer Actions */}
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <button 
                onClick={handleStartMission}
                className="w-full h-14 bg-[#1337ec] hover:bg-blue-700 text-white rounded-lg font-bold text-lg tracking-wide transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                START MISSION
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-medium">
                System status: <span className="text-emerald-500">Ready</span>
              </p>
            </div>
          </div>
        </main>

        {/* Aesthetic Footer Elements */}
        <footer className="p-6 flex justify-between items-center opacity-30 text-[10px] uppercase tracking-[0.2em] font-bold">
          <div>SEC-OP // UNIT 042</div>
          <div>STATION-7 // NODAL_ACCESS_GRANTED</div>
        </footer>
      </div>
    </div>
  );
};

export default DifficultySelectionPage;