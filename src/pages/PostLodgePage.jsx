import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing } from '../services/api';
import { LOCATIONS } from '../services/mockData';
import { PlusCircle, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PostLodgePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: 'Ifite-Up School',
    first_price: '',
    year_price: '',
    rooms: 'Self-contained',
    amenities: 'Water, Electricity, Security, WiFi',
    description: '',
    rules: 'No loud music after 10 PM. Maintain cleanliness.',
    agent_name: user?.name || '',
    agent_phone: user?.phone || '08011112222'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createListing({
        ...formData,
        agent_email: user?.email
      }, imageFile);

      alert("Lodge listing posted successfully!");
      navigate('/');
    } catch (err) {
      setError("Failed to post listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Agent Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Post a New Lodge Listing</h1>
          <p className="text-xs text-slate-500 mt-1">Upload verified details to list your student accommodation for prospective lodgers.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Lodge Title / Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Sunny Villa Suites"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location & Room Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Location / Zone</label>
              <select 
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LOCATIONS.filter(l => l.id !== '').map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Room Category</label>
              <select 
                value={formData.rooms}
                onChange={e => setFormData({ ...formData, rooms: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Self-contained">Self-contained</option>
                <option value="Single Room">Single Room</option>
                <option value="Two Bedroom Flat">Two Bedroom Flat</option>
                <option value="Shared Apartment">Shared Apartment</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">1st Year Rent (₦)</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 180000"
                value={formData.first_price}
                onChange={e => setFormData({ ...formData, first_price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Subsequent Years Rent (₦)</label>
              <input 
                type="number" 
                placeholder="e.g. 150000"
                value={formData.year_price}
                onChange={e => setFormData({ ...formData, year_price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Amenities (Comma-separated)</label>
            <input 
              type="text" 
              placeholder="Water, Electricity, Security, WiFi, Parking"
              value={formData.amenities}
              onChange={e => setFormData({ ...formData, amenities: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Lodge Description</label>
            <textarea 
              rows="4"
              required
              placeholder="Describe the lodge features, surroundings, distance to campus gate..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">House Rules</label>
            <input 
              type="text" 
              placeholder="e.g. No smoking, quiet hours after 10 PM"
              value={formData.rules}
              onChange={e => setFormData({ ...formData, rules: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Agent Info prefilled */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Agent Name</label>
              <input 
                type="text" 
                required
                value={formData.agent_name}
                onChange={e => setFormData({ ...formData, agent_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Agent Phone Number</label>
              <input 
                type="text" 
                required
                value={formData.agent_phone}
                onChange={e => setFormData({ ...formData, agent_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Cover Photo</label>
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-slate-50">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="h-40 mx-auto rounded-xl object-cover shadow-sm" />
                  <p className="text-xs text-indigo-600 font-semibold">Click to change selected image</p>
                </div>
              ) : (
                <div className="space-y-2 text-slate-500">
                  <Upload className="w-8 h-8 mx-auto text-indigo-500" />
                  <p className="text-sm font-medium">Drag & drop or click to upload cover image</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Posting Lodge...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Publish Lodge Listing</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
