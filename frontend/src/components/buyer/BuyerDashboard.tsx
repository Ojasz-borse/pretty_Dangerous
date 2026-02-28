'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Users
} from 'lucide-react';
import SmartSearch from './SmartSearch';
import FairPriceChecker from './FairPriceChecker';
import LogisticsOptimization from './LogisticsOptimization';
import InnovationPanel from './InnovationPanel';

const modules = [
    { id: 'search', label: 'Find Crops', icon: Search, color: 'bg-blue-500' },
    { id: 'fair-price', label: 'Fair Price', icon: DollarSign, color: 'bg-green-500' },
    { id: 'logistics', label: 'Logistics', icon: Truck, color: 'bg-purple-500' },
    { id: 'innovation', label: 'AI Insights', icon: Sparkles, color: 'bg-amber-500' },
];

export default function BuyerDashboard() {
    const [selectedListing, setSelectedListing] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('search');
    const [mobileOpen, setMobileOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'search':
                return <SmartSearch onSelectListing={setSelectedListing} selectedListing={selectedListing} />;
            case 'fair-price':
                return <FairPriceChecker />;
            case 'logistics':
                return <LogisticsOptimization />;
            case 'innovation':
                return <InnovationPanel />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* ===== NAVBAR (same style as farmer) ===== */}
            <nav className="navbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/login" className="flex items-center gap-3 no-underline">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-sm">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-none">
                                    <span className="text-green-600">Krishi</span>
                                    <span className="text-slate-800">Setu</span>
                                </h1>
                                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none mt-0.5">Buyer Dashboard</p>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {modules.map((mod) => (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveTab(mod.id)}
                                    className={`nav-link ${activeTab === mod.id ? 'active' : ''}`}
                                >
                                    <mod.icon className="w-4 h-4" />
                                    {mod.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                <ShoppingCart className="w-3 h-3 text-blue-600" />
                                <span className="font-medium">Buyer Portal</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 badge-green text-xs rounded-full px-3 py-1.5">
                                <div className="live-dot" style={{ width: '6px', height: '6px' }}></div>
                                <span>Live</span>
                            </div>
                            <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 no-underline hover:bg-slate-100 transition-colors">
                                <Users className="w-3 h-3 text-green-600" />
                                <span className="font-medium">Switch Role</span>
                            </Link>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {mobileOpen && (
                        <div className="lg:hidden pb-4 border-t border-slate-100 mt-2 pt-3">
                            <div className="grid grid-cols-2 gap-2">
                                {modules.map((mod) => (
                                    <button
                                        key={mod.id}
                                        onClick={() => { setActiveTab(mod.id); setMobileOpen(false); }}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === mod.id
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <mod.icon className="w-4 h-4" />
                                        {mod.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <main className="bg-white">
                {/* ===== QUICK STATS ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Available Listings', value: '1,248', icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', border: 'card-blue' },
                            { label: 'Verified Farmers', value: '856', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'card-green' },
                            { label: 'Avg Trust Score', value: '85/100', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'card-purple' },
                            { label: 'Fair Price Range', value: 'Active', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', border: 'card-orange' },
                        ].map((stat, i) => (
                            <div key={i} className={`stat-card ${stat.border} animate-fade-in-up`} style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== CONTENT AREA ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 animate-fade-in-up delay-400">
                    {renderContent()}
                </section>
            </main>

            {/* ===== FOOTER (same style as farmer) ===== */}
            <footer className="footer py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                                <Leaf className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm">© 2024 KrishiSetu — AI-Powered Agricultural Intelligence Platform</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Buyer Portal</span>
                            <span>·</span>
                            <span>Fair Trade Certified</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
