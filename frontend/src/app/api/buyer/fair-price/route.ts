import { NextResponse } from 'next/server';
import type { FairPriceAnalysis, ApiResponse } from '@/types/buyer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cropName, bidPrice } = body;

        // Mock fair price data
        const avgPrice = 2450;
        const minPrice = 2350;
        const maxPrice = 2580;

        let priceStatus: 'exploitative' | 'below_fair' | 'fair' | 'above_fair' = 'fair';
        let exploitationRisk: 'none' | 'low' | 'medium' | 'high' = 'none';
        let recommendation = 'Your bid is within the fair market range. Proceed with offer.';

        if (bidPrice < minPrice * 0.8) {
            priceStatus = 'exploitative';
            exploitationRisk = 'high';
            recommendation = `Exploitative pricing detected. Your bid of ₹${bidPrice} is more than 20% below the minimum fair price. This harms the farmer. Increase your bid to at least ₹${minPrice}.`;
        } else if (bidPrice < minPrice) {
            priceStatus = 'below_fair';
            exploitationRisk = 'medium';
            recommendation = `Your bid of ₹${bidPrice} is slightly below the fair market range. Consider increasing it to build long-term trust.`;
        } else if (bidPrice > maxPrice) {
            priceStatus = 'above_fair';
            exploitationRisk = 'none';
            recommendation = `Your bid of ₹${bidPrice} is above current market rates. This is an excellent offer for the farmer.`;
        }

        const data: FairPriceAnalysis = {
            buyerBidPrice: bidPrice,
            priceStatus,
            exploitationRisk,
            recommendation,
            fairPriceRange: {
                min: minPrice,
                avg: avgPrice,
                max: maxPrice
            },
            marketFactors: [
                {
                    factor: 'Market Demand',
                    description: 'High demand in urban centers',
                    impact: 'positive',
                    percentageChange: 8.5
                },
                {
                    factor: 'Supply Level',
                    description: 'Low arrivals in local mandis',
                    impact: 'positive',
                    percentageChange: 5.2
                },
                {
                    factor: 'Logistics',
                    description: 'Increased transportation costs due to fuel prices',
                    impact: 'negative',
                    percentageChange: -2.1
                }
            ]
        };

        const response: ApiResponse<FairPriceAnalysis> = { success: true, data };
        return NextResponse.json(response);

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to analyze fair price' }, { status: 500 });
    }
}
