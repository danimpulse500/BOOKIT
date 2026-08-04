import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, agentOnly = false }) {
  const { isLoggedIn, isAgent, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (agentOnly && !isAgent) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl text-center border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Agent Access Required</h3>
        <p className="text-sm text-slate-600 mb-6">
          This feature is exclusively reserved for verified Book-It Agents.
        </p>
        <Navigate to="/profile" replace />
      </div>
    );
  }

  return children;
}
