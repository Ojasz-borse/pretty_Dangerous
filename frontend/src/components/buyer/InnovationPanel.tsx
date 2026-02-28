'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BarChart3, Globe2, Zap, BrainCircuit, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InnovationPanel() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* AI Demand Pulse */}
                <Card className="border-amber-100 shadow-xl overflow-hidden group hover:shadow-amber-100/50 transition-all">
                    <div className="bg-amber-500 p-6 text-white text-center">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                        <h3 className="text-xl font-black italic tracking-[0.05em]">AI Demand Pulse</h3>
                    </div>
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-gray-500 font-medium mb-6">Real-time prediction of crop demand spikes across 500+ urban centers using neural analysis.</p>
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Growth</p>
                                <p className="text-2xl font-black text-amber-600 leading-none Ital">14.2%</p>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                                <p className="text-2xl font-black text-blue-600 leading-none Ital">98.5%</p>
                            </div>
                        </div>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 font-black rounded-xl h-12 shadow-lg shadow-amber-100 border-0 italic">
                            Launch Pulse
                        </Button>
                    </CardContent>
                </Card>

                {/* Global Trade Analyzer */}
                <Card className="border-blue-100 shadow-xl overflow-hidden group hover:shadow-blue-100/50 transition-all bg-gradient-to-b from-blue-50 to-white">
                    <div className="p-8 text-center">
                        <Globe2 className="w-12 h-12 mx-auto mb-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                        <h3 className="text-2xl font-black italic text-gray-800 mb-2">Global Trade AI</h3>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-[0.2em] mb-6">Export Intelligence</p>

                        <div className="space-y-3 mb-8">
                            {[
                                { label: 'Top Destination', val: 'UAE' },
                                { label: 'Hot Commodity', val: 'Spices' },
                                { label: 'Avg Tariff', val: '4.2%' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-bold text-gray-500 px-4 py-2 bg-white rounded-xl border border-blue-50">
                                    <span>{row.label}</span>
                                    <span className="text-blue-700">{row.val}</span>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 font-black rounded-xl h-12 hover:bg-blue-50 italic">
                            Analyze Markets
                        </Button>
                    </div>
                </Card>

                {/* Automation & IoT */}
                <Card className="border-indigo-100 shadow-xl overflow-hidden group hover:shadow-indigo-100/50 transition-all relative">
                    <div className="absolute top-4 right-4 animate-bounce">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-between h-full">
                        <div>
                            <Rocket className="w-10 h-10 text-indigo-600 mb-6" />
                            <h3 className="text-3xl font-black italic text-gray-800 mb-4 tracking-tight leading-none">Smart <br /> Contracts</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                                Instant settlements, autonomous quality audits, and transparent ledger tracking for every purchase.
                            </p>
                        </div>
                        <Button className="w-full bg-indigo-950 text-white font-black rounded-xl h-12 hover:bg-black shadow-lg shadow-indigo-100 border-0 italic group-hover:bg-indigo-900">
                            Setup Automation
                        </Button>
                    </CardContent>
                </Card>

            </div>

            {/* AI Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/1.jpeg')] opacity-10 bg-cover bg-center mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <BrainCircuit className="w-10 h-10 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic mb-2 tracking-tight">Cerebro <span className="text-blue-400">Trading-Engine</span></h2>
                        <p className="text-blue-200/80 font-bold text-sm max-w-lg">
                            Our primary AI core that manages matching, logistics, and fair pricing simultaneously.
                        </p>
                    </div>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Cerebro Load</p>
                        <p className="text-2xl font-black italic">42% OPTIMAL</p>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-black rounded-full px-8 h-14 shadow-xl italic border-0">
                        Enter Core
                    </Button>
                </div>
            </div>
        </div>
    );
}
