'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Leaf,
    ShoppingCart,
    Shield,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import FarmerDashboard from '@/components/farmer/FarmerDashboard';
import BuyerDashboard from '@/components/buyer/BuyerDashboard';

export default function MainDashboard() {
    const [activeRole, setActiveRole] = useState<'farmer' | 'buyer'>('farmer');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Role Selection Header */}
            <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">Agricultural Intelligence Platform</h1>
                        <p className="opacity-90">Smart trading platform for farmers and buyers with AI-powered insights</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => setActiveRole('farmer')}
                            className={`px-8 py-6 rounded-xl text-lg font-medium transition-all ${activeRole === 'farmer'
                                    ? 'bg-white text-green-700 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <Leaf className="w-6 h-6 mr-2" />
                            👨‍🌾 Farmer Dashboard
                        </Button>
                        <Button
                            onClick={() => setActiveRole('buyer')}
                            className={`px-8 py-6 rounded-xl text-lg font-medium transition-all ${activeRole === 'buyer'
                                    ? 'bg-white text-blue-700 shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            🛒 Buyer Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="relative">
                {activeRole === 'farmer' ? (
                    <FarmerDashboard />
                ) : (
                    <BuyerDashboard />
                )}
            </div>

            {/* Innovation Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Sparkles className="w-8 h-8 text-white" />
                            <div className="text-white">
                                <h3 className="font-bold">🚀 Innovation Modules Active</h3>
                                <p className="text-sm opacity-90">Decision Intelligence • Transparent AI • Risk Engine • Voice Advisor • Profit Calculator • Heatmap</p>
                            </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                            <Shield className="w-4 h-4 mr-1" />
                            Fair Trade Certified
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
