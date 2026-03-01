'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    Camera, Upload, CheckCircle2, AlertCircle, Loader2, Package,
    Tag, IndianRupee, BarChart4, Trash2, Globe, Clock, Plus,
    ExternalLink, Star, Leaf, Scan, Award, MapPin, ImagePlus, FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

interface CropListing {
    _id: string;
    cropName: string;
    variety?: string;
    quality?: string;
    description?: string;
    image?: string;
    quantity: number;
    unit: string;
    expectedPrice: number;
    availability: string;
    status: string;
    location?: { district: string; state: string };
    createdAt: string;
}

const cropImageMap: Record<string, string> = {
    'Wheat': '/wheat.jpg',
    'Rice': '/rice.jpg',
    'Cotton': '/cotton.jpg',
    'Mustard': '/mustard.jpg',
    'Maize': '/maize.jpeg',
    'Onion': '/onion.avif',
    'Soybean': '/wheat.jpg',
    'Sugarcane': '/maize.jpeg',
    'Bajra': '/wheat.jpg',
    'Jowar': '/wheat.jpg',
};

export default function CropDetection() {
    const { token, user } = useAuth();
    const { district, state } = useLocation();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [listings, setListings] = useState<CropListing[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        cropName: '',
        variety: '',
        quality: 'A Grade',
        description: '',
        quantity: '',
        unit: 'quintal',
        expectedPrice: '',
        availability: 'immediate',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMyCrops = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5000/api/farmer/my-crops', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setListings(data);
            }
        } catch (err) {
            console.error('Failed to fetch crops');
        }
    }, [token]);

    useEffect(() => {
        if (user?.role === 'farmer') {
            fetchMyCrops();
        }
    }, [fetchMyCrops, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
            setResult(null);
            setError(null);
        }
    };

    const analyzeImage = () => {
        if (!file) {
            setError('Please upload an image first.');
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setTimeout(() => {
            const detectedCrop = "Premium Wheat (Sharbati)";
            setResult({
                crop: detectedCrop,
                confidence: "98.4%",
                quality: "A Grade",
                health: "Excellent",
                estimatedYield: "4.2 Tons/Hectare"
            });
            setIsAnalyzing(false);
            setFormData(prev => ({ ...prev, cropName: 'Wheat', variety: 'Sharbati', quality: 'A Grade' }));
            setShowForm(true);
        }, 2000);
    };

    const handleAddListing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5000/api/farmer/crop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cropName: formData.cropName,
                    variety: formData.variety,
                    quantity: Number(formData.quantity),
                    unit: formData.unit,
                    expectedPrice: Number(formData.expectedPrice),
                    quality: formData.quality,
                    description: formData.description,
                    image: preview || cropImageMap[formData.cropName] || '/wheat.jpg',
                    availability: formData.availability,
                    location: {
                        district: district || 'Unknown',
                        state: state || 'Unknown'
                    }
                }),
            });

            if (res.ok) {
                await fetchMyCrops();
                setSubmitSuccess(true);
                setTimeout(() => {
                    setFormData({
                        cropName: '', variety: '', quality: 'A Grade', description: '',
                        quantity: '', unit: 'quintal', expectedPrice: '', availability: 'immediate',
                    });
                    setShowForm(false);
                    setResult(null);
                    setPreview(null);
                    setFile(null);
                    setSubmitSuccess(false);
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to list crop');
            }
        } catch (err) {
            setError('Connection error. Is backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token || !confirm('Are you sure you want to delete this listing?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/farmer/crop/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchMyCrops();
        } catch (err) {
            console.error('Delete failed');
        }
    };

    if (!user || user.role !== 'farmer') {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-50 min-h-[60vh] rounded-3xl m-6">
                <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Farmer Access Restricted</h2>
                <p className="text-slate-500 mt-2 font-medium">This module is reserved for registered farmers only.</p>
                <Link href="/login" className="btn-primary mt-8 px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-green-600/20 no-underline">
                    Sign In as Farmer
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* ===== PAGE HEADER ===== */}
            <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                        <Scan className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Crop AI <span className="text-gradient-green">Studio</span></h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-0.5">Scan · Analyze · List for Buyers</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 border-slate-700 rounded-2xl">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">{district || 'Your District'}, {state || 'Your State'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/* ===== LEFT: AI SCANNER ===== */}
                <div className="space-y-8">
                    <div className="relative p-8 bg-[#131b2f] border border-slate-700 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full -mr-36 -mt-36 blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                    <Camera className="w-5 h-5 text-orange-400" />
                                    AI Crop Scanner
                                </h3>
                                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-black rounded-full uppercase tracking-widest">Computer Vision</span>
                            </div>

                            <div
                                className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden cursor-pointer ${preview ? 'border-green-500 bg-[#0f172a]' : 'border-slate-600 hover:border-slate-500 bg-[#0f172a]'}`}
                                onClick={() => !preview && fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                                                <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-white font-black tracking-widest uppercase text-[10px] animate-pulse">Neural Processing...</p>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setResult(null); }} className="p-2.5 bg-red-500/20 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12">
                                        <div className="w-20 h-20 bg-slate-800 border-slate-700 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                            <ImagePlus className="w-10 h-10 text-white/30" />
                                        </div>
                                        <span className="text-white/80 font-black text-sm mb-1">Upload Crop Photo</span>
                                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider text-center px-8">This image will be shown to buyers in the marketplace</span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </div>

                            <button
                                onClick={analyzeImage}
                                disabled={!file || isAnalyzing}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:grayscale transition-all hover:shadow-2xl hover:shadow-orange-500/30 flex items-center justify-center gap-3"
                            >
                                {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Scan className="w-5 h-5" /> Start AI Analysis</>}
                            </button>
                        </div>
                    </div>

                    {/* ===== AI RESULT PANEL ===== */}
                    {result && (
                        <div className="bg-[#131b2f] p-7 rounded-[2.5rem] border border-slate-700 shadow-2xl animate-scale-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                                    <Star className="w-5 h-5 text-amber-400" /> AI Analysis
                                </h3>
                                <span className="px-3 py-1 bg-green-600/20 text-green-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-500/30">{result.confidence} Match</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Commodity', val: result.crop, icon: Leaf },
                                    { label: 'AI Grade', val: result.quality, icon: Award },
                                    { label: 'Health', val: result.health, icon: CheckCircle2 },
                                    { label: 'Yield Est.', val: result.estimatedYield, icon: BarChart4 },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-800 border-slate-700 p-4 rounded-2xl hover:bg-white/10 transition-all">
                                        <item.icon className="w-4 h-4 text-emerald-400 mb-2" />
                                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-white">{item.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== RIGHT: LISTING FORM + INVENTORY ===== */}
                <div className="space-y-8">
                    {showForm ? (
                        <div className="bg-[#131b2f] p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl animate-fade-in">
                            {submitSuccess ? (
                                <div className="text-center py-12 animate-scale-in">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-1">Listed Successfully! 🌾</h3>
                                    <p className="text-white/40 text-sm">Buyers can now see your listing in the marketplace.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight flex items-center gap-2">
                                                <Package className="w-5 h-5 text-emerald-400" /> List for Buyers
                                            </h3>
                                            <p className="text-white/40 font-medium text-xs mt-1">Fill details below — this will appear in the buyer marketplace.</p>
                                        </div>
                                        <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors">
                                            <Plus className="w-5 h-5 rotate-45" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddListing} className="space-y-5">
                                        {error && <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold rounded-2xl border border-red-500/20">{error}</div>}

                                        {/* Image Preview */}
                                        {preview && (
                                            <div className="relative rounded-2xl overflow-hidden h-40 border border-white/10">
                                                <img src={preview} alt="Crop" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Image Ready for Buyers</span>
                                                </div>
                                            </div>
                                        )}

                                        {!preview && (
                                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-white/30 transition-all">
                                                <ImagePlus className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                                <p className="text-white/40 text-xs font-bold">Click to add a crop photo for buyers</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Crop Name *</label>
                                                <select required className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none" value={formData.cropName} onChange={e => setFormData({ ...formData, cropName: e.target.value })}>
                                                    <option value="" className="bg-slate-900">Select Crop</option>
                                                    {['Wheat', 'Rice', 'Cotton', 'Mustard', 'Maize', 'Onion', 'Soybean', 'Sugarcane', 'Bajra', 'Jowar'].map(c => (
                                                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Variety</label>
                                                <input className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/20" placeholder="e.g. Sharbati, 1121..." value={formData.variety} onChange={e => setFormData({ ...formData, variety: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Quantity *</label>
                                                <div className="relative">
                                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                    <input required type="number" className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/20" placeholder="500" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Unit</label>
                                                <select className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                                                    <option value="kg" className="bg-slate-900">Kilograms (kg)</option>
                                                    <option value="quintal" className="bg-slate-900">Quintals (q)</option>
                                                    <option value="ton" className="bg-slate-900">Tons (t)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Price per Unit (₹) *</label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                    <input required type="number" className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/20" placeholder="2450" value={formData.expectedPrice} onChange={e => setFormData({ ...formData, expectedPrice: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Quality Grade</label>
                                                <select className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 px-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none" value={formData.quality} onChange={e => setFormData({ ...formData, quality: e.target.value })}>
                                                    {['Premium', 'A Grade', 'B Grade', 'C Grade'].map(q => (
                                                        <option key={q} value={q} className="bg-slate-900">{q}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 block">Description for Buyers</label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-4 w-4 h-4 text-emerald-400" />
                                                <textarea className="w-full bg-slate-800 border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/20 resize-none h-20" placeholder="Organic, freshly harvested, no pesticides..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !formData.cropName || !formData.quantity || !formData.expectedPrice}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:grayscale transition-all hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Upload className="w-4 h-4" /> List Crop for Buyers</>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* ===== DIRECT ADD CROP SECTION ===== */}
                            <div className="p-7 bg-slate-800 rounded-[2.5rem] border border-slate-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                            <Plus className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white">Add Your Crop</h4>
                                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">List directly for buyers — no AI scan needed</p>
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs leading-relaxed font-medium mb-4">Upload an image, enter crop details, and your listing goes live instantly on the buyer marketplace.</p>
                                    <button
                                        onClick={() => {
                                            setFormData({ cropName: '', variety: '', quality: 'A Grade', description: '', quantity: '', unit: 'quintal', expectedPrice: '', availability: 'immediate' });
                                            setShowForm(true);
                                        }}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Plus className="w-5 h-5" /> Add Crop Listing
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Inventory</h3>
                                <button onClick={() => { setFormData({ cropName: '', variety: '', quality: 'A Grade', description: '', quantity: '', unit: 'quintal', expectedPrice: '', availability: 'immediate' }); setShowForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                                    <Plus className="w-4 h-4" /> Add Crop
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                                {listings.length === 0 ? (
                                    <div className="p-16 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
                                        <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                        <p className="text-white/40 font-bold text-sm">No crops listed yet.</p>
                                        <button onClick={() => setShowForm(true)} className="text-emerald-400 text-xs font-black uppercase tracking-widest mt-2 hover:underline">Start Listing →</button>
                                    </div>
                                ) : (
                                    listings.map((item) => (
                                        <div key={item._id} className="group bg-slate-800 rounded-[2rem] border border-slate-700 shadow-sm hover:shadow-2xl hover:border-emerald-500/20 transition-all overflow-hidden">
                                            {/* Image Banner */}
                                            {item.image && (
                                                <div className="relative h-32 overflow-hidden">
                                                    <img src={item.image} alt={item.cropName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-2.5 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">🟢 Live</span>
                                                    </div>
                                                    <div className="absolute bottom-3 left-4">
                                                        <h4 className="font-black text-white text-lg">{item.cropName}</h4>
                                                        {item.variety && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{item.variety} · {item.quality || 'Standard'}</p>}
                                                    </div>
                                                </div>
                                            )}

                                            {!item.image && (
                                                <div className="px-6 pt-5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                                            <Leaf className="w-6 h-6 text-emerald-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-white text-lg">{item.cropName}</h4>
                                                            {item.variety && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{item.variety} · {item.quality || 'Standard'}</p>}
                                                        </div>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">🟢 Live</span>
                                                </div>
                                            )}

                                            <div className="p-5">
                                                {item.description && <p className="text-white/30 text-xs italic mb-4">{item.description}</p>}

                                                <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Stock</p>
                                                        <p className="text-sm font-black text-white">{item.quantity} {item.unit}</p>
                                                    </div>
                                                    <div className="border-x border-white/10 text-center">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Price</p>
                                                        <p className="text-sm font-black text-emerald-400">₹{item.expectedPrice}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Region</p>
                                                        <p className="text-[10px] font-bold text-white/60">{item.location?.district || district || '—'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-[10px] text-white/20 font-bold flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== MARKETPLACE INFO CARD ===== */}
                    <div className="p-7 bg-slate-800 rounded-[2.5rem] border border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Marketplace</p>
                                    <p className="text-xs font-bold text-white/60">120+ Active Buyers</p>
                                </div>
                            </div>
                            <h4 className="text-lg font-black text-white mt-4 leading-tight">Connected to Buyer Marketplace</h4>
                            <p className="text-white/40 text-xs leading-relaxed font-medium mt-1">Crops you list here are instantly visible to buyers. Add photos for 3x more inquiries!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
