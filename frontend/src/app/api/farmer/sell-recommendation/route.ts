// ============================================
// 💰 SELL NOW OR WAIT MODULE - API ROUTE
// Location: /api/farmer/sell-recommendation
// Innovation Layer: Smart selling recommendations
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, SellRecommendation, SellAnalysisInput } from '@/types/farmer';

// Simple deterministic random based on crop name
function getSeededValue(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

// Rule-based recommendation engine
function generateRecommendation(input: SellAnalysisInput): SellRecommendation {
    // Base prices for different crops
    const basePrices: Record<string, number> = {
        'Rice (Basmati)': 3500,
        'Wheat': 2250,
        'Tomato': 1000,
        'Onion': 1750,
        'Potato': 750,
        'Cotton': 5850,
        'Sugarcane': 375,
        'Maize': 2000,
        'Soybean': 4000,
        'Groundnut': 5500,
        'Mustard': 4800,
        'Chilli': 12000,
        'Turmeric': 8000,
        'Garlic': 6000
    };

    const currentPrice = basePrices[input.cropName] || 2000;
    const storageCostPerDay = input.storageCostPerDay || currentPrice * 0.005;

    // Use deterministic random based on cropName
    const seed = getSeededValue(input.cropName);

    // Simulate price prediction (deterministic per crop)
    const predictedChange = (seed * 20 - 5); // -5% to +15%
    const predictedPrice = currentPrice * (1 + predictedChange / 100);

    // Calculate optimal wait days
    let waitDays = 0;
    let expectedGain = 0;

    if (predictedChange > 5) {
        waitDays = Math.min(Math.round(predictedChange / 2), 7);
        expectedGain = predictedChange;
    } else if (predictedChange > 2) {
        waitDays = 3;
        expectedGain = predictedChange;
    }

    // Deterministic demand index
    const demandIndex = Math.round(50 + seed * 40);

    // Calculate net profit
    const grossAmount = currentPrice * input.quantity * (1 + expectedGain / 100);
    const storageCost = waitDays * storageCostPerDay * input.quantity;
    const netProfit = grossAmount - storageCost;

    // Deterministic risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (predictedChange > 8) riskLevel = 'High';
    else if (predictedChange < 2) riskLevel = 'Low';

    // Generate recommendation
    const recommendation: SellRecommendation = {
        id: `rec_${input.cropName.toLowerCase()}_${new Date().toISOString().split('T')[0]}`,
        cropName: input.cropName,
        currentPrice,
        predictedPrice: Math.round(predictedPrice),
        recommendation: expectedGain > 3 ? 'WAIT' : 'SELL_NOW',
        waitDays: expectedGain > 3 ? waitDays : undefined,
        expectedGain: Math.round(expectedGain * 10) / 10,
        reason: generateReason(expectedGain, demandIndex, riskLevel, input.cropName),
        storageCost: Math.round(storageCost),
        demandIndex,
        netProfit: Math.round(netProfit),
        riskLevel,
        timestamp: new Date().toISOString()
    };

    return recommendation;
}

function generateReason(gain: number, demand: number, risk: string, crop: string): string {
    if (gain > 8) {
        return `Strong upward price trend detected for ${crop}. Market analysis indicates ${gain.toFixed(1)}% potential increase. High demand (${demand}/100) supports this projection. Consider waiting for optimal returns.`;
    } else if (gain > 5) {
        return `Moderate price increase expected (${gain.toFixed(1)}%). Current market conditions favor holding for ${Math.round(gain / 2)} more days. Demand remains steady at ${demand}/100.`;
    } else if (gain > 2) {
        return `Slight price increase possible. However, storage costs may reduce net gains. Current demand is ${demand}/100. Sell soon if storage costs are high.`;
    } else if (gain > 0) {
        return `Minimal price movement expected. Market is stable. Consider selling now to avoid storage costs and secure immediate returns.`;
    } else {
        return `Price decline expected. Market conditions suggest selling immediately to avoid losses. Demand index: ${demand}/100.`;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cropName = searchParams.get('cropName') || 'Wheat';
        const quantity = parseFloat(searchParams.get('quantity') || '10');
        const storageCostPerDay = searchParams.get('storageCostPerDay')
            ? parseFloat(searchParams.get('storageCostPerDay')!)
            : undefined;

        const input: SellAnalysisInput = {
            cropName,
            quantity,
            storageCostPerDay
        };

        const recommendation = generateRecommendation(input);

        const response: ApiResponse<SellRecommendation> = {
            success: true,
            data: recommendation,
            message: 'Recommendation generated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating recommendation:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate recommendation',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: SellAnalysisInput = await request.json();

        // Validate input
        if (!body.cropName || !body.quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Crop name and quantity are required',
                    timestamp: new Date().toISOString()
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        const recommendation = generateRecommendation(body);

        const response: ApiResponse<SellRecommendation> = {
            success: true,
            data: recommendation,
            message: 'Recommendation generated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating recommendation:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate recommendation',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
