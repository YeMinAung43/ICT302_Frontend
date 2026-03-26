import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const IncidentChoicePage = () => {
  const navigate = useNavigate();
  
  // The ID is now the actual Session ID from Django (e.g., "14")
  const { id } = useParams();
  
  // --- BACKEND STATES ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- GAME STATES ---
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  // 1. Fetch AI Questions from Django when the page loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/generate/${id}/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          // Asking the AI to give us 3 questions for this stage
          body: JSON.stringify({ questions_per_stage: 3 })
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          // Set the timer to whatever time limit the AI decided for the first question!
          if (data.length > 0) setTimeLeft(data[0].time_limit || 30);
          setIsLoading(false);
        } else {
          console.error("Failed to generate questions");
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  const currentQuestion = questions[currentStepIndex];

  // Timer Logic
  useEffect(() => {
    if (isLoading || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);

  // Calculate Dashoffset for SVG ring (283 is total circumference)
  const maxTime = currentQuestion?.time_limit || 30;
  const dashOffset = 283 - (timeLeft / maxTime) * 283;

  // 2. Handle submitting the answer to Django
  const handleChoice = async (optionId: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/answer/${id}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_uid: currentQuestion.question_uid,
          selected_option_id: optionId
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // The backend has graded the answer! 
        // We navigate to a Feedback page and pass the backend's results via state
        navigate(`/FeedbackPage/${id}`, { 
          state: { 
            feedback: result, 
            nextStep: currentStepIndex + 1,
            isLastQuestion: currentStepIndex >= questions.length - 1
          } 
        });
      } else {
        console.error("Failed to submit answer");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Server error:", error);
      setIsSubmitting(false);
    }
  };

  // Pre-defined styles to make the AI's dynamic options look beautiful
  const BUTTON_STYLES = [
    { bg: 'bg-emerald-600', icon: 'check_circle' },
    { bg: 'bg-rose-600', icon: 'cancel' },
    { bg: 'bg-amber-500', icon: 'help_outline' },
    { bg: 'bg-purple-600', icon: 'policy' }
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
        .choice-button { transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.2); }
        .choice-button:hover { transform: translateY(-2px); box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.2); filter: brightness(1.1); }
        .choice-button:active { transform: translateY(2px); box-shadow: 0 0px 0 0 rgba(0, 0, 0, 0.2); }
        .timer-ring { transition: stroke-dashoffset 1s linear; transform: rotate(-90deg); transform-origin: 50% 50%; }
      `}} />

      {/* Nav */}
      <nav className="w-full border-b border-white/5 bg-[#0a0c16]/80 backdrop-blur-md z-20">
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
                stroke={timeLeft < 10 ? "#ef4444" : "#1337ec"} 
                strokeWidth="6" 
                strokeDasharray="283" 
                strokeDashoffset={dashOffset} 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
          
          {/* The actual AI Question Text */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center leading-tight max-w-5xl tracking-tight uppercase">
            {currentQuestion.question_text}
          </h1>
        </div>

        {/* Dynamic Choice Grid based on AI options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl h-full">
          {currentQuestion.options.map((option: any, index: number) => {
            const style = BUTTON_STYLES[index % BUTTON_STYLES.length];
            
            return (
              <button 
                key={option.id}
                onClick={() => handleChoice(option.id)} 
                disabled={isSubmitting}
                className={`choice-button ${style.bg} rounded-2xl p-8 flex flex-col items-center justify-center gap-6 text-center group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
                  <span className="material-icons text-4xl text-white">{style.icon}</span>
                </div>
                {/* The dynamic text from the AI option */}
                <span className="text-xl font-bold text-white uppercase tracking-wider">
                  {option.text}
                </span>
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