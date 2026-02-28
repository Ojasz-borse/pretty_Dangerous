'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Truck,
    MapPin,
    Calculator,
    ArrowRight,
    Clock,
    Package,
    Star,
    Route,
    Fuel,
    IndianRupee,
    CheckCircle
} from 'lucide-react';

const popularCrops = ['Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato', 'Cotton'];
const markets = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad'];

export default function LogisticsOptimization() {
    const [crop, setCrop] = useState('Wheat');
    const [quantity, setQuantity] = useState('50');
    const [pickup, setPickup] = useState('Sirsa');
    const [delivery, setDelivery] = useState('Delhi');
    const [showResults, setShowResults] = useState(false);

    const transportOptions = [
        { type: 'truck', name: '10-Ton Truck', cost: 4500, time: 6, rating: 4.5, recommended: true },
        { type: 'tempo', name: 'Tempo Traveller', cost: 3200, time: 8, rating: 4.2, recommended: false },
        { type: 'tractor', name: 'Tractor Trolley', cost: 2800, time: 12, rating: 3.8, recommended: false },
    ];

    const calculateLogistics = () => {
        setShowResults(true);
    };

    return (
        <div className="space-y-6">
            {/* Input Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-purple-600" />
                        Logistics Optimization
                    </CardTitle>
                    <CardDescription>
                        Calculate delivery distance, costs, and choose the best transport option
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Crop</Label>
                            <Select value={crop} onValueChange={setCrop}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {popularCrops.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Quantity (Quintals)</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pickup Location</Label>
                            <Input value={pickup} onChange={(e) => setPickup(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Delivery Market</Label>
                            <Select value={delivery} onValueChange={setDelivery}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {markets.map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculateLogistics} className="mt-4 bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate Logistics
                    </Button>
                </CardContent>
            </Card>

            {showResults && (
                <div className="space-y-6">
                    {/* Route Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Route className="w-5 h-5 text-blue-600" />
                                Route Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center gap-6 py-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                                        <MapPin className="w-8 h-8 text-green-600" />
                                    </div>
                                    <p className="font-medium">{pickup}</p>
                                    <p className="text-sm text-gray-500">Haryana</p>
                                </div>

                                <div className="flex-1 flex flex-col items-center">
                                    <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 rounded-full border border-gray-200">
                                            <span className="text-lg font-bold text-purple-600">245 km</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3">~6 hours estimated</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                                        <MapPin className="w-8 h-8 text-red-600" />
                                    </div>
                                    <p className="font-medium">{delivery}</p>
                                    <p className="text-sm text-gray-500">Delhi</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transport Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transport Options</CardTitle>
                            <CardDescription>Choose the best option for your shipment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transportOptions.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl border-2 transition-all ${option.recommended
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">
                                                    {option.type === 'truck' ? '🚛' : option.type === 'tempo' ? '🚐' : '🚜'}
                                                </span>
                                                <div>
                                                    <p className="font-medium">{option.name}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {option.time} hrs
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-amber-500" />
                                                            {option.rating}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-purple-600">₹{option.cost.toLocaleString()}</p>
                                                {option.recommended && (
                                                    <Badge className="bg-purple-600 mt-1">Recommended</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cost Breakdown */}
                    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-purple-600" />
                                Cost Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Transport Cost</span>
                                    <span className="font-medium">₹4,500</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Loading/Unloading</span>
                                    <span className="font-medium">₹500</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Insurance</span>
                                    <span className="font-medium">₹250</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="font-medium">₹100</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between py-2">
                                    <span className="font-medium text-gray-700">Total Logistics Cost</span>
                                    <span className="text-xl font-bold text-purple-600">₹5,350</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-white rounded-xl">
                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Best Value Recommendation</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    The 10-Ton Truck offers the best balance of cost and delivery time for your
                                    {quantity} quintal shipment. Expected delivery by today evening.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
