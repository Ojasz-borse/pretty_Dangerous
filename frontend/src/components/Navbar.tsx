'use client';

import React, { useState, useRef, useEffect } from 'react';
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
    MapPin,
    Users,
    ChevronDown,
    Check
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { locationData } from '@/data/locationData';

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
    const [locationOpen, setLocationOpen] = useState(false);
    const locationRef = useRef<HTMLDivElement>(null);

    const { state, district, mandi, setState, setDistrict, setMandi, displayLabel } = useLocation();

    // Close dropdown on outside click
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setLocationOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const selectedState = locationData.find(s => s.name === state);
    const selectedDistrict = selectedState?.districts.find(d => d.name === district);

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
                    <div className="flex items-center gap-2">
                        {/* Dynamic Location Picker */}
                        <div className="relative hidden sm:block" ref={locationRef}>
                            <button
                                onClick={() => setLocationOpen(!locationOpen)}
                                className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors font-medium"
                            >
                                <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span className="max-w-[120px] truncate">{displayLabel}</span>
                                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {locationOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📍 Set Your Location</p>

                                    {/* State */}
                                    <div className="mb-3">
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">State</label>
                                        <select
                                            className="select-field w-full text-sm"
                                            value={state}
                                            onChange={e => setState(e.target.value)}
                                        >
                                            <option value="">Select State</option>
                                            {locationData.map(s => (
                                                <option key={s.code} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* District */}
                                    <div className="mb-3">
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">District</label>
                                        <select
                                            className="select-field w-full text-sm"
                                            value={district}
                                            onChange={e => setDistrict(e.target.value)}
                                            disabled={!state}
                                        >
                                            <option value="">Select District</option>
                                            {selectedState?.districts.map(d => (
                                                <option key={d.name} value={d.name}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Mandi */}
                                    <div className="mb-4">
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">Mandi (optional)</label>
                                        <select
                                            className="select-field w-full text-sm"
                                            value={mandi}
                                            onChange={e => setMandi(e.target.value)}
                                            disabled={!district}
                                        >
                                            <option value="">All Mandis</option>
                                            {selectedDistrict?.mandis.map(m => (
                                                <option key={m.code} value={m.name}>{m.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => setLocationOpen(false)}
                                        className="btn-primary w-full justify-center text-sm"
                                    >
                                        <Check className="w-4 h-4" /> Apply Location
                                    </button>
                                </div>
                            )}
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
                        <div className="grid grid-cols-2 gap-2 mb-3">
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
                        {/* Mobile location row */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                            <select className="select-field text-xs" value={state} onChange={e => setState(e.target.value)}>
                                <option value="">Select State</option>
                                {locationData.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                            </select>
                            <select className="select-field text-xs" value={district} onChange={e => setDistrict(e.target.value)} disabled={!state}>
                                <option value="">Select District</option>
                                {selectedState?.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
