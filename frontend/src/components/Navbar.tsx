'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Leaf, Home, DollarSign, TrendingUp, Lightbulb, BarChart3,
    Camera, Star, Truck, Menu, X, MapPin, Users, ChevronDown,
    Check, LogOut, Search, Sparkles, Box
} from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { locationData } from '@/data/locationData';

const farmerNav = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/prices', label: 'Market Prices', icon: DollarSign },
    { href: '/prediction', label: 'Price Forecast', icon: TrendingUp },
    { href: '/sell-advice', label: 'Sell Advice', icon: Lightbulb },
    { href: '/demand', label: 'Demand', icon: BarChart3 },
    { href: '/crop-detect', label: 'Crop AI', icon: Camera },
    { href: '/trust-score', label: 'Trust Score', icon: Star },
    { href: '/logistics', label: 'Logistics', icon: Truck },
];

const buyerNav = [
    { href: '/buyer', label: 'Marketplace', icon: Search },
    { href: '/buyer/prices', label: 'Fair Prices', icon: DollarSign },
    { href: '/buyer/insights', label: 'AI Insights', icon: Sparkles },
    { href: '/buyer/logistics', label: 'Logistics', icon: Truck },
    { href: '/buyer/orders', label: 'My Orders', icon: Box },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const locationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const { state, district, mandi, setState, setDistrict, setMandi, displayLabel } = useLocation();

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setLocationOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const navItems = user?.role === 'buyer' ? buyerNav : farmerNav;
    const selectedState = locationData.find(s => s.name === state);
    const selectedDistrict = selectedState?.districts.find(d => d.name === district);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user?.role === 'buyer' ? '/buyer' : '/'} className="flex items-center gap-3 no-underline">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${user?.role === 'buyer' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-green-500 to-green-700'}`}>
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">
                                <span className={user?.role === 'buyer' ? 'text-blue-600' : 'text-green-600'}>Krishi</span>
                                <span className="text-slate-800">Setu</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none mt-0.5">
                                {user?.role === 'buyer' ? 'Buyer Terminal' : 'Digital Agri Platform'}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${pathname === item.href ? 'active' : ''} ${user?.role === 'buyer' ? 'hover:text-blue-600' : ''}`}
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
                                <MapPin className={`w-3 h-3 flex-shrink-0 ${user?.role === 'buyer' ? 'text-blue-600' : 'text-green-600'}`} />
                                <span className="max-w-[120px] truncate">{displayLabel}</span>
                                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {locationOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📍 Set Your Location</p>
                                    <div className="mb-3">
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">State</label>
                                        <select className="select-field w-full text-sm" value={state} onChange={e => setState(e.target.value)}>
                                            <option value="">Select State</option>
                                            {locationData.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-xs font-semibold text-slate-500 block mb-1">District</label>
                                        <select className="select-field w-full text-sm" value={district} onChange={e => setDistrict(e.target.value)} disabled={!state}>
                                            <option value="">Select District</option>
                                            {selectedState?.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={() => setLocationOpen(false)} className={`btn-primary w-full justify-center text-sm ${user?.role === 'buyer' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                                        <Check className="w-4 h-4" /> Apply Location
                                    </button>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all group"
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white ${user.role === 'buyer' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 hidden md:block">{user.name.split(' ')[0]}</span>
                                    <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                                            <p className="text-xs font-bold text-slate-700 truncate">{user.mobile}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 px-3 py-1.5 no-underline hover:text-green-600 font-bold">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="btn-primary py-1.5 px-4 text-xs">
                                    Join Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
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
                                        ? (user?.role === 'buyer' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200')
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

