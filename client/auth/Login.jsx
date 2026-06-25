import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext.jsx';
import { authAPI } from '../services/authAPI.js';

const Login = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);

	const [form, setForm] = useState({ email: '', password: '' });
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
			const data = await authAPI.login(form);
			login(data);
			navigate('/', { replace: true });
		} catch (err) {
			setError(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className='min-h-screen flex items-center justify-center p-6'>
			<div className='w-full max-w-md border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white'>
				<h1 className='text-2xl font-semibold mb-4'>Login</h1>

				<form onSubmit={onSubmit} className='flex flex-col gap-3'>
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
						className='bg-linear-to-t from-sky-500 to-indigo-500 cursor-pointer text-white py-2 rounded disabled:opacity-50'
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<p className='mt-4 text-sm'>
					New here?
					<button className='bg-linear-to-t from-sky-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer pl-2'
						onClick={() => navigate('/register')}
					>
						Create account
					</button>
				</p>
			</div>
		</section>
	);
};

export default Login;
