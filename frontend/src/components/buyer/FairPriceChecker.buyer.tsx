'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Minus, Scale, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface FairPriceData {
    minPrice: number;
    avgPrice: number;
    maxPrice: number;
    trend: string;
    confidence: number;
    insight: string;
    recommendation: string;
}

export default function FairPriceChecker() {
    const { district } = useLocation();
    const [crop, setCrop] = useState('Wheat');
    const [location, setLocation] = useState(district || 'Sirsa');
    const [data, setData] = useState<FairPriceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState('');

    const checkPrice = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/farmer/gemini?type=fair-price&crop=${encodeURIComponent(crop)}&district=${encodeURIComponent(location)}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setSource(json.source);
            }
        } catch (e) {
            console.error('Fair price check error:', e);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'bullish') return <TrendingUp className="w-4 h-4" />;
        if (trend === 'bearish') return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };
    const getTrendColor = (trend: string) => {
        if (trend === 'bullish') return 'text-green-600 bg-green-50 border-green-200';
        if (trend === 'bearish') return 'text-red-600 bg-red-50 border-red-200';
        return 'text-slate-600 bg-slate-50 border-slate-200';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Card */}
                <div className="card card-green card-3d lg:col-span-1 h-fit">
                    <div className="p-6">
                        <div className="section-header">
                            <div className="section-icon bg-green-50 pulse-glow">
                                <Scale className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Fair Price Intel</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> Powered by Gemini AI
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Select Crop</label>
                                <select
                                    className="input-field"
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                >
                                    {['Wheat', 'Rice', 'Cotton', 'Mustard', 'Maize', 'Onion', 'Soybean', 'Sugarcane'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Mandi / District</label>
                                <input
                                    placeholder="e.g., Sirsa, Karnal..."
                                    className="input-field"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <button onClick={checkPrice} disabled={loading} className="btn-primary w-full justify-center mt-4 pulse-glow">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {loading ? 'Analyzing...' : 'Check Fair Range'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className="card card-3d lg:col-span-2">
                    <div className="p-6 sm:p-8">
                        {!data && !loading ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                                    <Scale className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">AI Fair Price Analysis</h3>
                                <p className="text-slate-400 text-sm max-w-sm mx-auto">Select a crop and district, then click "Check Fair Range" to get AI-powered price Intelligence.</p>
                            </div>
                        ) : loading ? (
                            <div className="text-center py-12 animate-scale-in">
                                <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">Analyzing market data for {crop} in {location}...</p>
                                <p className="text-xs text-slate-400 mt-1">Checking mandi prices, seasonal trends, and demand patterns</p>
                            </div>
                        ) : data && (
                            <div className="animate-slide-up">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                                    <div className="text-center md:text-left">
                                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                                            <span className="gradient-text">{crop}</span> Fair Trade Index
                                        </h2>
                                        <p className="text-slate-500 text-sm font-medium">
                                            AI analysis for {location}
                                            {source === 'gemini' && <span className="ml-2 badge-green text-[10px]">✨ Gemini AI</span>}
                                            {source === 'mock' && <span className="ml-2 text-amber-500 text-xs font-semibold">(demo data)</span>}
                                        </p>
                                    </div>
                                    <div className={`px-5 py-3 rounded-2xl border text-center ${getTrendColor(data.trend)}`}>
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5">Market Trend</p>
                                        <div className="flex items-center gap-1.5 font-bold capitalize">
                                            {getTrendIcon(data.trend)}
                                            {data.trend}
                                        </div>
                                    </div>
                                </div>

                                {/* Price Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: 'Min Fair Price', value: `₹${data.minPrice.toLocaleString()}`, sub: '/quintal', color: 'text-red-600', border: 'card-red' },
                                        { label: 'Avg Price (Best Buy)', value: `₹${data.avgPrice.toLocaleString()}`, sub: '/quintal', color: 'text-green-600', border: 'card-green' },
                                        { label: 'Max Fair Price', value: `₹${data.maxPrice.toLocaleString()}`, sub: '/quintal', color: 'text-blue-600', border: 'card-blue' }
                                    ].map((stat, i) => (
                                        <div key={i} className={`card ${stat.border} card-3d p-5 text-center animate-slide-up stagger-${i + 1}`}>
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                                            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}<span className="text-xs text-slate-400 font-medium">{stat.sub}</span></p>
                                        </div>
                                    ))}
                                </div>

                                {/* Confidence + Insight */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-14 h-14 rounded-full border-4 border-green-200 flex items-center justify-center bg-green-50 flex-shrink-0">
                                            <span className="text-lg font-extrabold text-green-600">{data.confidence}%</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Confidence Score</p>
                                            <p className="text-sm text-slate-600 mt-0.5">{data.insight}</p>
                                        </div>
                                    </div>

                                    <div className="hero-banner p-5 flex items-start gap-4">
                                        <div className="relative z-10 flex items-start gap-4 w-full">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-5 h-5 text-green-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                                                    AI Recommendation
                                                    <span className="badge-green text-[10px] px-2 py-0.5">LIVE</span>
                                                </h4>
                                                <p className="text-xs text-white/80">{data.recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
