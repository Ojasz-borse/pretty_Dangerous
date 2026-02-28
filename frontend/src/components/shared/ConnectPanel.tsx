'use client';

import React, { useState } from 'react';
import { Users, Star, MapPin, Shield, ArrowRight, MessageCircle, Phone, Mail, TrendingUp, Search } from 'lucide-react';

interface ConnectUser {
    id: string;
    name: string;
    type: 'buyer' | 'farmer';
    location: string;
    trustScore: number;
    totalDeals: number;
    speciality: string;
    rating: number;
    image: string;
    responseTime: string;
}

const mockBuyers: ConnectUser[] = [
    { id: 'b1', name: 'Reliance Fresh', type: 'buyer', location: 'Mumbai, Maharashtra', trustScore: 96, totalDeals: 342, speciality: 'Wheat, Rice, Pulses', rating: 4.8, image: '/3.webp', responseTime: '< 2 hours' },
    { id: 'b2', name: 'BigBasket Agri', type: 'buyer', location: 'Bangalore, Karnataka', trustScore: 93, totalDeals: 218, speciality: 'Vegetables, Fruits', rating: 4.7, image: '/3.webp', responseTime: '< 4 hours' },
    { id: 'b3', name: 'ITC Agri Division', type: 'buyer', location: 'Hyderabad, Telangana', trustScore: 98, totalDeals: 567, speciality: 'Wheat, Spices, Cotton', rating: 4.9, image: '/3.webp', responseTime: '< 1 hour' },
    { id: 'b4', name: 'Adani Wilmar', type: 'buyer', location: 'Ahmedabad, Gujarat', trustScore: 91, totalDeals: 156, speciality: 'Mustard, Soybean', rating: 4.5, image: '/3.webp', responseTime: '< 6 hours' },
    { id: 'b5', name: 'Mother Dairy', type: 'buyer', location: 'Delhi', trustScore: 94, totalDeals: 280, speciality: 'Milk Products, Grains', rating: 4.6, image: '/3.webp', responseTime: '< 3 hours' },
    { id: 'b6', name: 'Ninjacart', type: 'buyer', location: 'Chennai, Tamil Nadu', trustScore: 89, totalDeals: 145, speciality: 'Fresh Produce', rating: 4.4, image: '/3.webp', responseTime: '< 5 hours' },
];

const mockFarmers: ConnectUser[] = [
    { id: 'f1', name: 'Rajesh Kumar', type: 'farmer', location: 'Sirsa, Haryana', trustScore: 92, totalDeals: 48, speciality: 'Wheat, Mustard', rating: 4.7, image: '/wheat.jpg', responseTime: '< 1 hour' },
    { id: 'f2', name: 'Gurpreet Singh', type: 'farmer', location: 'Karnal, Punjab', trustScore: 88, totalDeals: 35, speciality: 'Basmati Rice', rating: 4.5, image: '/rice.jpg', responseTime: '< 2 hours' },
    { id: 'f3', name: 'Amit Sharma', type: 'farmer', location: 'Bhatinda, Punjab', trustScore: 95, totalDeals: 62, speciality: 'Cotton, Wheat', rating: 4.9, image: '/cotton.jpg', responseTime: '< 30 min' },
    { id: 'f4', name: 'Suresh Patil', type: 'farmer', location: 'Nashik, Maharashtra', trustScore: 87, totalDeals: 29, speciality: 'Onion, Grapes', rating: 4.4, image: '/onion.avif', responseTime: '< 4 hours' },
    { id: 'f5', name: 'Ramesh Yadav', type: 'farmer', location: 'Hisar, Haryana', trustScore: 91, totalDeals: 41, speciality: 'Mustard, Wheat', rating: 4.6, image: '/mustard.jpg', responseTime: '< 2 hours' },
    { id: 'f6', name: 'Harjinder Singh', type: 'farmer', location: 'Ludhiana, Punjab', trustScore: 89, totalDeals: 38, speciality: 'Maize, Rice', rating: 4.5, image: '/maize.jpeg', responseTime: '< 3 hours' },
];

interface ConnectPanelProps {
    userType: 'farmer' | 'buyer';
}

export default function ConnectPanel({ userType }: ConnectPanelProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'trustScore' | 'totalDeals' | 'rating'>('trustScore');
    const [contacted, setContacted] = useState<Set<string>>(new Set());

    // Farmer sees buyers, buyer sees farmers
    const listings = userType === 'farmer' ? mockBuyers : mockFarmers;
    const otherLabel = userType === 'farmer' ? 'Buyers' : 'Farmers';

    const filtered = listings
        .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.speciality.toLowerCase().includes(search.toLowerCase()) || u.location.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b[sortBy] - a[sortBy]);

    const handleConnect = (id: string) => {
        setContacted(prev => new Set(prev).add(id));
    };

    const getTrustColor = (score: number) => {
        if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="card card-3d p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-800">
                                Find Trusted <span className="gradient-text">{otherLabel}</span>
                            </h2>
                            <p className="text-xs text-slate-400">Connect directly — sorted by trust score</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {(['trustScore', 'totalDeals', 'rating'] as const).map(key => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key)}
                                className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${sortBy === key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            >
                                {key === 'trustScore' ? 'Trust' : key === 'totalDeals' ? 'Deals' : 'Rating'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="mt-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="input-field pl-10"
                        placeholder={`Search ${otherLabel.toLowerCase()} by name, crop, or location...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((user, i) => (
                    <div key={user.id} className={`card card-3d overflow-hidden animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                        <div className="flex gap-4 p-5">
                            <img src={user.image} alt={user.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-bold text-slate-800 truncate">{user.name}</h3>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${getTrustColor(user.trustScore)}`}>
                                        <Shield className="w-3 h-3" />
                                        {user.trustScore}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3" /> {user.location}
                                </p>
                                <p className="text-xs text-slate-500 mb-2">{user.speciality}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {user.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-green-500" /> {user.totalDeals} deals
                                    </span>
                                    <span>⏱ {user.responseTime}</span>
                                </div>

                                {contacted.has(user.id) ? (
                                    <div className="flex items-center gap-2">
                                        <span className="badge-green text-xs flex items-center gap-1">✅ Connected</span>
                                        <button className="btn-outline text-xs py-1 gap-1"><Phone className="w-3 h-3" /> Call</button>
                                        <button className="btn-outline text-xs py-1 gap-1"><MessageCircle className="w-3 h-3" /> Chat</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(user.id)}
                                        className="btn-primary text-xs py-1.5 gap-1.5"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" /> Connect Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="card p-8 text-center">
                    <p className="text-slate-400">No {otherLabel.toLowerCase()} found matching your search.</p>
                </div>
            )}
        </div>
    );
}
