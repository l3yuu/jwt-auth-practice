
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface UserProfile {
  message: string;
  user: {
    user: string; // This matches the payload you signed in Node.js
    iat: number;
    exp: number;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get<UserProfile>('/api/user/profile');
        setProfile(data);
        } catch { // No (err) needed at all
        setError('Failed to fetch profile. Are you logged in?');
        }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.message}</h2>
      <p>Welcome back, <strong>{profile.user.user}</strong>!</p>
    </div>
  );
};

export default Profile;