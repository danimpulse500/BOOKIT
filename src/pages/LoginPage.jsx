import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn, Eye, EyeOff, Loader2, AlertCircle, Phone, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithGoogle, requestPhoneOTP, confirmPhoneOTP } = useAuth();
  const navigate = useNavigate();

  // Auth Mode: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState('email');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP state
  const [phone, setPhone] = useState('+234');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // UI status state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Switch authentication tabs cleanly
  const handleMethodSwitch = (method) => {
    setAuthMethod(method);
    setError(null);
    if (method === 'phone') {
      setOtpSent(false);
      setOtp('');
    }
  };

  // ---------------- HANDLERS ---------------- //

  // Email / Password Login
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  // Google OAuth Login
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    setSubmitting(true);
    setError(null);

    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 1: Send Phone OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await requestPhoneOTP(phone.trim());
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP code. Please check the phone number.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify Phone OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await confirmPhoneOTP(phone.trim(), otp.trim());
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="BookIt" className="h-10 mx-auto" />
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Log in to manage your bookings and saved student lodges</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* GOOGLE LOGIN BUTTON */}
        <div className={`flex justify-center w-full ${submitting ? 'pointer-events-none opacity-60' : ''}`}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Authentication Failed')}
            shape="pill"
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
            Or Continue With
          </span>
        </div>

        {/* METHOD TOGGLE (Email vs Phone) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleMethodSwitch('email')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${authMethod === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleMethodSwitch('phone')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${authMethod === 'phone' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Phone Number (OTP)
          </button>
        </div>

        {/* FORM 1: EMAIL & PASSWORD */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                placeholder="student@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM 2: PHONE OTP */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+2348000000000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Include country code (e.g. +234)</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending SMS...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>Send OTP Code</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 text-center">
                    Enter 6-Digit Code sent to {phone}
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl font-bold rounded-xl border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || otp.length < 6}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Log In</span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError(null);
                  }}
                  className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change phone number</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}