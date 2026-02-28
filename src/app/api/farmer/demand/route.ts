// ============================================
// 📊 DEMAND FORECAST MODULE - API ROUTE
// Location: /api/farmer/demand
// Connects to FastAPI backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, DemandForecast } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const district = searchParams.get('district') || 'Pune';

        const res = await fetch(`${BACKEND_URL}/demand/top?district=${encodeURIComponent(district)}`);
        if (!res.ok) throw new Error('Failed to fetch demand from backend');
        const data = await res.json();

        // Add some mock data for festivals as they aren't in backend yet
        const forecast: DemandForecast = {
            ...data,
            upcomingFestivals: [
                {
                    name: 'Holi',
                    date: '2026-03-14',
                    cropsImpacted: ['Wheat', 'Sugar'],
                    expectedDemandIncrease: 15
                }
            ],
            regionalInsights: [
                {
                    state: 'Maharashtra',
                    district: district,
                    highDemandCrops: data.topCrops.slice(0, 3).map((c: any) => c.cropName),
                    demandScore: data.demandMeter
                }
            ]
        };

        const response: ApiResponse<DemandForecast> = {
            success: true,
            data: forecast,
            message: 'Demand forecast generated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error in demand API:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate demand forecast',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
