// ============================================
// 🚚 LOGISTICS MODULE - API ROUTE
// Location: /api/farmer/logistics
// Transport cost estimation and profit calculation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, LogisticsInfo, Location, TransportOption, ProfitCalculation } from '@/types/farmer';

// Calculate distance between two locations (simulated)
function calculateDistance(pickup: Location, delivery: Location): number {
    // In production, use Google Maps API or similar
    // For demo, simulate based on pincode difference
    const pickupPin = parseInt(pickup.pincode) || 100000;
    const deliveryPin = parseInt(delivery.pincode) || 200000;
    const diff = Math.abs(pickupPin - deliveryPin);

    // Rough estimation: every 10000 difference ≈ 50km
    return Math.round(10 + diff / 200);
}

// Generate transport options
function generateTransportOptions(distance: number, quantity: number): TransportOption[] {
    const baseCostPerKm = {
        truck: 25,
        tempo: 18,
        tractor: 12,
        custom: 30
    };

    const options: TransportOption[] = [
        {
            id: 'truck_1',
            type: 'truck',
            name: '10-Ton Truck',
            capacity: 100,
            costPerKm: baseCostPerKm.truck,
            totalCost: Math.round(distance * baseCostPerKm.truck * (quantity > 100 ? 2 : 1)),
            estimatedTime: Math.round(distance / 40 + 2), // 40km/h average + loading
            provider: 'AgriLogistics Pvt Ltd',
            rating: 4.5,
            available: true
        },
        {
            id: 'tempo_1',
            type: 'tempo',
            name: 'Tempo Traveller',
            capacity: 30,
            costPerKm: baseCostPerKm.tempo,
            totalCost: Math.round(distance * baseCostPerKm.tempo * (quantity > 30 ? 2 : 1)),
            estimatedTime: Math.round(distance / 35 + 1),
            provider: 'FastFarm Transport',
            rating: 4.2,
            available: true
        },
        {
            id: 'tractor_1',
            type: 'tractor',
            name: 'Tractor Trolley',
            capacity: 20,
            costPerKm: baseCostPerKm.tractor,
            totalCost: Math.round(distance * baseCostPerKm.tractor * (quantity > 20 ? 2 : 1)),
            estimatedTime: Math.round(distance / 20 + 2), // slower
            provider: 'Local Transport',
            rating: 3.8,
            available: quantity <= 40
        },
        {
            id: 'custom_1',
            type: 'custom',
            name: 'Refrigerated Truck',
            capacity: 80,
            costPerKm: baseCostPerKm.custom,
            totalCost: Math.round(distance * baseCostPerKm.custom),
            estimatedTime: Math.round(distance / 45 + 1),
            provider: 'ColdChain Express',
            rating: 4.8,
            available: true
        }
    ];

    return options.filter(o => o.available);
}

// Calculate profit breakdown
function calculateProfit(
    cropName: string,
    quantity: number,
    pricePerQuintal: number,
    transportCost: number,
    distance: number
): ProfitCalculation {
    const grossAmount = quantity * pricePerQuintal;
    const loadingCost = Math.round(quantity * 5); // Rs. 5 per quintal loading
    const marketFee = Math.round(grossAmount * 0.01); // 1% market fee
    const otherExpenses = Math.round(quantity * 2 + distance * 5); // Misc costs

    const totalExpenses = transportCost + loadingCost + marketFee + otherExpenses;
    const netProfit = grossAmount - totalExpenses;
    const profitMargin = (netProfit / grossAmount) * 100;

    return {
        cropName,
        quantity,
        pricePerQuintal,
        grossAmount,
        transportCost,
        loadingCost,
        marketFee,
        otherExpenses,
        totalExpenses,
        netProfit,
        profitMargin: Math.round(profitMargin * 10) / 10
    };
}

// Base prices for crops
const cropPrices: Record<string, number> = {
    'Rice (Basmati)': 3500,
    'Wheat': 2250,
    'Tomato': 1000,
    'Onion': 1750,
    'Potato': 750,
    'Cotton': 5850,
    'Sugarcane': 375,
    'Maize': 2000,
    'Soybean': 4000,
    'Groundnut': 5500
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Pickup location
        const pickupDistrict = searchParams.get('pickupDistrict') || 'Sirsa';
        const pickupState = searchParams.get('pickupState') || 'Haryana';
        const pickupPincode = searchParams.get('pickupPincode') || '125055';

        // Delivery location
        const deliveryDistrict = searchParams.get('deliveryDistrict') || 'Delhi';
        const deliveryState = searchParams.get('deliveryState') || 'Delhi';
        const deliveryPincode = searchParams.get('deliveryPincode') || '110001';

        // Crop details
        const cropName = searchParams.get('cropName') || 'Wheat';
        const quantity = parseFloat(searchParams.get('quantity') || '50');
        const pricePerQuintal = parseFloat(searchParams.get('pricePerQuintal') || cropPrices[cropName]?.toString() || '2000');

        const pickupLocation: Location = {
            address: `${pickupDistrict} Mandi`,
            district: pickupDistrict,
            state: pickupState,
            pincode: pickupPincode
        };

        const deliveryLocation: Location = {
            address: `${deliveryDistrict} Market`,
            district: deliveryDistrict,
            state: deliveryState,
            pincode: deliveryPincode
        };

        const distance = calculateDistance(pickupLocation, deliveryLocation);
        const transportOptions = generateTransportOptions(distance, quantity);
        const recommendedOption = transportOptions.reduce((best, current) =>
            current.rating > best.rating && current.totalCost <= best.totalCost * 1.2 ? current : best
        );

        const netProfitCalculation = calculateProfit(
            cropName,
            quantity,
            pricePerQuintal,
            recommendedOption.totalCost,
            distance
        );

        const logisticsInfo: LogisticsInfo = {
            id: `log_${Date.now()}`,
            pickupLocation,
            deliveryLocation,
            distance,
            estimatedTime: recommendedOption.estimatedTime,
            transportOptions,
            recommendedOption,
            netProfitCalculation
        };

        const response: ApiResponse<LogisticsInfo> = {
            success: true,
            data: logisticsInfo,
            message: 'Logistics information calculated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error calculating logistics:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to calculate logistics information',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            pickupLocation,
            deliveryLocation,
            cropName,
            quantity,
            pricePerQuintal
        } = body;

        // Validate required fields
        if (!pickupLocation || !deliveryLocation || !cropName || !quantity) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: pickupLocation, deliveryLocation, cropName, quantity',
                    timestamp: new Date().toISOString()
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        const distance = calculateDistance(pickupLocation, deliveryLocation);
        const transportOptions = generateTransportOptions(distance, quantity);
        const recommendedOption = transportOptions.reduce((best, current) =>
            current.rating > best.rating && current.totalCost <= best.totalCost * 1.2 ? current : best
        );

        const price = pricePerQuintal || cropPrices[cropName] || 2000;
        const netProfitCalculation = calculateProfit(
            cropName,
            quantity,
            price,
            recommendedOption.totalCost,
            distance
        );

        const logisticsInfo: LogisticsInfo = {
            id: `log_${Date.now()}`,
            pickupLocation,
            deliveryLocation,
            distance,
            estimatedTime: recommendedOption.estimatedTime,
            transportOptions,
            recommendedOption,
            netProfitCalculation
        };

        const response: ApiResponse<LogisticsInfo> = {
            success: true,
            data: logisticsInfo,
            message: 'Logistics information calculated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error calculating logistics:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to calculate logistics information',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}