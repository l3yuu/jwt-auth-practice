import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', { username, password });
      alert('Registration Successful! Please login.');
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error("Registration failed", error);
      alert('Registration failed. User might already exist or server is down.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
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
        <button type="submit">Register</button>
      </form>

      {/* Back to Login Link matching the Login UI style */}
      <p style={{ marginTop: '1.5rem' }}>
        Already have an account? <Link to="/" style={{ color: '#007bff', fontWeight: 'bold' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;