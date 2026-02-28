'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
    Camera, Upload, CheckCircle2, AlertCircle, Loader2, Package,
    Tag, IndianRupee, BarChart4, Trash2, Globe, Clock, Plus,
    ExternalLink, Star, Leaf, Scan, Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

interface CropListing {
    _id: string;
    cropName: string;
    quantity: number;
    unit: string;
    expectedPrice: number;
    availability: string;
    status: string;
    createdAt: string;
}

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

    const [formData, setFormData] = useState({
        cropName: '',
        quantity: '',
        unit: 'kg',
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
            setPreview(URL.createObjectURL(selected));
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
        // Simulate AI Analysis
        setTimeout(() => {
            const detectedCrop = "Premium Wheat (Sharbati)";
            setResult({
                crop: detectedCrop,
                confidence: "98.4%",
                quality: "Grade A+",
                health: "Excellent",
                estimatedYield: "4.2 Tons/Hectare"
            });
            setIsAnalyzing(false);
            setFormData(prev => ({ ...prev, cropName: 'Wheat' }));
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
                    quantity: Number(formData.quantity),
                    unit: formData.unit,
                    expectedPrice: Number(formData.expectedPrice),
                    availability: formData.availability
                }),
            });

            if (res.ok) {
                await fetchMyCrops();
                setFormData({
                    cropName: '',
                    quantity: '',
                    unit: 'kg',
                    expectedPrice: '',
                    availability: 'immediate',
                });
                setShowForm(false);
                setResult(null);
                setPreview(null);
                setFile(null);
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
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left: AI Scanner */}
                <div className="space-y-8">
                    <div className="section-card p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 shadow-2xl relative overflow-hidden group rounded-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-green-500/20 transition-all duration-700"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                                <Scan className="w-6 h-6 text-green-400" />
                                Crop AI Scanner
                            </h2>
                            <p className="text-slate-400 font-medium mb-8">Instant quality assessment & market valuation using computer vision.</p>

                            <div
                                className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-green-500/50 bg-black/40' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}
                                onClick={() => !preview && fileInputRef.current?.click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-white font-black tracking-widest uppercase text-[10px] animate-pulse">Neural Processing...</p>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 right-4 flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setResult(null); }} className="p-2 bg-red-500/20 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="cursor-pointer flex flex-col items-center justify-center p-12">
                                        <div className="w-16 h-16 bg-slate-700 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <span className="text-white font-bold mb-1">Click to Upload</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider text-center px-8">Supports High Detail JPG/PNG</span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </div>

                            <button
                                onClick={analyzeImage}
                                disabled={!file || isAnalyzing}
                                className="btn-primary w-full mt-8 py-4 text-sm font-black tracking-widest justify-center shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:grayscale transition-all"
                            >
                                {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Scan className="w-5 h-5" /> Start AI Analysis</>}
                            </button>
                        </div>
                    </div>

                    {/* Result Panel */}
                    {result && (
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl animate-scale-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                    <Star className="w-5 h-5 text-green-600" /> Analysis Result
                                </h3>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Confidence</p>
                                    <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{result.confidence}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Commodity', val: result.crop, icon: Leaf },
                                    { label: 'AI Grade', val: result.quality, icon: Award },
                                    { label: 'Maturity', val: result.health, icon: CheckCircle2 },
                                    { label: 'Forecast', val: result.estimatedYield, icon: BarChart4 },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-green-500/20 transition-all">
                                        <item.icon className="w-4 h-4 text-green-600 mb-2" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-slate-800 italic">"{item.val}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Listings */}
                <div className="space-y-8">
                    {showForm ? (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight uppercase tracking-tighter">📦 Marketplace Listing</h3>
                                    <p className="text-slate-500 font-medium text-sm">Convert your produce into a digital asset.</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">
                                    <Plus className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAddListing} className="space-y-5">
                                {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 mb-4">{error}</div>}

                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Crop Name</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                                            <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="e.g. Sharbati Wheat" value={formData.cropName} onChange={e => setFormData({ ...formData, cropName: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Volume</label>
                                            <div className="relative">
                                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                                                <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="0.00" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Metric</label>
                                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                                                <option value="kg">Kilograms (kg)</option>
                                                <option value="quintal">Quintals (q)</option>
                                                <option value="ton">Tons (t)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Asking Price (Per Unit)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                                            <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="₹ 0.00" value={formData.expectedPrice} onChange={e => setFormData({ ...formData, expectedPrice: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary w-full py-4 text-xs font-black tracking-widest justify-center shadow-lg shadow-green-600/20 uppercase"
                                >
                                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Launch Listing'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Inventory</h3>
                                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/10">
                                    <Plus className="w-4 h-4" /> New Crop
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {listings.length === 0 ? (
                                    <div className="p-16 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold text-sm">Your digital barn is empty.</p>
                                        <button onClick={() => setShowForm(true)} className="text-green-600 text-xs font-black uppercase tracking-widest mt-2 hover:underline">Start Listing</button>
                                    </div>
                                ) : (
                                    listings.map((item) => (
                                        <div key={item._id} className="group p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-green-600/20 transition-all border-l-4 border-l-green-600">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-all duration-500">
                                                        <Leaf className="w-7 h-7 text-green-600 group-hover:text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800 text-lg group-hover:text-green-700 transition-all">{item.cropName}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDelete(item._id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">In Stock</p>
                                                    <p className="text-sm font-black text-slate-800 text-center">{item.quantity} {item.unit}</p>
                                                </div>
                                                <div className="border-x border-slate-200">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Unit Price</p>
                                                    <p className="text-sm font-black text-green-700 text-center">₹{item.expectedPrice}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Status</p>
                                                    <p className="text-[10px] font-black text-blue-600 uppercase text-center flex items-center justify-center gap-1">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                                        Live
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-green-600/20 transition-all duration-1000"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Globe className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Network Visibility</p>
                                    <p className="text-xs font-bold">120+ Active Buyers</p>
                                </div>
                            </div>
                            <h4 className="text-lg font-black leading-tight mb-2">Connected to Digital Bharat Mandi</h4>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">Your crops are automatically synchronized with the buyer marketplace. Ensure image quality for 3x higher inquiries.</p>
                            <Link href="#" className="inline-flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest mt-6 hover:gap-3 transition-all no-underline">
                                Strategic Partnership Info <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
