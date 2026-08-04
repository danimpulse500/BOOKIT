import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitAgentRequest } from '../services/api';
import { Crown, X, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingAgentBtn() {
  const { user, isLoggedIn, isAgent } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    agency_name: '',
    message: ''
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Scroll minimize effect
  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 150) {
        setMinimized(true);
      } else {
        setMinimized(false);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide button if user is already logged in as Agent
  if (isLoggedIn && isAgent) {
    return null;
  }

  const handleOpen = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setModalOpen(true);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitAgentRequest({
        email: formData.email,
        agency_name: formData.agency_name,
        message: formData.message,
        timestamp: new Date().toISOString(),
        source: 'BookIt React Website'
      });
      setSuccess(true);
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 rounded-full px-5 py-3 flex items-center gap-2.5 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ${minimized ? 'px-3' : ''}`}
        title="Become a Book-It Agent"
      >
        <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-300 ${minimized ? 'hidden' : 'block'}`}>
          Become an Agent
        </span>
      </button>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-slide-up">
            
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-lg">Become a Book-It Agent</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {success ? (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-slate-800">Request Submitted!</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thank you for your interest in becoming a Book-It Agent. Our verification team will review your application and email you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Agency / Agent Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.agency_name}
                      onChange={e => setFormData({ ...formData, agency_name: e.target.value })}
                      placeholder="e.g. Apex Realty"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Experience / Notes (Optional)</label>
                    <textarea 
                      rows="3"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the properties you manage..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-800">
                    <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>We process agent applications within 24 hours. Check your inbox and spam folder.</span>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
