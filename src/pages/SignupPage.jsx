import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Eye, EyeOff, Loader2, Crown, User, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const { register, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('Lodger'); // Lodger | Agent
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        email,
        password1: password,
        password2: confirmPassword,
        full_name: fullName,
        phone_number: phoneNumber,
        is_agent: role === 'Agent'
      });
      setRegistered(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail(email.trim());
      setError('A new verification email has been sent.');
    } catch (err) {
      setError(err.message || 'Unable to resend verification email.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl max-w-lg w-full space-y-6">
        
        <div className="text-center space-y-2">
          {/* <img src="./bookit-logo.png" alt="BookIt" className="h-10 mx-auto" /> */}
          <h1 className="text-2xl font-extrabold text-slate-900">Create Your Book-It Account</h1>
          <p className="text-xs text-slate-500">Join thousands of students and verified lodge agents</p>
        </div>

        {/* ROLE SELECTION TOGGLE */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button 
            type="button"
            onClick={() => setRole('Lodger')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${role === 'Lodger' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <User className="w-4 h-4" />
            <span>Student / Lodger</span>
          </button>
          <button 
            type="button"
            onClick={() => setRole('Agent')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${role === 'Agent' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Agent</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {registered ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">Account created. Check your email to verify your account before logging in.</p>
            <button type="button" onClick={handleResend} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl">Resend verification email</button>
            <Link to="/login" className="block text-sm font-bold text-indigo-600">Go to login</Link>
          </div>
        ) : <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="Daniel Dominic"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
            <input 
              type="tel" 
              required
              placeholder="08012345678"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="student@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#222761] hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create {role} Account</span>
              </>
            )}
          </button>
        </form>}

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
