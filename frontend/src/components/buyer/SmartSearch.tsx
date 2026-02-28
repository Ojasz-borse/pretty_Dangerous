'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, MapPin, Tag, Filter, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Listing {
    id: string;
    crop: string;
    variety: string;
    quantity: string;
    price: string;
    location: string;
    farmer: string;
    trustScore: number;
    image: string;
}

interface SmartSearchProps {
    onSelectListing: (id: string) => void;
    selectedListing: string | null;
}

export default function SmartSearch({ onSelectListing, selectedListing }: SmartSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const mockListings: Listing[] = [
        {
            id: '1',
            crop: 'Wheat',
            variety: 'Sharbati',
            quantity: '500 Quintals',
            price: '₹2,450/qtl',
            location: 'Sirsa, Haryana',
            farmer: 'Rajesh Kumar',
            trustScore: 92,
            image: '/1.jpeg'
        },
        {
            id: '2',
            crop: 'Basmati Rice',
            variety: '1121',
            quantity: '250 Quintals',
            price: '₹4,800/qtl',
            location: 'Karnal, Punjab',
            farmer: 'Gurpreet Singh',
            trustScore: 88,
            image: '/2.jpg'
        },
        {
            id: '3',
            crop: 'Cotton',
            variety: 'Bt Cotton',
            quantity: '120 Quintals',
            price: '₹7,200/qtl',
            location: 'Bhatinda, Punjab',
            farmer: 'Amit Sharma',
            trustScore: 95,
            image: '/4.jpg'
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="border-blue-100 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <h2 className="text-3xl font-black mb-2 italic">Smart Buyer Search</h2>
                    <p className="text-blue-100 opacity-90 max-w-2xl">Find verified produce directly from farmers using our AI-powered discovery engine.</p>
                </div>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search by crop, variety, or location..."
                                className="pl-10 h-12 border-blue-100 focus:ring-blue-500 rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all font-bold">
                            <Search className="w-4 h-4 mr-2" />
                            Search Markets
                        </Button>
                        <Button variant="outline" className="h-12 border-blue-200 rounded-xl">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockListings.map((listing) => (
                            <Card
                                key={listing.id}
                                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-blue-50 ${selectedListing === listing.id ? 'ring-2 ring-blue-500 border-transparent shadow-blue-100' : ''}`}
                                onClick={() => onSelectListing(listing.id)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={listing.image} alt={listing.crop} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-white/90 text-blue-700 backdrop-blur-sm shadow-sm">
                                            Trust: {listing.trustScore}%
                                        </Badge>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        <div className="flex items-center gap-1 text-xs opacity-90">
                                            <MapPin className="w-3 h-3" />
                                            {listing.location}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800">{listing.crop}</h3>
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{listing.variety}</p>
                                        </div>
                                        <p className="text-xl font-black text-green-600 italic">{listing.price}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {listing.farmer[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                                    {listing.farmer}
                                                    <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500" />
                                                </span>
                                                <span className="text-[10px] text-gray-400">Verified Seller</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs font-bold text-gray-500">
                                            {listing.quantity}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
