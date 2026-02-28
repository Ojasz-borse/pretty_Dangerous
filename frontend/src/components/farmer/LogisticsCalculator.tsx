'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calculator, ArrowRight, Clock, Package, Star, IndianRupee, Fuel, Route, Loader2 } from 'lucide-react';
import type { LogisticsInfo, ApiResponse } from '@/types/farmer';

interface LogisticsCalculatorProps { cropName: string; pickupDistrict: string; pickupState: string; }

const popularCrops = ['Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Groundnut'];
const majorMarkets = [
    { district: 'Delhi', state: 'Delhi', pincode: '110001' },
    { district: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { district: 'Pune', state: 'Maharashtra', pincode: '411001' },
    { district: 'Nashik', state: 'Maharashtra', pincode: '422001' },
    { district: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
    { district: 'Sirsa', state: 'Haryana', pincode: '125055' },
    { district: 'Karnal', state: 'Haryana', pincode: '132001' },
    { district: 'Ludhiana', state: 'Punjab', pincode: '141001' },
    { district: 'Amritsar', state: 'Punjab', pincode: '143001' },
    { district: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
    { district: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001' },
    { district: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
    { district: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001' },
    { district: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    { district: 'Kota', state: 'Rajasthan', pincode: '324001' },
    { district: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
    { district: 'Surat', state: 'Gujarat', pincode: '395001' },
    { district: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    { district: 'Bangalore', state: 'Karnataka', pincode: '560001' },
];

export default function LogisticsCalculator({ cropName, pickupDistrict, pickupState }: LogisticsCalculatorProps) {
    const [selectedCrop, setSelectedCrop] = useState('');
    const [quantity, setQuantity] = useState('50');
    const [pricePerQuintal, setPricePerQuintal] = useState('2250');
    const [selectedPickupDistrict, setSelectedPickupDistrict] = useState('');
    const [selectedPickupState, setSelectedPickupState] = useState('');
    const [deliveryDistrict, setDeliveryDistrict] = useState('');
    const [logistics, setLogistics] = useState<LogisticsInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLogistics = async () => {
        if (!selectedCrop || !selectedPickupDistrict || !deliveryDistrict) {
            return;
        }

        setLoading(true);
        try {
            // Updated to call the real-time Node.js backend
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/logistics/manual-calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cropName: selectedCrop,
                    quantity: parseFloat(quantity),
                    pickupCity: selectedPickupDistrict,
                    deliveryCity: deliveryDistrict,
                    pricePerQuintal: parseFloat(pricePerQuintal)
                })
            });

            const result: ApiResponse<any> = await response.json();
            if (result.success && result.data) {
                // Map the Node backend response to the frontend type structure
                const data = result.data;
                const formattedData: LogisticsInfo = {
                    ...data,
                    id: `log_${Date.now()}`,
                    transportOptions: [
                        {
                            id: 'truck_1',
                            type: 'truck',
                            name: 'Standard Truck',
                            capacity: 100,
                            costPerKm: 8,
                            totalCost: data.netProfitCalculation.transportCost,
                            estimatedTime: data.estimatedTime,
                            provider: 'Verified Agri-Carrier',
                            rating: 4.8,
                            available: true
                        }
                    ],
                    recommendedOption: {
                        id: 'truck_1',
                        type: 'truck',
                        name: 'Standard Truck',
                        capacity: 100,
                        costPerKm: 8,
                        totalCost: data.netProfitCalculation.transportCost,
                        estimatedTime: data.estimatedTime,
                        provider: 'Verified Agri-Carrier',
                        rating: 4.8,
                        available: true
                    }
                };
                setLogistics(formattedData);
            }
        } catch (error) {
            console.error('Logistics Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCrop && selectedPickupDistrict && deliveryDistrict) {
            fetchLogistics();
        }
    }, [selectedCrop, deliveryDistrict, selectedPickupDistrict]);

    const getTransportIcon = (type: string) => {
        switch (type) { case 'truck': return '🚛'; case 'tempo': return '🚐'; case 'tractor': return '🚜'; case 'custom': return '🧊'; default: return '🚚'; }
    };

    return (
        <div className="space-y-6">
            {/* Input */}
            <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Crop</label>
                        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="select-field w-full">
                            <option value="">Select Crop...</option>
                            {popularCrops.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity (Qtl)</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price/Quintal (₹)</label>
                        <input type="number" value={pricePerQuintal} onChange={(e) => setPricePerQuintal(e.target.value)} className="input-field" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-green-600">Crop City (Origin)</label>
                        <select value={selectedPickupDistrict} onChange={(e) => setSelectedPickupDistrict(e.target.value)} className="select-field w-full border-green-200 focus:border-green-500">
                            <option value="">Select Pickup City...</option>
                            {majorMarkets.map(m => <option key={`pickup-${m.district}`} value={m.district}>{m.district}, {m.state}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-red-600">Delivery Market</label>
                        <select value={deliveryDistrict} onChange={(e) => setDeliveryDistrict(e.target.value)} className="select-field w-full border-red-200 focus:border-red-500">
                            <option value="">Select Delivery City...</option>
                            {majorMarkets.map(m => <option key={`delivery-${m.district}`} value={m.district}>{m.district}, {m.state}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={fetchLogistics} disabled={loading || !selectedCrop || !selectedPickupDistrict || !deliveryDistrict} className="btn-secondary mt-4">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />} Calculate
                </button>
            </div>

            {loading ? (
                <div className="card p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
            ) : logistics ? (
                <>
                    {/* Route */}
                    <div className="card p-6 card-blue">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Route className="w-5 h-5 text-blue-500" /> Route Details</h3>
                        <div className="flex items-center justify-center gap-4 py-4">
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-2 border border-green-200"><MapPin className="w-7 h-7 text-green-600" /></div>
                                <p className="font-semibold text-slate-800">{logistics.pickupLocation.district}</p>
                                <p className="text-xs text-slate-400">{logistics.pickupLocation.state}</p>
                            </div>
                            <div className="flex-1 max-w-xs text-center">
                                <div className="border-t-2 border-dashed border-slate-300 relative">
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-lg font-bold text-blue-600">{logistics.distance} km</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-3">~{logistics.estimatedTime} hrs</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-2 border border-red-200"><MapPin className="w-7 h-7 text-red-600" /></div>
                                <p className="font-semibold text-slate-800">{logistics.deliveryLocation.district}</p>
                                <p className="text-xs text-slate-400">{logistics.deliveryLocation.state}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transport Options */}
                    <div className="card p-6">
                        <h3 className="font-bold text-slate-800 mb-1">Transport Options</h3>
                        <p className="text-xs text-slate-400 mb-4">Choose the best option for your shipment</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {logistics.transportOptions.map((opt) => (
                                <div key={opt.id} className={`p-5 rounded-2xl border-2 transition-all ${opt.id === logistics.recommendedOption.id ? 'border-indigo-300 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{getTransportIcon(opt.type)}</span>
                                            <div><p className="font-semibold text-slate-800">{opt.name}</p><p className="text-xs text-slate-400">{opt.provider}</p></div>
                                        </div>
                                        {opt.id === logistics.recommendedOption.id && <span className="badge-blue text-[10px]">⭐ Recommended</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <span className="flex items-center gap-1.5 text-slate-500"><Package className="w-3.5 h-3.5" /> {opt.capacity} Qtl</span>
                                        <span className="flex items-center gap-1.5 text-slate-500"><Clock className="w-3.5 h-3.5" /> {opt.estimatedTime} hrs</span>
                                        <span className="flex items-center gap-1.5 text-slate-500"><Star className="w-3.5 h-3.5 text-amber-400" /> {opt.rating}/5</span>
                                        <span className="flex items-center gap-1.5 text-slate-500"><Fuel className="w-3.5 h-3.5" /> ₹{opt.costPerKm}/km</span>
                                    </div>
                                    <div className="separator"></div>
                                    <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Total Cost</span><span className="text-xl font-bold text-indigo-600">₹{opt.totalCost.toLocaleString()}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profit */}
                    <div className="card overflow-hidden card-green">
                        <div className="bg-green-50 p-6 border-b border-green-200 flex items-center gap-3">
                            <IndianRupee className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-bold text-green-800">Net Profit Calculation</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-1"><ArrowRight className="w-4 h-4" /> Income</h4>
                                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                                        <div className="flex justify-between"><span className="text-slate-600">Gross Amount</span><span className="font-bold text-green-600">₹{logistics.netProfitCalculation.grossAmount.toLocaleString()}</span></div>
                                        <p className="text-xs text-slate-400 mt-1">{logistics.netProfitCalculation.quantity} Qtl × ₹{logistics.netProfitCalculation.pricePerQuintal}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1"><ArrowRight className="w-4 h-4" /> Expenses</h4>
                                    <div className="space-y-1.5">
                                        {[['Transport', logistics.netProfitCalculation.transportCost], ['Loading/Unloading', logistics.netProfitCalculation.loadingCost], ['Market Fee', logistics.netProfitCalculation.marketFee], ['Other', logistics.netProfitCalculation.otherExpenses]].map(([l, v]) => (
                                            <div key={l as string} className="flex justify-between text-sm"><span className="text-slate-500">{l}</span><span className="text-red-500 font-medium">-₹{(v as number).toLocaleString()}</span></div>
                                        ))}
                                        <div className="separator"></div>
                                        <div className="flex justify-between font-semibold"><span className="text-slate-700">Total</span><span className="text-red-600">-₹{logistics.netProfitCalculation.totalExpenses.toLocaleString()}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-green-50 rounded-2xl border border-green-200 flex items-center justify-between">
                                <div><p className="text-xs text-slate-400">Net Profit</p><p className="text-3xl font-bold text-green-600">₹{logistics.netProfitCalculation.netProfit.toLocaleString()}</p></div>
                                <div className="text-right"><p className="text-xs text-slate-400">Margin</p><p className="text-2xl font-bold text-green-600">{logistics.netProfitCalculation.profitMargin}%</p></div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card p-12 text-center border-dashed"><Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">Enter details to calculate logistics</p></div>
            )}
        </div>
    );
}
