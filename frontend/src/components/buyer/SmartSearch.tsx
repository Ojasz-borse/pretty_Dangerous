'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, CheckCircle2, ShoppingCart, IndianRupee, Package, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { useAuth } from '@/context/AuthContext';
import { locationData, cropOptions } from '@/data/locationData';
import PaymentModal from '@/components/shared/PaymentModal';

interface Listing {
    id: string;
    crop: string;
    variety: string;
    quantity: string;
    price: string;
    location: string;
    state: string;
    district: string;
    farmer: string;
    trustScore: number;
    image: string;
    isFarmerListed?: boolean;
}

interface SmartSearchProps {
    onSelectListing: (id: string) => void;
    selectedListing: string | null;
}

const cropImageMap: Record<string, string> = {
    'Wheat': '/wheat.jpg',
    'Rice': '/rice.jpg',
    'Basmati Rice': '/rice.jpg',
    'Cotton': '/cotton.jpg',
    'Mustard': '/mustard.jpg',
    'Maize': '/maize.jpeg',
    'Onion': '/onion.avif',
    'Soybean': '/wheat.jpg',
    'Sugarcane': '/maize.jpeg',
    'Bajra': '/wheat.jpg',
    'Jowar': '/wheat.jpg',
};

export default function SmartSearch({ onSelectListing, selectedListing }: SmartSearchProps) {
    const { state: ctxState, district: ctxDistrict } = useLocation();
    const { token } = useAuth();

    const [cropFilter, setCropFilter] = useState('All Crops');
    const [filterState, setFilterState] = useState(ctxState);
    const [filterDistrict, setFilterDistrict] = useState(ctxDistrict);
    const [filterMandi, setFilterMandi] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [paymentListing, setPaymentListing] = useState<Listing | null>(null);
    const [allListings, setAllListings] = useState<Listing[]>([]);

    useEffect(() => {
        const fetchCrops = async () => {
            if (!token) return;
            try {
                // Build query params
                const params = new URLSearchParams();
                if (cropFilter !== 'All Crops') params.append('cropName', cropFilter);
                if (searchTerm) params.append('cropName', searchTerm); // Reuse cropName for text search on backend for now

                const res = await fetch(`http://localhost:5000/api/buyer/search?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (data.crops) {
                    const converted: Listing[] = data.crops.map((c: any) => ({
                        id: c._id,
                        crop: c.cropName,
                        variety: c.variety || 'Standard',
                        quantity: `${c.quantity} ${c.unit}`,
                        price: `₹${(c.expectedPrice || 0).toLocaleString()}/qtl`,
                        location: `${c.location?.district || 'Unknown'}, ${c.location?.state || 'Unknown'}`,
                        state: c.location?.state || '',
                        district: c.location?.district || '',
                        farmer: c.farmer?.name || 'Verified Farmer',
                        trustScore: c.farmer?.trustScore || 85,
                        image: c.image || cropImageMap[c.cropName] || '/wheat.jpg',
                        isFarmerListed: true
                    }));
                    setAllListings(converted);
                }
            } catch (err) { console.error('Search error:', err); }
            finally { setIsLoading(false); }
        };

        fetchCrops();
    }, [token, cropFilter, filterState, filterDistrict, searchTerm]);

    const handleClear = () => {
        setCropFilter('All Crops');
        setFilterState('');
        setFilterDistrict('');
        setFilterMandi('');
        setSearchTerm('');
    };

    const filteredListings = allListings.filter(l => {
        const matchState = !filterState || l.state === filterState;
        const matchDistrict = !filterDistrict || l.district === filterDistrict;
        return matchState && matchDistrict;
    });

    return (
        <div className="p-8 space-y-10 animate-fade-in">
            {/* ====== ELITE SEARCH PANEL ====== */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-2xl shadow-slate-200/50">
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search harvests, farmers, or varieties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-transparent rounded-[2rem] py-5 pl-16 pr-8 text-sm font-bold text-slate-800 focus:bg-white focus:border-green-500 transition-all outline-none placeholder:text-slate-400 shadow-inner"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 ring-green-500/20"
                            value={cropFilter}
                            onChange={e => setCropFilter(e.target.value)}
                        >
                            {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={handleClear} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">State Territory</label>
                        <select
                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-green-500/20"
                            value={filterState}
                            onChange={e => { setFilterState(e.target.value); setFilterDistrict(''); }}
                        >
                            <option value="">All Regions</option>
                            {locationData.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">District / Hub</label>
                        <select
                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 ring-green-500/20"
                            value={filterDistrict}
                            onChange={e => setFilterDistrict(e.target.value)}
                            disabled={!filterState}
                        >
                            <option value="">All Districts</option>
                            {locationData.find(s => s.name === filterState)?.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <div className="w-full bg-green-50 border border-green-100 rounded-2xl px-6 py-4 flex items-center justify-between">
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Markets</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-black text-slate-900">{filteredListings.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== RESULTS MESH ====== */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[450px] bg-white rounded-[3rem] border border-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredListings.map((listing, i) => (
                        <div
                            key={listing.id}
                            className={`group flex flex-col bg-white rounded-[3.5rem] border border-slate-200 hover:border-green-500/30 transition-all duration-700 shadow-sm hover:shadow-2xl overflow-hidden scroll-reveal stagger-${(i % 3) + 1}`}
                            onClick={() => onSelectListing(listing.id)}
                        >
                            {/* Image Header */}
                            <div className="relative h-64 overflow-hidden">
                                <img src={listing.image} alt={listing.crop} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                                        <ShieldCheck className="w-3 h-3 text-green-400" /> Inspected
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {listing.trustScore}% Trust
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{listing.crop}</h3>
                                        <p className="text-green-400 text-xs font-black uppercase tracking-[0.2em] mt-1">{listing.variety}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Live Quote</p>
                                        <p className="text-2xl font-black text-white">{listing.price.split('/')[0]}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-8 pb-4 flex-1">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Available Stock</p>
                                        <div className="flex items-center gap-2 text-slate-800 font-black text-base">
                                            <Package className="w-4 h-4 text-green-600" />
                                            {listing.quantity}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sourcing From</p>
                                        <div className="flex items-center gap-2 text-slate-800 font-black text-sm truncate">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            {listing.district}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-black text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-lg">
                                            {listing.farmer[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 flex items-center gap-1">
                                                {listing.farmer}
                                                <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500" />
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Premier Grower</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-green-500 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="p-8 pt-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setPaymentListing(listing); }}
                                    className="w-full bg-slate-900 py-6 rounded-[2rem] text-[11px] font-black text-white uppercase tracking-[0.2em] border border-slate-800 hover:bg-green-600 hover:border-green-500 transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                                >
                                    Secure Trade <ShoppingCart className="ml-2 w-4 h-4 inline-block -mt-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-40 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Zero Harvests Detected</h3>
                    <p className="text-slate-400 mt-2 font-medium">Try expanding your search radius across more territories.</p>
                </div>
            )}

            {/* Payment Modal */}
            {paymentListing && (
                <PaymentModal
                    isOpen={!!paymentListing}
                    onClose={() => setPaymentListing(null)}
                    crop={paymentListing.crop}
                    variety={paymentListing.variety}
                    price={paymentListing.price}
                    farmer={paymentListing.farmer}
                    trustScore={paymentListing.trustScore}
                    image={paymentListing.image}
                    quantity={paymentListing.quantity}
                />
            )}
        </div>
    );
}
