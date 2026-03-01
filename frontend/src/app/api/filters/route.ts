import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const res = await fetch('http://localhost:8000/filters');
        const data = await res.json();

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error("Filter fetch failed", err);
        return NextResponse.json({ success: false, error: "Failed to fetch filters" }, { status: 500 });
    }
}
