import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import EmailSuccessPage from './pages/EmailSuccessPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RecoveryLinkSentPage from './pages/RecoveryLinkSentPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ScenarioSelectionPage from './pages/ScenarioSelectionPage';
import DifficultySelectionPage from './pages/DifficultySelectionPage';
import ScenarioBriefingPage from './pages/ScenarioBriefingPage';
import IncidentChoicePage from './pages/IncidentChoicePage';
import MissionCompletePage from './pages/MissionCompletePage';

// We import the new unified Feedback Page!
import FeedbackPage from './pages/FeedbackPage';

function App() {
  return (
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-email/:uidb64/:token" element={<VerifyEmailPage />} />
          <Route path="/EmailSuccessPage-email" element={<EmailSuccessPage />} />
          <Route path="/ForgotPasswordPage-username" element={<ForgotPasswordPage />} />
          <Route path="/recovery-sent" element={<RecoveryLinkSentPage />} />
          <Route path="/ResetPasswordPage-sent" element={<ResetPasswordPage />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />
          
          <Route path="/ScenarioSelectionPage" element={<ScenarioSelectionPage />} />
          <Route path="/DifficultySelectionPage" element={<DifficultySelectionPage />} />
          
          {/* --- THE 3 NEW AI GAMEPLAY ROUTES --- */}
          <Route path="/ScenarioBriefingPage/:id" element={<ScenarioBriefingPage />} />
          <Route path="/play/:id" element={<IncidentChoicePage />} />
          <Route path="/FeedbackPage/:id" element={<FeedbackPage />} />
          {/* -------------------------------------- */}

          <Route path="/MissionCompletePage/:id" element={<MissionCompletePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;