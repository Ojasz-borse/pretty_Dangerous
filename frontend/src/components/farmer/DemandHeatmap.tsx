'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';

interface HeatmapEntry {
    district: string;
    moisture: number;
    soilTemp: number;
    airTemp: number;
    humidity: number;
    cropHealthIndex: number;
}

const getHealthColor = (score: number) => {
    if (score >= 80) return { bg: '#16a34a', text: 'white', label: 'Excellent' };
    if (score >= 65) return { bg: '#22c55e', text: 'white', label: 'Good' };
    if (score >= 50) return { bg: '#f59e0b', text: 'white', label: 'Moderate' };
    if (score >= 35) return { bg: '#f97316', text: 'white', label: 'Low' };
    return { bg: '#ef4444', text: 'white', label: 'Critical' };
};

export default function DemandHeatmap() {
    const [data, setData] = useState<HeatmapEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<HeatmapEntry | null>(null);
    const [isMock, setIsMock] = useState(false);
    const [metric, setMetric] = useState<'cropHealthIndex' | 'moisture' | 'airTemp' | 'humidity'>('cropHealthIndex');

    const fetchHeatmap = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/farmer/crop-health?type=heatmap');
            const json = await res.json();
            if (json.success) {
                setData(json.data);
                if (json.isMock) setIsMock(true);
            }
        } catch (e) {
            console.error('Heatmap error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHeatmap(); }, []);

    const metricOptions = [
        { key: 'cropHealthIndex' as const, label: 'Crop Health Index', unit: '/100' },
        { key: 'moisture' as const, label: 'Soil Moisture', unit: '%' },
        { key: 'airTemp' as const, label: 'Air Temp', unit: '°C' },
        { key: 'humidity' as const, label: 'Humidity', unit: '%' },
    ];

    const activeMetric = metricOptions.find(m => m.key === metric)!;

    const min = Math.min(...data.map(d => d[metric]));
    const max = Math.max(...data.map(d => d[metric]));
    const normalize = (val: number) => max === min ? 0.5 : (val - min) / (max - min);

    // Color scale: green is high for health/moisture, red is high for temp
    const getBarColor = (val: number) => {
        const n = normalize(val);
        const isInverseMetric = metric === 'airTemp';
        const pct = isInverseMetric ? 1 - n : n;
        if (pct >= 0.75) return '#16a34a';
        if (pct >= 0.5) return '#22c55e';
        if (pct >= 0.25) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) return (
        <div className="card p-10 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Fetching satellite data from Agromonitoring…</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            🛰️ Regional Crop Health Heatmap
                            {isMock && <span className="text-xs font-medium text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">demo data</span>}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Powered by Agromonitoring Satellite API — soil & weather across key agricultural districts</p>
                    </div>
                    <button onClick={fetchHeatmap} className="btn-outline text-xs gap-1.5 self-start sm:self-auto">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>

                {/* Metric selector */}
                <div className="flex flex-wrap gap-2">
                    {metricOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setMetric(opt.key)}
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${metric === opt.key ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map(entry => {
                    const val = entry[metric];
                    const healthStyle = getHealthColor(entry.cropHealthIndex);
                    const barWidth = normalize(val) * 100;

                    return (
                        <div
                            key={entry.district}
                            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${selected?.district === entry.district ? 'ring-2 ring-green-500' : ''}`}
                            onClick={() => setSelected(selected?.district === entry.district ? null : entry)}
                        >
                            {/* Top Color Band */}
                            <div
                                className="h-2 w-full"
                                style={{ backgroundColor: getBarColor(val) }}
                            ></div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold text-slate-800">{entry.district}</span>
                                    </div>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: healthStyle.bg, color: healthStyle.text }}
                                    >
                                        {healthStyle.label}
                                    </span>
                                </div>

                                {/* Primary metric */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>{activeMetric.label}</span>
                                        <span className="font-bold text-slate-700">{val}{activeMetric.unit}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(barWidth, 100)}%`, backgroundColor: getBarColor(val) }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Mini stats row */}
                                <div className="grid grid-cols-3 gap-2 text-center mt-3 pt-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Moisture</p>
                                        <p className="text-xs font-bold text-blue-600">{entry.moisture}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Soil °C</p>
                                        <p className="text-xs font-bold text-orange-500">{entry.soilTemp}°</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Air °C</p>
                                        <p className="text-xs font-bold text-slate-600">{entry.airTemp}°</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Selected district detail */}
            {selected && (
                <div className="card p-6 card-green animate-fade-in">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {selected.district} — Detailed Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Crop Health Index', value: `${selected.cropHealthIndex}/100`, color: 'text-green-600' },
                            { label: 'Soil Moisture', value: `${selected.moisture}%`, color: 'text-blue-600' },
                            { label: 'Soil Temp', value: `${selected.soilTemp}°C`, color: 'text-orange-500' },
                            { label: 'Air Temp', value: `${selected.airTemp}°C`, color: 'text-slate-700' },
                            { label: 'Humidity', value: `${selected.humidity}%`, color: 'text-cyan-600' },
                        ].map((item, i) => (
                            <div key={i} className="card-flat p-3 text-center">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                                <p className={`text-lg font-extrabold ${item.color}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recommendation */}
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800 font-medium">
                        {selected.cropHealthIndex >= 75
                            ? `✅ ${selected.district} shows excellent conditions. Ideal for sowing Rabi crops and applying fertiliser.`
                            : selected.cropHealthIndex >= 50
                                ? `🌤 ${selected.district} conditions are moderate. Monitor soil moisture over the next 7 days.`
                                : `⚠️ ${selected.district} shows sub-optimal crop health. Consider irrigation and soil amendment before planting.`}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="card p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🎨 Health Index Legend</p>
                <div className="flex flex-wrap gap-3">
                    {[
                        { color: '#16a34a', label: 'Excellent (80-100)' },
                        { color: '#22c55e', label: 'Good (65-79)' },
                        { color: '#f59e0b', label: 'Moderate (50-64)' },
                        { color: '#f97316', label: 'Low (35-49)' },
                        { color: '#ef4444', label: 'Critical (<35)' },
                    ].map(item => (
                        <div key={item.color} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
