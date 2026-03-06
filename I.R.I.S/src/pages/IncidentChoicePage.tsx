import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SCENARIO_QUESTIONS } from '../data/scenarioData';

const IncidentChoicePage = () => {
  const navigate = useNavigate();
  const { id,step } = useParams();
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(2450);

// Convert the step from the URL (string) into a number
  const currentStepIndex = parseInt(step || '0');

  // Get the list of questions for this specific scenario
  const questions = SCENARIO_QUESTIONS[id as keyof typeof SCENARIO_QUESTIONS] || SCENARIO_QUESTIONS.phishing;
  
  // Get the EXACT question the user is on right now
  const currentQuestion = questions[currentStepIndex];

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Calculate Dashoffset for SVG ring (283 is total circumference)
  const dashOffset = 283 - (timeLeft / 30) * 283;

  const handleChoice = (choice: string) => {
    // When they click an answer, we pass the SAME step to the feedback page
    // so the feedback page knows which question we just answered!
    if (choice === 'yes') {
      navigate(`/CorrectFeedbackPage/${id}/${currentStepIndex}`);
    } else if (choice === 'no') {
      navigate(`/IncorrectFeedpage/${id}/${currentStepIndex}`);
    } else {
      navigate(`/MaybeFeedbackPage/${id}/${currentStepIndex}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] flex flex-col relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .choice-button { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2); }
        .choice-button:hover { transform: translateY(-2px); box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2); filter: brightness(1.1); }
        .choice-button:active { transform: translateY(2px); box-shadow: 0 0px 0 0 rgba(0, 0, 0, 0.2); }
        .timer-ring { transition: stroke-dashoffset 1s linear; transform: rotate(-90deg); transform-origin: 50% 50%; }
      `}} />

      {/* Nav */}
      <nav className="w-full border-b border-white/5 bg-[#0a0c16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white text-sm">security</span>
            </div>
            <span className="text-lg font-bold tracking-tight">CYBER<span className="text-[#1337ec]">QUEST</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
              Scenario: <span className="text-[#1337ec]">{id?.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">Score:</span>
              <span className="text-sm font-bold text-white">{score.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Question */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full py-8 z-10">
        <div className="w-full flex flex-col items-center mb-12">
          {/* Timer Ring */}
          <div className="relative w-24 h-24 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle 
                className="timer-ring" 
                cx="50" cy="50" r="45" 
                fill="transparent" 
                stroke="#1337ec" 
                strokeWidth="6" 
                strokeDasharray="283" 
                strokeDashoffset={dashOffset} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{timeLeft}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center leading-tight max-w-4xl tracking-tight uppercase">
          {currentQuestion.text}
          </h1>
        </div>

        {/* Choice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl h-full">
  
  {/* YES BUTTON */}
  <button 
    onClick={() => handleChoice('yes')} 
    className="choice-button bg-emerald-600 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 text-center group"
  >
    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
      <span className="material-icons text-5xl text-white">check_circle</span>
    </div>
    <span className="text-4xl font-black text-white uppercase italic tracking-widest">
      YES
    </span>
  </button>

  {/* NO BUTTON */}
  <button 
    onClick={() => handleChoice('no')} 
    className="choice-button bg-rose-600 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 text-center group"
  >
    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
      <span className="material-icons text-5xl text-white">cancel</span>
    </div>
    <span className="text-4xl font-black text-white uppercase italic tracking-widest">
      NO
    </span>
  </button>

  {/* MAYBE BUTTON */}
  <button 
    onClick={() => handleChoice('maybe')} 
    className="choice-button bg-amber-500 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 text-center group"
  >
    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
      <span className="material-icons text-5xl text-white">help_outline</span>
    </div>
    <span className="text-4xl font-black text-white uppercase italic tracking-widest">
      MAYBE
    </span>
  </button>
        </div>
      </main>

      

      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1337ec]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#1368ce]/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
};

export default IncidentChoicePage;