'use client';

import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Minus,
    Search,
    Loader2,
    Filter
} from 'lucide-react';
import type { CropPrice, ApiResponse } from '@/types/farmer';
import { useLocation } from '@/context/LocationContext';
import { locationData, cropOptions } from '@/data/locationData';

interface RealTimePriceProps {
    selectedCrop: string;
    setSelectedCrop: (crop: string) => void;
    district?: string; // kept for backwards compat but context takes priority
}

export default function RealTimePrice({ selectedCrop, setSelectedCrop }: RealTimePriceProps) {
    const [fullFilterTree, setFullFilterTree] = useState<any>(null);
    const [priceData, setPriceData] = useState<CropPrice | null>(null);
    const [historyData, setHistoryData] = useState<any[]>([]); // Real historical data

    // Initialise local filter state
    const [filterState, setFilterState] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [filterMandi, setFilterMandi] = useState('');
    const [filterCrop, setFilterCrop] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await fetch('/api/filters');
                const json = await res.json();
                if (json.success) setFullFilterTree(json.data);
            } catch (err) {
                console.error("Failed to load filters", err);
            }
        };
        fetchFilters();
    }, []);

    const fetchSelectedPriceAndHistory = async () => {
        if (!filterState || !filterDistrict || !filterMandi || !filterCrop) return;

        setLoading(true);
        try {
            // 1. Fetch current price
            const priceUrl = `/api/farmer/price?state=${encodeURIComponent(filterState)}&district=${encodeURIComponent(filterDistrict)}&market=${encodeURIComponent(filterMandi)}&cropName=${encodeURIComponent(filterCrop)}`;
            const priceRes = await fetch(priceUrl);
            const priceJson = await priceRes.json();

            if (priceJson.success && priceJson.data && priceJson.data.length > 0) {
                setPriceData(priceJson.data[0]);
                setSelectedCrop(filterCrop);
            } else {
                setPriceData(null);
            }

            // 2. Fetch history for trend graph
            const historyUrl = `/api/farmer/history?crop=${encodeURIComponent(filterCrop)}&mandi=${encodeURIComponent(filterMandi)}&days=30`;
            const historyRes = await fetch(historyUrl);
            const historyJson = await historyRes.json();

            if (historyJson.success && historyJson.data) {
                // Map to format suitable for Recharts area chart
                const formattedHistory = historyJson.data.map((item: any) => ({
                    day: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    price: item.close || item.modalPrice || 0,
                    rawDate: item.date
                }));
                setHistoryData(formattedHistory);
            } else {
                setHistoryData([]);
            }
        } catch (err) {
            console.error("Data fetch failed", err);
            setPriceData(null);
            setHistoryData([]);
        } finally {
            setLoading(false);
        }
    };

    // Note: Removed automatic fetch on filter change to satisfy "Fetch Data" button requirement
    // but we can still show a placeholder if no data is fetched yet.

    // Helpers to get curated options
    const stateOptions = fullFilterTree ? Object.keys(fullFilterTree).sort() : [];
    const districtOptions = (fullFilterTree && filterState) ? Object.keys(fullFilterTree[filterState] || {}).sort() : [];
    const mandiOptions = (fullFilterTree && filterState && filterDistrict) ? Object.keys(fullFilterTree[filterState][filterDistrict] || {}).sort() : [];
    const curatedCrops = (fullFilterTree && filterState && filterDistrict && filterMandi) ? (fullFilterTree[filterState][filterDistrict][filterMandi] || []).sort() : [];

    const filteredPrices = priceData ? [priceData] : [];
    const selectedPrice = priceData;

    return (
        <div className="space-y-6">
            {/* ===== SEQUENTIAL 4-FILTER ROW ===== */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-slate-700">Market Price Selection</span>
                    <span className="text-xs text-slate-400">(Select in order: State → District → Mandi → Crop)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. State */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">1. State</label>
                        <select
                            value={filterState}
                            onChange={e => {
                                setFilterState(e.target.value);
                                setFilterDistrict('');
                                setFilterMandi('');
                                setFilterCrop('');
                            }}
                            className="select-field w-full"
                        >
                            <option value="">Select State</option>
                            {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* 2. District */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">2. District</label>
                        <select
                            value={filterDistrict}
                            onChange={e => {
                                setFilterDistrict(e.target.value);
                                setFilterMandi('');
                                setFilterCrop('');
                            }}
                            className="select-field w-full"
                            disabled={!filterState}
                        >
                            <option value="">Select District</option>
                            {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* 3. Mandi */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">3. Mandi</label>
                        <select
                            value={filterMandi}
                            onChange={e => {
                                setFilterMandi(e.target.value);
                                setFilterCrop('');
                            }}
                            className="select-field w-full"
                            disabled={!filterDistrict}
                        >
                            <option value="">Select Mandi</option>
                            {mandiOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* 4. Crop */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">4. Crop</label>
                        <select
                            value={filterCrop}
                            onChange={e => setFilterCrop(e.target.value)}
                            className="select-field w-full"
                            disabled={!filterMandi}
                        >
                            <option value="">Select Crop</option>
                            {curatedCrops.map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Fetch Button & Status Row */}
                <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${(!filterState || !filterDistrict || !filterMandi || !filterCrop)
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-green-500'
                            }`} />
                        <p className="text-sm text-slate-500 font-medium">
                            {(!filterState || !filterDistrict || !filterMandi || !filterCrop)
                                ? `Waiting for: ${!filterState ? 'State' : !filterDistrict ? 'District' : !filterMandi ? 'Mandi' : 'Crop'}`
                                : "Selection complete! Fetch the latest data."}
                        </p>
                    </div>

                    <button
                        onClick={fetchSelectedPriceAndHistory}
                        disabled={loading || !filterState || !filterDistrict || !filterMandi || !filterCrop}
                        className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md ${loading || !filterState || !filterDistrict || !filterMandi || !filterCrop
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Fetching...</span>
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-4 h-4" />
                                <span>Fetch Price & Trend</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card p-12 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Fetching verified market data...</p>
                    </div>
                </div>
            ) : filterCrop && priceData ? (
                <>
                    {/* Stock Market Chart */}
                    {selectedPrice && (
                        <div className="card p-6 card-green">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{selectedCrop} — Price Chart</h3>
                                    <p className="text-xs text-slate-400">
                                        30-day price movement
                                        {filterMandi ? ` • ${filterMandi}` : filterDistrict ? ` • ${filterDistrict}` : filterState ? ` • ${filterState}` : ` • ${selectedPrice.market}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">₹{selectedPrice.modalPrice}</p>
                                        <p className="text-xs text-slate-400">/{selectedPrice.unit}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="price-badge-up">▲ 8.5%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyData.length > 0 ? historyData : []}>
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v}`} />
                                        <Tooltip
                                            formatter={(value: any) => [`₹${value}`, 'Price']}
                                            contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        />
                                        <Area type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" animationDuration={1000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Price Summary Cards */}
                    {selectedPrice && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Minimum Price', value: `₹${selectedPrice.minPrice}`, color: 'text-red-600', border: 'card-red' },
                                { label: 'Modal Price', value: `₹${selectedPrice.modalPrice}`, color: 'text-green-600', border: 'card-green' },
                                { label: 'Maximum Price', value: `₹${selectedPrice.maxPrice}`, color: 'text-blue-600', border: 'card-blue' },
                            ].map((p, i) => (
                                <div key={i} className={`card p-5 ${p.border}`}>
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{p.label}</p>
                                    <p className={`text-2xl font-bold ${p.color}`}>{p.value}</p>
                                    <p className="text-xs text-slate-400 mt-1">per {selectedPrice.unit}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* All Prices Table */}
                    <div className="card overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800">All Market Prices</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {filteredPrices.length} results
                                    {filterDistrict ? ` in ${filterDistrict}` : filterState ? ` in ${filterState}` : ''}
                                    {' '}— click to see price chart
                                </p>
                            </div>
                            <span className="badge-green">{filteredPrices.length} crops</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Crop</th>
                                        <th>Market</th>
                                        <th>Min Price</th>
                                        <th>Modal Price</th>
                                        <th>Max Price</th>
                                        <th>Grade</th>
                                        <th>Variety</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPrices.map((p) => (
                                        <tr
                                            key={p.id}
                                            onClick={() => setSelectedCrop(p.cropName)}
                                            className={`cursor-pointer ${selectedCrop === p.cropName ? 'bg-green-50' : ''}`}
                                        >
                                            <td className="font-semibold text-slate-800">
                                                {p.cropName}
                                                {p.cropNameHindi && <span className="text-xs text-slate-400 ml-1.5">({p.cropNameHindi})</span>}
                                            </td>
                                            <td>{p.market}</td>
                                            <td className="text-red-600 font-medium">₹{p.minPrice}</td>
                                            <td className="text-green-600 font-bold">₹{p.modalPrice}</td>
                                            <td className="text-blue-600 font-medium">₹{p.maxPrice}</td>
                                            <td><span className="badge-green">{p.grade}</span></td>
                                            <td className="text-slate-500">{p.variety}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <TrendingUp className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="text-slate-800 font-bold mb-1">No Data Selected</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        Complete the 4-step selection above to view verified real-time market prices and trends.
                    </p>
                </div>
            )}
        </div>
    );
}
