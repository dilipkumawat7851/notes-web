import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4 py-12">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg shadow-xl p-10 text-white">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-3">Sign Up</h1>
          <p className="text-sm text-slate-400">
            Already a member? <Link to="/login" className="text-[#84C4ED] hover:underline">Log In</Link>
          </p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-0 border-b border-[#2D2D2D] focus:border-[#84C4ED] focus:ring-0 px-0 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-0 border-b border-[#2D2D2D] focus:border-[#84C4ED] focus:ring-0 px-0 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-0 border-b border-[#2D2D2D] focus:border-[#84C4ED] focus:ring-0 px-0 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-transparent border-0 border-b border-[#2D2D2D] focus:border-[#84C4ED] focus:ring-0 px-0 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-[#84C4ED] hover:bg-[#72b8e3] text-[#111111] font-bold text-sm transition-colors rounded"
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px bg-[#2D2D2D] flex-1"></div>
          <span className="text-xs text-slate-500 uppercase tracking-wide">or sign up with</span>
          <div className="h-px bg-[#2D2D2D] flex-1"></div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button className="w-8 h-8 rounded bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:opacity-90 transition-opacity">
            <svg viewBox="0 0 48 48" className="w-8 h-8"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
