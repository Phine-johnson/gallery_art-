import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery'; // Page 1: Landing Page
import CategoryPage from './pages/CategoryPage';
import Hire from './pages/Hire';        // Page 2: Freelancer Directory
import Auth from './pages/Auth';
import Messages from './pages/Messages';
import DesignerProfile from './pages/DesignerProfile';
import DesignerDashboard from './pages/DesignerDashboard';
import HireForm from './pages/HireForm';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="app-main-wrapper">
          <Routes>
            {/* ORDER 1: Landing Page (Dark Banner) */}
            <Route path="/" element={<Gallery />} /> 
            
            {/* ORDER 2: Freelancer Directory */}
            <Route path="/hire" element={<Hire />} /> 
            
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/designer/:id" element={<DesignerProfile />} />
            <Route path="/hire/:id" element={<HireForm />} />

            <Route path="/auth" element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } />

            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DesignerDashboard />
              </ProtectedRoute>
            } />

            {/* If path doesn't exist, go back to Gallery landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;