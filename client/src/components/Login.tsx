import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

interface LoginProps {
  setAuth: (auth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/login', { username, password });
      setAuth(true);
      
      alert('Login Successful!');
      navigate('/profile'); 
    } catch (error) {
      console.error("Login failed", error);
      alert('Invalid credentials or server is down');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;