'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    CheckCircle2,
    Package,
    ArrowRight,
    ShieldCheck,
    Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { locationData, cropOptions } from '@/data/locationData';
import PaymentModal from '@/components/shared/PaymentModal';

interface Listing {
    id: string;
    crop: string;
    variety: string;
    quantity: string;
    price: string;
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

const cropImageMap: Record<string, string> = {
    Wheat: '/wheat.jpg',
    Rice: '/rice.jpg',
    Cotton: '/cotton.jpg',
    Mustard: '/mustard.jpg',
    Maize: '/maize.jpeg',
    Onion: '/onion.avif',
};

export default function SmartSearch({ onSelectListing }: SmartSearchProps) {
    const { token } = useAuth();

    const [cropFilter, setCropFilter] = useState('All Crops');
    const [filterState, setFilterState] = useState('');
    const [filterDistrict, setFilterDistrict] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentListing, setPaymentListing] = useState<Listing | null>(null);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCrops = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (cropFilter !== 'All Crops') {
                    params.append('cropName', cropFilter);
                }

                const res = await fetch(
                    `http://localhost:5000/api/buyer/search?${params.toString()}`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                    }
                );

                if (!res.ok) {
                    throw new Error('Backend error');
                }

                const data = await res.json();

                if (data.crops && Array.isArray(data.crops)) {
                    const converted: Listing[] = data.crops.map((c: any) => ({
                        id: c._id,
                        crop: c.cropName,
                        variety: c.variety || 'Standard',
                        quantity: `${c.quantity || 0} ${c.unit || 'qtl'}`,
                        price: `₹${(c.expectedPrice || 0).toLocaleString()}/qtl`,
                        state: c.location?.state || '',
                        district: c.location?.district || '',
                        farmer: c.farmer?.name || 'Verified Farmer',
                        trustScore: c.farmer?.trustScore || 85,
                        image:
                            c.image ||
                            cropImageMap[c.cropName] ||
                            '/wheat.jpg',
                    }));

                    setAllListings(converted);
                } else {
                    setAllListings([]);
                }
            } catch (err) {
                console.error(err);
                setError('Cannot connect to backend (Port 5000)');
                setAllListings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrops();
    }, [token, cropFilter]);

    const handleClear = () => {
        setCropFilter('All Crops');
        setFilterState('');
        setFilterDistrict('');
        setSearchTerm('');
    };

    const filteredListings = allListings.filter((l) => {
        const matchState =
            !filterState ||
            l.state.toLowerCase().trim() ===
            filterState.toLowerCase().trim();

        const matchDistrict =
            !filterDistrict ||
            l.district.toLowerCase().trim() ===
            filterDistrict.toLowerCase().trim();

        const matchSearch =
            !searchTerm ||
            l.crop.toLowerCase().includes(searchTerm.toLowerCase());

        return matchState && matchDistrict && matchSearch;
    });

    return (
        <div className="p-8 space-y-10">

            {/* Search Panel */}
            <div className="bg-white rounded-3xl p-6 border shadow-md">
                <div className="flex flex-col lg:flex-row gap-4 mb-6">

                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find crops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-xl pl-10 pr-4 py-3"
                        />
                    </div>

                    <select
                        value={cropFilter}
                        onChange={(e) => setCropFilter(e.target.value)}
                        className="border rounded-xl px-4 py-3" >
                        {cropOptions.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleClear}
                        className="px-4 py-3 text-sm font-bold text-red-500"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-green-600">
                        {filteredListings.length} Active Listings
                    </span>
                </div>
            </div>

            {/* Loading */}
            {isLoading && <p>Loading crops...</p>}

            {/* Error */}
            {error && (
                <p className="text-red-500 font-medium">{error}</p>
            )}

            {/* Listings */}
            {!isLoading && filteredListings.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer"
                            onClick={() =>
                                onSelectListing(listing.id)
                            }
                        >
                            <img
                                src={listing.image}
                                alt={listing.crop}
                                className="h-48 w-full object-cover"
                            />

                            <div className="p-6">
                                <h3 className="text-xl font-bold">
                                    {listing.crop}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {listing.variety}
                                </p>

                                <div className="mt-4 flex justify-between text-sm">
                                    <span>{listing.quantity}</span>
                                    <span className="font-bold">
                                        {listing.price}
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-between text-xs">
                                    <span>
                                        {listing.farmer}
                                    </span>
                                    <span>
                                        ⭐ {listing.trustScore}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && filteredListings.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400">
                        No crops found.
                    </p>
                </div>
            )}

            {paymentListing && (
                <PaymentModal
                    isOpen={!!paymentListing}
                    onClose={() =>
                        setPaymentListing(null)
                    }
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