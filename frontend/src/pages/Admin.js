import React, { useEffect, useState } from 'react';
import api from '../api';
export default function Admin() {
  const [tab, setTab] = useState('overview'), [data, setData] = useState({}), [error, setError] = useState('');
  const load = async current => { try { const path = current === 'overview' ? '/admin/dashboard' : `/admin/${current}`; const { data: result } = await api.get(path); setData(result); } catch (e) { setError(e.response?.data?.message || 'Could not load admin data'); } };
  useEffect(() => { load(tab); }, [tab]);
  const action = async (url, method, body) => { try { await api[method](url, body); load(tab); } catch (e) { setError(e.response?.data?.message || 'Action failed'); } };
  return <section className="section"><p className="eyebrow">SITE CONTROL</p><h1>Admin dashboard</h1>{error && <p className="error">{error}</p>}
    <div className="tabs">{['overview', 'users', 'posts', 'comments'].map(t => <button className={tab === t ? 'active' : ''} key={t} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>
    {tab === 'overview' && data.stats && <><div className="stats">{Object.entries(data.stats).map(([k, v]) => <div className="stat" key={k}><strong>{v}</strong><span>{k}</span></div>)}</div><h2>Recent activity</h2><div className="dashboard-list">{data.activities?.map(a => <div className="dashboard-row" key={a._id}><strong>{a.actor?.name || 'System'} — {a.action}</strong><small>{new Date(a.createdAt).toLocaleString()}</small></div>)}</div></>}
    {tab === 'users' && <div className="dashboard-list">{data.users?.map(u => <div className="dashboard-row" key={u._id}><div><strong>{u.name}</strong><small>{u.email} · {u.role} · {u.isActive ? 'active' : 'disabled'}</small></div><div className="actions"><button onClick={() => action(`/admin/users/${u._id}`, 'patch', { role: u.role === 'admin' ? 'user' : 'admin' })}>{u.role === 'admin' ? 'Make user' : 'Make admin'}</button><button onClick={() => action(`/admin/users/${u._id}`, 'patch', { isActive: !u.isActive })}>{u.isActive ? 'Disable' : 'Enable'}</button><button className="danger" onClick={() => window.confirm('Delete user and their content?') && action(`/admin/users/${u._id}`, 'delete')}>Delete</button></div></div>)}</div>}
    {tab === 'posts' && <div className="dashboard-list">{data.posts?.map(p => <div className="dashboard-row" key={p._id}><div><strong>{p.title}</strong><small>By {p.author?.name} · {p.status}</small></div><button className="danger" onClick={() => window.confirm('Delete this post?') && action(`/admin/posts/${p._id}`, 'delete')}>Delete</button></div>)}</div>}
    {tab === 'comments' && <div className="dashboard-list">{data.comments?.map(c => <div className="dashboard-row" key={c._id}><div><strong>{c.author?.name} on {c.post?.title}</strong><small>{c.body}</small></div><button className="danger" onClick={() => window.confirm('Delete this comment?') && action(`/admin/comments/${c._id}`, 'delete')}>Delete</button></div>)}</div>}
  </section>;
}
