import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateSessionPage } from './pages/CreateSessionPage';
import { PracticeSessionPage } from './pages/PracticeSessionPage';
import { InterviewCompletedPage } from './pages/InterviewCompletedPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { InterviewHistoryPage } from './pages/InterviewHistoryPage';
import { PinnedQuestionsPage } from './pages/PinnedQuestionsPage';
import { NotesPage } from './pages/NotesPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Routes wrapped in AppLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews/create"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateSessionPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PracticeSessionPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews/:id/practice"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PracticeSessionPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews/:id/completed"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewCompletedPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <QuestionBankPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewHistoryPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pinned"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PinnedQuestionsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NotesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ResumeAnalyzerPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EditProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
