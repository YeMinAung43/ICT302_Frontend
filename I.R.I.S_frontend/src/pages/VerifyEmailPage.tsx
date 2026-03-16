import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const VerifyEmailPage = () => {
  const location = useLocation();
  // 1. Grab the secret codes from the URL (if the user clicked the email link)
  const { uidb64, token } = useParams(); 
  
  const userEmail = location.state?.email || "your email address";

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  // 2. SMART STATE: If the URL has codes, start verifying. Otherwise, stay 'idle' (pending).
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>(
    uidb64 && token ? 'verifying' : 'idle'
  );

  // 3. The Auto-Verification Logic
  useEffect(() => {
    if (uidb64 && token) {
      const verifyAccount = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/verify-email/${uidb64}/${token}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            setVerifyStatus('success');
          } else {
            setVerifyStatus('error');
          }
        } catch (error) {
          setVerifyStatus('error');
        }
      };
      verifyAccount();
    }
  }, [uidb64, token]);

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
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
          __html: `body { font-family: "Space Grotesk", sans-serif; }`
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
            
            {/* STATE 1: IDLE (User just signed up, checking inbox) */}
            {verifyStatus === 'idle' && (
              <>
                <div>
                  <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">Verify your email to continue</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                    We've sent a verification link to your inbox. Please click the link to activate your account.
                  </p>
                </div>
                <div className="py-4">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined notranslate text-[#1337ec] text-xl mr-2">alternate_email</span>
                    <span className="text-slate-900 dark:text-white font-medium">{userEmail}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center">
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
                        <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Sending...</>
                      ) : ('Resend verification link')}
                    </button>
                  </p>
                  <div className="mt-6">
                     <Link to="/" className="text-sm text-slate-400 hover:text-[#1337ec] transition-colors font-medium">Back to Sign In</Link>
                  </div>
                </div>
              </>
            )}

            {/* STATE 2: VERIFYING (User clicked the link) */}
            {verifyStatus === 'verifying' && (
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-[#1337ec] mb-4">progress_activity</span>
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">Verifying Identity...</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">Securely checking your credentials with ShieldResponse servers.</p>
              </div>
            )}

            {/* STATE 3: SUCCESS */}
            {verifyStatus === 'success' && (
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-green-500 mb-4">check_circle</span>
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">Email Verified!</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">Your account is fully activated and ready to go.</p>
                <Link to="/" className="w-full rounded-xl bg-[#1337ec] h-14 text-white text-base font-bold tracking-wide flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg">
                  Proceed to Login
                </Link>
              </div>
            )}

            {/* STATE 4: ERROR */}
            {verifyStatus === 'error' && (
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">Verification Failed</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">This link may be expired or invalid. Please try registering again.</p>
                <Link to="/signup" className="text-[#1337ec] font-bold hover:underline">
                  Return to Sign Up
                </Link>
              </div>
            )}

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