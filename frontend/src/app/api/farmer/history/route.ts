import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const crop = searchParams.get('crop');
    const mandi = searchParams.get('mandi');
    const days = searchParams.get('days') || '30';

    if (!crop) {
        return NextResponse.json({ success: false, error: 'Crop is required' }, { status: 400 });
    }

    try {
        const backendUrl = `http://127.0.0.1:8000/history?crop=${encodeURIComponent(crop)}${mandi ? `&mandi=${encodeURIComponent(mandi)}` : ''}&days=${days}`;

        const response = await fetch(backendUrl);

        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('History API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch historical data',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
