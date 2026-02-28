'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Leaf,
    ShoppingCart,
    ArrowRight,
    Shield,
    Zap,
    Users,
    TrendingUp
} from 'lucide-react';

export default function LoginPage() {
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Tricolor Bar */}
            <div className="tricolor-bar"></div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-4xl w-full animate-fade-in">
                    {/* Logo & Branding */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg">
                                <Leaf className="w-9 h-9 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                            <span className="text-green-600">Krishi</span>
                            <span className="text-slate-800">Setu</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">India's Digital Agricultural Intelligence Platform</p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <span className="badge-green">
                                <Shield className="w-3 h-3" /> Govt. of India Initiative
                            </span>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-slate-700">Choose your role to get started</h2>
                        <p className="text-sm text-slate-400 mt-1">Select how you want to use KrishiSetu</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* Farmer Card */}
                        <Link
                            href="/"
                            className="group feature-card relative overflow-hidden"
                            onMouseEnter={() => setHoveredRole('farmer')}
                            onMouseLeave={() => setHoveredRole(null)}
                        >
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Leaf className="w-10 h-10 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">
                                    👨‍🌾 I'm a Farmer
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Access real-time mandi prices, AI predictions, sell/wait advice, crop detection, and logistics calculator.
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { icon: TrendingUp, text: 'Price Forecast' },
                                        { icon: Zap, text: 'Smart Advice' },
                                        { icon: Users, text: 'Trust Score' },
                                        { icon: Shield, text: 'Crop Detection' },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <f.icon className="w-3.5 h-3.5 text-green-500" />
                                            {f.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">Enter Dashboard</span>
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Buyer Card */}
                        <Link
                            href="/buyer"
                            className="group feature-card relative overflow-hidden"
                            onMouseEnter={() => setHoveredRole('buyer')}
                            onMouseLeave={() => setHoveredRole(null)}
                        >
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingCart className="w-10 h-10 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                                    🛒 I'm a Buyer
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Find verified produce, check fair prices, optimize logistics, and access AI-powered market insights.
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { icon: ShoppingCart, text: 'Find Crops' },
                                        { icon: TrendingUp, text: 'Fair Price' },
                                        { icon: Zap, text: 'AI Insights' },
                                        { icon: Shield, text: 'Logistics' },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <f.icon className="w-3.5 h-3.5 text-blue-500" />
                                            {f.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Enter Dashboard</span>
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bottom Info */}
                    <div className="text-center mt-12">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                            <span className="font-medium">Powered by:</span>
                            {['Agmarknet', 'OpenWeather API', 'AI Vision'].map((src) => (
                                <span key={src} className="badge-gray">{src}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm">© 2024 KrishiSetu — AI-Powered Agricultural Intelligence Platform</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Ministry of Agriculture & Farmers Welfare</span>
                            <span>·</span>
                            <span>Government of India</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
