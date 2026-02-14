// client/src/App.tsx
import React, { useState } from 'react';
import axios from 'axios';
import type { AuthResponse } from './types';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // We tell Axios to expect the 'AuthResponse' shape
      const { data } = await axios.post<AuthResponse>('http://localhost:5000/login', {
        username,
        password,
      });

      // TypeScript now knows 'data' has a 'token' property
      localStorage.setItem('token', data.token);
      alert('Login Successful!');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
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
  );
};

export default App;