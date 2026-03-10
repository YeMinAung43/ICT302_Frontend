import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // 1. Setup state to hold the input values and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. The new async login function to talk to Django
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // NOTE: Make sure this URL matches exactly what is in your Django urls.py
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Crucial for receiving the JWT HttpOnly cookies!
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      if (response.ok) {
        // Success! Cookies are set, navigate to the game
        navigate('/DifficultySelectionPage'); 
      } else {
        // Handle incorrect passwords or missing users
        const data = await response.json();
        setError(data.detail || data.error || 'Invalid username or password.');
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
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="size-14 text-blue-600">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor" />
              <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">Welcome Back</h1>
            <p className="text-[#9da1b9] text-base">Sign in to your ShieldResponse account</p>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-[#1c1d27] rounded-2xl shadow-xl border border-slate-100 dark:border-[#282b39] p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* 3. Error Message Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-300 text-sm font-medium ml-1">Username</label>
              <div className="form-input-container relative flex items-center group">
                <span className="input-icon material-symbols-outlined absolute left-4 text-slate-400 dark:text-[#9da1b9] transition-colors">person</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-[#3b3f54] bg-slate-50 dark:bg-[#101322] text-slate-900 dark:text-white h-14 pl-12 pr-4 outline-none focus:border-blue-500 transition-colors"
                  placeholder="username" 
                  required

                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-slate-600 dark:text-slate-300 text-sm font-medium">Password</label>
                <Link to="/ForgotPasswordPage-username" className="text-sm text-[#1337ec] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="form-input-container relative flex items-center group">
                <span className="input-icon material-symbols-outlined absolute left-4 text-slate-400 dark:text-[#9da1b9] transition-colors">lock</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-[#3b3f54] bg-slate-50 dark:bg-[#101322] text-slate-900 dark:text-white h-14 pl-12 pr-12 outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  type="password" 
                  required
                />
              </div>
            </div>

            {/* 4. Dynamic Submit Button */}
            <button
              disabled={isLoading}
              className={`w-full rounded-xl bg-blue-600 h-14 text-white text-base font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-[0.98]'}`}
              type="submit"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#9da1b9]">
              New to the platform?
              <Link to="/signup" className="text-blue-600 font-bold hover:underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;