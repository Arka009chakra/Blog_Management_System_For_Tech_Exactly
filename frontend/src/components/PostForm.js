import React, { useState } from 'react';
export default function PostForm({ initial = {}, onSubmit, submitLabel = 'Publish post' }) {
  const [form, setForm] = useState({
    title: initial.title || '', body: initial.body || '', excerpt: initial.excerpt || '',
    category: initial.category || 'General', tags: (initial.tags || []).join(', '), status: initial.status || 'published'
  });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }); };
  return <form className="form-card" onSubmit={submit}>
    <label>Title<input name="title" value={form.title} onChange={change} required minLength="3" maxLength="180" /></label>
    <label>Short summary<input name="excerpt" value={form.excerpt} onChange={change} maxLength="400" /></label>
    <div className="form-row"><label>Category<input name="category" value={form.category} onChange={change} /></label><label>Tags (comma separated)<input name="tags" value={form.tags} onChange={change} /></label></div>
    <label>Article<textarea name="body" value={form.body} onChange={change} required minLength="10" rows="14" /></label>
    <label>Status<select name="status" value={form.status} onChange={change}><option value="published">Published</option><option value="draft">Draft</option></select></label>
    <button className="primary" type="submit">{submitLabel}</button>
  </form>;
}
