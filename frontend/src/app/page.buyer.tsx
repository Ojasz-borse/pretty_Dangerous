'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
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
    ChevronRight,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const features = [
    { href: '/prices', icon: DollarSign, color: 'bg-green-600', bg: 'bg-green-50', border: 'border-green-200', title: 'Market Prices', desc: 'Real-time mandi prices from Agmarknet with stock-market style charts and price comparisons across markets.' },
    { href: '/prediction', icon: TrendingUp, color: 'bg-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', title: 'Price Forecast', desc: 'AI-powered 7-day price prediction using historical data, weather patterns, and market trends.' },
    { href: '/sell-advice', icon: Lightbulb, color: 'bg-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', title: 'Sell or Wait', desc: 'Smart recommendation engine telling you the best time to sell based on demand, price forecast, and storage costs.' },
    { href: '/demand', icon: BarChart3, color: 'bg-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', title: 'Demand Insights', desc: 'Regional demand analysis with Google Trends data, festival impacts, and crop-wise demand scores.' },
    { href: '/crop-detect', icon: Camera, color: 'bg-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', title: 'Crop Detection AI', desc: 'Upload crop images for AI identification, quality grading, health assessment, and harvest recommendations.' },
    { href: '/trust-score', icon: Star, color: 'bg-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', title: 'Trust Score', desc: 'Your reliability rating based on delivery history, quality, and buyer reviews — build trust with buyers.' },
];



export default function Home() {
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/30">
            <Navbar />

            <main className="overflow-hidden" ref={mainRef}>
                {/* ===== PREMIUM HERO ===== */}
                <section className="relative min-h-[700px] lg:min-h-[850px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/farmer_corner_banner (1).jpg"
                            alt="Indian farmers working"
                            className="w-full h-full object-cover scale-105 animate-slow-zoom"
                        />
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[0.5px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/20"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 lg:py-32">
                        <div className="max-w-4xl lg:text-left text-center">
                            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-xl text-green-300 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-green-500/30 animate-fade-in shadow-2xl shadow-green-500/20">
                                <Sparkles className="w-4 h-4 icon-glow" /> Digital India Initiative
                            </div>
                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] mb-10 tracking-tight text-white animate-slide-up stagger-1">
                                Empowering the <br />
                                <span className="gradient-text">Future of Farming.</span>
                            </h1>
                            <p className="text-white/80 text-lg sm:text-2xl mb-14 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium animate-slide-up stagger-2 drop-shadow-md">
                                The all-in-one AI platform for Indian farmers. Real-time Mandi prices, deep-learning crop diagnostics, and smart market logistics.
                            </p>
                            <div className="flex flex-wrap lg:justify-start justify-center gap-6 animate-slide-up stagger-3">
                                <Link href="/prices" className="group inline-flex items-center gap-3 bg-green-600 text-white font-black px-12 py-5 rounded-[2rem] hover:bg-green-700 transition-all no-underline shadow-2xl shadow-green-600/30 hover:-translate-y-2 text-sm uppercase tracking-widest pulse-glow">
                                    <DollarSign className="w-5 h-5" /> Start Trading <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <Link href="/login" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-2xl text-white font-black px-12 py-5 rounded-[2rem] hover:bg-white/20 transition-all no-underline border border-white/20 hover:-translate-y-2 text-sm uppercase tracking-widest">
                                    <Users className="w-5 h-5" /> Join KrishiSetu
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Live Ticker Area */}
                    <div className="absolute bottom-12 left-0 right-0 z-20 overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-white/60 font-bold text-sm">Visit the Prices page for live mandi rates</span>
                                    <ArrowRight className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== FEATURE SHOWCASE ===== */}
                <section className="relative py-32 bg-slate-50 rounded-[4rem] -mt-20 z-30 shadow-2xl shadow-slate-200/40 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-10">
                            <div className="max-w-3xl scroll-reveal">
                                <span className="text-green-600 font-black tracking-[0.3em] uppercase text-xs mb-4 block">Our Ecosystem</span>
                                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                                    Everything you need to <br />
                                    <span className="text-green-600 underline decoration-green-100 decoration-[12px] underline-offset-[12px]">scale your harvest.</span>
                                </h2>
                            </div>
                            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-md lg:text-right scroll-reveal">
                                Integrated digital solutions designed specifically for the Indian agricultural landscape.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {features.map((f, i) => (
                                <Link key={i} href={f.href} className={`scroll-reveal group relative bg-slate-50 p-10 rounded-[4rem] border border-slate-100 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(22,163,74,0.15)] hover:border-green-200 transition-all duration-700 no-underline overflow-hidden card-3d`} style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className={`w-20 h-20 rounded-3xl ${f.color} flex items-center justify-center mb-8 shadow-2xl shadow-current/30 group-hover:scale-110 transition-transform duration-700`}>
                                        <f.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-green-700 transition-colors">{f.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium mb-10">{f.desc}</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Govt. Verified</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all duration-500 shadow-lg">
                                            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== TRUST BANNER ===== */}
                <section className="scroll-reveal py-32 overflow-hidden bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="relative scroll-reveal">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
                                <img src="/347052-field-77087361280.avif" alt="Field" className="relative rounded-[5rem] shadow-2xl border-[12px] border-white z-10 w-full object-cover aspect-[4/3]" />
                                <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[3rem] shadow-2xl z-20 border border-slate-100 flex items-center gap-6 animate-float">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                                        <Star className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">4.9/5</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Farmer Rating</p>
                                    </div>
                                </div>
                            </div>
                            <div className="scroll-reveal delay-200">
                                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tight">
                                    Building trust in <br />
                                    <span className="text-green-600">every grain sold.</span>
                                </h2>
                                <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium">
                                    We bridge the gap between hard-working farmers and honest buyers. Our platform ensures transparency, prompt payments, and logistical excellence.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        'Secure direct payments via platform escrows',
                                        'Verified buyer network with trust scores',
                                        'Real-time price auditing using ML models',
                                        'Transparent quality inspection reports'
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="font-bold text-slate-700">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== CALL TO ACTION ===== */}
                <section className="scroll-reveal max-w-7xl mx-auto px-4 sm:px-6 py-20">
                    <div className="relative bg-slate-900 rounded-[5rem] p-12 lg:p-24 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full -mr-64 -mt-64 blur-[100px]"></div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl sm:text-7xl font-black text-white mb-10 tracking-tight leading-none"> Ready to transform <br /><span className="text-green-400">your business?</span></h2>
                            <p className="text-white/60 text-xl mb-14 max-w-2xl mx-auto font-medium">Join thousands of Indian farmers and buyers already using KrishiSetu to find better deals and better crops.</p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/signup" className="px-12 py-5 bg-white text-slate-950 font-black rounded-[2rem] hover:bg-slate-100 transition-all hover:scale-105 shadow-2xl text-sm uppercase tracking-widest no-underline">
                                    Create Free Account
                                </Link>
                                <Link href="/prices" className="px-12 py-5 bg-green-600 text-white font-black rounded-[2rem] hover:bg-green-700 transition-all hover:scale-105 shadow-2xl text-sm uppercase tracking-widest no-underline">
                                    Browse Mandis Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== SYSTEM STATS ===== */}
                <section className="scroll-reveal bg-white py-20 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { label: 'Farmers Joined', value: '50k+', color: 'text-green-600' },
                                { label: 'Tonnes Traded', value: '1.2M', color: 'text-blue-600' },
                                { label: 'Mandi Coverage', value: '800+', color: 'text-purple-600' },
                                { label: 'Verified Buyers', value: '12k', color: 'text-amber-600' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                                    <p className={`text-4xl sm:text-6xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-950 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-2xl shadow-green-600/20">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">KrishiSetu</h2>
                    </div>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-10 leading-relaxed font-medium">A unified digital platform empowering the Indian agricultural community through AI, transparency, and logical connectivity.</p>
                    <div className="flex flex-wrap justify-center gap-8 mb-16 text-xs font-black uppercase tracking-widest text-white/60">
                        {['Digital Markets', 'AI Diagnostics', 'Smart Logistics', 'Farmer Trust'].map(link => (
                            <span key={link} className="hover:text-green-400 cursor-pointer transition-colors">{link}</span>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">© 2024 KRISHISETU TECHNOLOGY PVT LTD</p>
                        <div className="flex items-center gap-6 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                            <span>Support Center</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
