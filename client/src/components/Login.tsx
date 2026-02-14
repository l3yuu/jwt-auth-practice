import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AxiosError } from 'axios';

interface LoginProps {
  setAuth: (auth: boolean) => void;
}

interface ErrorResponse {
  message: string;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/login', { username, password });
      
      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.user);
      
      setAuth(true);
      alert('Login Successful!');
      navigate('/profile'); 
    } catch (err) {
      console.error("Login failed", err);
      
      // Type-safe error handling
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;
        setError(errorData.message || 'Invalid credentials or server is down');
        alert(errorData.message || 'Invalid credentials or server is down');
      } else {
        setError('Invalid credentials or server is down');
        alert('Invalid credentials or server is down');
      }
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
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
      </form>

      <p style={{ marginTop: '1.5rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;