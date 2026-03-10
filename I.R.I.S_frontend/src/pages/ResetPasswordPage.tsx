import { useNavigate, Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would verify that both passwords match here.
    
    // After "updating", we send them to the success page you already made!
    navigate('/verify-success'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0c16]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { font-family: "Space Grotesk", sans-serif; }
            .form-input:focus { outline: none; border-color: #1337ec; ring: 0; }
          `
        }}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="size-8 text-[#1337ec]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">ShieldResponse</h2>
            </div>
            <div className="text-center">
              <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">Reset your password</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Enter a new password for your account below.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#151726] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={handleUpdatePassword}>
              
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                  <input 
                    className="form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0b14] h-12 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">refresh</span>
                  <input 
                    className="form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0b14] h-12 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                  />
                </div>
              </div>

              <button 
                className="w-full mt-2 cursor-pointer rounded-xl h-12 bg-[#1337ec] text-white text-sm font-bold tracking-wide hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20" 
                type="submit"
              >
                Update Password
              </button>

              <div className="text-center pt-2">
                <Link 
                  to="/" 
                  className="text-slate-500 dark:text-slate-400 text-sm hover:text-[#1337ec] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-base">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs">© 2024 ShieldResponse</p>
      </footer>
    </div>
  );
};

export default ResetPasswordPage;