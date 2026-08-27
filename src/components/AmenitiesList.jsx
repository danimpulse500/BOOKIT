import React from 'react';
import { 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  Car, 
  Tv, 
  Wind, 
  Utensils, 
  Key, 
  Sparkles,
  BedDouble,
  ShowerHead
} from 'lucide-react';

const getAmenityIcon = (name) => {
  const lower = String(name).toLowerCase();
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-4 h-4 text-indigo-500" />;
  if (lower.includes('light') || lower.includes('electricity') || lower.includes('power')) return <Zap className="w-4 h-4 text-amber-500" />;
  if (lower.includes('security') || lower.includes('gate')) return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
  if (lower.includes('water') || lower.includes('borehole')) return <Droplets className="w-4 h-4 text-blue-500" />;
  if (lower.includes('park')) return <Car className="w-4 h-4 text-purple-500" />;
  if (lower.includes('tv')) return <Tv className="w-4 h-4 text-rose-500" />;
  if (lower.includes('ac') || lower.includes('fan') || lower.includes('air')) return <Wind className="w-4 h-4 text-cyan-500" />;
  if (lower.includes('kitchen') || lower.includes('cabinet')) return <Utensils className="w-4 h-4 text-orange-500" />;
  if (lower.includes('bed') || lower.includes('room')) return <BedDouble className="w-4 h-4 text-teal-500" />;
  if (lower.includes('bath') || lower.includes('toilet') || lower.includes('shower')) return <ShowerHead className="w-4 h-4 text-sky-500" />;
  return <Sparkles className="w-4 h-4 text-indigo-400" />;
};

const getAmenityName = (item) => typeof item === 'string' ? item : item?.name || 'Amenity';

export default function AmenitiesList({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {amenities.map((item, idx) => (
        <div 
          key={idx} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-medium border border-slate-200 transition-all duration-200"
        >
          {getAmenityIcon(getAmenityName(item))}
          <span>{getAmenityName(item)}</span>
        </div>
      ))}
    </div>
  );
}
