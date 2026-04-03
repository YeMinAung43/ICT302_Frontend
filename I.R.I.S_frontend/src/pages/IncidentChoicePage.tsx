import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';

const IncidentChoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); 
  
  const [missionTitle, setMissionTitle] = useState("Active Cyber Incident");

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
        const isResuming = location.state?.isResuming || false;
        
        const endpoint = isResuming 
          ? `http://localhost:8000/api/resume/${id}/` 
          : `http://localhost:8000/api/generate/${id}/`;

        const fetchOptions: any = { method: 'POST' };

        if (!isResuming) {
          fetchOptions.body = JSON.stringify({ questions_per_stage: 3 });
        }

        const response = await fetchWithAuth(endpoint, fetchOptions);

        if (response.ok) {
          const data = await response.json();
          
          let questionsArray = [];
          
          if (isResuming) {
            questionsArray = data.questions || [];
            
            if (data.score !== undefined) setScore(data.score);
            
            if (data.current_index !== undefined) {
              setCurrentStepIndex(data.current_index);
            }
          } else {
            questionsArray = Array.isArray(data) ? data : (data.questions || []);
          }

          const currentDifficulty = location.state?.difficulty || 'expert';
          
          const formattedData = questionsArray.map((q: any) => {
            const correctOptions = q.options.filter((o: any) => o.outcome === 'good');
            const wrongOptions = q.options.filter((o: any) => o.outcome !== 'good');

            wrongOptions.sort(() => Math.random() - 0.5);

            let selectedWrong: any[] = [];
            if (currentDifficulty === 'easy' || currentDifficulty === 'beginner') {
              selectedWrong = wrongOptions.slice(0, 1);
            } else if (currentDifficulty === 'intermediate') {
              selectedWrong = wrongOptions.slice(0, 2);
            } else {
              selectedWrong = wrongOptions; 
            }

            const finalOptions = [...correctOptions, ...selectedWrong].sort(() => Math.random() - 0.5);
            return { ...q, options: finalOptions };
          });

          setQuestions(formattedData); 
          if (formattedData.length > 0) setTimeLeft(formattedData[0].time_limit || 30);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch questions from server.");
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };

    fetchQuestions();
  }, [id, questions.length]);

  const currentQuestion = questions[currentStepIndex];

  useEffect(() => {
    if (location.state?.customTitle) {
      setMissionTitle(location.state.customTitle);
      sessionStorage.setItem(`missionTitle_${id}`, location.state.customTitle);
    } else {
      const savedTitle = sessionStorage.getItem(`missionTitle_${id}`);
      if (savedTitle) {
        setMissionTitle(savedTitle);
      }
    }
  }, [location.state, id]);

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

  const handleAbortMission = async () => {
    if (!window.confirm("Are you sure you want to abort this mission? The threat will remain active on the network.")) return;

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('token');

      const response = await fetch(`http://localhost:8000/api/abandon/${id}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        navigate(`/debrief/${id}`, {
          state: {
            score: score || 0,
            totalQuestions: questions.length,
            answeredQuestions: currentStepIndex,
            isAbandoned: true 
          }
        });
      } else {
        console.error("Failed to abort mission on the server.");
      }
    } catch (error) {
      console.error("Error connecting to server to abort:", error);
    }
  };

  const handlePauseMission = async () => {
    try {
      const token = localStorage.getItem('access') || localStorage.getItem('token');

      const response = await fetch(`http://localhost:8000/api/pause/${id}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        navigate('/ScenarioSelectionPage'); 
      } else {
        console.error("Failed to pause mission on the server.");
      }
    } catch (error) {
      console.error("Error connecting to server to pause:", error);
    }
  };

  const handleChoice = async (optionId: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('access') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/answer/${id}/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        credentials: 'include', 
        
        body: JSON.stringify({
          question_uid: currentQuestion.question_uid,
          selected_option_id: optionId
        })
      });

      let result: any = {};

      if (response.ok) {
        result = await response.json();
      } else if (optionId === "TIMEOUT") {
        // 🚨 ADDED: Pass the current score through so Django doesn't override it on timeout
        result = { 
          answer_is_correct: false, 
          crisis_event: "Time ran out! In a real cyber incident, hesitating can cost you the network.",
          score_change: 0,
          score: score, 
          health_change: -10
        };
      } else {
        console.error("Failed to submit answer");
        setIsSubmitting(false);
        return;
      }

      // 🚨 UPDATED: STRICT DJANGO SCORE SYNC
      const isAnswerCorrect = result.answer_is_correct === true;
      const pointsEarned = result.score_change || 0; 
      
      // If Django gives us the exact new score, use it. Otherwise do the math.
      const newScore = result.score !== undefined ? result.score : score + pointsEarned;

      const finalFeedback = {
        ...result, 
        is_correct: isAnswerCorrect,
        points_earned: pointsEarned, // Send real points instead of strict 10 XP
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
            <span className="text-lg font-bold tracking-tight">CYBER<span className="text-[#1337ec]">FANHOUSE</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-r border-white/10 pr-4">
              <span className="text-sm font-bold text-slate-400">Score:</span>
              {/* 🚨 REMOVED 'XP' FROM HERE */}
              <span className="text-sm font-bold text-white">{Number(score).toFixed(2)}</span>
            </div>
            {/* ABORT MISSION BUTTON */}
            <button 
        onClick={handlePauseMission}
        className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/50 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2"
      >
        <span className="material-icons text-sm">pause</span>
        PAUSE MISSION
      </button>
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

      {/* PROGRESS BAR */}
      <div className="w-full bg-white/5 h-1.5 relative z-20 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1337ec] to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Question */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full py-8 z-10">
        <div className="w-full flex flex-col items-center mb-12">

          {/*Title*/} 
          <div className="mb-6 text-center">
          <h2 className="text-lg md:text-3xl font-black text-[#1337ec] tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(19,55,236,0.5)]">
          {missionTitle}
          </h2>
          </div>
          
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
          
          <h1 className="text-xl md:text-3xl font-extrabold text-white text-center uppercase tracking-wide leading-tight max-w-5xl mb-10">
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
                
                <span className="text-base md:text-lg font-bold text-slate-300 group-hover:text-white uppercase tracking-widest leading-relaxed z-10 transition-colors">
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