
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [error, setError] = React.useState('');

  const submit = async (data) => {
    setError('');

    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <form
        className="form-card auth-card"
        onSubmit={handleSubmit(submit)}
      >
        <p className="eyebrow">WELCOME BACK</p>

        <h1>Log in</h1>

        {error && <p className="error">{error}</p>}

        <label>
          Email
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address'
              }
            })}
          />
        </label>

        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}

        <label>
          Password
          <input
            type="password"
            {...register('password', {
              required: 'Password is required'
            })}
          />
        </label>

        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}

        <button className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <div className="oauth">
          <a href={`${api.defaults.baseURL}/auth/google`}>
            Continue with Google
          </a>

          <a href={`${api.defaults.baseURL}/auth/facebook`}>
            Continue with Facebook
          </a>
        </div>

        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
