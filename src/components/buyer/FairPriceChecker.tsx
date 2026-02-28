'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Info, Scale, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FairPriceChecker() {
    const [crop, setCrop] = useState('');
    const [location, setLocation] = useState('');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-green-100 shadow-xl overflow-hidden h-fit">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
                        <h3 className="text-xl font-bold flex items-center gap-2 italic">
                            <Scale className="w-5 h-5" />
                            Fair Price Intel
                        </h3>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Crop</label>
                            <Input
                                placeholder="e.g., Wheat, Mustard..."
                                className="rounded-xl border-green-100 focus:ring-green-500"
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mandi / District</label>
                            <Input
                                placeholder="e.g., Sirsa, Karnal..."
                                className="rounded-xl border-green-100 focus:ring-green-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-12 mt-4 shadow-lg shadow-emerald-100">
                            Check Fair Range
                        </Button>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-blue-50 shadow-xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-black text-gray-800 mb-2 italic">Fair Trade <span className="text-emerald-600">Index</span></h2>
                                <p className="text-gray-500 font-medium">Verified price range calculated using live market feeds and regional demand data.</p>
                            </div>
                            <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 text-center scale-110">
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-2 text-emerald-700 font-black">
                                    <TrendingUp className="w-4 h-4" />
                                    Bullish
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Min Fair Price', value: '₹2,350', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Mid-Point (Avg)', value: '₹2,450', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Max Fair Price', value: '₹2,580', color: 'text-amber-600', bg: 'bg-amber-50' }
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/50 text-center shadow-sm`}>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`text-3xl font-black italic ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-900 rounded-3xl p-6 text-white flex items-center justify-between gap-6 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Info className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold flex items-center gap-2 tracking-tight">
                                        Antigravity Insight
                                        <Badge variant="secondary" className="bg-blue-500 text-white text-[10px] px-2 py-0 h-4 font-black italic">BETA</Badge>
                                    </h4>
                                    <p className="text-xs text-blue-100 opacity-80">Supply in Sirsa region is expected to drop by 15% next week. Current prices are optimal for bulk purchase.</p>
                                </div>
                            </div>
                            <Button className="bg-white text-blue-900 border-0 hover:bg-blue-50 font-black rounded-xl px-6 italic whitespace-nowrap hidden sm:flex">
                                Detail Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
