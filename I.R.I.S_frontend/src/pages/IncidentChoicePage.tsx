import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const IncidentChoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); 

  // --- BACKEND STATES ---
  const [questions, setQuestions] = useState<any[]>(location.state?.questions || []);
  const [currentStepIndex, setCurrentStepIndex] = useState(location.state?.nextStep || 0);
  const [isLoading, setIsLoading] = useState(location.state?.questions ? false : true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- GAME STATES ---
  const initialTime = location.state?.questions 
    ? (location.state.questions[location.state.nextStep || 0]?.time_limit || 30) 
    : 30;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [score, setScore] = useState<number>(location.state?.score || 0);

  // 🔒 THE LOCK
  const hasFetched = useRef(false);

  // 📊 PROGRESS CALCULATIONS
  const totalQuestions = questions.length;
  const currentQuestionNum = currentStepIndex + 1;
  const progressPercentage = totalQuestions > 0 ? (currentQuestionNum / totalQuestions) * 100 : 0;

  useEffect(() => {
    if (questions.length > 0 || hasFetched.current) {
      setIsLoading(false);
      return; 
    }

    hasFetched.current = true;

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('access') || localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/generate/${id}/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' 
          },
          body: JSON.stringify({ questions_per_stage: 3 })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Grab the difficulty from the backpack! (Default to 'expert' if missing)
          const currentDifficulty = location.state?.difficulty || 'expert';
          
          // 🔀 THE SMART SLICER
          const formattedData = data.map((q: any) => {
            // 1. Separate the correct answer from the wrong answers
            const correctOptions = q.options.filter((o: any) => o.outcome === 'good');
            const wrongOptions = q.options.filter((o: any) => o.outcome !== 'good');

            // 2. Shuffle the wrong answers so they are different every time
            wrongOptions.sort(() => Math.random() - 0.5);

            // 3. Pick how many wrong answers to show based on difficulty
            let selectedWrong: any[] = [];
            if (currentDifficulty === 'easy' || currentDifficulty === 'beginner') {
              selectedWrong = wrongOptions.slice(0, 1); // 1 Correct + 1 Wrong = 2 Buttons
            } else if (currentDifficulty === 'intermediate') {
              selectedWrong = wrongOptions.slice(0, 2); // 1 Correct + 2 Wrong = 3 Buttons
            } else {
              selectedWrong = wrongOptions; // Expert gets all buttons!
            }

            // 4. Combine them and do one final shuffle so the correct answer moves around!
            const finalOptions = [...correctOptions, ...selectedWrong].sort(() => Math.random() - 0.5);

            return { ...q, options: finalOptions };
          });

          setQuestions(formattedData); 
          if (formattedData.length > 0) setTimeLeft(formattedData[0].time_limit || 30);
          setIsLoading(false);
        } else {
          console.error("Failed to generate questions");
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };

    fetchQuestions();
  }, [id, questions.length]);

  const currentQuestion = questions[currentStepIndex];

  useEffect(() => {
    if (isLoading || timeLeft <= 0 || isSubmitting) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, isSubmitting]);

  const maxTime = currentQuestion?.time_limit || 30;
  const dashOffset = 283 - (timeLeft / maxTime) * 283;

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitting && currentQuestion) {
      handleChoice("TIMEOUT"); 
    }
  }, [timeLeft, isSubmitting, currentQuestion]);

// 🚪 EMERGENCY EXIT LOGIC
  const handleAbortMission = async () => {
    const confirmAbort = window.confirm("WARNING: Are you sure you want to abort the mission? You will lose all current progress.");
    if (!confirmAbort) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/abandon/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      // 🚨 Goes back to scenario selection!
      navigate('/ScenarioSelectionPage'); 
      
    } catch (error) {
      console.error("Failed to abort mission:", error);
      setIsSubmitting(false);
    }
  };

  const handleChoice = async (optionId: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/answer/${id}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          question_uid: currentQuestion.question_uid,
          selected_option_id: optionId
        })
      });

      let result: any = {};

      if (response.ok) {
        result = await response.json();
      } else if (optionId === "TIMEOUT") {
        result = { 
          answer_is_correct: false, 
          crisis_event: "Time ran out! In a real cyber incident, hesitating can cost you the network.",
          score_change: 0,
          health_change: -10
        };
      } else {
        console.error("Failed to submit answer");
        setIsSubmitting(false);
        return;
      }

      // 💎 STRICT 10/0 SCORING SYSTEM
      const isAnswerCorrect = result.answer_is_correct === true;
      
      // We ignore Django's 'score_change' and force our own math!
      const xpEarned = isAnswerCorrect ? 10 : 0; 
      const newScore = score + xpEarned;

      const finalFeedback = {
        ...result, 
        is_correct: isAnswerCorrect,
        xp_earned: xpEarned, // Pack our clean XP into the backpack
        is_timeout: optionId === "TIMEOUT"
      };

      navigate(`/FeedbackPage/${id}`, { 
        state: { 
          feedback: finalFeedback, 
          nextStep: currentStepIndex + 1,
          questions: questions,
          score: newScore
        } 
      });

    } catch (error) {
      console.error("Server error:", error);
      setIsSubmitting(false);
    }
  };

  const BUTTON_STYLES = [
    { border: 'border-[#1337ec]/30', glow: 'group-hover:shadow-[0_0_30px_rgba(19,55,236,0.15)]', iconColor: 'text-[#1337ec]', icon: 'terminal', bg: 'bg-[#1337ec]/5' },
    { border: 'border-emerald-500/30', glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]', iconColor: 'text-emerald-500', icon: 'dns', bg: 'bg-emerald-500/5' },
    { border: 'border-purple-500/30', glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]', iconColor: 'text-purple-500', icon: 'memory', bg: 'bg-purple-500/5' },
    { border: 'border-amber-500/30', glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]', iconColor: 'text-amber-500', icon: 'api', bg: 'bg-amber-500/5' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c16] text-white flex flex-col items-center justify-center font-['Space_Grotesk']">
        <span className="material-icons text-6xl text-[#1337ec] animate-spin mb-4">autorenew</span>
        <h2 className="text-2xl font-bold tracking-widest uppercase">AI is generating scenario...</h2>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] flex flex-col relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .timer-ring { transition: stroke-dashoffset 1s linear; transform: rotate(-90deg); transform-origin: 50% 50%; }
      `}} />

      {/* Nav */}
      <nav className="w-full bg-[#0a0c16]/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white text-sm">security</span>
            </div>
            <span className="text-lg font-bold tracking-tight">SHIELD<span className="text-[#1337ec]">RESPONSE</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
              Session ID: <span className="text-[#1337ec]">#{id}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <span className="text-sm font-bold text-slate-400">Score:</span>
              <span className="text-sm font-bold text-white">{score.toLocaleString()} XP</span>
            </div>
            {/* ABORT MISSION BUTTON */}
            <button 
              onClick={handleAbortMission}
              disabled={isSubmitting}
              className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-[16px]">power_settings_new</span>
              Abort
            </button>
          </div>
        </div>
      </nav>

      {/* 📊 PROGRESS BAR */}
      <div className="w-full bg-white/5 h-1.5 relative z-20 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1337ec] to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Question */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full py-8 z-10">
        <div className="w-full flex flex-col items-center mb-12">
          
          {/* STEP COUNTER PILL */}
          <div className="mb-6 px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-slate-400 uppercase shadow-sm">
            Threat Encounter <span className="text-white text-sm">{currentQuestionNum}</span> of <span className="text-white text-sm">{totalQuestions}</span>
          </div>

          {/* Timer Ring */}
          <div className="relative w-24 h-24 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle 
                className="timer-ring" 
                cx="50" cy="50" r="45" 
                fill="transparent" 
                stroke={timeLeft <= 5 ? "#ef4444" : "#1337ec"} 
                strokeWidth="6" 
                strokeDasharray="283" 
                strokeDashoffset={dashOffset} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center leading-tight max-w-5xl tracking-tight uppercase">
            {currentQuestion.question_text}
          </h1>
        </div>

        {/* Dynamic Choice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl h-full mt-4 justify-center">
          {currentQuestion.options.map((option: any, index: number) => {
            const style = BUTTON_STYLES[index % BUTTON_STYLES.length];
            
            return (
              <button 
                key={option.option_uid || index}
                onClick={() => handleChoice(option.option_uid)} 
                disabled={isSubmitting}
                className={`relative overflow-hidden ${style.bg} backdrop-blur-sm border ${style.border} rounded-xl p-8 flex flex-col items-center justify-center gap-6 text-center group transition-all duration-300 hover:-translate-y-1 hover:border-white/20 ${style.glow} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/40 transition-all duration-500" />

                <div className="w-16 h-16 bg-[#0a0c16]/80 border border-white/5 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                  <span className={`material-icons text-3xl ${style.iconColor}`}>{style.icon}</span>
                </div>
                
                <span className="text-sm md:text-base font-bold text-slate-300 group-hover:text-white uppercase tracking-widest leading-relaxed z-10 transition-colors">
                  {option.option_text || option.text || "Unknown Option"}
                </span>

                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1337ec]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#1368ce]/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
};

export default IncidentChoicePage;