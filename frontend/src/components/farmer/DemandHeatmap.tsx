'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface DemandEntry {
    district: string;
    suitability: number;
    demandScore: number;
    avgPrice: number;
    recommendation: string;
    trend: string;
}

const getSuitabilityColor = (score: number) => {
    if (score >= 80) return { bg: '#16a34a', text: 'white', label: 'Excellent' };
    if (score >= 65) return { bg: '#22c55e', text: 'white', label: 'Good' };
    if (score >= 50) return { bg: '#f59e0b', text: 'white', label: 'Moderate' };
    if (score >= 35) return { bg: '#f97316', text: 'white', label: 'Low' };
    return { bg: '#ef4444', text: 'white', label: 'Unsuitable' };
};

export default function DemandHeatmap() {
    const [data, setData] = useState<DemandEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [selected, setSelected] = useState<DemandEntry | null>(null);
    const [source, setSource] = useState('');

    const fetchDemand = async (crop: string) => {
        setLoading(true);
        setSelected(null);
        try {
            const res = await fetch(`/api/farmer/gemini?type=crop-demand&crop=${encodeURIComponent(crop)}`);
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                setSource(json.source);
            }
        } catch (e) {
            console.error('Heatmap error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDemand(selectedCrop); }, []);

    const handleCropChange = (crop: string) => {
        setSelectedCrop(crop);
        fetchDemand(crop);
    };

    const sortedData = [...data].sort((a, b) => b.suitability - a.suitability);

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
        if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
        return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header + Crop Selector */}
            <div className="card p-5 card-3d">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                            🛰️ <span className="gradient-text">{selectedCrop}</span> Demand Heatmap
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            {source === 'gemini' ? <><Sparkles className="w-3 h-3 text-amber-500" /> AI-powered analysis by Gemini</> : 'Crop demand across key agricultural districts'}
                        </p>
                    </div>
                    <button onClick={() => fetchDemand(selectedCrop)} className="btn-outline text-xs gap-1.5 self-start sm:self-auto">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>

                {/* Crop Selector Chips */}
                <div className="flex flex-wrap gap-2">
                    {['Wheat', 'Rice', 'Cotton', 'Mustard', 'Maize', 'Onion', 'Soybean', 'Sugarcane'].map(crop => (
                        <button
                            key={crop}
                            onClick={() => handleCropChange(crop)}
                            className={`text-xs px-4 py-2 rounded-full font-bold border transition-all ${selectedCrop === crop
                                ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200 scale-105'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:scale-105'
                                }`}
                        >
                            {crop}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="card p-10 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                    <p className="text-sm text-slate-400 font-medium">Analyzing {selectedCrop} demand with AI…</p>
                </div>
            ) : (
                <>
                    {/* Gemini badge */}
                    {source === 'gemini' && (
                        <div className="flex items-center justify-center gap-2 py-2">
                            <span className="badge-green text-xs font-bold px-3 py-1 rounded-full pulse-glow flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Live Gemini AI Data
                            </span>
                        </div>
                    )}

                    {/* Heatmap Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedData.map((entry, i) => {
                            const style = getSuitabilityColor(entry.suitability);

                            return (
                                <div
                                    key={entry.district}
                                    className={`card card-3d cursor-pointer overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 6)} ${selected?.district === entry.district ? 'ring-2 ring-green-500' : ''}`}
                                    onClick={() => setSelected(selected?.district === entry.district ? null : entry)}
                                >
                                    <div className="h-2 w-full" style={{ backgroundColor: style.bg }}></div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-800">{entry.district}</span>
                                            </div>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.text }}>
                                                {style.label}
                                            </span>
                                        </div>

                                        {/* Suitability Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                <span>{selectedCrop} Suitability</span>
                                                <span className="font-bold text-slate-700">{entry.suitability}/100</span>
                                            </div>
                                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(entry.suitability, 100)}%`, backgroundColor: style.bg }}></div>
                                            </div>
                                        </div>

                                        {/* Mini Stats */}
                                        <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Demand</p>
                                                <p className="text-xs font-bold text-blue-600">{entry.demandScore}/100</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Price</p>
                                                <p className="text-xs font-bold text-green-600">₹{entry.avgPrice?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Trend</p>
                                                <div className="flex items-center justify-center gap-0.5">
                                                    {getTrendIcon(entry.trend)}
                                                    <span className="text-xs font-bold capitalize text-slate-600">{entry.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected District Detail */}
                    {selected && (
                        <div className="card p-6 card-green animate-scale-in">
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                {selected.district} — {selectedCrop} Analysis
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {[
                                    { label: 'Suitability', value: `${selected.suitability}/100`, color: 'text-green-600' },
                                    { label: 'Demand Score', value: `${selected.demandScore}/100`, color: 'text-blue-600' },
                                    { label: 'Avg Price', value: `₹${selected.avgPrice?.toLocaleString()}`, color: 'text-amber-600' },
                                    { label: 'Trend', value: selected.trend?.toUpperCase(), color: selected.trend === 'up' ? 'text-green-600' : selected.trend === 'down' ? 'text-red-600' : 'text-slate-600' },
                                ].map((item, i) => (
                                    <div key={i} className="card-flat p-3 text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                                        <p className={`text-lg font-extrabold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800 font-medium">
                                💡 {selected.recommendation}
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="card p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🎨 {selectedCrop} Suitability Legend</p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { color: '#16a34a', label: 'Excellent (80-100)' },
                                { color: '#22c55e', label: 'Good (65-79)' },
                                { color: '#f59e0b', label: 'Moderate (50-64)' },
                                { color: '#f97316', label: 'Low (35-49)' },
                                { color: '#ef4444', label: 'Unsuitable (<35)' },
                            ].map(item => (
                                <div key={item.color} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
