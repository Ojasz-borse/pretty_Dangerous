'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Camera, Upload, X, CheckCircle2, Loader2, Package, MapPin, IndianRupee, Wheat } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

export interface CropListing {
    _id: string;
    cropName: string;
    variety: string;
    quantity: number;
    unit: string;
    expectedPrice: number;
    quality: string;
    description: string;
    image: string | null;
    status: 'available' | 'sold' | 'listed';
    farmer?: any;
    location?: { district: string; state: string };
    createdAt?: string;
}

export default function AddCropListing() {
    const { district, state } = useLocation();
    const { token, user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [listings, setListings] = useState<CropListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        cropName: '', variety: '', quantity: '', pricePerQtl: '', quality: 'A Grade', description: '', imagePreview: null as string | null,
    });

    // Load from real API
    useEffect(() => {
        const fetchMyCrops = async () => {
            if (!token) return;
            try {
                const res = await fetch('http://localhost:5000/api/farmer/my-crops', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) setListings(data);
            } catch (err) { console.error('Fetch error:', err); }
            finally { setIsLoading(false); }
        };
        fetchMyCrops();
    }, [token]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm(prev => ({ ...prev, imagePreview: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!form.cropName || !form.quantity || !form.pricePerQtl || !token) return;

        try {
            const res = await fetch('http://localhost:5000/api/farmer/crop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cropName: form.cropName,
                    variety: form.variety,
                    quantity: parseInt(form.quantity),
                    unit: 'Quintals',
                    expectedPrice: parseInt(form.pricePerQtl),
                    quality: form.quality,
                    description: form.description,
                    image: form.imagePreview,
                    location: {
                        district: district || 'Unknown',
                        state: state || 'Unknown'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                setListings(prev => [data.crop, ...prev]);
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setShowForm(false);
                    setForm({ cropName: '', variety: '', quantity: '', pricePerQtl: '', quality: 'A Grade', description: '', imagePreview: null });
                }, 2000);
            }
        } catch (err) { console.error('Submit error:', err); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header + Add Button */}
            <div className="card card-3d p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800">My Crop Listings</h2>
                            <p className="text-xs text-slate-400">
                                📍 {district || 'Your District'}, {state || 'Your State'} · {listings.length} active listings
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className={`btn-primary gap-1.5 ${showForm ? 'bg-red-500 hover:bg-red-600' : ''}`}>
                        {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add New Crop</>}
                    </button>
                </div>
            </div>

            {/* Add Crop Form */}
            {showForm && (
                <div className="card card-green p-6 animate-scale-in">
                    {submitted ? (
                        <div className="text-center py-8 animate-scale-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Crop Listed Successfully! 🌾</h3>
                            <p className="text-sm text-slate-500">Buyers can now see your listing</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                <Wheat className="w-5 h-5 text-green-600" /> List Your Crop for Sale
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Crop Name *</label>
                                    <select className="select-field w-full" value={form.cropName} onChange={(e) => setForm(prev => ({ ...prev, cropName: e.target.value }))}>
                                        <option value="">Select Crop</option>
                                        {['Wheat', 'Rice', 'Cotton', 'Mustard', 'Maize', 'Onion', 'Soybean', 'Sugarcane', 'Bajra', 'Jowar'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Variety</label>
                                    <input className="input-field" placeholder="e.g. Sharbati, 1121, Bt Cotton..." value={form.variety} onChange={(e) => setForm(prev => ({ ...prev, variety: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Quantity (Quintals) *</label>
                                    <input className="input-field" type="number" placeholder="e.g. 500" value={form.quantity} onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Price per Quintal (₹) *</label>
                                    <input className="input-field" type="number" placeholder="e.g. 2450" value={form.pricePerQtl} onChange={(e) => setForm(prev => ({ ...prev, pricePerQtl: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Quality Grade</label>
                                    <select className="select-field w-full" value={form.quality} onChange={(e) => setForm(prev => ({ ...prev, quality: e.target.value }))}>
                                        {['Premium', 'A Grade', 'B Grade', 'C Grade'].map(q => (
                                            <option key={q} value={q}>{q}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
                                    <input className="input-field" placeholder="Brief description of your crop..." value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Crop Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="btn-outline cursor-pointer gap-1.5">
                                        <Camera className="w-4 h-4" /> Upload Image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                    {form.imagePreview && (
                                        <div className="relative">
                                            <img src={form.imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border-2 border-green-200" />
                                            <button onClick={() => setForm(prev => ({ ...prev, imagePreview: null }))} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleSubmit} disabled={!form.cropName || !form.quantity || !form.pricePerQtl} className="btn-primary w-full justify-center py-3 text-base pulse-glow disabled:opacity-50 disabled:cursor-not-allowed">
                                <Upload className="w-5 h-5" /> List Crop for Buyers
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Existing Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing, i) => (
                    <div key={listing._id} className={`card card-3d overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                        {listing.image && (
                            <div className="relative h-40 overflow-hidden">
                                <img src={listing.image} alt={listing.cropName} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${listing.status === 'available' || listing.status === 'listed' ? 'bg-green-500 text-white' : listing.status === 'sold' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                        {listing.status === 'available' || listing.status === 'listed' ? '🟢 Live' : listing.status === 'sold' ? '✅ Sold' : '📝 Draft'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{listing.cropName}</h3>
                                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{listing.variety} · {listing.quality}</p>
                                </div>
                                <p className="text-lg font-extrabold text-green-600">₹{(listing.expectedPrice || 0).toLocaleString()}<span className="text-xs text-slate-400 font-medium">/qtl</span></p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Package className="w-3 h-3" /> {listing.quantity} {listing.unit}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {listing.location?.district || 'Your District'}
                                </span>
                            </div>
                            {listing.description && <p className="text-xs text-slate-400 mt-2 italic">{listing.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
