'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
    Search,
    MapPin,
    Star,
    TrendingUp,
    Filter,
    SortAsc,
    Phone,
    Package,
    Shield,
    Clock,
    ChevronRight,
    CheckCircle
} from 'lucide-react';
import type { FarmerListing, ApiResponse } from '@/types/buyer';

interface SmartSearchProps {
    onSelectListing: (id: string | null) => void;
    selectedListing: string | null;
}

const popularCrops = [
    'All Crops', 'Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato',
    'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Groundnut'
];

export default function SmartSearch({ onSelectListing, selectedListing }: SmartSearchProps) {
    const [listings, setListings] = useState<FarmerListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchCrop, setSearchCrop] = useState('All Crops');
    const [sortBy, setSortBy] = useState<'price' | 'distance' | 'trustScore' | 'rating'>('trustScore');
    const [minTrust, setMinTrust] = useState('0');
    const [maxDistance, setMaxDistance] = useState('2000');

    useEffect(() => {
        fetchListings();
    }, [searchCrop, sortBy]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchCrop !== 'All Crops') params.append('cropName', searchCrop);
            params.append('sortBy', sortBy);
            params.append('sortOrder', 'desc');
            params.append('minTrustScore', minTrust);
            params.append('maxDistance', maxDistance);

            const response = await fetch(`/api/buyer/search?${params.toString()}`);
            const data: ApiResponse<{ listings: FarmerListing[]; total: number }> = await response.json();

            if (data.success && data.data) {
                setListings(data.data.listings);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrustColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-amber-600';
        return 'text-red-600';
    };

    const getGradeBadge = (grade: string) => {
        const colors: Record<string, string> = {
            'A': 'bg-green-100 text-green-700 border-green-300',
            'B': 'bg-blue-100 text-blue-700 border-blue-300',
            'C': 'bg-amber-100 text-amber-700 border-amber-300',
            'D': 'bg-red-100 text-red-700 border-red-300'
        };
        return colors[grade] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Search Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-600" />
                        Smart Search & Matching
                    </CardTitle>
                    <CardDescription>
                        Find verified farmers sorted by price, distance, and trust score
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Crop</Label>
                            <Select value={searchCrop} onValueChange={setSearchCrop}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularCrops.map((crop) => (
                                        <SelectItem key={crop} value={crop}>
                                            {crop}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="trustScore">Trust Score</SelectItem>
                                    <SelectItem value="price">Price</SelectItem>
                                    <SelectItem value="distance">Distance</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Min Trust Score</Label>
                            <Input
                                type="number"
                                value={minTrust}
                                onChange={(e) => setMinTrust(e.target.value)}
                                min="0" max="100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Distance (km)</Label>
                            <Input
                                type="number"
                                value={maxDistance}
                                onChange={(e) => setMaxDistance(e.target.value)}
                                min="1"
                            />
                        </div>
                        <Button onClick={fetchListings} className="bg-blue-600 hover:bg-blue-700">
                            <Filter className="w-4 h-4 mr-2" />
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Found <span className="font-bold text-blue-600">{listings.length}</span> matching listings
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <SortAsc className="w-4 h-4" />
                    Sorted by: <span className="font-medium capitalize">{sortBy.replace(/([A-Z])/g, ' $1')}</span>
                </div>
            </div>

            {/* Listing Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-8 w-1/2 mb-4" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                        <Card
                            key={listing.id}
                            className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${selectedListing === listing.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => onSelectListing(listing.id)}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">{listing.cropName}</h3>
                                        {listing.cropNameHindi && (
                                            <p className="text-sm opacity-80">{listing.cropNameHindi}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={`${getGradeBadge(listing.qualityGrade)} border`}>
                                            Grade {listing.qualityGrade}
                                        </Badge>
                                        {listing.verified && (
                                            <Badge className="bg-white/20 text-white border-0">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                {/* Farmer Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-lg font-bold text-gray-600">
                                            {listing.farmerName.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{listing.farmerName}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            <span>{listing.location.district}, {listing.location.state}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`flex items-center gap-1 ${getTrustColor(listing.trustScore)}`}>
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="font-bold">{listing.trustScore}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Trust Score</p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-bold text-green-600">₹{listing.pricePerQuintal.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Per Quintal</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-bold text-blue-600">{listing.quantity}</p>
                                        <p className="text-xs text-gray-500">Quintals</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-bold text-purple-600">{listing.distance} km</p>
                                        <p className="text-xs text-gray-500">Distance</p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                                        <p className="text-lg font-bold text-amber-600">{listing.rating}★</p>
                                        <p className="text-xs text-gray-500">Rating</p>
                                    </div>
                                </div>

                                {/* Trust Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Trust Level</span>
                                        <span className={`font-medium ${getTrustColor(listing.trustScore)}`}>
                                            {listing.reliabilityLevel}
                                        </span>
                                    </div>
                                    <Progress value={listing.trustScore} className="h-2" />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Contact
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                        <Package className="w-4 h-4 mr-2" />
                                        Place Bid
                                    </Button>
                                </div>

                                {/* Additional Info */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Listed {new Date(listing.listedAt).toLocaleDateString()}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {listing.totalSales} sales
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
