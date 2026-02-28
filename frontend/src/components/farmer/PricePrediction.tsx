'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Cloud, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import type { PricePrediction, ApiResponse } from '@/types/farmer';

interface PricePredictionProps { cropName: string; district: string; }

const popularCrops = ['Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Groundnut'];

export default function PricePrediction({ cropName, district }: PricePredictionProps) {
    const [selectedCrop, setSelectedCrop] = useState(cropName);
    const [prediction, setPrediction] = useState<PricePrediction | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchPrediction(); }, [selectedCrop]);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ cropName: selectedCrop, district, days: '7' });
            const response = await fetch(`/api/farmer/prediction?${params}`);
            const data: ApiResponse<PricePrediction> = await response.json();
            if (data.success && data.data) setPrediction(data.data);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getRiskBadge = (risk: string) => {
        if (risk === 'Low') return 'badge-green';
        if (risk === 'Medium') return 'badge-amber';
        return 'badge-red';
    };

    const chartData = prediction ? [
        ...prediction.historicalPrices.map(p => ({ date: p.date.slice(5), price: p.price, type: 'Historical' })),
        ...prediction.predictedPrices.map(p => ({ date: p.date.slice(5), price: p.price, type: 'Predicted' }))
    ] : [];

    return (
        <div className="space-y-6">
            <div className="card p-5">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Crop</label>
                        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="select-field w-[200px]">
                            {popularCrops.map((crop) => (<option key={crop} value={crop}>{crop}</option>))}
                        </select>
                    </div>
                    <button onClick={fetchPrediction} className="btn-secondary">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                        Generate Forecast
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : prediction ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Trend', value: prediction.trendDirection, icon: prediction.trendDirection === 'up' ? TrendingUp : prediction.trendDirection === 'down' ? TrendingDown : Minus, color: prediction.trendDirection === 'up' ? 'text-green-600' : prediction.trendDirection === 'down' ? 'text-red-600' : 'text-slate-500', bg: prediction.trendDirection === 'up' ? 'bg-green-50' : prediction.trendDirection === 'down' ? 'bg-red-50' : 'bg-slate-50' },
                            { label: 'Confidence', value: `${prediction.confidence}%`, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Risk Level', value: prediction.riskLevel, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', badge: getRiskBadge(prediction.riskLevel) },
                            { label: 'Weather', value: prediction.weatherImpact.impact, icon: Cloud, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                        ].map((item, i) => (
                            <div key={i} className="stat-card">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}><item.icon className={`w-5 h-5 ${item.color}`} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400">{item.label}</p>
                                        {item.badge ? <span className={`${item.badge}`}>{item.value}</span> : <p className={`font-bold capitalize ${item.color}`}>{item.value}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="card p-6 card-blue">
                        <h3 className="font-bold text-slate-800 mb-1">Price Trend Analysis</h3>
                        <p className="text-xs text-slate-400 mb-4">Historical (7 days) + Predicted (7 days)</p>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}`} stroke="#e2e8f0" />
                                    <Tooltip formatter={(value: any) => [`₹${value}`, 'Price']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
                                    <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} fill="url(#histGrad)" name="Price (₹)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weather */}
                    <div className="card p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Cloud className="w-5 h-5 text-cyan-500" /> Weather Impact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {[
                                { icon: Thermometer, label: 'Temperature', value: `${prediction.weatherImpact.temperature}°C`, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { icon: Droplets, label: 'Humidity', value: `${prediction.weatherImpact.humidity}%`, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { icon: Wind, label: 'Rainfall', value: `${prediction.weatherImpact.rainfall}mm`, color: 'text-slate-500', bg: 'bg-slate-50' },
                            ].map((w, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className={`w-9 h-9 ${w.bg} rounded-lg flex items-center justify-center`}><w.icon className={`w-4 h-4 ${w.color}`} /></div>
                                    <div><p className="text-xs text-slate-400">{w.label}</p><p className="font-semibold text-slate-700">{w.value}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className={`p-4 rounded-xl ${prediction.weatherImpact.impact === 'positive' ? 'bg-green-50 border border-green-200' : prediction.weatherImpact.impact === 'negative' ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                            <p className={`text-sm ${prediction.weatherImpact.impact === 'positive' ? 'text-green-700' : prediction.weatherImpact.impact === 'negative' ? 'text-red-700' : 'text-slate-600'}`}>
                                {prediction.weatherImpact.description}
                            </p>
                        </div>
                    </div>

                    {/* Prediction Table */}
                    <div className="card overflow-hidden">
                        <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-800">Predicted Prices (Next 7 Days)</h3></div>
                        <table className="data-table">
                            <thead><tr><th>Date</th><th className="text-right">Predicted Price</th><th className="text-right">Change</th></tr></thead>
                            <tbody>
                                {prediction.predictedPrices.map((p, idx) => {
                                    const prev = idx === 0 ? prediction.historicalPrices[prediction.historicalPrices.length - 1].price : prediction.predictedPrices[idx - 1].price;
                                    const change = ((p.price - prev) / prev * 100).toFixed(1);
                                    return (
                                        <tr key={p.date}>
                                            <td>{p.date}</td>
                                            <td className="text-right font-semibold text-green-600">₹{p.price.toLocaleString()}</td>
                                            <td className={`text-right font-medium ${parseFloat(change) >= 0 ? 'price-up' : 'price-down'}`}>
                                                {parseFloat(change) >= 0 ? '+' : ''}{change}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="card p-12 text-center border-dashed">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">Select a crop to generate price prediction</p>
                </div>
            )}
        </div>
    );
}
