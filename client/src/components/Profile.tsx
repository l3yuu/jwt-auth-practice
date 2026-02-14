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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<UserProfile>('/api/user/profile');
        
        // Simulate minimum loading time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProfile(data);
      } catch {
        setError('Failed to fetch profile. Please try logging in again.');
        setAuth(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setAuth]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await api.post('/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      // Always clear localStorage and update state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuth(false);
      
      // Small delay for smooth transition
      setTimeout(() => {
        navigate('/');
      }, 300);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <div className="error-icon-large">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="error-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container loading">
          <div className="profile-header">
            <div className="skeleton skeleton-circle"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
          <div className="profile-body">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    );
  }

  // Format token expiration date
  const expirationDate = profile ? new Date(profile.user.exp * 1000).toLocaleString() : '';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.user.user.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">Welcome back, {profile?.user.user}!</h1>
          <p className="profile-status">
            <span className="status-dot"></span>
            Active Session
          </p>
        </div>

        <div className="profile-body">
          <div className="info-card">
            <div className="info-label">Username</div>
            <div className="info-value">{profile?.user.user}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Session Status</div>
            <div className="info-value">{profile?.message}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Token Expires</div>
            <div className="info-value expires">{expirationDate}</div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="logout-button"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <span className="spinner"></span>
              Logging out...
            </>
          ) : (
            <>
              <span className="logout-icon">🚪</span>
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Profile;