import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DemoBanner from './components/ui/DemoBanner';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import JournalPage from './pages/JournalPage';
import ExercisesPage from './pages/ExercisesPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Preloader from './components/preloader/Preloader';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  if (showPreloader) {
    return (
      <AnimatePresence>
        <Preloader onComplete={() => setShowPreloader(false)} />
      </AnimatePresence>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="chat/:conversationId" element={<ChatPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="exercises" element={<ExercisesPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
