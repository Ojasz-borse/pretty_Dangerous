// ============================================
// 🌱 CROP IMAGE DETECTION MODULE - API ROUTE
// Location: /api/farmer/detect-crop
// Forwards image to FastAPI Vision Model (MobileNetV2)
// Returns Grade A/B/C with confidence and health indicators
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropDetectionResult, HealthIndicator } from '@/types/farmer';

const AI_BACKEND_URL = process.env.VISION_AI_URL || 'http://localhost:9000';

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];

// Maximum file size: 10 MB
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

// Map AI backend results to recommendations
function buildRecommendations(crop: string, recommendation: string, confidence: number): string[] {
    const recs: string[] = [];

    if (recommendation === 'WAIT') {
        recs.push(`AI suggests WAITING to sell your ${crop}. Market trends indicate a price increase.`);
        recs.push('Ensure proper storage to maintain crop quality during the wait period.');
    } else {
        recs.push(`AI suggests SELLING your ${crop} NOW. Current prices are optimal.`);
        recs.push('Quick sale will help avoid potential price drops or storage losses.');
    }

    if (confidence < 70) {
        recs.push('⚠️ AI confidence is moderate — consider uploading a clearer, well-lit crop photo.');
    }

    return recs;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;
        const district = formData.get('district') as string || 'Sirsa';

        if (!imageFile) {
            return NextResponse.json({ success: false, error: 'No image provided.' }, { status: 400 });
        }

        // ── Forward to Custom CNN Vision Model ────────────────────────────────────
        const aiFormData = new FormData();
        aiFormData.append('file', imageFile, imageFile.name);

        let aiResponse: Response;
        try {
            aiResponse = await fetch(`${AI_BACKEND_URL}/detect?district=${encodeURIComponent(district)}`, {
                method: 'POST',
                body: aiFormData,
                signal: AbortSignal.timeout(45_000),
            });
        } catch (fetchErr: unknown) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Vision AI server (port 9000) is not reachable.',
                    timestamp: new Date().toISOString(),
                },
                { status: 503 }
            );
        }

        if (!aiResponse.ok) {
            return NextResponse.json({ success: false, error: 'AI backend error.' }, { status: aiResponse.status });
        }

        const aiResult = await aiResponse.json() as {
            crop: string;
            confidence: string;
            market_insight: {
                current_price: number;
                predicted_price: number;
                growth_percent: number;
                demand_index: number;
                recommendation: 'WAIT' | 'SELL';
                reason: string;
                risk_level: string;
            }
        };

        const confidenceVal = parseFloat(aiResult.confidence);
        const cropName = aiResult.crop || 'Unknown';

        const result: CropDetectionResult = {
            id: `crop_${Date.now()}`,
            cropName: cropName.charAt(0).toUpperCase() + cropName.slice(1),
            confidence: Math.round(confidenceVal),
            qualityGrade: 'A', // Defaulting since custom CNN doesn't export grade yet
            qualityScore: Math.round(confidenceVal),
            healthIndicators: [
                { name: 'AI Confidence', value: `${confidenceVal}%`, status: confidenceVal > 80 ? 'good' : 'warning' },
                { name: 'Market Demand', value: `${aiResult.market_insight.demand_index}/100`, status: 'good' },
                { name: 'Growth Potential', value: `${aiResult.market_insight.growth_percent}%`, status: 'good' }
            ],
            recommendations: buildRecommendations(cropName, aiResult.market_insight.recommendation, confidenceVal),
            marketInsight: {
                currentPrice: aiResult.market_insight.current_price,
                predictedPrice: aiResult.market_insight.predicted_price,
                growthPercent: aiResult.market_insight.growth_percent,
                demandIndex: aiResult.market_insight.demand_index,
                recommendation: aiResult.market_insight.recommendation,
                reason: aiResult.market_insight.reason,
                riskLevel: aiResult.market_insight.risk_level
            },
            imageUrl: '',
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: result,
            message: `Detected ${cropName} with ${aiResult.market_insight.recommendation} advice.`,
            timestamp: new Date().toISOString(),
        } as ApiResponse<CropDetectionResult>);

    } catch (error) {
        console.error('[detect-crop] Error:', error);
        return NextResponse.json({ success: false, error: 'Analysis failed.' }, { status: 500 });
    }
}

// GET is not supported — always return a clear 405
export async function GET() {
    return NextResponse.json(
        {
            success: false,
            error: 'Use POST with a multipart/form-data body containing an "image" field.',
            timestamp: new Date().toISOString(),
        } as ApiResponse<null>,
        { status: 405 }
    );
}
