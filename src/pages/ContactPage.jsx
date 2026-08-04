import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, HelpCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">

      {/* HEADER BANNER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Contact & Support</h1>
        <p className="text-slate-500 text-sm">
          Have questions about finding a hostel, listing your lodge, or account verification? Our support team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CONTACT INFO */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold">Get in Touch</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              We respond to student inquiries and agent verification requests within 24 hours.
            </p>

            <div className="space-y-4 pt-2 text-xs font-medium">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Mail className="w-4 h-4 text-indigo-200" />
                </div>
                <span>bookit.office@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Phone className="w-4 h-4 text-indigo-200" />
                </div>
                <span>+234 913 485 0138</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <MapPin className="w-4 h-4 text-indigo-200" />
                </div>
                <span>Nnamdi Azikiwe University, Awka, Anambra State</span>
              </div>
            </div>
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-800">Message Sent!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting Book-It Support. We have received your inquiry and will reply to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-full hover:bg-indigo-700 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Send Us a Direct Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lodge Inspection Inquiry"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
