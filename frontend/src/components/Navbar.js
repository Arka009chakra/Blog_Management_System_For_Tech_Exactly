import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/'); };
  return <header className="navbar"><Link className="brand" to="/">BlogSpace</Link><nav>
    <NavLink to="/">Explore</NavLink>
    {user && <><NavLink to="/my-posts">My posts</NavLink><NavLink to="/create">Write</NavLink></>}
    {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
    {user ? <><span className="welcome">Hi, {user.name}</span><button className="link-button" onClick={signOut}>Logout</button></> : <><NavLink to="/login">Login</NavLink><NavLink className="nav-cta" to="/register">Join</NavLink></>}
  </nav></header>;
}
