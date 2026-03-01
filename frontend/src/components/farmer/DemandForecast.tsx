'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, Calendar, MapPin, Loader2, Info } from 'lucide-react';
import type { DemandForecast, ApiResponse } from '@/types/farmer';
import CropHealthPanel from './CropHealthPanel';
import DemandHeatmap from './DemandHeatmap';

interface DemandForecastProps { district: string; state: string; }

export default function DemandForecast({ district, state }: DemandForecastProps) {
    const [forecast, setForecast] = useState<DemandForecast | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchForecast(); }, []);

    const fetchForecast = async () => {
        try {
            const params = new URLSearchParams({ district, state });
            const response = await fetch(`/api/farmer/demand?${params}`);
            const data: ApiResponse<DemandForecast> = await response.json();
            if (data.success && data.data) setForecast(data.data);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getDemandColor = (score: number) => {
        if (score >= 80) return 'progress-green';
        if (score >= 60) return 'progress-blue';
        if (score >= 40) return 'progress-amber';
        return 'progress-purple';
    };

    if (loading) return <div className="card p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>;
    if (!forecast) return (
        <div className="card p-12 text-center text-slate-400 italic">
            Authentic demand forecast data is currently unavailable.
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Demand Meter */}
            <div className="card p-6 card-purple">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Overall Demand Meter</h3>
                        <p className="text-sm text-slate-400">
                            Seasonal Trend: <span className={`font-semibold ${forecast.seasonalTrend === 'increasing' ? 'text-green-600' : forecast.seasonalTrend === 'decreasing' ? 'text-red-600' : 'text-slate-600'}`}>
                                {forecast.seasonalTrend}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full border-4 border-purple-200 flex items-center justify-center bg-purple-50">
                            <span className="text-2xl font-bold text-purple-600">{forecast.demandMeter}</span>
                        </div>
                        <span className="text-sm text-slate-400">/100</span>
                    </div>
                </div>
            </div>

            {/* Top Crops */}
            <div className="card overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Top Crops by Demand</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Ranked by current market demand score</p>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Crop</th>
                            <th>Demand Score</th>
                            <th>Trend</th>
                            <th>Change</th>
                            <th>Volume (Qtl)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecast.topCrops.map((crop) => (
                            <tr key={crop.rank}>
                                <td><span className="w-7 h-7 bg-slate-100 rounded-lg inline-flex items-center justify-center font-bold text-sm text-slate-600">#{crop.rank}</span></td>
                                <td className="font-semibold text-slate-800">{crop.cropName}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="progress-bar flex-1" style={{ maxWidth: '100px' }}><div className={`progress-fill ${getDemandColor(crop.demandScore)}`} style={{ width: `${crop.demandScore}%` }}></div></div>
                                        <span className="font-semibold text-sm text-slate-700">{crop.demandScore}</span>
                                    </div>
                                </td>
                                <td>
                                    {crop.trend === 'up' && <span className="price-badge-up flex items-center gap-1 w-fit"><TrendingUp className="w-3 h-3" /> Up</span>}
                                    {crop.trend === 'down' && <span className="price-badge-down flex items-center gap-1 w-fit"><TrendingDown className="w-3 h-3" /> Down</span>}
                                    {crop.trend === 'stable' && <span className="price-badge-stable flex items-center gap-1 w-fit"><Minus className="w-3 h-3" /> Stable</span>}
                                </td>
                                <td className={`font-medium ${crop.changePercent >= 0 ? 'price-up' : 'price-down'}`}>
                                    {crop.changePercent >= 0 ? '+' : ''}{crop.changePercent}%
                                </td>
                                <td className="text-slate-500">{crop.arrivalVolume.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Festival + Regional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Festivals */}
                <div className="card p-6 card-orange">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-500" /> Upcoming Festivals
                    </h3>
                    <div className="space-y-3">
                        {forecast.upcomingFestivals.map((fest, i) => (
                            <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-slate-800">{fest.name}</p>
                                        <p className="text-xs text-slate-400">{new Date(fest.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="badge-green">+{fest.expectedDemandIncrease}% demand</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {fest.cropsImpacted.map((c) => (<span key={c} className="badge-amber text-xs">{c}</span>))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regional */}
                <div className="card p-6 card-blue">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" /> Regional Demand
                    </h3>
                    <div className="space-y-3">
                        {forecast.regionalInsights.map((region, i) => (
                            <div key={i} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-slate-800">{region.district}, {region.state}</p>
                                    <span className="font-bold text-blue-600">{region.demandScore}/100</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {region.highDemandCrops.map((c) => (<span key={c} className="badge-blue text-xs">{c}</span>))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== SATELLITE CROP HEALTH (Agromonitoring API) ===== */}
            <CropHealthPanel />

            {/* ===== DEMAND HEATMAP ===== */}
            <DemandHeatmap />
        </div>
    );
}
