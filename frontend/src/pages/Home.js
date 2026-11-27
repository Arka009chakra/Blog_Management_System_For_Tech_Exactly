import React, { useEffect, useState } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';
export default function Home() {
  const [posts, setPosts] = useState([]), [search, setSearch] = useState(''), [page, setPage] = useState(1), [pages, setPages] = useState(1), [loading, setLoading] = useState(true);
  const load = async (p = page, q = search) => { setLoading(true); try { const { data } = await api.get('/posts', { params: { page: p, search: q } }); setPosts(data.posts); setPages(data.pages || 1); } finally { setLoading(false); } };
  useEffect(() => { load(1, ''); }, []);
  const submit = (e) => { e.preventDefault(); setPage(1); load(1, search); };
  return <><section className="hero"><div><p className="eyebrow">STORIES THAT MATTER</p><h1>Ideas worth<br /><em>sharing.</em></h1><p>Discover fresh perspectives, practical guides and stories from our community.</p><form className="search" onSubmit={submit}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." /><button className="primary">Search</button></form></div><div className="hero-art"><span>✍️</span><small>Read. Write. Repeat.</small></div></section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">THE LATEST</p><h2>Explore stories</h2></div><span>{posts.length} articles on this page</span></div>
    {loading ? <p>Loading articles...</p> : posts.length ? <div className="post-grid">{posts.map(post => <PostCard key={post._id} post={post} />)}</div> : <p className="empty">No articles found. Try another search.</p>}
    <div className="pagination"><button disabled={page <= 1} onClick={() => { const p = page - 1; setPage(p); load(p); }}>← Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages} onClick={() => { const p = page + 1; setPage(p); load(p); }}>Next →</button></div></section></>;
}
