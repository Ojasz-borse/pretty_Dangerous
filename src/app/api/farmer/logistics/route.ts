// ============================================
// 🚚 LOGISTICS MODULE - API ROUTE
// Location: /api/farmer/logistics
// Connects to FastAPI backend for data
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, LogisticsInfo, Location, TransportOption, ProfitCalculation } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

function calculateDistance(pickup: Location, delivery: Location): number {
    const pickupPin = parseInt(pickup.pincode) || 125055;
    const deliveryPin = parseInt(delivery.pincode) || 110001;
    const diff = Math.abs(pickupPin - deliveryPin);
    return Math.round(10 + diff / 300);
}

function generateTransportOptions(distance: number, quantity: number): TransportOption[] {
    const baseCostPerKm = { truck: 22, tempo: 15, tractor: 10, custom: 28 };
    return [
        {
            id: 'truck_1', type: 'truck', name: 'Standard Truck', capacity: 100, costPerKm: baseCostPerKm.truck,
            totalCost: Math.round(distance * baseCostPerKm.truck), estimatedTime: Math.round(distance / 40 + 2),
            provider: 'AgriLogistics', rating: 4.5, available: true
        },
        {
            id: 'tempo_1', type: 'tempo', name: 'Large Tempo', capacity: 30, costPerKm: baseCostPerKm.tempo,
            totalCost: Math.round(distance * baseCostPerKm.tempo), estimatedTime: Math.round(distance / 45 + 1),
            provider: 'FastFarm', rating: 4.2, available: true
        }
    ];
}

function calculateProfit(c: string, q: number, p: number, tc: number, d: number): ProfitCalculation {
    const gross = q * p;
    const loading = Math.round(q * 8);
    const mfee = Math.round(gross * 0.015);
    const other = Math.round(q * 3 + d * 4);
    const totalExp = tc + loading + mfee + other;
    return {
        cropName: c, quantity: q, pricePerQuintal: p, grossAmount: gross,
        transportCost: tc, loadingCost: loading, marketFee: mfee, otherExpenses: other,
        totalExpenses: totalExp, netProfit: gross - totalExp, profitMargin: Math.round(((gross - totalExp) / gross) * 1000) / 10
    };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cropName = searchParams.get('cropName') || 'Wheat';
        const quantity = parseFloat(searchParams.get('quantity') || '50');
        let pricePerQuintal = parseFloat(searchParams.get('pricePerQuintal') || '0');

        if (pricePerQuintal === 0) {
            const res = await fetch(`${BACKEND_URL}/data`);
            const allData = await res.json();
            const cropData = allData.find((d: any) => d.Commodity.toLowerCase() === cropName.toLowerCase());
            pricePerQuintal = cropData ? parseFloat(cropData['Modal Price']) : 2200;
        }

        const pickupLocation: Location = {
            address: searchParams.get('pickupDistrict') || 'Sirsa',
            district: searchParams.get('pickupDistrict') || 'Sirsa',
            state: searchParams.get('pickupState') || 'Haryana',
            pincode: searchParams.get('pickupPincode') || '125055'
        };
        const deliveryLocation: Location = {
            address: searchParams.get('deliveryDistrict') || 'Delhi',
            district: searchParams.get('deliveryDistrict') || 'Delhi',
            state: searchParams.get('deliveryState') || 'Delhi',
            pincode: searchParams.get('deliveryPincode') || '110001'
        };

        const distance = calculateDistance(pickupLocation, deliveryLocation);
        const transportOptions = generateTransportOptions(distance, quantity);
        const recommendedOption = transportOptions[0];

        const logisticsInfo: LogisticsInfo = {
            id: `log_${Date.now()}`, pickupLocation, deliveryLocation, distance,
            estimatedTime: recommendedOption.estimatedTime, transportOptions,
            recommendedOption, netProfitCalculation: calculateProfit(cropName, quantity, pricePerQuintal, recommendedOption.totalCost, distance)
        };

        return NextResponse.json({ success: true, data: logisticsInfo });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    return GET(request);
}
