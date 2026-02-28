'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    Search,
    DollarSign,
    Truck,
    Sparkles,
    Leaf,
    MapPin,
    Menu,
    X,
    Home,
    Users,
    ArrowRight,
    Star,
    Shield
} from 'lucide-react';
import SmartSearch from './SmartSearch';
import FairPriceChecker from './FairPriceChecker';
import LogisticsOptimization from './LogisticsOptimization';
import InnovationPanel from './InnovationPanel';
import ConnectPanel from '@/components/shared/ConnectPanel';

const modules = [
    { id: 'search', label: 'Find Crops', icon: Search, color: 'bg-blue-600', desc: 'Browse verified farmer listings' },
    { id: 'fair-price', label: 'Fair Price', icon: DollarSign, color: 'bg-green-600', desc: 'AI-powered market value check' },
    { id: 'connect', label: 'Find Farmers', icon: Users, color: 'bg-indigo-600', desc: 'Connect directly with growers' },
    { id: 'logistics', label: 'Logistics', icon: Truck, color: 'bg-purple-600', desc: 'Optimize delivery routes' },
    { id: 'innovation', label: 'AI Insights', icon: Sparkles, color: 'bg-amber-600', desc: 'Analyze deep market trends' },
];

export default function BuyerDashboard() {
    const [selectedListing, setSelectedListing] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('search');
    const [mobileOpen, setMobileOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

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
            case 'search':
                return <SmartSearch onSelectListing={setSelectedListing} selectedListing={selectedListing} />;
            case 'fair-price':
                return <FairPriceChecker />;
            case 'logistics':
                return <LogisticsOptimization />;
            case 'connect':
                return <ConnectPanel userType="buyer" />;
            case 'innovation':
                return <InnovationPanel />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50" ref={scrollRef}>
            {/* ===== PREMIUM NAVBAR ===== */}
            <nav className="navbar border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 no-underline">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Leaf className="w-7 h-7 text-white icon-glow" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black leading-none tracking-tight">
                                    <span className="text-green-600">Krishi</span>
                                    <span className="text-slate-900">Setu</span>
                                </h1>
                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase leading-none mt-1">Buyer Intelligence</p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-2">
                            {modules.map((mod) => (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveTab(mod.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === mod.id
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                        : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    <mod.icon className={`w-4 h-4 ${activeTab === mod.id ? 'text-green-400' : 'text-slate-400'}`} />
                                    {mod.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">Active Orders</span>
                                </div>
                                <Link href="/login" className="text-xs font-black text-slate-500 hover:text-green-600 transition-colors uppercase tracking-widest no-underline border-l border-slate-200 pl-4">
                                    Switch Role
                                </Link>
                            </div>

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                            >
                                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {mobileOpen && (
                        <div className="lg:hidden py-6 border-t border-slate-100 animate-slide-up">
                            <div className="grid grid-cols-1 gap-3">
                                {modules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => { setActiveTab(mod.id); setMobileOpen(false); }}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === mod.id
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <mod.icon className={`w-5 h-5 ${activeTab === mod.id ? 'text-green-400' : 'text-slate-400'}`} />
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{mod.label}</p>
                                                <p className={`text-[10px] ${activeTab === mod.id ? 'text-white/50' : 'text-slate-400'}`}>{mod.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <main>
                {/* ===== IMMERSIVE HERO WITH IMAGES ===== */}
                <section className="relative min-h-[500px] flex items-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img src="/1.jpeg" alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 text-center lg:text-left">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-md text-green-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-500/30 animate-fade-in">
                                    <Sparkles className="w-3.5 h-3.5" /> Direct Farmer Connectivity
                                </span>
                                <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight animate-slide-up stagger-1">
                                    Quality Produce. <br />
                                    <span className="text-green-400">Direct From Source.</span>
                                </h1>
                                <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl lg:mx-0 mx-auto animate-slide-up stagger-2">
                                    Empower your supply chain with AI-verified listings, fair price auditing, and seamless logistics. Source the freshest harvest from India's most reliable farmers.
                                </p>
                                <div className="flex flex-wrap lg:justify-start justify-center gap-4 animate-slide-up stagger-3">
                                    <button onClick={() => setActiveTab('search')} className="px-8 py-4 bg-green-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-green-700 transition-all hover:-translate-y-1 shadow-2xl shadow-green-600/20">
                                        Browse Inventory
                                    </button>
                                    <button onClick={() => setActiveTab('innovation')} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1">
                                        Market Analysis
                                    </button>
                                </div>
                            </div>

                            {/* Visual Image Grid */}
                            <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-lg animate-fade-in-right">
                                <div className="space-y-4 pt-8">
                                    <div className="relative group">
                                        <img src="/2.jpeg" alt="Crop 1" className="w-full h-48 object-cover rounded-[32px] border-2 border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[32px]"></div>
                                    </div>
                                    <div className="relative group">
                                        <img src="/3.jpeg" alt="Crop 2" className="w-full h-64 object-cover rounded-[32px] border-2 border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[32px]"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <img src="/4.jpeg" alt="Crop 3" className="w-full h-64 object-cover rounded-[32px] border-2 border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[32px]"></div>
                                    </div>
                                    <div className="relative group">
                                        <img src="/5.jpeg" alt="Crop 4" className="w-full h-48 object-cover rounded-[32px] border-2 border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[32px]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== FUNCTIONALITY BRIEF ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 mb-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Smart Inspection', desc: 'AI-powered quality scoring based on crop history and field health.', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { title: 'Direct Logistics', desc: 'Auto-calculate lowest freight costs from farmer to your warehouse.', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { title: 'Verified Profiles', desc: 'Every farmer is verified by Govt. IDs and platform trust ratings.', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-slide-up" style={{ transitionDelay: `${i * 100}ms` }}>
                                <div className={`w-16 h-16 ${item.bg} rounded-3xl flex items-center justify-center mb-6`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== MAIN DASHBOARD AREA ===== */}
                <section id="dashboard-content" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                                {modules.find(m => m.id === activeTab)?.label}
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Operational Area: Global</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Live Market sync</span>
                        </div>
                    </div>

                    <div className="bg-white min-h-[600px] rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                        <div className="p-1">
                            {renderContent()}
                        </div>
                    </div>
                </section>

                {/* ===== MARKET TRENDS MINI BOARD ===== */}
                <section className="bg-slate-900 overflow-hidden py-24 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-green-400 font-black tracking-widest uppercase text-xs">AI Forecasting</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">Predictive Market <span className="text-green-400">Trends</span></h2>
                            <p className="text-white/40 mt-4 max-w-2xl mx-auto font-medium">Using deep neural networks to forecast supply chain volatility and price fluctuations across 1,000+ Indian Mandis.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { crop: 'Wheat', trendStr: '+12%', status: 'Bullish', color: 'text-green-400' },
                                { crop: 'Basmati', trendStr: '-3.5%', status: 'Stable', color: 'text-blue-400' },
                                { crop: 'Mustard', trendStr: '+8.2%', status: 'Rising', color: 'text-amber-400' },
                                { crop: 'Onion', trendStr: '+24%', status: 'Critical', color: 'text-red-400' },
                            ].map((trend, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-[32px] hover:bg-white/10 transition-colors">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">{trend.crop}</p>
                                    <div className="flex items-end justify-between">
                                        <h4 className={`text-2xl font-black ${trend.color}`}>{trend.trendStr}</h4>
                                        <span className="text-[10px] font-bold text-white/60 mb-1">{trend.status}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r from-transparent to-current ${trend.color}`} style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* ===== PREMIUM FOOTER ===== */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800 tracking-tight">KrishiSetu Buyer Intelligence</p>
                                <p className="text-xs text-slate-400 font-medium">Supporting Bharat's Farmers Since 2024</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {['Pricing Engine', 'Logistics Link', 'Trust Ratings', 'Direct Connect'].map(link => (
                                <span key={link} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-green-600 cursor-pointer transition-colors">{link}</span>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">© 2024 All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
