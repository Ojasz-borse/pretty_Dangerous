// ============================================
// 💰 SELL NOW OR WAIT MODULE - API ROUTE
// Location: /api/farmer/sell-recommendation
// Innovation Layer: Smart selling recommendations
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, SellRecommendation, SellAnalysisInput } from '@/types/farmer';

// Simple deterministic random based on crop name
function getSeededValue(seed: string): number {
    // Include current date to match Python implementation and ensure daily validity
    const today = new Date().toISOString().split('T')[0];
    const seedStr = `${seed}_${today}`;

    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

// Rule-based recommendation engine — NOW UPDATED TO USE REAL DATA
async function generateRecommendation(input: SellAnalysisInput): Promise<SellRecommendation> {
    const MANDI_API_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';
    const district = 'Sirsa'; // Default or based on context

    try {
        const response = await fetch(`${MANDI_API_URL}/predict?crop=${encodeURIComponent(input.cropName)}&district=${encodeURIComponent(district)}&days=7`);
        const result = await response.json();

        if (response.ok && result.forecast && result.forecast.length > 0) {
            const forecast = result.forecast;
            const sellAdvice = result.sell_advice;
            const currentPrice = forecast[0].predicted_price;
            const predictedPrice = forecast[forecast.length - 1].predicted_price;
            const expectedGain = ((predictedPrice - currentPrice) / currentPrice) * 100;
            const waitDays = sellAdvice.includes('Wait') ? 7 : 0;
            const demandIndex = 75; // Logic placeholder

            // Calculate profit
            const grossAmount = currentPrice * input.quantity * (1 + (waitDays > 0 ? expectedGain / 100 : 0));
            const storageCost = waitDays * (input.storageCostPerDay || 10) * input.quantity;
            const netProfit = grossAmount - storageCost;

            return {
                id: `rec_${input.cropName.toLowerCase()}_${Date.now()}`,
                cropName: input.cropName,
                currentPrice,
                predictedPrice: Math.round(predictedPrice),
                recommendation: waitDays > 0 ? 'WAIT' : 'SELL_NOW',
                waitDays: waitDays > 0 ? waitDays : undefined,
                expectedGain: Math.round(expectedGain * 10) / 10,
                reason: sellAdvice,
                storageCost: Math.round(storageCost),
                demandIndex,
                netProfit: Math.round(netProfit),
                riskLevel: 'Medium',
                timestamp: new Date().toISOString()
            };
        }
    } catch (err) {
        console.error('Mandi API Error:', err);
    }

    // Fallback if API fails
    return {
        id: `rec_${input.cropName.toLowerCase()}_fallback`,
        cropName: input.cropName,
        currentPrice: 2000,
        predictedPrice: 2000,
        recommendation: 'SELL_NOW',
        reason: 'Unable to fetch live market data. Prices shown are estimates.',
        storageCost: 0,
        demandIndex: 50,
        netProfit: input.quantity * 2000,
        riskLevel: 'Medium',
        timestamp: new Date().toISOString(),
        expectedGain: 0
    };
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

        const recommendation = await generateRecommendation(input);

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

        const recommendation = await generateRecommendation(body);

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
