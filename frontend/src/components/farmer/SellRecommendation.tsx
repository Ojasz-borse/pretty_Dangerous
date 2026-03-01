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

    useEffect(() => { fetchRecommendation(); }, [selectedCrop]);

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
            ) : recommendation ? (
                <>
                    {/* Big Recommendation Banner */}
                    <div className={`card overflow-hidden ${recommendation.recommendation === 'SELL_NOW' ? 'card-green' : 'card-amber'}`}>
                        {/* ... rest of the content ... */}
                    </div>
                </>
            ) : (
                <div className="card p-12 text-center text-slate-400 italic">
                    Unable to generate an authentic recommendation without verified market data.
                </div>
            )}
        </div>
    );
}
