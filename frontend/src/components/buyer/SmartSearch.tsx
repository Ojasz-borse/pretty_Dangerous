'use client';

import React, { useState } from 'react';
import { Search, MapPin, Filter, CheckCircle2 } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { locationData, cropOptions } from '@/data/locationData';

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
}

interface SmartSearchProps {
    onSelectListing: (id: string) => void;
    selectedListing: string | null;
}

const mockListings: Listing[] = [
    { id: '1', crop: 'Wheat', variety: 'Sharbati', quantity: '500 Quintals', price: '₹2,450/qtl', location: 'Sirsa, Haryana', state: 'Haryana', district: 'Sirsa', farmer: 'Rajesh Kumar', trustScore: 92, image: '/wheat.jpg' },
    { id: '2', crop: 'Basmati Rice', variety: '1121', quantity: '250 Quintals', price: '₹4,800/qtl', location: 'Karnal, Punjab', state: 'Punjab', district: 'Karnal', farmer: 'Gurpreet Singh', trustScore: 88, image: '/rice.jpg' },
    { id: '3', crop: 'Cotton', variety: 'Bt Cotton', quantity: '120 Quintals', price: '₹7,200/qtl', location: 'Bhatinda, Punjab', state: 'Punjab', district: 'Bhatinda', farmer: 'Amit Sharma', trustScore: 95, image: '/cotton.jpg' },
    { id: '4', crop: 'Onion', variety: 'Nasik Red', quantity: '300 Quintals', price: '₹1,200/qtl', location: 'Nashik, Maharashtra', state: 'Maharashtra', district: 'Nashik', farmer: 'Suresh Patil', trustScore: 87, image: '/onion.avif' },
    { id: '5', crop: 'Mustard', variety: 'Yellow Sarson', quantity: '180 Quintals', price: '₹5,400/qtl', location: 'Hisar, Haryana', state: 'Haryana', district: 'Hisar', farmer: 'Ramesh Yadav', trustScore: 91, image: '/mustard.jpg' },
    { id: '6', crop: 'Maize', variety: 'Yellow Hybrid', quantity: '400 Quintals', price: '₹1,800/qtl', location: 'Ludhiana, Punjab', state: 'Punjab', district: 'Ludhiana', farmer: 'Harjinder Singh', trustScore: 89, image: '/maize.jpeg' },
];

export default function SmartSearch({ onSelectListing, selectedListing }: SmartSearchProps) {
    const { state: ctxState, district: ctxDistrict } = useLocation();

    const [cropFilter, setCropFilter] = useState('All Crops');
    const [filterState, setFilterState] = useState(ctxState);
    const [filterDistrict, setFilterDistrict] = useState(ctxDistrict);
    const [filterMandi, setFilterMandi] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filtersApplied, setFiltersApplied] = useState(false);

    const selectedStateData = locationData.find(s => s.name === filterState);
    const selectedDistrictData = selectedStateData?.districts.find(d => d.name === filterDistrict);

    const handleApply = () => setFiltersApplied(true);

    const filteredListings = mockListings.filter(l => {
        const matchCrop = cropFilter === 'All Crops' || l.crop.toLowerCase().includes(cropFilter.toLowerCase());
        const matchState = !filterState || l.state === filterState;
        const matchDistrict = !filterDistrict || l.district === filterDistrict;
        const matchSearch = !searchTerm || l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || l.farmer.toLowerCase().includes(searchTerm.toLowerCase()) || l.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCrop && matchState && matchDistrict && matchSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ===== 4-FILTER SEARCH PANEL ===== */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-700">Smart Buyer Search</h3>
                    <span className="text-xs text-slate-400">— Find verified produce directly from farmers</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Crop */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Crop</label>
                        <select
                            className="select-field w-full"
                            value={cropFilter}
                            onChange={e => setCropFilter(e.target.value)}
                        >
                            {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* State */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">State</label>
                        <select
                            className="select-field w-full"
                            value={filterState}
                            onChange={e => { setFilterState(e.target.value); setFilterDistrict(''); setFilterMandi(''); }}
                        >
                            <option value="">All States</option>
                            {locationData.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>

                    {/* District */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">District</label>
                        <select
                            className="select-field w-full"
                            value={filterDistrict}
                            onChange={e => { setFilterDistrict(e.target.value); setFilterMandi(''); }}
                            disabled={!filterState}
                        >
                            <option value="">All Districts</option>
                            {selectedStateData?.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>

                    {/* Mandi */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Mandi</label>
                        <select
                            className="select-field w-full"
                            value={filterMandi}
                            onChange={e => setFilterMandi(e.target.value)}
                            disabled={!filterDistrict}
                        >
                            <option value="">All Mandis</option>
                            {selectedDistrictData?.mandis.map(m => <option key={m.code} value={m.name}>{m.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Free text search + apply */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            placeholder="Search by crop, farmer name, or location..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary whitespace-nowrap" onClick={handleApply}>
                        <Search className="w-4 h-4" /> Search Markets
                    </button>
                    <button className="btn-outline" onClick={() => { setCropFilter('All Crops'); setFilterState(''); setFilterDistrict(''); setFilterMandi(''); setSearchTerm(''); }}>
                        Clear
                    </button>
                </div>

                {/* Active filter chips */}
                {(cropFilter !== 'All Crops' || filterState || filterDistrict || filterMandi) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {cropFilter !== 'All Crops' && <span className="badge-green text-xs">🌾 {cropFilter}</span>}
                        {filterState && <span className="badge-blue text-xs">📍 {filterState}</span>}
                        {filterDistrict && <span className="badge-blue text-xs">🏘 {filterDistrict}</span>}
                        {filterMandi && <span className="badge-green text-xs">🏪 {filterMandi}</span>}
                    </div>
                )}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">{filteredListings.length}</span> verified listings
                    {filterDistrict ? ` in ${filterDistrict}` : filterState ? ` in ${filterState}` : ''}
                </p>
                <span className="text-xs text-slate-400">Sorted by Trust Score</span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.length === 0 ? (
                    <div className="col-span-3 card p-12 text-center">
                        <p className="text-slate-400 font-medium">No listings found for the selected filters.</p>
                        <p className="text-xs text-slate-300 mt-1">Try broadening your search criteria.</p>
                    </div>
                ) : filteredListings.map((listing) => (
                    <div
                        key={listing.id}
                        className={`card group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${selectedListing === listing.id ? 'ring-2 ring-green-500 border-transparent' : ''}`}
                        onClick={() => onSelectListing(listing.id)}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={listing.image} alt={listing.crop} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-3 right-3">
                                <span className="badge-green">Trust: {listing.trustScore}%</span>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <div className="flex items-center gap-1 text-xs opacity-90">
                                    <MapPin className="w-3 h-3" />
                                    {listing.location}
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{listing.crop}</h3>
                                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{listing.variety}</p>
                                </div>
                                <p className="text-xl font-bold text-green-600">{listing.price}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 py-3 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs border border-green-200">
                                        {listing.farmer[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                            {listing.farmer}
                                            <CheckCircle2 className="w-3 h-3 text-green-500 fill-green-500" />
                                        </span>
                                        <span className="text-[10px] text-slate-400">Verified Seller</span>
                                    </div>
                                </div>
                                <div className="text-right text-xs font-bold text-slate-500">
                                    {listing.quantity}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
