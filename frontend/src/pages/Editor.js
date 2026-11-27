
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import PostForm from '../components/PostForm';

export default function Editor() {
  const { id } = useParams(), navigate = useNavigate();
  const [initial, setInitial] = useState(null), [error, setError] = useState('');

  useEffect(() => {
    if (id) api.get(`/posts/${id}`)
      .then(({ data }) => setInitial(data.post))
      .catch(e => setError(e.response?.data?.message || 'Unable to load post'));
    else setInitial({});
  }, [id]);

  const save = async values => {
    try {
      const { data } = id
        ? await api.put(`/posts/${id}`, values)
        : await api.post('/posts', values);

      navigate('/my-posts');

    } catch (e) {
      setError(e.response?.data?.message || 'Could not save article');
    }
  };

  if (!initial) return <p className="center">Loading editor...</p>;

  return (
    <section className="editor-page">
      <p className="eyebrow">{id ? 'REFINE YOUR STORY' : 'CREATE SOMETHING GREAT'}</p>
      <h1>{id ? 'Edit article' : 'Write a story'}</h1>
      {error && <p className="error">{error}</p>}
      <PostForm
        initial={initial}
        onSubmit={save}
        submitLabel={id ? 'Save changes' : 'Publish story'}
      />
    </section>
  );
}
