import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery'; 
import CategoryPage from './pages/CategoryPage';
import Hire from './pages/HirePage'; 
import Auth from './pages/Auth';
import Messages from './pages/Messages';
import DesignerProfile from './pages/DesignerProfile';
import DesignerDashboard from './pages/DesignerDashboard';
import HireForm from './pages/HireForm';
import './App.css';

// Fixed: Matches the 'token' key used in Login and Dashboard
const ProtectedRoute = ({ children }) => {
  const hasToken = localStorage.getItem('token');
  if (!hasToken) return <Navigate to="/auth" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const hasToken = localStorage.getItem('token');
  if (hasToken) return <Navigate to="/dashboard" replace />;
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
            <Route path="/" element={<Gallery />} /> 
            <Route path="/hire" element={<Hire />} /> 
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/designer/:id" element={<DesignerProfile />} />
            <Route path="/hire/:id" element={<HireForm />} />

            {/* Auth Route: Using PublicRoute to prevent logged-in users from seeing login again */}
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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;