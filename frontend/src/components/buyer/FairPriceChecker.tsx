'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Info, Scale, CheckCircle2 } from 'lucide-react';

export default function FairPriceChecker() {
    const [crop, setCrop] = useState('');
    const [location, setLocation] = useState('');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Card */}
                <div className="card card-green lg:col-span-1 h-fit">
                    <div className="p-6">
                        <div className="section-header">
                            <div className="section-icon bg-green-50">
                                <Scale className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Fair Price Intel</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Select Crop</label>
                                <input
                                    placeholder="e.g., Wheat, Mustard..."
                                    className="input-field"
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                />
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
                            <button className="btn-primary w-full justify-center mt-4">
                                Check Fair Range
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className="card lg:col-span-2">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Fair Trade <span className="text-green-600">Index</span></h2>
                                <p className="text-slate-500 text-sm font-medium">Verified price range from live market feeds and regional demand data.</p>
                            </div>
                            <div className="bg-green-50 px-5 py-3 rounded-2xl border border-green-200 text-center">
                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-0.5">Status</p>
                                <div className="flex items-center gap-1.5 text-green-700 font-bold">
                                    <TrendingUp className="w-4 h-4" />
                                    Bullish
                                </div>
                            </div>
                        </div>

                        {/* Price Range Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: 'Min Fair Price', value: '₹2,350', color: 'text-red-600', border: 'card-red' },
                                { label: 'Mid-Point (Avg)', value: '₹2,450', color: 'text-green-600', border: 'card-green' },
                                { label: 'Max Fair Price', value: '₹2,580', color: 'text-blue-600', border: 'card-blue' }
                            ].map((stat, i) => (
                                <div key={i} className={`card ${stat.border} p-5 text-center`}>
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Insight Banner */}
                        <div className="hero-banner p-5 flex items-center justify-between gap-4">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <Info className="w-5 h-5 text-green-300" />
                                </div>
                                <div>
                                    <h4 className="font-bold flex items-center gap-2 text-sm">
                                        Market Insight
                                        <span className="badge-green text-[10px] px-2 py-0.5">LIVE</span>
                                    </h4>
                                    <p className="text-xs text-white/80">Supply in Sirsa region is expected to drop by 15% next week. Current prices are optimal for bulk purchase.</p>
                                </div>
                            </div>
                            <button className="btn-outline bg-white/10 border-white/20 text-white hover:bg-white/20 hidden sm:flex whitespace-nowrap">
                                Detail Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
