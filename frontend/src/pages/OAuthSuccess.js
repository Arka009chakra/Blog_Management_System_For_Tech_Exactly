import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
export default function OAuthSuccess() {
  const [params] = useSearchParams(), navigate = useNavigate(), { setUser } = useAuth();
  useEffect(() => {
    const token = params.get('token');
    if (!token) { navigate('/login'); return; }
    localStorage.setItem('accessToken', token);
    api.get('/auth/me').then(({ data }) => { setUser(data.user); navigate('/'); }).catch(() => navigate('/login'));
  }, [params, navigate, setUser]);
  return <p className="center">Signing you in...</p>;
}
