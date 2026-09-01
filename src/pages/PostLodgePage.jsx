import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing } from '../services/api';
import { 
  PlusCircle, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ChevronDown, 
  Sparkles,
  Building,
  Video,
  FileText
} from 'lucide-react';

const LOCATION_OPTIONS = [
  { value: "AROMA", label: "Aroma" },
  { value: "IFITE_ANAMBRA", label: "Ifite Anambra" },
  { value: "IFITE_UP", label: "Ifite Up-School" },
  { value: "IFITE_DOWN", label: "Ifite Down-School" },
  { value: "AMANSEA", label: "Amansea" },
  { value: "PERMANENT_SITE", label: "Permanent Site" },
  { value: "TEMP_SITE", label: "Temp Site" },
  { value: "UNIZIK_GATE", label: "Unizik Gate" },
  { value: "OKPUNO", label: "Okpuno" },
  { value: "AWKA_ROAD", label: "Awka Road" }
];

const ROOM_TYPE_OPTIONS = [
  { value: "SELF_CONTAINED", label: "Self Contained" },
  { value: "SINGLE_ROOM", label: "Single Room" },
  { value: "ONE_BEDROOM", label: "One Bedroom Flat" },
  { value: "TWO_BEDROOM", label: "Two Bedroom Flat" },
  { value: "STUDIO", label: "Studio Apartment" },
  { value: "SHARED_ROOM", label: "Shared Room" }
];

const PRESET_AMENITIES = [
  "Running Water",
  "Electricity",
  "24/7 Security",
  "WiFi",
  "Parking",
  "Kitchen",
  "Balcony",
  "Generator",
  "Prepaid Meter",
  "Furnished"
];

export default function PostLodgePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lodge_name: '',
    description: '',
    first_price: '',
    year_price: '',
    location: 'AROMA',
    room_type: 'SELF_CONTAINED',
    amenity_names: ["Running Water", "Electricity", "24/7 Security"],
    total_rooms: '10',
    room_number: 'Flat 1',
    video: '',
    is_available: true,
    rules: 'No loud music after 10 PM. Maintain cleanliness.',
    contact_phone: user?.phone || '08011112222',
    contact_email: user?.email || 'agent@bookit.com'
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle adding amenity from dropdown or input
  const handleAddAmenity = (amenityToAdd) => {
    const trimmed = amenityToAdd.trim();
    if (!trimmed) return;

    if (!formData.amenity_names.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        amenity_names: [...prev.amenity_names, trimmed]
      }));
    }
    setCustomAmenity('');
  };

  const handleRemoveAmenity = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenity_names: prev.amenity_names.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Handle Image Upload Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];
    const previews = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select valid image files.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be smaller than 5MB.');
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setError(null);
    setImageFiles(validFiles);
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        lodge_name: formData.lodge_name,
        description: formData.description,
        first_price: formData.first_price,
        year_price: formData.year_price || null,
        location: formData.location,
        room_type: formData.room_type,
        amenity_names: formData.amenity_names,
        total_rooms: Number(formData.total_rooms) || 1,
        room_number: formData.room_number,
        video: formData.video,
        is_available: formData.is_available,
        rules: formData.rules,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email
      };

      await createListing(payload, imageFiles, token);

      alert("Lodge listing published successfully!");
      navigate('/');
    } catch (err) {
      setError(err.message || "Failed to post listing. Please check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          {/* <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Agent Portal</span>
          </div> */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Post a New Lodge Listing</h1>
          <p className="text-xs text-slate-500 mt-1">Upload verified property details according to student lodger requirements.</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Lodge Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Lodge Name
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Peace Haven Lodge"
              value={formData.lodge_name}
              onChange={e => setFormData({ ...formData, lodge_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location & Room Type Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Location
              </label>
              <div className="relative">
                <select 
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                >
                  {LOCATION_OPTIONS.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label} ({loc.value})</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Room Type Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Room Type 
              </label>
              <div className="relative">
                <select 
                  value={formData.room_type}
                  onChange={e => setFormData({ ...formData, room_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                >
                  {ROOM_TYPE_OPTIONS.map(rt => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                1st Year Price (₦)
              </label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="e.g. 400000.00"
                value={formData.first_price}
                onChange={e => setFormData({ ...formData, first_price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subsequent Years Rent (₦)
              </label>
              <input 
                type="number"
                step="0.01"
                placeholder="e.g. 300000.00 (Optional)"
                value={formData.year_price}
                onChange={e => setFormData({ ...formData, year_price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Total Rooms & Room Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Total Rooms
              </label>
              <input 
                type="number" 
                min="1"
                required
                placeholder="e.g. 12"
                value={formData.total_rooms}
                onChange={e => setFormData({ ...formData, total_rooms: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Room Number / Flat
              </label>
              <input 
                type="text" 
                placeholder="e.g. Room A4 or Flat 2"
                value={formData.room_number}
                onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Amenities (Dropdown Multi-Select) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Amenities 
            </label>

            {/* Dropdown Selector */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddAmenity(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                >
                  <option value="">Select Amenities</option>
                  {PRESET_AMENITIES.map((amenity) => (
                    <option key={amenity} value={amenity} disabled={formData.amenity_names.includes(amenity)}>
                      {amenity} {formData.amenity_names.includes(amenity) ? '(Added)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* Custom Amenity Write-in */}
              {/* <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Or type custom..."
                  value={customAmenity}
                  onChange={e => setCustomAmenity(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAmenity(customAmenity);
                    }
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddAmenity(customAmenity)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs shrink-0 transition-colors"
                >
                  Add
                </button>
              </div> */}
            </div>

            {/* Selected Amenity Pill Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.amenity_names.map((amenity, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f5] text-xs font-bold shadow-sm"
                >
                  {/* <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> */}
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="p-0.5 rounded-full transition-colors text-gray-600"
                    title="Remove amenity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description
            </label>
            <textarea 
              rows="3"
              required
              placeholder="Well furnished apartment with clean water supply and security..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
          </div>

          {/* Video URL & House Rules */}
          <div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Video Tour URL
              </label>
              <input 
                type="url" 
                placeholder="https://youtube.com/watch?v=... (Optional)"
                value={formData.video}
                onChange={e => setFormData({ ...formData, video: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                House Rules
              </label>
              <input 
                type="text" 
                placeholder="e.g. Quiet hours after 10 PM"
                value={formData.rules}
                onChange={e => setFormData({ ...formData, rules: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div> */}
          </div>

          {/* Contact Details */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contact Phone
              </label>
              <input 
                type="text" 
                required
                value={formData.contact_phone}
                onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contact Email 
              </label>
              <input 
                type="email" 
                required
                value={formData.contact_email}
                onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white"
              />
            </div>
          </div> */}

          {/* Availability Toggle */}
          {/* <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <input 
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="is_available" className="text-sm font-semibold text-slate-800 cursor-pointer">
              Mark as Available for Rent = {String(formData.is_available)})
            </label>
          </div> */}

          {/* Uploaded Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Uploaded Images
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-slate-50">
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreviews.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    {imagePreviews.map((preview, idx) => (
                      <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="h-24 w-28 rounded-xl object-cover shadow-sm border border-slate-200" />
                    ))}
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold">Click or drag to change selected images</p>
                </div>
              ) : (
                <div className="space-y-2 text-slate-500">
                  <Upload className="w-8 h-8 mx-auto text-indigo-500" />
                  <p className="text-sm font-medium">Drag & drop or click to upload photos</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB each</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#222761] hover:bg-indigo-900 text-white font-bold rounded-2xl shadow-xl shadow-indigo-950/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publishing Lodge...</span>
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
