import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import api from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if the user is already logged in via token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      // If no token, user is not authenticated
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with backend
        await api.get('/api/user/profile');
        setIsAuthenticated(true);
      } catch {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading while checking authentication status
  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Router>
      <div className="app-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>JWT Auth Practice</h1>
        
        <Routes>
          {/* Pass setIsAuthenticated so Login can update the global state */}
          <Route path="/" element={
            !isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/profile" />
          } />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Group */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/profile" element={<Profile setAuth={setIsAuthenticated} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;