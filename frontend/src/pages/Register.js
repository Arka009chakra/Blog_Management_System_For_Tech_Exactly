
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submit = async (form) => {
    try {
      await registerUser(form);
      navigate('/');
    } catch (err) {
      console.log(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrap">
      <form
        className="form-card auth-card"
        onSubmit={handleSubmit(submit)}
      >
        <p className="eyebrow">JOIN THE COMMUNITY</p>
        <h1>Create account</h1>

        <label>
          Name
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must contain at least 2 characters'
              }
            })}
          />
        </label>
        {errors.name && <p className="error">{errors.name.message}</p>}

        <label>
          Email
          <input
            type="email"
            {...register('email', {
              required: 'Email is required'
            })}
          />
        </label>
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>
          Password
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must contain at least 8 characters'
              }
            })}
          />
        </label>
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button className="primary">Create account</button>

        <p className="muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
