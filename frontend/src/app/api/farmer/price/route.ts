// ============================================
// 📊 REAL-TIME PRICE MODULE - API ROUTE
// Location: /api/farmer/price
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropPrice, PriceQuery } from '@/types/farmer';

// Simulated Agmarknet data (In production, fetch from real API)
const mockMarketData: CropPrice[] = [
    {
        id: '1',
        cropName: 'Rice (Basmati)',
        cropNameHindi: 'बासमती चावल',
        district: 'Karnal',
        state: 'Haryana',
        market: 'Karnal Grain Market',
        minPrice: 3200,
        maxPrice: 3800,
        modalPrice: 3500,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Basmati 1121',
        grade: 'A'
    },
    {
        id: '2',
        cropName: 'Wheat',
        cropNameHindi: 'गेहूं',
        district: 'Sirsa',
        state: 'Haryana',
        market: 'Sirsa Mandi',
        minPrice: 2100,
        maxPrice: 2400,
        modalPrice: 2250,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'HD-2967',
        grade: 'A'
    },
    {
        id: '3',
        cropName: 'Tomato',
        cropNameHindi: 'टमाटर',
        district: 'Kolar',
        state: 'Karnataka',
        market: 'Kolar APMC',
        minPrice: 800,
        maxPrice: 1200,
        modalPrice: 1000,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Hybrid',
        grade: 'A'
    },
    {
        id: '4',
        cropName: 'Onion',
        cropNameHindi: 'प्याज',
        district: 'Nashik',
        state: 'Maharashtra',
        market: 'Lasalgaon Mandi',
        minPrice: 1500,
        maxPrice: 2000,
        modalPrice: 1750,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Red',
        grade: 'A'
    },
    {
        id: '5',
        cropName: 'Potato',
        cropNameHindi: 'आलू',
        district: 'Agra',
        state: 'Uttar Pradesh',
        market: 'Agra Potato Market',
        minPrice: 600,
        maxPrice: 900,
        modalPrice: 750,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Kufri Bahar',
        grade: 'A'
    },
    {
        id: '6',
        cropName: 'Cotton',
        cropNameHindi: 'कपास',
        district: 'Nagpur',
        state: 'Maharashtra',
        market: 'Nagpur Cotton Market',
        minPrice: 5500,
        maxPrice: 6200,
        modalPrice: 5850,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Bt Cotton',
        grade: 'A'
    },
    {
        id: '7',
        cropName: 'Sugarcane',
        cropNameHindi: 'गन्ना',
        district: 'Meerut',
        state: 'Uttar Pradesh',
        market: 'Meerut Mandi',
        minPrice: 350,
        maxPrice: 400,
        modalPrice: 375,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'CoS 767',
        grade: 'A'
    },
    {
        id: '8',
        cropName: 'Maize',
        cropNameHindi: 'मक्का',
        district: 'Begusarai',
        state: 'Bihar',
        market: 'Begusarai Mandi',
        minPrice: 1800,
        maxPrice: 2200,
        modalPrice: 2000,
        unit: 'Quintal',
        arrivalDate: new Date().toISOString().split('T')[0],
        variety: 'Hybrid',
        grade: 'A'
    }
];

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cropName = searchParams.get('cropName');
        const district = searchParams.get('district');
        const state = searchParams.get('state');

        let filteredData = [...mockMarketData];

        if (cropName) {
            filteredData = filteredData.filter(
                item => item.cropName.toLowerCase().includes(cropName.toLowerCase()) ||
                    item.cropNameHindi?.includes(cropName)
            );
        }

        if (district) {
            filteredData = filteredData.filter(
                item => item.district.toLowerCase().includes(district.toLowerCase())
            );
        }

        if (state) {
            filteredData = filteredData.filter(
                item => item.state.toLowerCase().includes(state.toLowerCase())
            );
        }

        const response: ApiResponse<CropPrice[]> = {
            success: true,
            data: filteredData,
            message: `Found ${filteredData.length} price entries`,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching prices:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch market prices',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: PriceQuery = await request.json();

        let filteredData = [...mockMarketData];

        if (body.cropName) {
            filteredData = filteredData.filter(
                item => item.cropName.toLowerCase().includes(body.cropName!.toLowerCase())
            );
        }

        if (body.district) {
            filteredData = filteredData.filter(
                item => item.district.toLowerCase().includes(body.district!.toLowerCase())
            );
        }

        if (body.state) {
            filteredData = filteredData.filter(
                item => item.state.toLowerCase().includes(body.state!.toLowerCase())
            );
        }

        const response: ApiResponse<CropPrice[]> = {
            success: true,
            data: filteredData,
            message: `Found ${filteredData.length} price entries`,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in price query:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process price query',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
