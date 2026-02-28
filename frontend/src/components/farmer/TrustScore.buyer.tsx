'use client';

import React, { useState, useEffect } from 'react';
import {
    Star, Shield, Award, TrendingUp, CheckCircle, Truck, Users,
    Clock, IndianRupee, ThumbsUp, ArrowRight, MessageCircle,
    Phone, Search, Filter, SortAsc, HelpCircle, AlertCircle,
    BarChart, Info, MapPin, Activity, Check
} from 'lucide-react';
import type { TrustScore as TrustScoreType, ApiResponse } from '@/types/farmer';

interface TrustBreakdown {
    paymentSpeed: number;
    disputeRate: number;
    volumeConsistency: number;
}

interface BuyerInfo {
    id: string;
    name: string;
    location: string;
    trustScore: number;
    deals: number;
    speciality: string;
    responseTime: string;
    verified: boolean;
    breakdown: TrustBreakdown;
}

const trustedBuyers: BuyerInfo[] = [
    { id: 'b1', name: 'Reliance Fresh (Agri)', location: 'Mumbai, Maharashtra', trustScore: 98, deals: 1240, speciality: 'Wheat, Rice, Pulses', responseTime: '< 30 mins', verified: true, breakdown: { paymentSpeed: 99, disputeRate: 1, volumeConsistency: 95 } },
    { id: 'b2', name: 'ITC Agri Division', location: 'Hyderabad, Telangana', trustScore: 96, deals: 890, speciality: 'Wheat, Spices, Cotton', responseTime: '< 1 hour', verified: true, breakdown: { paymentSpeed: 97, disputeRate: 2, volumeConsistency: 92 } },
    { id: 'b3', name: 'BigBasket Wholesale', location: 'Bangalore, Karnataka', trustScore: 94, deals: 450, speciality: 'Vegetables, Fruits', responseTime: '< 2 hours', verified: true, breakdown: { paymentSpeed: 92, disputeRate: 3, volumeConsistency: 90 } },
    { id: 'b4', name: 'Adani Wilmar Ltd', location: 'Ahmedabad, Gujarat', trustScore: 92, deals: 320, speciality: 'Mustard, Soybean', responseTime: '< 4 hours', verified: true, breakdown: { paymentSpeed: 90, disputeRate: 4, volumeConsistency: 88 } },
    { id: 'b5', name: 'Mother Dairy Mandi', location: 'Delhi NCR', trustScore: 91, deals: 670, speciality: 'Milk, Grains', responseTime: '< 3 hours', verified: true, breakdown: { paymentSpeed: 89, disputeRate: 5, volumeConsistency: 85 } },
    { id: 'b6', name: 'Ninjacart Direct', location: 'Chennai, Tamil Nadu', trustScore: 89, deals: 210, speciality: 'Organic Produce', responseTime: '< 5 hours', verified: true, breakdown: { paymentSpeed: 85, disputeRate: 7, volumeConsistency: 82 } },
];

export default function TrustScore() {
    const [trustData, setTrustData] = useState<TrustScoreType | null>(null);
    const [loading, setLoading] = useState(true);
    const [contacted, setContacted] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'trustScore' | 'deals'>('trustScore');
    const [showBreakdown, setShowBreakdown] = useState<string | null>(null);

    useEffect(() => {
        if (!loading) {
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

            document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
            return () => observer.disconnect();
        }
    }, [loading, searchTerm, sortBy]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/farmer/trust-score');
                const data: ApiResponse<TrustScoreType> = await response.json();
                if (data.success && data.data) setTrustData(data.data);
            } catch (error) { console.error('Stats error'); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    const filteredBuyers = trustedBuyers
        .filter(b =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.speciality.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b[sortBy] - a[sortBy]);

    const getScoreColor = (score: number) => {
        if (score >= 95) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 90) return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-amber-600 bg-amber-50 border-amber-100';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-24 gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500/30" />
            </div>
            <div className="text-center">
                <p className="text-sm font-bold text-slate-800 tracking-tight">Verifying Buyer Liquidity...</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">Syncing with Mandi Data</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-16">
            {/* ====== ELITE HEADER SECTION ====== */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 scroll-reveal">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Global Trust Registry</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                        Connect with <span className="text-emerald-500">Verified</span> <br /> Institutional Buyers.
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        KrishiSetu evaluates 15+ metrics including payment promptness, quality adherence, and logistics reliability. Sell with total confidence.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
                    <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <Star className="w-8 h-8 text-emerald-500 fill-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Reputation Score</p>
                        <div className="flex items-end gap-1">
                            <span className="text-4xl font-black text-slate-900 leading-none">{trustData?.overallScore || 88}</span>
                            <span className="text-sm font-bold text-slate-400 mb-1">/100</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== REFINED FILTERS ====== */}
            <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] border border-slate-200 shadow-lg flex flex-col md:flex-row gap-4 scroll-reveal">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by company name or crop focus..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 transition-all outline-none placeholder:text-slate-400 shadow-inner"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                        {(['trustScore', 'deals'] as const).map(key => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === key ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {key === 'trustScore' ? 'Elite Rating' : 'High Volume'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ====== PREMIUM BUYER GRID ====== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {filteredBuyers.length > 0 ? filteredBuyers.map((buyer, i) => (
                    <div key={buyer.id} className={`scroll-reveal group flex flex-col bg-white rounded-[3rem] border border-slate-200 hover:border-emerald-500/30 transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden stagger-${(i % 3) + 1}`}>

                        {/* Card Header Area */}
                        <div className="p-8 pb-4 relative">
                            {buyer.verified && (
                                <div className="absolute top-8 right-8 flex items-center gap-1 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                    <Award className="w-3 h-3" /> Verified
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-700 shadow-sm">
                                    <span className="text-3xl font-black text-slate-900 group-hover:text-white transition-colors">{buyer.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-900 text-xl leading-tight truncate">{buyer.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wide truncate">{buyer.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Core Stats Bar */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className={`p-4 rounded-3xl border ${getScoreColor(buyer.trustScore)}`}>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">Trust Score</p>
                                    <div className="flex items-center gap-1 font-black text-lg leading-none">
                                        {buyer.trustScore}
                                        <span className="text-[10px] opacity-60">%</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 text-slate-600">
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">Total Deals</p>
                                    <div className="flex items-center gap-1 font-black text-lg leading-none text-slate-800">
                                        {buyer.deals}
                                        <span className="text-[10px] text-slate-400">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Metrics */}
                        <div className="px-8 flex-1">
                            <button
                                onClick={() => setShowBreakdown(showBreakdown === buyer.id ? null : buyer.id)}
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all mb-4"
                            >
                                <span className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5" /> Stability Metrics
                                </span>
                                {showBreakdown === buyer.id ? 'Hide' : 'Details'}
                            </button>

                            {showBreakdown === buyer.id && (
                                <div className="space-y-4 py-2 border-t border-slate-100 animate-fade-in mb-4">
                                    {[
                                        { label: 'Payment Speed', val: buyer.breakdown.paymentSpeed },
                                        { label: 'Fair Pricing', val: 100 - (buyer.breakdown.disputeRate * 5) },
                                        { label: 'Order Continuity', val: buyer.breakdown.volumeConsistency }
                                    ].map((metric, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[9px] font-bold">
                                                <span className="text-slate-400 uppercase tracking-widest">{metric.label}</span>
                                                <span className="text-slate-900">{metric.val}%</span>
                                            </div>
                                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metric.val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Crop Focus List */}
                            <div className="mb-8">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Commodity Specialty</p>
                                <div className="flex flex-wrap gap-2">
                                    {buyer.speciality.split(', ').map(s => (
                                        <span key={s} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold shadow-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="p-8 pt-0 mt-auto">
                            {contacted.has(buyer.id) ? (
                                <div className="grid grid-cols-2 gap-3 animate-fade-in">
                                    <button className="flex items-center justify-center gap-2 bg-slate-900 py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                                        <Phone className="w-3.5 h-3.5" /> Call Rep
                                    </button>
                                    <button className="flex items-center justify-center gap-2 bg-emerald-500 py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                                        <MessageCircle className="w-3.5 h-3.5" /> Chat Live
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setContacted(prev => new Set(prev).add(buyer.id))}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-50 py-5 rounded-[1.8rem] text-[11px] font-black text-slate-800 uppercase tracking-widest border border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300"
                                >
                                    Negotiate Trade <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-40 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Matching Buyers</h3>
                        <p className="text-slate-400 mt-2 font-medium">Try broadening your search criteria.</p>
                    </div>
                )}
            </div>

            {/* ====== STRUCTURED FRAMEWORK ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-reveal">
                <div className="p-12 bg-white rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative space-y-8">
                        <div className="inline-flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <Activity className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Audit Framework</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'Payment Punctuality', desc: 'Weighted average of bank settlement latency across 1,000+ trades.' },
                                { title: 'Quality Adherence', desc: 'Score based on historical weighment disputes and inspection failures.' },
                                { title: 'Financial Solvency', desc: 'Real-time liquidity verification ensuring bulk trade guarantees.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 group/item">
                                    <div className="w-12 h-12 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                        0{idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900 leading-none mb-2">{item.title}</p>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-12 bg-emerald-500 rounded-[4rem] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 animate-pulse"></div>
                    <div className="relative space-y-10">
                        <h4 className="text-3xl font-black tracking-tight leading-none px-2">Elite <br /> Trader Insights</h4>
                        <div className="grid gap-6">
                            {[
                                'Elite-rated (95+) buyers settle funds within 6 hours of mandi verification.',
                                'Long-term contracts with high-volume buyers often include free logistics support.',
                                'Verify your farm location via GPS to appear in "local buy-back" programs.',
                                'Consistently high quality produce unlocks "Priority Trader" status with premiums.'
                            ].map((tip, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-5 bg-white/10 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all">
                                    <div className="mt-1 w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <p className="text-[15px] font-bold leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
