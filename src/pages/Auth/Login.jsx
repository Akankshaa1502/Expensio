import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const firebaseErrors = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/invalid-email': 'Please enter a valid email address.',
};

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(firebaseErrors[err.code] || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-logo">
          <div className="auth-logo-icon">E</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Expensio account</p>
        </div>

        {authError && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HiOutlineExclamationCircle size={16} />
            {authError}
          </motion.div>
        )}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-google" onClick={handleGoogleLogin} type="button">
          <svg viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
}
