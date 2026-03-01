'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    TrendingUp,
    IndianRupee,
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
import ConnectPanel from '@/components/shared/ConnectPanel';
import AddCropListing from './AddCropListing';

const modules = [
    { id: 'price', label: 'Market Price', icon: IndianRupee, gradient: 'from-emerald-400 to-green-500' },
    { id: 'prediction', label: 'Price Forecast', icon: TrendingUp, gradient: 'from-blue-400 to-cyan-500' },
    { id: 'sell', label: 'Sell or Wait', icon: Lightbulb, gradient: 'from-amber-400 to-yellow-500' },
    { id: 'list-crop', label: 'List Crops', icon: Target, gradient: 'from-teal-400 to-emerald-500' },
    { id: 'demand', label: 'Demand Insights', icon: BarChart3, gradient: 'from-purple-400 to-violet-500' },
    { id: 'connect', label: 'Find Buyers', icon: Target, gradient: 'from-indigo-400 to-blue-600' },
    { id: 'detect', label: 'Crop Detection', icon: Camera, gradient: 'from-orange-400 to-red-500' },
    { id: 'trust', label: 'Trust Score', icon: Star, gradient: 'from-yellow-400 to-amber-500' },
    { id: 'logistics', label: 'Logistics', icon: Truck, gradient: 'from-indigo-400 to-blue-500' },
];

export default function FarmerDashboard() {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const { district: ctxDistrict, state: ctxState } = useLocation();
    const district = ctxDistrict || 'Sirsa';
    const state = ctxState || 'Haryana';
    const [activeTab, setActiveTab] = useState('price');
    const [currentTime, setCurrentTime] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        update();
        const t = setInterval(update, 60000);
        return () => clearInterval(t);
    }, []);

    // Scroll reveal logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case 'price':
                return <RealTimePrice selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} district={district} />;
            case 'prediction':
                return <PricePrediction cropName={selectedCrop} district={district} />;
            case 'sell':
                return <SellRecommendation cropName={selectedCrop} district={district} />;
            case 'list-crop':
                return <AddCropListing />;
            case 'demand':
                return <DemandForecast district={district} state={state} />;
            case 'detect':
                return <CropDetection />;
            case 'trust':
                return <TrustScore />;
            case 'logistics':
                return <LogisticsCalculator cropName={selectedCrop} pickupDistrict={district} pickupState={state} />;
            case 'connect':
                return <ConnectPanel userType="farmer" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative bg-[#0a0f1e]" ref={scrollRef}>
            {/* ===== PREMIUM HEADER ===== */}
            <header className="glass-header sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
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

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 badge-glass px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/40">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                <span>{currentTime}</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 badge-glass px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/40">
                                <Activity className="w-3 h-3 text-emerald-400" />
                                <span>{district}, {state}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <Zap className="w-3 h-3" />
                                <span className="hidden sm:inline">🌾 Kharif Season</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
                {/* ===== HERO STAT CARDS ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Today's Best Price", value: '2,250', prefix: '₹', sub: '/Quintal', icon: IndianRupee, glow: 'glow-green', gradient: 'from-emerald-400 to-green-500', delay: 'stagger-1' },
                        { label: 'Market Outlook', value: '+8.5%', prefix: '', sub: 'Rising Demand', icon: TrendingUp, glow: 'glow-blue', gradient: 'from-blue-400 to-cyan-500', delay: 'stagger-2' },
                        { label: 'Demand Index', value: 'High', prefix: '', sub: 'Strong Volume', icon: Target, glow: 'glow-purple', gradient: 'from-purple-400 to-violet-500', delay: 'stagger-3' },
                        { label: 'Your Trust Rating', value: '82', prefix: '', sub: 'Verified Producer', icon: Star, glow: 'glow-amber', gradient: 'from-amber-400 to-yellow-500', delay: 'stagger-4' },
                    ].map((stat, i) => (
                        <div key={i} className={`scroll-reveal ${stat.delay}`}>
                            <div className={`stat-card-inner glass-card p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:bg-white/5 transition-all duration-500 cursor-default ${stat.glow}`}>
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-[10px] text-white/40 mb-1 uppercase tracking-[0.2em] font-black">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white/40 text-lg font-bold">{stat.prefix}</span>
                                    <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                                </div>
                                <p className="text-[10px] text-white/30 mt-2 font-bold uppercase tracking-widest">{stat.sub}</p>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:bg-white/10 transition-colors"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== NAVIGATION PILLS ===== */}
                <div className="scroll-reveal glass-header p-2 rounded-[2.5rem] border border-white/5 animate-slide-up">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-2">
                        {modules.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveTab(mod.id)}
                                className={`nav-pill flex-shrink-0 group ${activeTab === mod.id ? 'active bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                            >
                                <mod.icon className={`w-5 h-5 ${activeTab === mod.id ? 'text-emerald-400' : 'text-white/20 group-hover:text-white/40'}`} />
                                <span className="hidden lg:block whitespace-nowrap font-black uppercase text-[10px] tracking-widest">{mod.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ===== CONTENT AREA ===== */}
                <div className="scroll-reveal bg-[#0f172a]/50 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[600px]">
                    <div className="p-1">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* ===== PREMIUM FOOTER ===== */}
            <footer className="mt-20 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white/80 tracking-tight">KrishiSetu Intelligence</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Built for Bharat's Farmers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            {['ML Prediction', 'Sat-Scan AI', 'Market Dynamics'].map((src) => (
                                <span key={src} className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-emerald-400 cursor-default transition-colors">
                                    {src}
                                </span>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">© 2024 KRISHISETU TECH</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
