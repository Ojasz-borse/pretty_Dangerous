'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Leaf,
    Home,
    DollarSign,
    TrendingUp,
    Lightbulb,
    BarChart3,
    Camera,
    Star,
    Truck,
    Menu,
    X,
    MapPin
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/prices', label: 'Market Prices', icon: DollarSign },
    { href: '/prediction', label: 'Price Forecast', icon: TrendingUp },
    { href: '/sell-advice', label: 'Sell Advice', icon: Lightbulb },
    { href: '/demand', label: 'Demand', icon: BarChart3 },
    { href: '/crop-detect', label: 'Crop AI', icon: Camera },
    { href: '/trust-score', label: 'Trust Score', icon: Star },
    { href: '/logistics', label: 'Logistics', icon: Truck },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 no-underline">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-sm">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">
                                <span className="text-green-600">Krishi</span>
                                <span className="text-slate-800">Setu</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none mt-0.5">Digital Agri Platform</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span className="font-medium">Sirsa, Haryana</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 badge-green text-xs rounded-full px-3 py-1.5">
                            <div className="live-dot" style={{ width: '6px', height: '6px' }}></div>
                            <span>Live</span>
                        </div>

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
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${pathname === item.href
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
