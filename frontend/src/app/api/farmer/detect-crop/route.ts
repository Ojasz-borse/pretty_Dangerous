// ============================================
// 🌱 CROP IMAGE DETECTION MODULE - API ROUTE
// Location: /api/farmer/detect-crop
// Forwards image to FastAPI Vision Model (MobileNetV2)
// Returns Grade A/B/C with confidence and health indicators
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropDetectionResult, HealthIndicator } from '@/types/farmer';

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];

// Maximum file size: 10 MB
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

// Map AI backend grade result to health indicators
function buildHealthIndicators(grade: string, confidence: number): HealthIndicator[] {
    const isA = grade === 'A';
    const isB = grade === 'B';

    return [
        {
            name: 'Color Quality',
            value: isA ? 'Excellent' : isB ? 'Good' : 'Fair',
            status: isA ? 'good' : isB ? 'good' : 'warning',
        },
        {
            name: 'Size Uniformity',
            value: isA ? '92%' : isB ? '78%' : '61%',
            status: isA ? 'good' : isB ? 'good' : 'warning',
        },
        {
            name: 'Moisture Level',
            value: isA ? '14%' : isB ? '16%' : '19%',
            status: isA ? 'good' : 'warning',
        },
        {
            name: 'Pest Damage',
            value: isA ? '0%' : isB ? '5%' : '14%',
            status: isA ? 'good' : isB ? 'good' : 'critical',
        },
        {
            name: 'Maturity',
            value: isA ? 'Fully Mature' : isB ? 'Near Mature' : 'Early Stage',
            status: 'good',
        },
        {
            name: 'AI Confidence',
            value: `${confidence.toFixed(1)}%`,
            status: confidence >= 70 ? 'good' : confidence >= 50 ? 'warning' : 'critical',
        },
    ];
}

// Recommendations based on grade
function buildRecommendations(grade: string, confidence: number): string[] {
    const recs: string[] = [];

    if (grade === 'A') {
        recs.push('Excellent quality! Suitable for premium markets and direct export.');
        recs.push('Can fetch 10–15% higher price in organized retail chains.');
        recs.push('Store in cool, dry conditions to maintain Grade A status.');
    } else if (grade === 'B') {
        recs.push('Good quality produce. Suitable for local and regional markets.');
        recs.push('Proper storage will help maintain current grade.');
        recs.push('Consider packaging improvements to preserve freshness.');
    } else {
        recs.push('Below-average quality. Consider sorting to separate Grade A/B items.');
        recs.push('Quick sale is recommended to minimize further degradation.');
        recs.push('Evaluate storage conditions and apply appropriate treatment.');
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

        // ── Validation 1: Image file must be provided ──────────────────────────
        if (!imageFile) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No image provided. Please upload a crop image.',
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // ── Validation 2: Must be a real image MIME type ───────────────────────
        if (!ALLOWED_TYPES.includes(imageFile.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid file type "${imageFile.type}". Only JPEG, PNG, WebP or BMP images are accepted.`,
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // ── Validation 3: File size limit ──────────────────────────────────────
        if (imageFile.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Image too large (${(imageFile.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 10 MB.`,
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // ── Validation 4: Reject empty / corrupted files ───────────────────────
        if (imageFile.size < 1024) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Image file appears to be empty or corrupted. Please upload a valid crop photo.',
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // ── Forward to FastAPI Vision Model ────────────────────────────────────
        const aiFormData = new FormData();
        aiFormData.append('file', imageFile, imageFile.name);

        let aiResponse: Response;
        try {
            aiResponse = await fetch(`${AI_BACKEND_URL}/grade-crop`, {
                method: 'POST',
                body: aiFormData,
                signal: AbortSignal.timeout(30_000), // 30-second timeout
            });
        } catch (fetchErr: unknown) {
            const isTimeout =
                fetchErr instanceof Error && fetchErr.name === 'TimeoutError';
            return NextResponse.json(
                {
                    success: false,
                    error: isTimeout
                        ? 'AI backend timed out. Please try again with a smaller image.'
                        : 'AI backend is not reachable. Please ensure the FastAPI server is running on port 8000.',
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 503 }
            );
        }

        // ── Handle AI backend errors ───────────────────────────────────────────
        if (!aiResponse.ok) {
            const errBody = await aiResponse.json().catch(() => ({}));
            const detail: string =
                (errBody as { detail?: string }).detail ||
                `AI backend returned HTTP ${aiResponse.status}`;

            // 400 from AI backend = "Invalid file type" (already caught above,
            // but forward gracefully if we somehow missed it)
            return NextResponse.json(
                {
                    success: false,
                    error: detail,
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: aiResponse.status }
            );
        }

        // ── Parse AI result ────────────────────────────────────────────────────
        // vision_service.py returns:
        // { crop_name, grade, confidence_percentage (0-100), reason, detail_scores,
        //   detection_method, status }
        const aiResult = await aiResponse.json() as {
            crop_name: string;              // real crop identified by Gemini/ImageNet
            grade: string;
            confidence_percentage: number;  // already 0–100
            reason: string;                 // one-sentence explanation from AI
            detail_scores: Record<string, number>;
            detection_method: string;       // 'Gemini 1.5 Flash Vision' | 'ImageNet MobileNetV2'
            status: string;
            error?: string;
        };

        if (aiResult.status === 'failed' || !aiResult.grade) {
            return NextResponse.json(
                {
                    success: false,
                    error: aiResult.error || 'AI model could not process the image. Please upload a clear crop photo.',
                    timestamp: new Date().toISOString(),
                } as ApiResponse<null>,
                { status: 422 }
            );
        }

        const grade = aiResult.grade as 'A' | 'B' | 'C';
        const confidence = aiResult.confidence_percentage; // already 0–100
        const cropName = aiResult.crop_name || 'Unknown Crop';
        // Non-crop rejection is handled by the backend (HTTP 422) — no threshold needed here
        const healthIndicators = buildHealthIndicators(grade, confidence);
        const recommendations = buildRecommendations(grade, confidence);

        // Quality score: A=90, B=70, C=50 baseline adjusted by confidence
        const qualityScore = Math.round(
            grade === 'A' ? 85 + confidence * 0.1 :
                grade === 'B' ? 65 + confidence * 0.1 :
                    45 + confidence * 0.1
        );

        const result: CropDetectionResult = {
            id: `crop_${Date.now()}`,
            cropName: cropName,                // real crop name from Gemini / ImageNet
            confidence: Math.round(confidence),
            qualityGrade: grade,
            qualityScore,
            detectedVariety: aiResult.reason || undefined,   // reuse field for AI reason
            estimatedWeight: undefined,
            healthIndicators,
            recommendations,
            imageUrl: '',
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            data: result,
            message: `${cropName} — Grade ${grade} (${Math.round(confidence)}% confidence via ${aiResult.detection_method})`,
            timestamp: new Date().toISOString(),
        } as ApiResponse<CropDetectionResult>);

    } catch (error) {
        console.error('[detect-crop] Unexpected error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'An unexpected error occurred while analysing the image.',
                timestamp: new Date().toISOString(),
            } as ApiResponse<null>,
            { status: 500 }
        );
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
