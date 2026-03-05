// import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmailPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0a0b14] min-h-screen flex flex-col">
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
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="size-10 text-blue-600">
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

            {/* Email Badge */}
            <div className="py-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined notranslate text-blue-600 text-xl mr-2">alternate_email</span>
                <span className="text-slate-900 dark:text-white font-medium">user@example.com</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Didn't receive the email? 
                <button className="text-blue-600 font-bold hover:underline underline-offset-4 ml-1">
                  Resend verification link
                </button>
              </p>
              {/* Added a back to login link for safety */}
              <div className="mt-6">
                 <Link to="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
                   Back to Sign In
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-xs">© 2024 ShieldResponse</p>
      </footer>
    </div>
  );
};

export default VerifyEmailPage;