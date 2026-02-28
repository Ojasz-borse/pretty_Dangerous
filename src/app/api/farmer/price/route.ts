// ============================================
// 📊 REAL-TIME PRICE MODULE - API ROUTE
// Location: /api/farmer/price
// Connects to FastAPI backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropPrice } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cropName = searchParams.get('cropName');
        const district = searchParams.get('district');
        const state = searchParams.get('state');

        // Fetch from FastAPI
        const res = await fetch(`${BACKEND_URL}/data`);
        if (!res.ok) throw new Error('Failed to fetch data from backend');
        const rawData = await res.json();

        // Map backend data to CropPrice type
        // The backend /data returns a list of dictionaries with CSV column names
        let prices: CropPrice[] = rawData.map((item: any, index: number) => ({
            id: String(index + 1),
            cropName: item.Commodity || 'Unknown',
            cropNameHindi: '', // Not provided by backend
            district: item.District || 'Unknown',
            state: item.State || 'Unknown',
            market: item.Market || 'Unknown',
            minPrice: parseFloat(item['Min Price']) || 0,
            maxPrice: parseFloat(item['Max Price']) || 0,
            modalPrice: parseFloat(item['Modal Price']) || 0,
            unit: 'Quintal',
            arrivalDate: item['Arrival Date'] || '',
            variety: item.Variety || '',
            grade: item.Grade || 'FAQ'
        }));

        if (cropName) {
            prices = prices.filter(p => p.cropName.toLowerCase().includes(cropName.toLowerCase()));
        }
        if (district) {
            prices = prices.filter(p => p.district.toLowerCase().includes(district.toLowerCase()));
        }
        if (state) {
            prices = prices.filter(p => p.state.toLowerCase().includes(state.toLowerCase()));
        }

        const response: ApiResponse<CropPrice[]> = {
            success: true,
            data: prices.slice(0, 50), // Limit to 50 for performance
            message: `Found ${prices.length} price entries`,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error fetching prices:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch market prices', timestamp: new Date().toISOString() } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Reuse GET logic for filtered search
    return GET(request);
}
