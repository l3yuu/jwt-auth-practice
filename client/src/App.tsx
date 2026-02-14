import React, { useState } from 'react';
import api from './services/api'; 
import type { AuthResponse } from './types';
import Profile from './components/Profile'; 

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    return !!token; 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use 'api' service here
      const { data } = await api.post<AuthResponse>('/login', {
        username,
        password,
      });

      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      alert('Login Successful!');
    } catch (error) {
      console.error("Login failed", error);
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="app-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>JWT Auth Practice</h1>

      {!isLoggedIn ? (
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username" 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
            />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div className="dashboard">
          <Profile />
          <button 
            onClick={handleLogout} 
            style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;