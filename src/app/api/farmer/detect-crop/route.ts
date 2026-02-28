// ============================================
// 🌱 CROP IMAGE DETECTION MODULE - API ROUTE
// Location: /api/farmer/detect-crop
// Connects to FastAPI backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropDetectionResult, HealthIndicator } from '@/types/farmer';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;

        if (!imageFile) {
            return NextResponse.json(
                { success: false, error: 'Please provide an image file', timestamp: new Date().toISOString() } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // Forward to FastAPI
        const apiFormData = new FormData();
        apiFormData.append('file', imageFile);

        const res = await fetch(`${BACKEND_URL}/grade-crop`, {
            method: 'POST',
            body: apiFormData
        });

        if (!res.ok) throw new Error('Failed to analyze image at backend');
        const data = await res.json();

        const healthIndicators: HealthIndicator[] = [
            { name: 'Color Quality', value: 'Detected', status: 'good' },
            { name: 'Surface Texture', value: 'Smooth', status: 'good' }
        ];

        const result: CropDetectionResult = {
            id: `crop_${Date.now()}`,
            cropName: "Detected Crop",
            confidence: Math.round(data.confidence * 100),
            qualityGrade: data.grade.replace('Grade ', ''),
            qualityScore: Math.round(data.confidence * 100),
            healthIndicators,
            recommendations: [data.advice],
            imageUrl: '', // This would ideally be the stored URL
            timestamp: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: result,
            message: 'Crop analyzed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error detecting crop:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to analyze crop image', timestamp: new Date().toISOString() } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
