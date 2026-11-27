import React from 'react';
import { Link } from 'react-router-dom';
export default function PostCard({ post }) {
  return <article className="post-card"><div className="post-meta">{post.category || 'General'} · {new Date(post.createdAt).toLocaleDateString()}</div>
    <h2><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
    <p>{post.excerpt || `${post.body.slice(0, 180)}${post.body.length > 180 ? '…' : ''}`}</p>
    <div className="post-footer"><span>By {post.author?.name || 'Author'}</span><Link to={`/posts/${post._id}`}>Read article →</Link></div>
    {post.tags?.length > 0 && <div className="tags">{post.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>}
  </article>;
}
