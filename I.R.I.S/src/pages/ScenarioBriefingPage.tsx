import React from 'react'; // Re-enabled
import { useNavigate, useParams } from 'react-router-dom';

const BRIEFING_DATABASE = {
  phishing: {
    title: "The Suspicious Email",
    priority: "Priority Case #4402",
    from: "Finance Dept <finance-internal@corp-services.net>",
    subject: "URGENT: Outstanding Invoice #INV-9928",
    body: "Our records indicate that the attached invoice for last month's infrastructure maintenance is now 14 days overdue. Failure to settle this balance immediately may result in temporary service interruption.",
    attachment: "invoice_details_final.pdf.exe",
    hint: "Pay close attention to the sender's domain and the attachment's file extension.",
    difficulty: "NOVICE",
    xp: "500 XP",
    time: "15 MINS"
  },
  usb: {
    title: "The Mystery Drive",
    priority: "Physical Breach #8812",
    from: "Security Guard <patrol-04@building-ops.com>",
    subject: "Found Item: Blue USB Drive",
    body: "I found this drive near the executive entrance this morning. The label says 'Salary Projections Q4'. Someone should check whose it is.",
    attachment: "salary_projections.xlsx.lnk",
    hint: "Shortcut files (.lnk) on a USB drive are a common way to execute malicious scripts.",
    difficulty: "NOVICE",
    xp: "400 XP",
    time: "10 MINS"
  },
  ransomware: {
    title: "Locked Computer",
    priority: "CRITICAL ALERT #9901",
    from: "System Sentinel <alerts@internal-monitor.local>",
    subject: "DETECTION: Unauthorized Encryption Activity",
    body: "A workstation in the Marketing department is reporting massive file modifications. A 'README' file has appeared on the desktop demanding Bitcoin.",
    attachment: "DECRYPT_FILES.txt.vbs",
    hint: "Ransomware often moves laterally. Isolating the infected machine is your top priority.",
    difficulty: "INTERMEDIATE",
    xp: "1200 XP",
    time: "25 MINS"
  }
};

const ScenarioBriefingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  // Safe lookup: default to 'phishing' if ID is invalid
  const data = BRIEFING_DATABASE[id as keyof typeof BRIEFING_DATABASE] || BRIEFING_DATABASE.phishing;

  return (
    <div className="min-h-screen bg-[#0a0c16] text-white font-['Space_Grotesk'] relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1337ec]/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#1337ec 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#1337ec]/10 bg-[#0a0c16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1337ec] rounded-lg flex items-center justify-center shadow-lg shadow-[#1337ec]/20">
              <span className="material-icons text-white">security</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">
              Cyber<span className="text-[#1337ec]">Quest</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-[#1337ec]/10 px-4 py-2 rounded-full border border-[#1337ec]/20">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-slate-300">
                Investigator: <span className="text-[#1337ec]">Alex Chen</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 relative z-10">
        <div className="max-w-4xl w-full">
          

          <div 
            onClick={() => navigate('/ScenarioSelectionPage')} 
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-[#1337ec] transition-colors cursor-pointer group w-fit"
          >
            <span className="material-icons text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-medium uppercase tracking-wider">Back to Scenarios</span>
          </div>

          <div className="bg-slate-900/40 border border-[#1337ec]/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="bg-[#1337ec]/10 border-b border-white/10 p-6">
              <span className="text-[#1337ec] font-bold text-xs uppercase tracking-widest">{data.priority}</span>
              <h1 className="text-3xl font-bold">{data.title}</h1>
            </div>

            <div className="p-8 md:p-12">
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-8 mb-12">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-4 mb-4 text-sm">
                  <p><span className="text-slate-500">From:</span> {data.from}</p>
                  <p><span className="text-slate-500">Subject:</span> <span className="text-rose-400 font-bold">{data.subject}</span></p>
                </div>
                <p className="text-slate-300 leading-relaxed">{data.body}</p>
                <div className="mt-6 flex items-center gap-2 text-[#1337ec]">
                  <span className="material-icons text-sm">attach_file</span>
                  <span className="text-sm font-mono">{data.attachment}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={() => navigate(`/IncidentChoicePage/${id}/0`)}
                  className="w-full md:w-auto px-12 py-5 bg-[#1337ec] hover:bg-blue-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(19,55,236,0.4)]"
                >
                  <span>BEGIN INVESTIGATION</span>
                  <span className="material-icons">play_arrow</span>
                </button>

                {/* Updated to use dynamic data */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">schedule</span>
                    <span>{data.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">trending_up</span>
                    <span>DIFFICULTY: {data.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">military_tech</span>
                    <span>{data.xp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-500 text-sm italic">
            "{data.hint}"
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t border-[#1337ec]/10 py-4 bg-[#0a0c16]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span>Server: <span className="text-green-500">Online</span></span>
            <span>Encryption: <span className="text-green-500">AES-256</span></span>
          </div>
          <p>© 2026 CyberQuest Simulation Labs</p>
        </div>
      </footer>
    </div>
  );
};

export default ScenarioBriefingPage;