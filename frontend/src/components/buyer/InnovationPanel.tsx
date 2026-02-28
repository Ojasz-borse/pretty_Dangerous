'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Sparkles,
    Brain,
    Mic,
    Play,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Info,
    ChevronDown,
    ChevronUp,
    MapPin,
    BarChart3,
    Calculator,
    Shield,
    Volume2,
    MessageSquare
} from 'lucide-react';

export default function InnovationPanel() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <Sparkles className="w-12 h-12" />
                        <div>
                            <h2 className="text-2xl font-bold">Innovation Modules</h2>
                            <p className="opacity-90">Advanced AI-powered agricultural intelligence features</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="decision" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="decision" className="rounded-lg">🧠 Decision</TabsTrigger>
                    <TabsTrigger value="transparent" className="rounded-lg">🔍 Transparent</TabsTrigger>
                    <TabsTrigger value="risk" className="rounded-lg">⚠️ Risk</TabsTrigger>
                    <TabsTrigger value="voice" className="rounded-lg">🎤 Voice</TabsTrigger>
                    <TabsTrigger value="profit" className="rounded-lg">💰 Profit</TabsTrigger>
                    <TabsTrigger value="heatmap" className="rounded-lg">🗺️ Heatmap</TabsTrigger>
                </TabsList>

                {/* Module 1: Decision Intelligence Engine */}
                <TabsContent value="decision">
                    <DecisionIntelligenceModule />
                </TabsContent>

                {/* Module 2: Transparent AI Panel */}
                <TabsContent value="transparent">
                    <TransparentAIModule />
                </TabsContent>

                {/* Module 3: Risk Score Engine */}
                <TabsContent value="risk">
                    <RiskScoreModule />
                </TabsContent>

                {/* Module 4: Multi-Language Voice Advisor */}
                <TabsContent value="voice">
                    <VoiceAdvisorModule />
                </TabsContent>

                {/* Module 5: Profit Calculator */}
                <TabsContent value="profit">
                    <ProfitCalculatorModule />
                </TabsContent>

                {/* Module 6: District Heatmap */}
                <TabsContent value="heatmap">
                    <HeatmapModule />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Module 1: Decision Intelligence Engine
function DecisionIntelligenceModule() {
    const [crop, setCrop] = useState('Wheat');
    const [quantity, setQuantity] = useState('50');
    const [result, setResult] = useState<any>(null);

    const analyze = () => {
        setResult({
            action: 'wait',
            waitDays: 5,
            currentPrice: 2250,
            predictedPrice: 2430,
            profitMargin: 8.5,
            confidence: 87,
            reasoning: [
                '📈 Price prediction shows 8% increase in next 5 days',
                '🎯 High demand index (78/100) supports waiting',
                '🚚 Logistics cost: ₹25/Quintal optimal for your quantity'
            ]
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Agricultural Decision Intelligence Engine
                    </CardTitle>
                    <CardDescription>
                        Profit optimization combining price prediction, demand, logistics, and storage costs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label>Crop</Label>
                            <Input value={crop} onChange={(e) => setCrop(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Quantity (Quintals)</Label>
                            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <Button onClick={analyze} className="self-end bg-purple-600 hover:bg-purple-700">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <Card className="overflow-hidden">
                    <div className={`bg-gradient-to-r ${result.action === 'sell_now' ? 'from-green-500 to-emerald-600' :
                            result.action === 'wait' ? 'from-blue-500 to-cyan-600' :
                                'from-purple-500 to-violet-600'
                        } p-6 text-white`}>
                        <div className="flex items-center gap-4">
                            {result.action === 'sell_now' ? <CheckCircle className="w-10 h-10" /> :
                                result.action === 'wait' ? <TrendingUp className="w-10 h-10" /> :
                                    <Sparkles className="w-10 h-10" />}
                            <div>
                                <h3 className="text-2xl font-bold capitalize">
                                    {result.action === 'sell_now' ? 'SELL NOW' :
                                        result.action === 'wait' ? `WAIT ${result.waitDays} DAYS` :
                                            'HOLD LONG TERM'}
                                </h3>
                                <p className="opacity-90">Expected profit margin: {result.profitMargin}%</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="text-2xl font-bold">₹{result.currentPrice}</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <p className="text-sm text-gray-500">Predicted Price</p>
                                <p className="text-2xl font-bold text-green-600">₹{result.predictedPrice}</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <p className="text-sm text-gray-500">Confidence</p>
                                <p className="text-2xl font-bold text-purple-600">{result.confidence}%</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">AI Reasoning:</h4>
                            {result.reasoning.map((r: string, i: number) => (
                                <p key={i} className="text-gray-700">{r}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Module 2: Transparent AI Panel
function TransparentAIModule() {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Transparent AI Panel
                    </CardTitle>
                    <CardDescription>
                        Understanding WHY the AI made this recommendation
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">AI Predicted Price</p>
                            <p className="text-4xl font-bold text-blue-600">₹2,350</p>
                            <p className="text-sm text-gray-500 mt-2">Confidence: 87%</p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <span className="flex items-center gap-2">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Why this recommendation?
                        </span>
                    </Button>

                    {expanded && (
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Market Demand</span>
                                    <Badge className="bg-green-100 text-green-700">+8.5%</Badge>
                                </div>
                                <p className="text-sm text-gray-500">High demand in major markets contributing to price increase</p>
                                <Progress value={85} className="h-2 mt-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Rainfall Impact</span>
                                    <Badge className="bg-green-100 text-green-700">+3.2%</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Adequate rainfall supporting crop quality</p>
                                <Progress value={32} className="h-2 mt-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Supply Level</span>
                                    <Badge className="bg-amber-100 text-amber-700">-2.1%</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Low market arrivals creating scarcity</p>
                                <Progress value={21} className="h-2 mt-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Seasonal Trend</span>
                                    <Badge className="bg-green-100 text-green-700">+5.0%</Badge>
                                </div>
                                <p className="text-sm text-gray-500">Festival season demand driving prices up</p>
                                <Progress value={50} className="h-2 mt-2" />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Module 3: Risk Score Engine
function RiskScoreModule() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                        Risk Score Engine
                    </CardTitle>
                    <CardDescription>
                        Predicting volatility and market risk
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold text-amber-600">42</span>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 text-lg px-4 py-1">
                                Medium Risk
                            </Badge>
                            <p className="text-sm text-gray-500 mt-4">Volatility Index: 46/100</p>
                            <p className="text-sm text-gray-500">Market: Moderate Stability</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Price Volatility</span>
                                    <Badge className="bg-amber-100 text-amber-700">Medium</Badge>
                                </div>
                                <Progress value={55} className="h-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Demand Stability</span>
                                    <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
                                </div>
                                <Progress value={25} className="h-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Weather Risk</span>
                                    <Badge className="bg-amber-100 text-amber-700">Medium</Badge>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Supply Chain</span>
                                    <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
                                </div>
                                <Progress value={20} className="h-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <h4 className="font-medium text-amber-800 mb-2">Recommendations</h4>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>⚡ Moderate risk - monitor market closely</li>
                            <li>🔄 Consider partial sales to hedge risk</li>
                            <li>📱 Enable price alerts for quick decisions</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Module 4: Voice Advisor
function VoiceAdvisorModule() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleQuery = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setResponse({
                english: "Based on current market analysis, selling after 5 days may give you 6.5% better profit. The demand is expected to increase due to upcoming festival season.",
                hindi: "वर्तमान बाजार विश्लेषण के आधार पर, 5 दिनों बाद बेचने से आपको 6.5% अधिक लाभ हो सकता है। आने वाले त्योहार के कारण मांग बढ़ने की उम्मीद है।",
                marathi: "सध्याच्या बाजार विश्लेषणानुसार, 5 दिवसांनी विकल्यास तुम्हाला 6.5% अधिक नफा मिळू शकतो. आगामी सणामुळे मागणी वाढण्याची अपेक्षा आहे."
            });
            setLoading(false);
        }, 1500);
    };

    const sampleQueries = [
        "Aaj bechna sahi hai kya?",
        "What is the current wheat price?",
        "Should I wait to sell my rice?",
        "Mujhe demand ke baare mein batao"
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-red-600" />
                        Multi-Language Smart Advisor
                    </CardTitle>
                    <CardDescription>
                        Ask questions in your language - get answers in multiple languages
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask in any language... (e.g., Aaj bechna sahi hai kya?)"
                            className="flex-1"
                        />
                        <Button onClick={handleQuery} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Mic className="w-4 h-4" />
                                    Ask
                                </span>
                            )}
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {sampleQueries.map((q, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                onClick={() => setQuery(q)}
                            >
                                {q}
                            </Button>
                        ))}
                    </div>

                    {response && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Volume2 className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-blue-800">English</span>
                                </div>
                                <p className="text-blue-700">{response.english}</p>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-orange-800">हिंदी (Hindi)</span>
                                </div>
                                <p className="text-orange-700">{response.hindi}</p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-purple-800">मराठी (Marathi)</span>
                                </div>
                                <p className="text-purple-700">{response.marathi}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Module 5: Profit Calculator
function ProfitCalculatorModule() {
    const [showResults, setShowResults] = useState(false);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-green-600" />
                        Advanced Profit Calculator
                    </CardTitle>
                    <CardDescription>
                        Net Profit = Predicted Price − Transport − Storage − Commission
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label>Crop</Label>
                            <Input defaultValue="Wheat" />
                        </div>
                        <div className="space-y-2">
                            <Label>Quantity (Quintals)</Label>
                            <Input defaultValue="50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Base Price (₹)</Label>
                            <Input defaultValue="2250" />
                        </div>
                    </div>
                    <Button onClick={() => setShowResults(true)} className="bg-green-600 hover:bg-green-700">
                        Calculate Profit
                    </Button>
                </CardContent>
            </Card>

            {showResults && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profit Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Gross Price</span>
                                    <span className="font-bold text-green-600">₹1,12,500</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-red-600">
                                    <span>Transport Cost</span>
                                    <span>-₹1,250</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-red-600">
                                    <span>Storage Cost</span>
                                    <span>-₹675</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-red-600">
                                    <span>Market Commission</span>
                                    <span>-₹2,250</span>
                                </div>
                                <div className="flex justify-between py-2 border-b text-red-600">
                                    <span>Platform Fee</span>
                                    <span>-₹562</span>
                                </div>
                                <div className="flex justify-between py-2 text-xl font-bold">
                                    <span>Net Profit</span>
                                    <span className="text-green-600">₹1,07,763</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Scenario Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3">Scenario</th>
                                            <th className="text-right py-3">Net Profit</th>
                                            <th className="text-right py-3">Margin</th>
                                            <th className="text-left py-3">Recommendation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b bg-green-50">
                                            <td className="py-3 font-medium">Sell Now</td>
                                            <td className="text-right text-green-600 font-bold">₹1,07,763</td>
                                            <td className="text-right">95.8%</td>
                                            <td className="text-sm text-gray-600">Good timing!</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 font-medium">Wait 3 Days</td>
                                            <td className="text-right">₹1,09,245</td>
                                            <td className="text-right">96.2%</td>
                                            <td className="text-sm text-green-600">Better profit possible!</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 font-medium">Wait 7 Days</td>
                                            <td className="text-right">₹1,08,500</td>
                                            <td className="text-right">94.5%</td>
                                            <td className="text-sm text-amber-600">High risk</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-medium">Direct to Mandi</td>
                                            <td className="text-right">₹1,05,300</td>
                                            <td className="text-right">93.6%</td>
                                            <td className="text-sm text-gray-600">Lower margins</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Module 6: Heatmap
function HeatmapModule() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        District Demand Heatmap
                    </CardTitle>
                    <CardDescription>
                        Visual demand distribution across India
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                            <span className="text-sm">Very Low (0-20)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-500"></div>
                            <span className="text-sm">Low (21-40)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-500"></div>
                            <span className="text-sm">Moderate (41-60)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <span className="text-sm">High (61-80)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-700"></div>
                            <span className="text-sm">Very High (81-100)</span>
                        </div>
                    </div>

                    {/* District Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {[
                            { name: 'Nashik', score: 95 },
                            { name: 'Sirsa', score: 92 },
                            { name: 'Kolar', score: 88 },
                            { name: 'Karnal', score: 88 },
                            { name: 'Ludhiana', score: 85 },
                            { name: 'Murshidabad', score: 85 },
                            { name: 'Erode', score: 82 },
                            { name: 'Amritsar', score: 82 },
                            { name: 'Junagadh', score: 80 },
                            { name: 'Burdwan', score: 78 },
                            { name: 'Hisar', score: 78 },
                            { name: 'Nagpur', score: 75 },
                            { name: 'Rajkot', score: 75 },
                            { name: 'Agra', score: 72 },
                            { name: 'Sehore', score: 72 },
                            { name: 'Pune', score: 70 },
                            { name: 'Salem', score: 70 },
                            { name: 'Indore', score: 68 },
                            { name: 'Meerut', score: 68 },
                            { name: 'Belgaum', score: 65 },
                            { name: 'Lucknow', score: 62 },
                            { name: 'Jaipur', score: 58 },
                            { name: 'Jodhpur', score: 52 },
                        ].map((district) => (
                            <div
                                key={district.name}
                                className={`p-3 rounded-lg text-white text-center ${district.score >= 81 ? 'bg-emerald-700' :
                                        district.score >= 61 ? 'bg-green-500' :
                                            district.score >= 41 ? 'bg-yellow-500' :
                                                district.score >= 21 ? 'bg-orange-500' :
                                                    'bg-red-500'
                                    }`}
                            >
                                <p className="font-medium text-sm">{district.name}</p>
                                <p className="text-lg font-bold">{district.score}</p>
                            </div>
                        ))}
                    </div>

                    {/* Top Districts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-green-700 text-lg">🔥 High Demand Zones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex justify-between"><span>Nashik, Maharashtra</span><Badge>95</Badge></li>
                                    <li className="flex justify-between"><span>Sirsa, Haryana</span><Badge>92</Badge></li>
                                    <li className="flex justify-between"><span>Kolar, Karnataka</span><Badge>88</Badge></li>
                                    <li className="flex justify-between"><span>Karnal, Haryana</span><Badge>88</Badge></li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-red-700 text-lg">📉 Low Demand Zones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex justify-between"><span>Jodhpur, Rajasthan</span><Badge>52</Badge></li>
                                    <li className="flex justify-between"><span>Jaipur, Rajasthan</span><Badge>58</Badge></li>
                                    <li className="flex justify-between"><span>Lucknow, UP</span><Badge>62</Badge></li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
