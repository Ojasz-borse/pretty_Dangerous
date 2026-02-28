'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
    DollarSign,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Info,
    Shield,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import type { FairPriceAnalysis, ApiResponse } from '@/types/buyer';

const popularCrops = [
    'Wheat', 'Rice (Basmati)', 'Tomato', 'Onion', 'Potato',
    'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Groundnut'
];

export default function FairPriceChecker() {
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [bidPrice, setBidPrice] = useState('');
    const [analysis, setAnalysis] = useState<FairPriceAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    const analyzePrice = async () => {
        if (!bidPrice) return;

        setLoading(true);
        try {
            const response = await fetch('/api/buyer/fair-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cropName: selectedCrop,
                    bidPrice: parseFloat(bidPrice)
                })
            });

            const data: ApiResponse<FairPriceAnalysis> = await response.json();

            if (data.success && data.data) {
                setAnalysis(data.data);
            }
        } catch (error) {
            console.error('Error analyzing price:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'fair': return 'bg-green-500';
            case 'below_fair': return 'bg-amber-500';
            case 'above_fair': return 'bg-blue-500';
            case 'exploitative': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getRiskBadge = (risk: string) => {
        switch (risk) {
            case 'none': return 'bg-green-100 text-green-700 border-green-300';
            case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'high': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Fair Price Suggestion
                    </CardTitle>
                    <CardDescription>
                        Check if your bid price is fair to prevent exploitation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Crop</Label>
                            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
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
                            <Label>Your Bid Price (₹/Quintal)</Label>
                            <Input
                                type="number"
                                value={bidPrice}
                                onChange={(e) => setBidPrice(e.target.value)}
                                placeholder="Enter bid price"
                            />
                        </div>
                        <Button
                            onClick={analyzePrice}
                            className="bg-green-600 hover:bg-green-700 md:col-span-2"
                            disabled={!bidPrice || loading}
                        >
                            {loading ? 'Analyzing...' : 'Check Fair Price'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
                <div className="space-y-6">
                    {/* Main Status Card */}
                    <Card className={`overflow-hidden border-2 ${analysis.priceStatus === 'fair' ? 'border-green-500' :
                            analysis.priceStatus === 'exploitative' ? 'border-red-500' :
                                'border-amber-500'
                        }`}>
                        <div className={`${getStatusColor(analysis.priceStatus)} p-6 text-white`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {analysis.priceStatus === 'fair' || analysis.priceStatus === 'above_fair' ? (
                                        <CheckCircle className="w-12 h-12" />
                                    ) : (
                                        <AlertTriangle className="w-12 h-12" />
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold capitalize">
                                            {analysis.priceStatus === 'fair' ? 'Fair Price!' :
                                                analysis.priceStatus === 'above_fair' ? 'Above Market' :
                                                    analysis.priceStatus === 'below_fair' ? 'Below Fair Range' :
                                                        'Exploitative Price!'}
                                        </h2>
                                        <p className="opacity-90">Your bid: ₹{analysis.buyerBidPrice.toLocaleString()}/Quintal</p>
                                    </div>
                                </div>
                                <Badge className={`${getRiskBadge(analysis.exploitationRisk)} text-lg px-4 py-2`}>
                                    {analysis.exploitationRisk === 'none' ? 'No Risk' :
                                        analysis.exploitationRisk === 'low' ? 'Low Risk' :
                                            analysis.exploitationRisk === 'medium' ? 'Medium Risk' :
                                                'High Risk'}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <Alert className={`${analysis.priceStatus === 'exploitative' ? 'bg-red-50 border-red-200' :
                                    analysis.priceStatus === 'fair' ? 'bg-green-50 border-green-200' :
                                        'bg-amber-50 border-amber-200'
                                }`}>
                                <Info className={`w-5 h-5 ${analysis.priceStatus === 'exploitative' ? 'text-red-600' :
                                        analysis.priceStatus === 'fair' ? 'text-green-600' :
                                            'text-amber-600'
                                    }`} />
                                <AlertDescription className={`${analysis.priceStatus === 'exploitative' ? 'text-red-800' :
                                        analysis.priceStatus === 'fair' ? 'text-green-800' :
                                            'text-amber-800'
                                    }`}>
                                    {analysis.recommendation}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Fair Price Range */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                Fair Market Range
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-blue-600 rounded border-2 border-white shadow-lg"
                                            style={{
                                                left: `${Math.min(100, Math.max(0,
                                                    ((analysis.buyerBidPrice - analysis.fairPriceRange.min * 0.8) /
                                                        (analysis.fairPriceRange.max * 1.1 - analysis.fairPriceRange.min * 0.8)) * 100
                                                ))}%`
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                                        <span>₹{(analysis.fairPriceRange.min * 0.8).toLocaleString()}</span>
                                        <span>₹{(analysis.fairPriceRange.max * 1.1).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500">Minimum Fair</p>
                                    <p className="text-2xl font-bold text-red-600">₹{analysis.fairPriceRange.min.toLocaleString()}</p>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                    <p className="text-sm text-gray-500">Average Market</p>
                                    <p className="text-2xl font-bold text-green-600">₹{analysis.fairPriceRange.avg.toLocaleString()}</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500">Maximum Fair</p>
                                    <p className="text-2xl font-bold text-blue-600">₹{analysis.fairPriceRange.max.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Market Factors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Factors Affecting Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analysis.marketFactors.map((factor, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {factor.impact === 'positive' ? (
                                                <TrendingUp className="w-5 h-5 text-green-500" />
                                            ) : factor.impact === 'negative' ? (
                                                <TrendingDown className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <ArrowRight className="w-5 h-5 text-gray-500" />
                                            )}
                                            <div>
                                                <p className="font-medium">{factor.factor}</p>
                                                <p className="text-sm text-gray-500">{factor.description}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={
                                            factor.impact === 'positive' ? 'border-green-300 text-green-600' :
                                                factor.impact === 'negative' ? 'border-red-300 text-red-600' :
                                                    'border-gray-300 text-gray-600'
                                        }>
                                            {factor.percentageChange > 0 ? '+' : ''}{factor.percentageChange.toFixed(1)}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Anti-Exploitation Notice */}
                    {analysis.exploitationRisk !== 'none' && (
                        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Shield className="w-8 h-8 text-amber-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-amber-800">Fair Trade Commitment</h4>
                                        <p className="text-amber-700 mt-1">
                                            Our platform is committed to preventing farmer exploitation. We monitor all transactions
                                            to ensure fair pricing. Prices significantly below market rates may be flagged and
                                            farmers will be notified of the fair market value.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
