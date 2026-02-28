'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    DollarSign,
    BarChart3,
    Lightbulb,
    Target,
    Camera,
    Star,
    Truck,
    Leaf,
    Activity,
    Clock,
    Zap
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import RealTimePrice from './RealTimePrice';
import PricePrediction from './PricePrediction';
import SellRecommendation from './SellRecommendation';
import DemandForecast from './DemandForecast';
import CropDetection from './CropDetection';
import TrustScore from './TrustScore';
import LogisticsCalculator from './LogisticsCalculator';

const modules = [
    { id: 'price', label: 'Market Price', icon: DollarSign, gradient: 'from-emerald-400 to-green-500' },
    { id: 'prediction', label: 'Price Forecast', icon: TrendingUp, gradient: 'from-blue-400 to-cyan-500' },
    { id: 'sell', label: 'Sell or Wait', icon: Lightbulb, gradient: 'from-amber-400 to-yellow-500' },
    { id: 'demand', label: 'Demand Insights', icon: BarChart3, gradient: 'from-purple-400 to-violet-500' },
    { id: 'detect', label: 'Crop Detection', icon: Camera, gradient: 'from-orange-400 to-red-500' },
    { id: 'trust', label: 'Trust Score', icon: Star, gradient: 'from-yellow-400 to-amber-500' },
    { id: 'logistics', label: 'Logistics', icon: Truck, gradient: 'from-indigo-400 to-blue-500' },
];

export default function FarmerDashboard() {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const { district: ctxDistrict, state: ctxState } = useLocation();
    // Fall back to 'Sirsa'/'Haryana' if user has not set a location yet
    const district = ctxDistrict || 'Sirsa';
    const state = ctxState || 'Haryana';
    const [activeTab, setActiveTab] = useState('price');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const update = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        update();
        const t = setInterval(update, 60000);
        return () => clearInterval(t);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'price':
                return <RealTimePrice selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} district={district} />;
            case 'prediction':
                return <PricePrediction cropName={selectedCrop} district={district} />;
            case 'sell':
                return <SellRecommendation cropName={selectedCrop} district={district} />;
            case 'demand':
                return <DemandForecast district={district} state={state} />;
            case 'detect':
                return <CropDetection />;
            case 'trust':
                return <TrustScore />;
            case 'logistics':
                return <LogisticsCalculator cropName={selectedCrop} pickupDistrict={district} pickupState={state} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative">
            {/* ===== PREMIUM HEADER ===== */}
            <header className="glass-header sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse-glow">
                                    <Leaf className="w-7 h-7 text-white icon-glow" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0a0f1e] animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">
                                    <span className="text-gradient-green">Krishi</span>
                                    <span className="text-white/90">Setu</span>
                                </h1>
                                <p className="text-xs text-white/40 tracking-wider uppercase">Smart Agri Intelligence</p>
                            </div>
                        </div>

                        {/* Right side badges */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 badge-glass px-3 py-1.5 rounded-full text-xs">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                <span>{currentTime}</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 badge-glass px-3 py-1.5 rounded-full text-xs">
                                <Activity className="w-3 h-3 text-emerald-400" />
                                <span>{district}, {state}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Zap className="w-3 h-3" />
                                <span className="hidden sm:inline">🌾 Kharif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* ===== HERO STAT CARDS ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Best Price", value: '₹2,250', sub: '/Quintal', icon: DollarSign, glow: 'glow-green', gradient: 'from-emerald-400 to-green-500', delay: '' },
                        { label: 'Price Trend', value: '↑ 8.5%', sub: 'Last 7 days', icon: TrendingUp, glow: 'glow-blue', gradient: 'from-blue-400 to-cyan-500', delay: 'delay-100' },
                        { label: 'Demand Index', value: 'High', sub: 'Strong Demand', icon: Target, glow: 'glow-purple', gradient: 'from-purple-400 to-violet-500', delay: 'delay-200' },
                        { label: 'Trust Score', value: '82/100', sub: 'Reliable', icon: Star, glow: 'glow-amber', gradient: 'from-amber-400 to-yellow-500', delay: 'delay-300' },
                    ].map((stat, i) => (
                        <div key={i} className={`stat-card-3d animate-fade-in-up ${stat.delay}`}>
                            <div className={`stat-card-inner ${stat.glow}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="animate-shimmer w-8 h-1 rounded-full mt-2"></div>
                                </div>
                                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== NAVIGATION PILLS ===== */}
                <div className="glass-card-static p-2 animate-fade-in-up delay-400">
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                        {modules.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveTab(mod.id)}
                                className={`nav-pill flex-shrink-0 ${activeTab === mod.id ? 'active' : ''}`}
                            >
                                <mod.icon className="w-5 h-5" />
                                <span className="hidden md:block whitespace-nowrap">{mod.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ===== CONTENT AREA ===== */}
                <div className="animate-fade-in-up delay-500">
                    {renderContent()}
                </div>
            </main>

            {/* ===== PREMIUM FOOTER ===== */}
            <footer className="relative z-10 mt-12">
                <div className="glass-separator"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-white/30">
                                © 2024 KrishiSetu — AI-Powered Agricultural Intelligence
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {['Agmarknet', 'OpenWeather', 'AI Vision'].map((src) => (
                                <span key={src} className="badge-glass px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                    {src}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
