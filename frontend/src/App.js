import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetails from './pages/PostDetails';
import Editor from './pages/Editor';
import MyPosts from './pages/MyPosts';
import Admin from './pages/Admin';
import OAuthSuccess from './pages/OAuthSuccess';
export default function App() {
  useEffect(() => {
  const handleExpired = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  window.addEventListener('auth:expired', handleExpired);

  return () => {
    window.removeEventListener('auth:expired', handleExpired);
  };
}, []);

  return <><Navbar /><main className="container"><Routes>
    <Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/oauth-success" element={<OAuthSuccess />} /><Route path="/posts/:id" element={<PostDetails />} />
    <Route element={<ProtectedRoute />}><Route path="/create" element={<Editor />} /><Route path="/posts/:id/edit" element={<Editor />} /><Route path="/my-posts" element={<MyPosts />} /></Route>
    <Route element={<ProtectedRoute admin />}><Route path="/admin" element={<Admin />} /></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main><footer className="footer">© {new Date().getFullYear()} BlogSpace · Built with the MERN stack</footer></>;
}
