import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext.jsx';
import { authAPI } from '../services/authAPI.js';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.register(form);
      // auto-login after successful registration
      const loginData = await authAPI.login({ email: form.email, password: form.password });
      login(loginData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='min-h-screen flex items-center justify-center p-6'>
      <div className='w-full max-w-md border border-gray-300 bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
        <h1 className='text-2xl font-semibold mb-4'>Register</h1>

        <form onSubmit={onSubmit} className='flex flex-col gap-3'>
          <input
            name='name'
            value={form.name}
            onChange={onChange}
            placeholder='Full name'
            className='border rounded p-2'
            required
          />
          <input
            name='email'
            value={form.email}
            onChange={onChange}
            placeholder='Email'
            type='email'
            className='border rounded p-2'
            required
          />
          <input
            name='password'
            value={form.password}
            onChange={onChange}
            placeholder='Password'
            type='password'
            className='border rounded p-2'
            required
          />

          {error ? <p className='text-red-600 text-sm'>{error}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='bg-linear-to-t from-sky-500 to-indigo-500 text-white py-2 rounded disabled:opacity-50 cursor-pointer'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className='mt-4 text-sm'>Already have an account? <button className='bg-linear-to-t from-sky-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer' onClick={() => navigate('/login')}>Login</button></p>
      </div>
    </section>
  );
};

export default Register;
