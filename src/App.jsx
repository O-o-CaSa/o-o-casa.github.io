
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import { useAuth } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <TooltipProvider delayDuration={100}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />}>
              <Route index element={
                <motion.div className="p-6 text-center" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
                  <h1 className="text-2xl font-bold text-white">Welcome to the Clan Dashboard!</h1>
                  <p className="text-discord-textMuted mt-2">Select a channel from the sidebar to get started.</p>
                </motion.div>
              } />
            </Route>
            <Route path="/channel/:channelType/:channelId" element={<DashboardPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </AnimatePresence>
    </TooltipProvider>
  );
}

export default App;
