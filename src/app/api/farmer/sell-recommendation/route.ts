// ============================================
// 💰 SELL NOW OR WAIT MODULE - API ROUTE
// Location: /api/farmer/sell-recommendation
// Connects to FastAPI backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, SellRecommendation, SellAnalysisInput } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function generateSmartRecommendation(input: SellAnalysisInput): Promise<SellRecommendation> {
    try {
        // 1. Fetch current price from backend /data
        const dataRes = await fetch(`${BACKEND_URL}/data`);
        const allData = await dataRes.json();
        const cropData = allData.find((d: any) => d.Commodity.toLowerCase() === input.cropName.toLowerCase());
        const currentPrice = cropData ? parseFloat(cropData['Modal Price']) : 2000;

        // 2. Fetch prediction from backend /predict
        const predRes = await fetch(`${BACKEND_URL}/predict?crop=${encodeURIComponent(input.cropName)}`);
        const predData = await predRes.json();
        const predictedPrice = predData.predicted_price || currentPrice * 1.05;

        const predictedChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
        const storageCostPerDay = input.storageCostPerDay || 5;

        // Calculate optimal wait days based on prediction
        let waitDays = 0;
        let expectedGain = predictedChange;

        if (predictedChange > 3) {
            waitDays = 7;
        } else if (predictedChange > 1) {
            waitDays = 3;
        }

        // Calculate demand - can use demand/top
        const demandRes = await fetch(`${BACKEND_URL}/demand/top`);
        const demandData = await demandRes.json();
        const cropDemand = demandData.topCrops.find((c: any) => c.name.toLowerCase().includes(input.cropName.toLowerCase()));
        const demandIndex = cropDemand ? cropDemand.score : 65;

        // Calculate costs
        const storageCost = waitDays * storageCostPerDay * input.quantity;
        const grossAmount = predictedPrice * input.quantity;
        const netProfit = grossAmount - storageCost;

        const recommendation: SellRecommendation = {
            id: `rec_${Date.now()}`,
            cropName: input.cropName,
            currentPrice,
            predictedPrice: Math.round(predictedPrice),
            recommendation: (predictedChange > 2 && netProfit > (currentPrice * input.quantity)) ? 'WAIT' : 'SELL_NOW',
            waitDays: (predictedChange > 2) ? waitDays : undefined,
            expectedGain: Math.round(predictedChange * 10) / 10,
            reason: predictedChange > 2
                ? `Prices for ${input.cropName} are trending up by ${predictedChange.toFixed(1)}%. Demand is ${demandIndex}/100.`
                : `Prices are stable or declining. Immediate sale recommended to avoid storage costs.`,
            storageCost: Math.round(storageCost),
            demandIndex,
            netProfit: Math.round(netProfit),
            riskLevel: predictedChange > 10 ? 'High' : 'Low',
            timestamp: new Date().toISOString()
        };

        return recommendation;
    } catch (error) {
        console.error("error in rec", error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: SellAnalysisInput = await request.json();
        if (!body.cropName || !body.quantity) {
            return NextResponse.json({ success: false, error: 'Crop name and quantity required' }, { status: 400 });
        }

        const recommendation = await generateSmartRecommendation(body);

        return NextResponse.json({
            success: true,
            data: recommendation,
            message: 'Recommendation generated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const body: SellAnalysisInput = {
        cropName: searchParams.get('cropName') || 'Wheat',
        quantity: parseFloat(searchParams.get('quantity') || '50'),
        storageCostPerDay: parseFloat(searchParams.get('storageCostPerDay') || '10')
    };

    try {
        const recommendation = await generateSmartRecommendation(body);
        return NextResponse.json({ success: true, data: recommendation });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
