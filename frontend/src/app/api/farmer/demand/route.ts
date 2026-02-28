// ============================================
// 📊 DEMAND FORECAST MODULE - API ROUTE
// Location: /api/farmer/demand
// Uses: Google Trends + Arrival Data
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, DemandForecast, DemandCrop, FestivalImpact, RegionalDemand } from '@/types/farmer';

// Simulate demand data based on market analysis
function generateDemandForecast(district?: string, state?: string): DemandForecast {
    // Top demanding crops with trends
    const allCrops: DemandCrop[] = [
        {
            rank: 1,
            cropName: 'Onion',
            demandScore: 92,
            trend: 'up',
            changePercent: 12.5,
            arrivalVolume: 15000,
            priceCorrelation: 0.85
        },
        {
            rank: 2,
            cropName: 'Tomato',
            demandScore: 88,
            trend: 'up',
            changePercent: 8.3,
            arrivalVolume: 12000,
            priceCorrelation: 0.78
        },
        {
            rank: 3,
            cropName: 'Potato',
            demandScore: 85,
            trend: 'stable',
            changePercent: 2.1,
            arrivalVolume: 25000,
            priceCorrelation: 0.65
        },
        {
            rank: 4,
            cropName: 'Wheat',
            demandScore: 82,
            trend: 'up',
            changePercent: 5.7,
            arrivalVolume: 50000,
            priceCorrelation: 0.72
        },
        {
            rank: 5,
            cropName: 'Rice (Basmati)',
            demandScore: 78,
            trend: 'stable',
            changePercent: 1.2,
            arrivalVolume: 35000,
            priceCorrelation: 0.68
        },
        {
            rank: 6,
            cropName: 'Cotton',
            demandScore: 75,
            trend: 'up',
            changePercent: 9.2,
            arrivalVolume: 8000,
            priceCorrelation: 0.82
        },
        {
            rank: 7,
            cropName: 'Maize',
            demandScore: 72,
            trend: 'down',
            changePercent: -3.4,
            arrivalVolume: 18000,
            priceCorrelation: 0.58
        },
        {
            rank: 8,
            cropName: 'Soybean',
            demandScore: 70,
            trend: 'up',
            changePercent: 6.8,
            arrivalVolume: 12000,
            priceCorrelation: 0.75
        }
    ];

    // Festival impacts (upcoming)
    const festivals: FestivalImpact[] = [
        {
            name: 'Diwali',
            date: '2024-11-01',
            cropsImpacted: ['Rice (Basmati)', 'Wheat', 'Sugar', 'Groundnut'],
            expectedDemandIncrease: 25
        },
        {
            name: 'Dussehra',
            date: '2024-10-12',
            cropsImpacted: ['Banana', 'Sugarcane', 'Wheat'],
            expectedDemandIncrease: 18
        },
        {
            name: 'Christmas',
            date: '2024-12-25',
            cropsImpacted: ['Tomato', 'Potato', 'Onion', 'Cauliflower'],
            expectedDemandIncrease: 15
        },
        {
            name: 'Makar Sankranti',
            date: '2025-01-14',
            cropsImpacted: ['Sesame', 'Groundnut', 'Jaggery'],
            expectedDemandIncrease: 22
        }
    ];

    // Regional demand patterns
    const regionalData: RegionalDemand[] = [
        {
            state: 'Maharashtra',
            district: 'Nashik',
            highDemandCrops: ['Onion', 'Grapes', 'Tomato'],
            demandScore: 92
        },
        {
            state: 'Karnataka',
            district: 'Kolar',
            highDemandCrops: ['Tomato', 'Potato', 'Beans'],
            demandScore: 88
        },
        {
            state: 'Haryana',
            district: 'Karnal',
            highDemandCrops: ['Rice', 'Wheat', 'Sugarcane'],
            demandScore: 85
        },
        {
            state: 'Punjab',
            district: 'Ludhiana',
            highDemandCrops: ['Wheat', 'Cotton', 'Maize'],
            demandScore: 83
        },
        {
            state: 'Gujarat',
            district: 'Junagadh',
            highDemandCrops: ['Groundnut', 'Cotton', 'Onion'],
            demandScore: 80
        }
    ];

    // Filter by region if specified
    let filteredRegional = regionalData;
    if (state) {
        filteredRegional = regionalData.filter(r =>
            r.state.toLowerCase().includes(state.toLowerCase())
        );
    }
    if (district) {
        filteredRegional = regionalData.filter(r =>
            r.district.toLowerCase().includes(district!.toLowerCase())
        );
    }

    // Calculate overall demand meter
    const demandMeter = Math.round(
        allCrops.slice(0, 5).reduce((sum, c) => sum + c.demandScore, 0) / 5
    );

    // Determine seasonal trend
    const currentMonth = new Date().getMonth();
    let seasonalTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (currentMonth >= 9 || currentMonth <= 1) {
        seasonalTrend = 'increasing'; // Festival season
    } else if (currentMonth >= 4 && currentMonth <= 6) {
        seasonalTrend = 'decreasing'; // Summer lean period
    }

    return {
        topCrops: allCrops,
        demandMeter,
        seasonalTrend,
        upcomingFestivals: festivals.filter(f => new Date(f.date) > new Date()),
        regionalInsights: filteredRegional,
        lastUpdated: new Date().toISOString()
    };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const district = searchParams.get('district') || undefined;
        const state = searchParams.get('state') || undefined;
        const limit = parseInt(searchParams.get('limit') || '8');

        const forecast = generateDemandForecast(district, state);

        // Limit top crops
        forecast.topCrops = forecast.topCrops.slice(0, limit);

        const response: ApiResponse<DemandForecast> = {
            success: true,
            data: forecast,
            message: 'Demand forecast generated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating demand forecast:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate demand forecast',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { district, state, limit } = body;

        const forecast = generateDemandForecast(district, state);

        if (limit) {
            forecast.topCrops = forecast.topCrops.slice(0, limit);
        }

        const response: ApiResponse<DemandForecast> = {
            success: true,
            data: forecast,
            message: 'Demand forecast generated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error generating demand forecast:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate demand forecast',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
