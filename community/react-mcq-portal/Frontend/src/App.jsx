import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Component Imports
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Page Imports
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import InstructionsPage from './pages/InstructionsPage';
import TestPage from './pages/TestPage';
import PastAttemptsPage from './pages/PastAttemptsPage';
import ResultsPage from './pages/ResultsPage';
import AccountPage from './pages/AccountPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import TeacherDashboardPage from './pages/teacher/ManageTestsPage';
import CreateTestPage from './pages/teacher/CreateTestPage';
import EditTestPage from './pages/teacher/EditTestPage';
import TestResultsPage from './pages/teacher/TestResultsPage';
import CreateUserPage from './pages/teacher/CreateUserPage';

function App() {
  const { logoutBeacon, token } = useAuth();

  useEffect(() => {
    // use 'unload' (fires on tab close / navigate away). sendBeacon is fire-and-forget.
    if (!token) return;
    const handleUnload = () => {
      try {
        logoutBeacon();
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('unload', handleUnload);
    return () => window.removeEventListener('unload', handleUnload);
  }, [logoutBeacon, token ]);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* --- Public Routes --- */}
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        {/* --- A SINGLE PROTECTED SECTION FOR ALL LOGGED-IN USERS --- */}
        <Route element={<ProtectedRoute />}>
          {/* Routes accessible to ALL logged-in users */}
          <Route path="account" element={<AccountPage />} />
          <Route path="update-password" element={<UpdatePasswordPage />} />
          
          {/* Student Specific Routes */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="instructions/:testId" element={<InstructionsPage />} />
          <Route path="test/:testId" element={<TestPage />} />
          <Route path="attempts/past" element={<PastAttemptsPage />} />
          <Route path="results" element={<ResultsPage />} />

          {/* Teacher/Admin Specific Routes NESTED INSIDE */}
          <Route element={<RoleBasedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route path="teacher/manage-tests" element={<TeacherDashboardPage />} />
            <Route path="teacher/create-test" element={<CreateTestPage />} />
            <Route path="teacher/test/:testId/edit" element={<EditTestPage />} />
            <Route path="teacher/test/:testId/results" element={<TestResultsPage />} />
            <Route path="teacher/create-user" element={<CreateUserPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;