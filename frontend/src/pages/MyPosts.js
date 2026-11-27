import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const load = () => api.get('/posts/mine').then(({ data }) => setPosts(data.posts));
  useEffect(() => { load(); }, []);
  const remove = async id => { if (window.confirm('Delete this article?')) { await api.delete(`/posts/${id}`); load(); } };
  return <section className="section"><div className="section-heading"><div><p className="eyebrow">YOUR WRITING</p><h1>My posts</h1></div><Link className="primary button-link" to="/create">Write a post</Link></div>
    {posts.length ? <div className="dashboard-list">{posts.map(p => <div className="dashboard-row" key={p._id}><div><strong>{p.title}</strong><small>{p.status} · {new Date(p.createdAt).toLocaleDateString()}</small></div><div className="actions"><Link to={`/posts/${p.slug}`}>View</Link><Link to={`/posts/${p._id}/edit`}>Edit</Link><button className="link-button danger-text" onClick={() => remove(p._id)}>Delete</button></div></div>)}</div> : <p className="empty">You haven't written anything yet.</p>}</section>;
}
