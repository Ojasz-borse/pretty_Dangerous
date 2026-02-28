'use client';

import React, { useEffect, useState } from 'react';
import { Leaf, Droplets, Thermometer, Wind, CloudSun, RefreshCw, Loader2, Satellite } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface SoilData {
    surfaceTemp: number;
    deepTemp: number;
    moisture: number;
    updatedAt: string | null;
}

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    feelsLike: number;
}

export default function CropHealthPanel() {
    const { district } = useLocation();
    const activeDistrict = district || 'Sirsa';

    const [soil, setSoil] = useState<SoilData | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [soilRes, weatherRes] = await Promise.all([
                fetch(`/api/farmer/crop-health?type=soil&district=${activeDistrict}`),
                fetch(`/api/farmer/crop-health?type=weather&district=${activeDistrict}`),
            ]);
            const soilJson = await soilRes.json();
            const weatherJson = await weatherRes.json();
            if (soilJson.success) { setSoil(soilJson.data); if (soilJson.isMock) setIsMock(true); }
            if (weatherJson.success) setWeather(weatherJson.data);
        } catch (e) {
            console.error('CropHealth fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [activeDistrict]);

    const getMoistureColor = (m: number) => {
        if (m > 55) return 'text-blue-600';
        if (m > 35) return 'text-green-600';
        return 'text-orange-500';
    };

    const getMoistureLabel = (m: number) => m > 55 ? 'Optimal' : m > 35 ? 'Moderate' : 'Low — Irrigation Needed';

    if (loading) return (
        <div className="card p-8 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Fetching satellite data for {activeDistrict}…</p>
        </div>
    );

    return (
        <div className="card p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="section-icon bg-green-50">
                        <Satellite className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Satellite Crop Health</h3>
                        <p className="text-xs text-slate-400">
                            Soil & weather for <span className="font-semibold text-green-600">{activeDistrict}</span>
                            {isMock && <span className="ml-2 text-amber-500 font-semibold">(demo data)</span>}
                        </p>
                    </div>
                </div>
                <button onClick={fetchData} className="btn-outline text-xs gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Weather + Soil Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Temp */}
                <div className="card-flat p-4 text-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{weather?.temp ?? '--'}°C</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Air Temperature</p>
                    {weather?.feelsLike !== undefined && (
                        <p className="text-[10px] text-slate-300 mt-0.5">Feels {weather.feelsLike}°C</p>
                    )}
                </div>

                {/* Humidity */}
                <div className="card-flat p-4 text-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{weather?.humidity ?? '--'}%</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Humidity</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{weather?.description}</p>
                </div>

                {/* Wind */}
                <div className="card-flat p-4 text-center col-span-2 md:col-span-1">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Wind className="w-5 h-5 text-slate-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{weather?.windSpeed ?? '--'} m/s</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Wind Speed</p>
                </div>
            </div>

            {/* Soil Section */}
            {soil && (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-3">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5" /> Soil Analysis
                    </p>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-extrabold text-slate-800">{soil.moisture}%</p>
                            <p className={`text-sm font-bold mt-0.5 ${getMoistureColor(soil.moisture)}`}>
                                {getMoistureLabel(soil.moisture)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Soil Moisture (0–10cm)</p>
                        </div>
                        <div className="text-right space-y-1">
                            <div>
                                <p className="text-xs text-slate-400">Surface Temp</p>
                                <p className="text-sm font-bold text-slate-700">{soil.surfaceTemp}°C</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Deep (10cm)</p>
                                <p className="text-sm font-bold text-slate-700">{soil.deepTemp}°C</p>
                            </div>
                        </div>
                    </div>

                    {/* Moisture bar */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Dry</span><span>Optimal</span><span>Saturated</span>
                        </div>
                        <div className="progress-bar h-3">
                            <div
                                className={`progress-fill h-3 rounded-full transition-all duration-700 ${soil.moisture > 55 ? 'progress-blue' : soil.moisture > 35 ? 'progress-green' : 'progress-amber'}`}
                                style={{ width: `${Math.min(soil.moisture, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advisory Banner */}
            {soil && (
                <div className={`p-4 rounded-xl border text-sm font-medium flex items-start gap-3 ${soil.moisture < 35 ? 'bg-red-50 border-red-200 text-red-700' : soil.moisture > 65 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    <CloudSun className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                        {soil.moisture < 35
                            ? `⚠️ Soil moisture in ${activeDistrict} is critically low (${soil.moisture}%). Irrigation is recommended for wheat and pulse crops.`
                            : soil.moisture > 65
                                ? `💧 Soil is well-saturated in ${activeDistrict} (${soil.moisture}%). Hold off on irrigation to prevent waterlogging.`
                                : `✅ Soil conditions in ${activeDistrict} are optimal (${soil.moisture}%). Good time to plan sowing or fertiliser application.`}
                    </span>
                </div>
            )}
        </div>
    );
}
