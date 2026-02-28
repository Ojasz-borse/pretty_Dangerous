"use client";

import React, { useState } from 'react';
import { mockMarkets } from '../data/mockMandiData';
import { TrendingUp, TrendingDown, Minus, MapPin, User, ShoppingBag } from 'lucide-react';

export default function MandiPrices() {
    const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
    const [selectedMarketId, setSelectedMarketId] = useState<string>(mockMarkets[0].id);

    const selectedMarket = mockMarkets.find(m => m.id === selectedMarketId) || mockMarkets[0];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 space-y-6">
            {/* Role Toggle */}
            <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
                <button
                    onClick={() => setRole('farmer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-lg font-bold transition-all duration-300 ${role === 'farmer' ? 'bg-green-600 text-white shadow-md transform scale-[1.02]' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <User size={24} />
                    <span>I am a Farmer</span>
                    <span className="text-sm opacity-90 ml-1 font-medium bg-black/10 px-2 py-0.5 rounded-full">(किसान)</span>
                </button>
                <button
                    onClick={() => setRole('buyer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-lg font-bold transition-all duration-300 ${role === 'buyer' ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <ShoppingBag size={24} />
                    <span>I am a Buyer</span>
                    <span className="text-sm opacity-90 ml-1 font-medium bg-black/10 px-2 py-0.5 rounded-full">(खरीदार)</span>
                </button>
            </div>

            {/* Header Info based on Role */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${role === 'farmer' ? 'text-green-800' : 'text-blue-800'}`}>
                    {role === 'farmer' ? 'Sell Your Produce For The Best Price' : 'Buy Fresh Produce Directly'}
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                    {role === 'farmer'
                        ? 'Compare local market prices and connect directly with trusted buyers.'
                        : 'Find the best prices and buy directly from trusted local farmers.'}
                </p>

                {/* Location Selector */}
                <div className="mt-6 flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="text-red-500" size={28} />
                        Mandi Location:
                    </label>
                    <select
                        value={selectedMarketId}
                        onChange={(e) => setSelectedMarketId(e.target.value)}
                        className="flex-1 w-full md:w-auto p-3 text-lg font-bold text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none shadow-sm cursor-pointer"
                    >
                        {mockMarkets.map(market => (
                            <option key={market.id} value={market.id}>
                                📍 {market.name}, {market.state}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Market Prices List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Today's Market Prices
                        <span className="text-sm bg-green-100 border border-green-200 text-green-800 px-3 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Data
                        </span>
                    </h3>
                    <div className="text-sm font-semibold text-gray-500">Updated: Just Now</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {selectedMarket.items.map(item => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex items-center justify-between group">

                            {/* Item Info */}
                            <div className="flex items-center gap-4">
                                <div className="text-5xl md:text-6xl bg-gray-50/80 p-3 rounded-2xl border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                    {item.imageIcon}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-gray-900 leading-tight">{item.name}</h4>
                                    <p className="text-xl text-gray-600 font-bold">{item.hindiName}</p>
                                    <span className="inline-block mt-1.5 text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
                                        {item.quality}
                                    </span>
                                </div>
                            </div>

                            {/* Price Info */}
                            <div className="text-right">
                                <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                    ₹{item.pricePerKg}
                                    <span className="text-base text-gray-500 font-bold ml-1">/ kg</span>
                                </div>

                                <div className={`flex items-center justify-end gap-1 mt-1 font-bold text-lg md:text-xl ${item.trend === 'up' ? 'text-green-600' :
                                        item.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                    }`}>
                                    {item.trend === 'up' && <TrendingUp size={24} strokeWidth={3} className="text-green-500" />}
                                    {item.trend === 'down' && <TrendingDown size={24} strokeWidth={3} className="text-red-500" />}
                                    {item.trend === 'stable' && <Minus size={24} strokeWidth={3} className="text-gray-400" />}

                                    {item.trendPercentage === 0 ? 'Stable' : `${item.trendPercentage}%`}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-10">
                <button className={`w-full py-5 rounded-2xl text-2xl font-bold text-white shadow-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-3 ${role === 'farmer'
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-600/20 hover:shadow-green-600/40'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-600/20 hover:shadow-blue-600/40'
                    }`}>
                    {role === 'farmer' ? (
                        <>
                            Connect with Buyers & Sell <TrendingUp size={28} />
                        </>
                    ) : (
                        <>
                            Contact Farmers to Buy <ShoppingBag size={28} />
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}
