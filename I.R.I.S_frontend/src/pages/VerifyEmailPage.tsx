import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VerifyEmailPage = () => {
  // useLocation allows us to grab data passed from the previous page
  const location = useLocation();
  
  // Try to get the email passed from the SignupPage, fallback to a generic message if not found
  const userEmail = location.state?.email || "your email address";

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // In the future, you can point this to a Django view that resends the email
      // const response = await fetch('http://localhost:8000/api/resend-verification/', { ... });
      
      // Simulating a network delay for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendMessage('Verification link resent! Please check your inbox.');
    } catch (error) {
      setResendMessage('Failed to resend. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0a0b14] min-h-screen flex flex-col">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { font-family: "Space Grotesk", sans-serif; }
          `
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[440px] text-center">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="size-10 text-[#1337ec]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">ShieldResponse</h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">Verify your email to continue</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                We've sent a verification link to your inbox. Please click the link to activate your account.
              </p>
            </div>

            {/* Dynamic Email Badge */}
            <div className="py-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined notranslate text-[#1337ec] text-xl mr-2">alternate_email</span>
                <span className="text-slate-900 dark:text-white font-medium">{userEmail}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center">
              {/* Status Message */}
              {resendMessage && (
                <p className={`text-sm font-medium mb-4 ${resendMessage.includes('resent') ? 'text-green-500' : 'text-red-500'}`}>
                  {resendMessage}
                </p>
              )}

              <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
                Didn't receive the email? 
                <button 
                  onClick={handleResend}
                  disabled={isResending}
                  className={`font-bold ml-1 flex items-center gap-1 transition-all ${isResending ? 'text-slate-400 cursor-not-allowed' : 'text-[#1337ec] hover:underline underline-offset-4'}`}
                >
                  {isResending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      Sending...
                    </>
                  ) : (
                    'Resend verification link'
                  )}
                </button>
              </p>
              
              <div className="mt-6">
                 <Link to="/" className="text-sm text-slate-400 hover:text-[#1337ec] transition-colors font-medium">
                   Back to Sign In
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs">© 2026 ShieldResponse</p>
      </footer>
    </div>
  );
};

export default VerifyEmailPage;