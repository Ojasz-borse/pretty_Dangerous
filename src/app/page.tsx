'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { mockMarkets } from '@/data/mockMandiData';
import {
    DollarSign,
    TrendingUp,
    Lightbulb,
    BarChart3,
    Camera,
    Star,
    Truck,
    ArrowRight,
    Leaf,
    Shield,
    Zap,
    Users,
    ChevronRight
} from 'lucide-react';

const features = [
    { href: '/prices', icon: DollarSign, color: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-200', title: 'Market Prices', desc: 'Real-time mandi prices from Agmarknet with stock-market style charts and price comparisons across markets.' },
    { href: '/prediction', icon: TrendingUp, color: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', title: 'Price Forecast', desc: 'AI-powered 7-day price prediction using historical data, weather patterns, and market trends.' },
    { href: '/sell-advice', icon: Lightbulb, color: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', title: 'Sell or Wait', desc: 'Smart recommendation engine telling you the best time to sell based on demand, price forecast, and storage costs.' },
    { href: '/demand', icon: BarChart3, color: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', title: 'Demand Insights', desc: 'Regional demand analysis with Google Trends data, festival impacts, and crop-wise demand scores.' },
    { href: '/crop-detect', icon: Camera, color: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', title: 'Crop Detection AI', desc: 'Upload crop images for AI identification, quality grading, health assessment, and harvest recommendations.' },
    { href: '/trust-score', icon: Star, color: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', title: 'Trust Score', desc: 'Your reliability rating based on delivery history, quality, and buyer reviews — build trust with buyers.' },
    { href: '/logistics', icon: Truck, color: 'bg-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', title: 'Logistics Calculator', desc: 'Calculate transport costs, compare vehicle options, and see net profit estimates for different delivery routes.' },
];

const allItems = mockMarkets.flatMap(m => m.items.map(i => ({ ...i, market: m.name })));

export default function Home() {
    return (
        <>
            <Navbar />



            <main className="bg-white">
                {/* ===== HERO ===== */}
                <section className="relative min-h-[600px] lg:min-h-[750px] flex items-center justify-center overflow-hidden">
                    {/* Background Image - Full Big */}
                    <img
                        src="/farmer_corner_banner (1).jpg"
                        alt="Indian farmers working"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Sophisticated Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-32">
                        {/* Left Aligned Content (No Box) */}
                        <div className="max-w-3xl lg:text-left text-center text-white animate-fade-in">
                            <span className="inline-flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md text-green-300 px-4 py-1.5 rounded-full text-sm font-bold mb-8 border border-green-500/30">
                                <Leaf className="w-4 h-4" /> Government of India Initiative
                            </span>
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight drop-shadow-2xl">
                                The Future of <span className="text-green-400 font-black">Indian Farming</span> <br className="hidden lg:block" /> is here.
                            </h1>
                            <p className="text-white/90 text-lg sm:text-xl mb-12 max-w-2xl lg:mx-0 mx-auto leading-relaxed drop-shadow-md font-medium">
                                Real-time mandi prices, AI-driven predictions, and smart logistics. Join 50,000+ farmers maximizing their income every month.
                            </p>
                            <div className="flex flex-wrap lg:justify-start justify-center gap-4">
                                <Link href="/prices" className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-green-600 transition-all no-underline shadow-xl shadow-green-500/20 hover:-translate-y-1 text-base">
                                    <DollarSign className="w-5 h-5" /> Live Market Prices
                                </Link>
                                <Link href="/prediction" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/20 transition-all no-underline border border-white/20 hover:-translate-y-1 text-base">
                                    <TrendingUp className="w-5 h-5 text-blue-400" /> AI Forecast
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Ticker Overlay at Bottom of Big Hero */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-lg border-t border-white/10">
                        <div className="max-w-7xl mx-auto py-4">
                            <div className="overflow-hidden whitespace-nowrap">
                                <div className="ticker-inner">
                                    {[...allItems, ...allItems].map((item, i) => (
                                        <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
                                            <span className="text-xl">{item.imageIcon}</span>
                                            <span className="font-bold text-white">{item.name}</span>
                                            <span className="text-white/80 font-medium">₹{item.pricePerKg}/kg</span>
                                            <span className={item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
                                                {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '—'} {item.trendPercentage}%
                                            </span>
                                            <span className="text-white/10">|</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== QUICK STATS ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Markets', value: '2,500+', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 shadow-green-100' },
                            { label: 'Crops Tracked', value: '150+', icon: Leaf, color: 'text-blue-600', bg: 'bg-blue-50 shadow-blue-100' },
                            { label: 'Farmers Served', value: '50,000+', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 shadow-purple-100' },
                            { label: 'States Covered', value: '28', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50 shadow-amber-100' },
                        ].map((stat, i) => (
                            <div key={i} className="group flex flex-col items-center text-center animate-fade-in-up">
                                <div className={`w-20 h-20 ${stat.bg.split(' ')[0]} rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className={`w-10 h-10 ${stat.color}`} />
                                </div>
                                <p className="text-4xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</p>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== FEATURE GRID ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 my-10 border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Smart Tools for <span className="text-green-600 underline decoration-green-200 decoration-8 underline-offset-4">Modern Farming</span></h2>
                            <p className="text-slate-500 text-lg">Integrated digital solutions to help you monitor markets, predict trends, and manage logistics seamlessly.</p>
                        </div>
                        <Link href="/prices" className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all whitespace-nowrap bg-green-50 px-6 py-3 rounded-xl border border-green-100">
                            Explore All Tools <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <Link key={i} href={f.href} className="group relative bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-green-100 hover:border-green-200 transition-all duration-500 no-underline overflow-hidden">
                                {/* Subtle pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors"></div>

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 ${f.color}`}>
                                    <f.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm mb-6">{f.desc}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">Free Service</span>
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ===== IMMERSIVE FIELD BANNER ===== */}
                <section className="relative min-h-[400px] sm:min-h-[500px] flex items-center overflow-hidden my-20">
                    <img src="/347052-field-77087361280.avif" alt="Agricultural fields" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-green-900/60 transition-opacity duration-500"></div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
                        {/* Content directly on overlay, no blur box */}
                        <div className="max-w-2xl text-white animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                                The Backbone of <span className="text-green-400">Indian Economy</span>
                            </h2>
                            <p className="text-white/90 text-lg sm:text-xl leading-relaxed mb-8 drop-shadow-md font-medium">
                                Every harvest tells a story of hard work. We're here to ensure that story ends with fair rewards and a prosperous future for every farmer.
                            </p>
                            <div className="flex flex-wrap gap-8 text-sm font-bold uppercase tracking-widest text-green-300">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span> Live Market Data</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span> AI Predictions</div>
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span> Smart Advice</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== SID-BY-SIDE STORY SECTION ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 relative order-2 lg:order-1">
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img src="/347052-field-77087361280.avif" alt="Agricultural fields" className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700" />
                            </div>
                            {/* Floating stat card */}
                            <div className="absolute -bottom-8 -right-8 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">+15%</p>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Income Boost</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2">
                            <span className="text-green-600 font-black tracking-widest uppercase text-xs mb-4 block">Our Impact</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-[1.2]">Empowering Rural Communities <span className="text-green-600">Since 2024</span></h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                We believe that technology can bridge the gap between hard-working farmers and fair market rewards. By providing transparency, we ensure every harvest gets its true value.
                            </p>

                            <div className="grid gap-6">
                                {[
                                    { title: 'Transparency', desc: 'Real-time data from 2,500+ mandis directly to your phone.', color: 'border-l-4 border-green-500' },
                                    { title: 'Intelligence', desc: 'AI-driven insights to help you decide what to grow and when to sell.', color: 'border-l-4 border-blue-500' },
                                    { title: 'Prosperity', desc: 'Optimizing logistics to reduce waste and maximize profits.', color: 'border-l-4 border-amber-500' }
                                ].map((item, i) => (
                                    <div key={i} className={`p-5 rounded-2xl bg-white shadow-sm border border-slate-100 ${item.color}`}>
                                        <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== HOW IT WORKS ===== */}
                <section className="bg-white border-y border-slate-200 py-12 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">How KrishiSetu Works</h2>
                            <p className="text-slate-500">Simple 3-step process to maximize your earnings</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: '01', title: 'Check Prices', desc: 'View real-time mandi prices across markets with stock-market style analysis.', icon: DollarSign, color: 'bg-green-500' },
                                { step: '02', title: 'Get AI Insights', desc: 'Use AI prediction, demand forecast, and sell/wait recommendations.', icon: Zap, color: 'bg-blue-500' },
                                { step: '03', title: 'Plan & Deliver', desc: 'Calculate logistics costs, find transport, and maximize your net profit.', icon: Truck, color: 'bg-purple-500' },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                        <s.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Step {s.step}</span>
                                    <h3 className="text-lg font-bold text-slate-800 mt-1 mb-2">{s.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== MANDI PRICES PREVIEW ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Today's Mandi Prices</h2>
                            <p className="text-sm text-slate-500">Live prices from {mockMarkets[0].name}</p>
                        </div>
                        <Link href="/prices" className="btn-primary text-sm no-underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockMarkets[0].items.map((item) => (
                            <div key={item.id} className="card p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{item.imageIcon}</span>
                                    <div>
                                        <p className="font-bold text-slate-800">{item.name}</p>
                                        <p className="text-xs text-slate-400">{item.hindiName} · {item.quality}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-slate-800">₹{item.pricePerKg}<span className="text-xs text-slate-400 font-medium">/kg</span></p>
                                    <span className={item.trend === 'up' ? 'price-badge-up' : item.trend === 'down' ? 'price-badge-down' : 'price-badge-stable'}>
                                        {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '—'} {item.trendPercentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== DATA SOURCES ===== */}
                <section className="bg-white border-t border-slate-200 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                            <span className="font-medium">Data Sources:</span>
                            {['Agmarknet', 'OpenWeather API', 'Google Trends', 'AI Vision'].map((src) => (
                                <span key={src} className="badge-gray">{src}</span>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* ===== FOOTER ===== */}
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
                            <span>Ministry of Agriculture & Farmers Welfare</span>
                            <span>·</span>
                            <span>Government of India</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
