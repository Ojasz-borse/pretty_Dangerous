// ============================================
// 📈 PRICE PREDICTION MODULE - API ROUTE
// Location: /api/farmer/prediction
// Connects to FastAPI backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, PricePrediction, PriceDataPoint, WeatherImpact } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cropName = searchParams.get('cropName') || 'Wheat';
        const district = searchParams.get('district') || 'Pune';
        const days = parseInt(searchParams.get('days') || '7');

        // 1. Fetch Forecast from FastAPI
        const predictRes = await fetch(`${BACKEND_URL}/predict?crop=${encodeURIComponent(cropName)}&district=${encodeURIComponent(district)}&days=${days}`);
        if (!predictRes.ok) throw new Error('Failed to fetch prediction from backend');
        const predictData = await predictRes.json();

        // 2. Fetch History from FastAPI
        const historyRes = await fetch(`${BACKEND_URL}/history?crop=${encodeURIComponent(cropName)}&mandi=${encodeURIComponent(district)}&days=7`);
        const historyData = historyRes.ok ? await historyRes.json() : [];

        // 3. Fetch Weather from FastAPI (reusing the /data endpoint or similar if needed, or mock for now)
        // For simplicity, let's use the weather from /data endpoint
        const dataRes = await fetch(`${BACKEND_URL}/data?district=${encodeURIComponent(district)}&crop=${encodeURIComponent(cropName)}`);
        const unifiedData = dataRes.ok ? await dataRes.json() : null;

        const historicalPrices: PriceDataPoint[] = historyData.map((h: any) => ({
            date: h.date,
            price: h.close,
            isPredicted: false
        }));

        const predictedPrices: PriceDataPoint[] = predictData.forecast.map((f: any) => ({
            date: f.ds.split('T')[0],
            price: Math.round(f.yhat),
            isPredicted: true
        }));

        const weatherImpact: WeatherImpact = unifiedData ? {
            temperature: unifiedData.weather_data.temp,
            humidity: unifiedData.weather_data.humidity,
            rainfall: unifiedData.weather_data.rain_next_3_days ? 50 : 0, // Mock rainfall value
            impact: unifiedData.weather_data.rain_next_3_days ? 'negative' : 'positive',
            description: unifiedData.advice_marathi.slice(0, 100) + '...'
        } : {
            temperature: 30,
            humidity: 60,
            rainfall: 0,
            impact: 'neutral',
            description: 'Weather data not available'
        };

        const trendDirection = predictData.sell_advice.advice === 'Wait' ? 'up' : 'down';

        const prediction: PricePrediction = {
            cropName,
            district,
            historicalPrices,
            predictedPrices,
            riskLevel: predictData.sell_advice.gain_percent > 10 ? 'High' : 'Low',
            confidence: 90, // Static for now
            weatherImpact,
            trendDirection
        };

        const response: ApiResponse<PricePrediction> = {
            success: true,
            data: prediction,
            message: predictData.sell_advice.reason,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Error fetching prediction:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate price prediction',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
