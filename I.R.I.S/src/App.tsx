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
import CorrectFeedbackPage from './pages/CorrectFeedbackPage';
import IncorrectFeedpage from './pages/IncorrectFeedpage';
import MaybeFeedbackPage from './pages/MaybeFeedbackPage';
import MissionCompletePage from './pages/MissionCompletePage';


function App() {
  return (
    // This is the Fragment that wraps everything
    <> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/EmailSuccessPage-email" element={<EmailSuccessPage />} />
          <Route path="/ForgotPasswordPage-email" element={<ForgotPasswordPage />} />
          <Route path="/recovery-sent" element={<RecoveryLinkSentPage />} />
          <Route path="/ResetPasswordPage-sent" element={<ResetPasswordPage />} />
          <Route path="/ScenarioSelectionPage" element={<ScenarioSelectionPage />} />
          <Route path="/DifficultySelectionPage" element={<DifficultySelectionPage />} />
          <Route path="/ScenarioBriefingPage/:id" element={<ScenarioBriefingPage />} />
          <Route path="/IncidentChoicePage/:id/:step" element={<IncidentChoicePage />} />
          <Route path="/CorrectFeedbackPage/:id/:step" element={<CorrectFeedbackPage />} />
          <Route path="/IncorrectFeedpage/:id/:step" element={<IncorrectFeedpage />} />
          <Route path="/MaybeFeedbackPage/:id/:step" element={<MaybeFeedbackPage />} />
          <Route path="/MissionCompletePage/:id" element={<MissionCompletePage />} />
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;