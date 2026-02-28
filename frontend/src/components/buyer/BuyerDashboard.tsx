'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShoppingCart,
    Search,
    DollarSign,
    MapPin,
    Star,
    Truck,
    Sparkles,
    Leaf,
    User
} from 'lucide-react';
import SmartSearch from './SmartSearch';
import FairPriceChecker from './FairPriceChecker';
import LogisticsOptimization from './LogisticsOptimization';
import InnovationPanel from './InnovationPanel';

export default function BuyerDashboard() {
    const [selectedListing, setSelectedListing] = useState<string | null>(null);

    const modules = [
        { id: 'search', label: 'Find Crops', icon: Search, color: 'text-blue-600' },
        { id: 'fair-price', label: 'Fair Price', icon: DollarSign, color: 'text-green-600' },
        { id: 'logistics', label: 'Logistics', icon: Truck, color: 'text-purple-600' },
        { id: 'innovation', label: 'AI Insights', icon: Sparkles, color: 'text-amber-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <ShoppingCart className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">🛒 Buyer Dashboard</h1>
                                <p className="text-sm text-gray-500">Smart Agricultural Procurement Platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                <User className="w-3 h-3 mr-1" />
                                Buyer Account
                            </Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                ✓ Verified Buyer
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Search className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="text-sm opacity-80">Available Listings</p>
                                    <p className="text-2xl font-bold">1,248</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Leaf className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="text-sm opacity-80">Verified Farmers</p>
                                    <p className="text-2xl font-bold">856</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Star className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="text-sm opacity-80">Avg Trust Score</p>
                                    <p className="text-2xl font-bold">85/100</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-8 h-8 opacity-80" />
                                <div>
                                    <p className="text-sm opacity-80">Fair Price Range</p>
                                    <p className="text-2xl font-bold">Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Module Tabs */}
                <Tabs defaultValue="search" className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto">
                        <TabsList className="grid grid-cols-4 gap-2 bg-transparent h-auto p-0">
                            {modules.map((module) => (
                                <TabsTrigger
                                    key={module.id}
                                    value={module.id}
                                    className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
                                >
                                    <module.icon className={`w-5 h-5 ${module.color}`} />
                                    <span className="text-xs font-medium">{module.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <TabsContent value="search" className="mt-0">
                        <SmartSearch
                            onSelectListing={setSelectedListing}
                            selectedListing={selectedListing}
                        />
                    </TabsContent>

                    <TabsContent value="fair-price" className="mt-0">
                        <FairPriceChecker />
                    </TabsContent>

                    <TabsContent value="logistics" className="mt-0">
                        <LogisticsOptimization />
                    </TabsContent>

                    <TabsContent value="innovation" className="mt-0">
                        <InnovationPanel />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2024 Agricultural Intelligence Platform | Buyer Portal
                        </p>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-xs">
                                Secure Transactions
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                Fair Trade Certified
                            </Badge>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
