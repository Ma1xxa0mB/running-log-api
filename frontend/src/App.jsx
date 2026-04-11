import { Navigate, Route, Routes } from 'react-router-dom';
import PageLayout from './components/PageLayout.jsx';
import CreateRunPage from './pages/CreateRunPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import RunDetailPage from './pages/RunDetailPage.jsx';
import RunsPage from './pages/RunsPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/runs" element={<RunsPage />} />
        <Route path="/runs/new" element={<CreateRunPage />} />
        <Route path="/runs/:id" element={<RunDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
