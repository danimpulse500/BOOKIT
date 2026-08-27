import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get('key') || searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (key) {
      handleVerification(key);
    } else {
      setLoading(false);
      setError("No verification key provided in the confirmation link.");
    }
  }, [key]);

  const handleVerification = async (verificationKey) => {
    try {
      await verifyEmail(verificationKey);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "The email confirmation link may have expired or is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl max-w-md w-full text-center space-y-6">
        
        {loading ? (
          <div className="space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">Verifying Email Address...</h2>
            <p className="text-xs text-slate-500">Please wait while we confirm your email credentials.</p>
          </div>
        ) : success ? (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your Book-It account email has been confirmed. You can now log in to explore student hostels or manage lodge listings.
            </p>
            <Link 
              to="/login"
              className="inline-block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all text-sm"
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Verification Link Invalid</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {error || "The email confirmation link may have expired or is invalid."}
            </p>
            <Link 
              to="/login"
              className="inline-block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all text-sm"
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
