'use client';

import React from 'react';
import { Sparkles, Globe2, Zap, BrainCircuit, Rocket, Leaf, TrendingUp, ArrowRight } from 'lucide-react';

export default function InnovationPanel() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* AI Demand Pulse */}
                <div className="feature-card group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">AI Demand Pulse</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Real-time prediction of crop demand spikes across 500+ urban centers using neural analysis.</p>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Growth</p>
                                <p className="text-2xl font-bold text-amber-600">14.2%</p>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Accuracy</p>
                                <p className="text-2xl font-bold text-blue-600">98.5%</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-amber-600 transition-colors">Launch Pulse</span>
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all">
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Trade Analyzer */}
                <div className="feature-card group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Globe2 className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Global Trade AI</h3>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-5">Export Intelligence</p>

                        <div className="space-y-2 mb-6">
                            {[
                                { label: 'Top Destination', val: 'UAE' },
                                { label: 'Hot Commodity', val: 'Spices' },
                                { label: 'Avg Tariff', val: '4.2%' }
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-medium text-slate-500 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                    <span>{row.label}</span>
                                    <span className="text-blue-700 font-bold">{row.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Analyze Markets</span>
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Contracts */}
                <div className="feature-card group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
                    <div className="absolute top-4 right-4 animate-bounce">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">Smart Contracts</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Instant settlements, autonomous quality audits, and transparent ledger tracking for every purchase.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">Setup Automation</span>
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all">
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Banner - matching farmer's hero-banner style */}
            <div className="hero-banner p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <BrainCircuit className="w-8 h-8 text-green-300 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">Cerebro <span className="text-green-300">Trading Engine</span></h2>
                        <p className="text-white/80 font-medium text-sm max-w-lg">
                            Our primary AI core that manages matching, logistics, and fair pricing simultaneously.
                        </p>
                    </div>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-1">Engine Load</p>
                        <p className="text-2xl font-bold text-white">42% Optimal</p>
                    </div>
                    <button className="btn-primary bg-white text-green-800 hover:bg-green-50">
                        Enter Core
                    </button>
                </div>
            </div>
        </div>
    );
}
