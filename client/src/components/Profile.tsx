import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface UserProfile {
  message: string;
  user: {
    user: string;
    iat: number;
    exp: number;
  };
}

interface ProfileProps {
  setAuth: (auth: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ setAuth }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<UserProfile>('/api/user/profile');
        setProfile(data);
      } catch {
        setError('Failed to fetch profile. Are you logged in?');
        setAuth(false);
        // Clear localStorage on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    fetchProfile();
  }, [setAuth]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      // Always clear localStorage and update state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(false);
      alert('Logged out successfully');
      navigate('/'); 
    }
  };

  if (error) return (
    <div style={{ padding: '2rem' }}>
      <p style={{ color: 'red' }}>{error}</p>
      <button onClick={() => navigate('/')}>Go to Login</button>
    </div>
  );
  
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem', border: '1px solid #ddd', borderRadius: '10px', maxWidth: '400px', margin: '2rem auto' }}>
      <h2>User Profile</h2>
      <p>Status: <strong>{profile.message}</strong></p>
      <p>Welcome back, <strong>{profile.user.user}</strong>!</p>
      
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: '20px', 
          backgroundColor: '#ff4d4d', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;