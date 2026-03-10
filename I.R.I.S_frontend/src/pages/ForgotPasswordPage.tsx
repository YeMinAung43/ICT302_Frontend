import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // NOTE: Make sure this URL matches the path in your Django urls.py for 'password_reset_request'
      const response = await fetch('http://localhost:8000/api/password-reset-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Python sent the email. Let's send the user to the confirmation page
        // We pass the email in the state so the next page can display it
        navigate('/recovery-sent', { state: { email: email } });
      } else {
        // Handle errors like "There is no existing user with the email provided"
        setError(data.error || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the Python backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0a0c16]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .form-input-container:focus-within .input-icon {
                color: #3b82f6; 
            }
          `
        }}
      />

      <div className="w-full max-w-[420px] px-2 flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="size-14 text-blue-600 bg-blue-600/10 rounded-full flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Reset Password
          </h1>
          <p className="text-[#9da1b9] text-base px-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="w-full bg-white dark:bg-[#1c1d27] rounded-2xl shadow-xl border border-slate-100 dark:border-[#282b39] p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleResetRequest}>
            
            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-300 text-sm font-medium ml-1">
                Email Address
              </label>
              <div className="form-input-container relative flex items-center group">
                <span className="input-icon material-symbols-outlined absolute left-4 text-slate-400 dark:text-[#9da1b9] transition-colors">
                  alternate_email
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-[#3b3f54] bg-slate-50 dark:bg-[#101322] text-slate-900 dark:text-white h-14 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors"
                  placeholder="name@company.com"
                  type="email" 
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className={`w-full rounded-xl h-14 text-white text-base font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2
                ${isLoading ? 'bg-blue-600/70 cursor-not-allowed' : 'bg-[#1337ec] hover:bg-blue-700 active:scale-[0.98]'}`}
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-[#1337ec] font-medium transition-colors flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;