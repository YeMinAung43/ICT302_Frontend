import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  // This function handles what happens when the user clicks "Create Account"
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing
    // Logic: In a real app, you'd save the user data here.
    // For your prototype, we jump straight to the verification screen.
    navigate('/verify-email');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0c16]">
      {/* 1. Global Styles for the Page */}
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
          
          {/* 2. Logo & Header Section */}
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
              <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Join our community and start your journey today.</p>
            </div>
          </div>

          {/* 3. The Signup Form Card */}
          <div className="bg-white dark:bg-[#151726] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={handleSignup}>
              
              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Username</label>
                <div className="relative">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                  <input 
                    className="form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0b14] h-12 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all" 
                    placeholder="Enter username" 
                    type="text" 
                    required 
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                  <input 
                    className="form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0b14] h-12 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all" 
                    placeholder="name@company.com" 
                    type="email" 
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Password</label>
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

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined notranslate absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                  <input 
                    className="form-input w-full rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0b14] h-12 pl-11 pr-4 text-sm placeholder:text-slate-400 transition-all" 
                    placeholder="••••••••" 
                    type="password" 
                    required 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full mt-2 cursor-pointer rounded-xl h-12 bg-[#1337ec] text-white text-sm font-bold tracking-wide hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20" 
                type="submit"
              >
                Create Account
              </button>

              {/* Footer Link */}
              <div className="text-center pt-2">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Already have an account?
                  <Link 
                    to="/" 
                    className="text-[#1337ec] font-bold hover:underline underline-offset-4 ml-1"
                  >
                    Sign In
                  </Link>
                </p>
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

export default SignupPage;