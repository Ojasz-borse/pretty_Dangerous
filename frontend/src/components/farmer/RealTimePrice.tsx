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
    Loader2
} from 'lucide-react';
import type { CropPrice, ApiResponse } from '@/types/farmer';

interface RealTimePriceProps {
    selectedCrop: string;
    setSelectedCrop: (crop: string) => void;
    district: string;
}

const popularCrops = [
    'Rice (Basmati)', 'Wheat', 'Tomato', 'Onion', 'Potato',
    'Cotton', 'Sugarcane', 'Maize'
];

export default function RealTimePrice({ selectedCrop, setSelectedCrop, district }: RealTimePriceProps) {
    const [prices, setPrices] = useState<CropPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchPrices(); }, []);

    const fetchPrices = async () => {
        try {
            const response = await fetch('/api/farmer/price');
            const data: ApiResponse<CropPrice[]> = await response.json();
            if (data.success && data.data) setPrices(data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock stock chart data for selected crop
    const chartData = Array.from({ length: 30 }, (_, i) => {
        const base = prices.find(p => p.cropName === selectedCrop)?.modalPrice || 2250;
        const variation = Math.sin(i * 0.5) * 200 + Math.random() * 150 - 75;
        return {
            day: `Day ${i + 1}`,
            price: Math.round(base + variation),
            min: Math.round(base + variation - 100),
            max: Math.round(base + variation + 100),
        };
    });

    const selectedPrice = prices.find(p => p.cropName === selectedCrop);
    const filteredPrices = prices.filter(p =>
        !searchTerm || p.cropName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Crop Select + Search */}
            <div className="card p-5">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Select Crop</label>
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="select-field w-full"
                        >
                            {popularCrops.map((crop) => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search crops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-9"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="card p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stock Market Chart */}
                    {selectedPrice && (
                        <div className="card p-6 card-green">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{selectedCrop} — Price Chart</h3>
                                    <p className="text-xs text-slate-400">30-day price movement • {selectedPrice.market}</p>
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
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" />
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}`} stroke="#e2e8f0" />
                                        <Tooltip
                                            formatter={(value: any) => [`₹${value}`, 'Price']}
                                            contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        />
                                        <Area type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} fill="url(#priceGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-green-500 rounded"></span> Modal Price</span>
                            </div>
                        </div>
                    )}

                    {/* Price Summary Cards */}
                    {selectedPrice && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Minimum Price', value: `₹${selectedPrice.minPrice}`, color: 'text-red-600', bg: 'bg-red-50', border: 'card-red' },
                                { label: 'Modal Price', value: `₹${selectedPrice.modalPrice}`, color: 'text-green-600', bg: 'bg-green-50', border: 'card-green' },
                                { label: 'Maximum Price', value: `₹${selectedPrice.maxPrice}`, color: 'text-blue-600', bg: 'bg-blue-50', border: 'card-blue' },
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
                        <div className="p-5 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">All Market Prices</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Click on a crop to view its price chart</p>
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
            )}
        </div>
    );
}
