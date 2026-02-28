'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Clock, Package, IndianRupee, AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import type { SellRecommendation as SellRec, ApiResponse } from '@/types/farmer';

interface SellRecommendationProps { cropName: string; district: string; }

const popularCrops = ['Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Sugarcane', 'Maize'];

export default function SellRecommendation({ cropName, district }: SellRecommendationProps) {
    const [selectedCrop, setSelectedCrop] = useState(cropName);
    const [quantity, setQuantity] = useState('50');
    const [storageCost, setStorageCost] = useState('10');
    const [recommendation, setRecommendation] = useState<SellRec | null>(null);
    const [loading, setLoading] = useState(false);

    // Recommendation only on manual trigger
    // useEffect(() => { fetchRecommendation(); }, [selectedCrop]);

    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/farmer/sell-recommendation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cropName: selectedCrop, quantity: parseInt(quantity), storageCostPerDay: parseInt(storageCost) })
            });
            const data: ApiResponse<SellRec> = await response.json();
            if (data.success && data.data) setRecommendation(data.data);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className="card p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop</label>
                        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="select-field w-full">
                            {popularCrops.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity (Quintals)</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Cost (₹/day/qtl)</label>
                        <input type="number" value={storageCost} onChange={(e) => setStorageCost(e.target.value)} className="input-field" />
                    </div>
                </div>
                <button onClick={fetchRecommendation} className="btn-primary mt-4" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />} Get Recommendation
                </button>
            </div>

            {loading ? (
                <div className="card p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
            ) : recommendation && (
                <>
                    {/* Big Recommendation Banner */}
                    <div className={`card overflow-hidden ${recommendation.recommendation === 'SELL_NOW' ? 'card-green' : 'card-amber'}`}>
                        <div className={`p-8 text-center ${recommendation.recommendation === 'SELL_NOW' ? 'bg-green-50' : 'bg-amber-50'}`}>
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${recommendation.recommendation === 'SELL_NOW' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                {recommendation.recommendation === 'SELL_NOW' ? <CheckCircle className="w-8 h-8 text-white" /> : <Clock className="w-8 h-8 text-white" />}
                            </div>
                            <h2 className={`text-3xl font-bold mb-2 ${recommendation.recommendation === 'SELL_NOW' ? 'text-green-700' : 'text-amber-700'}`}>
                                {recommendation.recommendation === 'SELL_NOW' ? '✅ SELL NOW' : '⏳ WAIT'}
                            </h2>
                            {recommendation.waitDays && (
                                <p className="text-lg text-amber-600 font-medium">Wait {recommendation.waitDays} more days for better price</p>
                            )}
                            <p className="text-slate-600 mt-2 max-w-md mx-auto">{recommendation.reason}</p>
                        </div>
                    </div>

                    {/* Analysis Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Current Price', value: `₹${recommendation.currentPrice}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Predicted Price', value: `₹${recommendation.predictedPrice}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Expected Gain', value: `₹${recommendation.expectedGain}`, icon: TrendingUp, color: recommendation.expectedGain >= 0 ? 'text-green-600' : 'text-red-600', bg: recommendation.expectedGain >= 0 ? 'bg-green-50' : 'bg-red-50' },
                            { label: 'Risk Level', value: recommendation.riskLevel, icon: AlertTriangle, color: recommendation.riskLevel === 'Low' ? 'text-green-600' : recommendation.riskLevel === 'Medium' ? 'text-amber-600' : 'text-red-600', bg: recommendation.riskLevel === 'Low' ? 'bg-green-50' : recommendation.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-red-50' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
                                <p className="text-xs text-slate-400">{stat.label}</p>
                                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Profit Breakdown */}
                    <div className="card p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Profit Analysis</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Demand Index', value: `${recommendation.demandIndex}/100`, pct: recommendation.demandIndex, color: 'progress-blue' },
                                { label: 'Storage Cost (total)', value: `₹${recommendation.storageCost}`, pct: Math.min(recommendation.storageCost / 10, 100), color: 'progress-amber' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">{item.label}</span>
                                        <span className="font-semibold text-slate-700">{item.value}</span>
                                    </div>
                                    <div className="progress-bar"><div className={`progress-fill ${item.color}`} style={{ width: `${item.pct}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                        <div className="separator"></div>
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                            <span className="font-semibold text-slate-700">Net Profit</span>
                            <span className="text-2xl font-bold text-green-600">₹{recommendation.netProfit.toLocaleString()}</span>
                        </div>
                    </div>
                </>
            )}

            {/* How it Works Section */}
            <div className="card p-8 bg-gradient-to-br from-slate-50 to-white border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">How our Recommendation Engine Works</h3>
                        <p className="text-sm text-slate-500 font-medium">Transparency in every decision</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: 'Market Intelligence',
                            desc: 'We fetch real-time crop prices directly from Government of India (data.gov.in) open data portals to ensure accuracy.',
                            icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50'
                        },
                        {
                            title: 'ML Price Prediction',
                            desc: 'Our Facebook Prophet models analyze historical seasonality and trends to forecast tomorrow\'s market value.',
                            icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50'
                        },
                        {
                            title: 'Demand Analysis',
                            desc: 'We calculate a Demand Index (0-100) based on market arrival volumes, representing current buyer interest.',
                            icon: TrendingDown, color: 'text-amber-500', bg: 'bg-amber-50'
                        },
                        {
                            title: 'Economic Net Profit',
                            desc: 'The final advice accounts for your storage costs and the "Wait Utility" vs immediate selling potential.',
                            icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-50'
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white/50 hover:shadow-md transition-shadow">
                            <div className={`shrink-0 w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
