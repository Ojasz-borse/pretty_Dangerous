'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, TrendingUp, BarChart3, Target } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLocation } from '@/context/LocationContext';

interface InsightsData {
    priceTrends: any[];
    demandSupply: any[];
    qualityScores: any[];
    summary: string;
}

export default function InnovationPanel() {
    const { district } = useLocation();
    const [data, setData] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState('');

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true);
            try {
                const loc = district || 'Sirsa';
                const res = await fetch(`/api/farmer/gemini?type=market-insights&district=${encodeURIComponent(loc)}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                    setSource(json.source);
                }
            } catch (e) {
                console.error('Insights error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [district]);

    if (loading) return (
        <div className="card p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading AI insights...</p>
        </div>
    );

    if (!data) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="card card-3d p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">
                                AI Market <span className="gradient-text">Intelligence</span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                {source === 'gemini' ? '✨ Powered by Gemini AI' : 'Market analytics for smart procurement'}
                            </p>
                        </div>
                    </div>
                    {source === 'gemini' && (
                        <span className="badge-green text-xs font-bold px-3 py-1 rounded-full pulse-glow">✨ Live Gemini Data</span>
                    )}
                </div>
            </div>

            {/* Summary Banner */}
            <div className="hero-banner p-6">
                <div className="relative z-10">
                    <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-2">📊 Market Summary</p>
                    <p className="text-white/90 text-sm leading-relaxed font-medium">{data.summary}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart - Price Trends */}
                <div className="card card-3d p-6 animate-slide-in-left">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-slate-800">Price Trends (6 Months)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={data.priceTrends}>
                            <defs>
                                <linearGradient id="wheatGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="cottonGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Area type="monotone" dataKey="wheat" stroke="#16a34a" fill="url(#wheatGrad)" strokeWidth={2.5} name="Wheat (₹/qtl)" />
                            <Area type="monotone" dataKey="rice" stroke="#2563eb" fill="url(#riceGrad)" strokeWidth={2.5} name="Rice (₹/qtl)" />
                            <Area type="monotone" dataKey="cotton" stroke="#7c3aed" fill="url(#cottonGrad)" strokeWidth={2.5} name="Cotton (₹/qtl)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar Chart - Quality Scores */}
                <div className="card card-3d p-6 animate-slide-in-right">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-slate-800">Regional Quality Scores</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={data.qualityScores}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Radar name="Quality" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Demand vs Supply */}
                <div className="card card-3d p-6 lg:col-span-2 animate-slide-up">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-800">Demand vs Supply Analysis</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.demandSupply} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="crop" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Bar dataKey="demand" fill="#16a34a" radius={[8, 8, 0, 0]} name="Demand %" />
                            <Bar dataKey="supply" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Supply %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Most In-Demand', value: data.demandSupply.sort((a: any, b: any) => b.demand - a.demand)[0]?.crop || 'Wheat', color: 'text-green-600', bg: 'bg-green-50 card-green' },
                    { label: 'Supply Shortage', value: data.demandSupply.filter((d: any) => d.demand > d.supply).length + ' crops', color: 'text-red-600', bg: 'bg-red-50 card-red' },
                    { label: 'Quality Score', value: Math.round(data.qualityScores.reduce((s: number, q: any) => s + q.value, 0) / data.qualityScores.length) + '/100', color: 'text-purple-600', bg: 'bg-purple-50 card-purple' },
                    { label: 'Price Trend', value: '↑ Rising', color: 'text-blue-600', bg: 'bg-blue-50 card-blue' },
                ].map((stat, i) => (
                    <div key={i} className={`stat-card card-3d ${stat.bg} animate-slide-up stagger-${i + 1}`}>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
