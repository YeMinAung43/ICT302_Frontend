import { useNavigate } from 'react-router-dom';

const EmailSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0b14]">
      {/* Font Styling */}
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
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="size-10 text-[#1337ec]">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                ShieldResponse
              </h2>
            </div>
          </div>

          {/* Success Content Section */}
          <div className="flex flex-col items-center gap-6">
            {/* Success Icon Badge */}
            <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined notranslate text-green-500 text-5xl font-bold">
                check_circle
              </span>
            </div>

            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-3">
                Email verified successfully!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                Your account is now active and ready for your first challenge.
              </p>
            </div>

            {/* Navigation Button */}
            <div className="w-full mt-4">
              <button
                onClick={() => navigate('/dashboard')} // Directs to your main app
                className="inline-flex w-full items-center justify-center px-6 py-3.5 bg-[#1337ec] hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs">
          © 2024 ShieldResponse
        </p>
      </footer>
    </div>
  );
};

export default EmailSuccessPage;