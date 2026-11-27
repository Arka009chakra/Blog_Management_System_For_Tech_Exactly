import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
export default function PostDetails() {
  const { id: slug } = useParams(), { user } = useAuth(), navigate = useNavigate();
  const [post, setPost] = useState(null), [comments, setComments] = useState([]), [body, setBody] = useState(''), [error, setError] = useState('');
  const load = async () => { const { data } = await api.get(`/posts/${slug}`); setPost(data.post); setComments(data.comments); };
  useEffect(() => { load().catch(e => setError(e.response?.data?.message || 'Could not load article')); }, [slug]);
  const addComment = async e => { e.preventDefault(); try { await api.post('/comments', { post: post._id, body }); setBody(''); load(); } catch (e) { setError(e.response?.data?.message || 'Could not add comment'); } };
  const removePost = async () => { if (window.confirm('Delete this article?')) { await api.delete(`/posts/${post._id}`); navigate('/'); } };
  const removeComment = async cid => { if (window.confirm('Delete this comment?')) { await api.delete(`/comments/${cid}`); load(); } };
  if (error && !post) return <p className="center error">{error}</p>;
  if (!post) return <p className="center">Loading article...</p>;
  const canEdit = user && (user.role === 'admin' || user.id === post.author?._id);
  return <article className="article"><Link to="/" className="back-link">← All stories</Link><div className="post-meta">{post.category} · {new Date(post.createdAt).toLocaleDateString()}</div><h1>{post.title}</h1><p className="article-byline">By {post.author?.name}</p>
    {canEdit && <div className="actions"><Link className="secondary" to={`/posts/${post._id}/edit`}>Edit article</Link><button className="danger" onClick={removePost}>Delete</button></div>}
    <div className="article-body">{post.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
    <div className="tags">{post.tags?.map(tag => <span key={tag}>#{tag}</span>)}</div>
    <section className="comments"><h2>Conversation ({comments.length})</h2>{user ? <form onSubmit={addComment}><textarea rows="3" value={body} onChange={e => setBody(e.target.value)} placeholder="Share your thoughts..." required /><button className="primary">Post comment</button></form> : <p><Link to="/login">Log in</Link> to join the conversation.</p>}
      {comments.map(c => <div className="comment" key={c._id}><div><strong>{c.author?.name}</strong><small>{new Date(c.createdAt).toLocaleString()}</small></div><p>{c.body}</p>{user && (user.role === 'admin' || user.id === c.author?._id) && <button className="link-button danger-text" onClick={() => removeComment(c._id)}>Delete</button>}</div>)}</section></article>;
}
