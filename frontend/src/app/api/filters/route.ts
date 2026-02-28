import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Call the Python backend API
        const response = await fetch('http://127.0.0.1:8000/filters', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Disable caching to ensure fresh districts list
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching filters from backend:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch filters' },
            { status: 500 }
        );
    }
}
