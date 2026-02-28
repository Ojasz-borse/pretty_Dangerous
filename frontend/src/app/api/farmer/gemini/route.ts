import { NextRequest, NextResponse } from 'next/server';

const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt: string) {
    if (!GEMINI_KEY) return null;
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
                }),
            }
        );
        if (!res.ok) throw new Error(`Gemini ${res.status}`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e: any) {
        console.error('Gemini API error:', e.message);
        return null;
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'fair-price';
    const crop = searchParams.get('crop') || 'Wheat';
    const district = searchParams.get('district') || 'Sirsa';

    if (type === 'fair-price') {
        const prompt = `You are an expert Indian agricultural market analyst. For the crop "${crop}" in "${district}" district, provide a JSON response with:
{
  "minPrice": <number in INR per quintal>,
  "avgPrice": <number in INR per quintal>,
  "maxPrice": <number in INR per quintal>,
  "trend": "<bullish/bearish/stable>",
  "confidence": <number 0-100>,
  "insight": "<2 sentence market insight for buyers>",
  "recommendation": "<1 sentence buy/wait recommendation>"
}
Base this on typical current Mandi prices for this region. Return ONLY valid JSON, no markdown.`;

        const result = await callGemini(prompt);
        if (result) {
            try {
                const cleaned = result.replace(/```json\n?|```\n?/g, '').trim();
                const parsed = JSON.parse(cleaned);
                return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
            } catch {
                console.error('Failed to parse Gemini response:', result);
            }
        }

        // Mock fallback
        const mockPrices: Record<string, any> = {
            Wheat: { minPrice: 2350, avgPrice: 2450, maxPrice: 2580, trend: 'bullish', confidence: 87, insight: `Wheat demand in ${district} is strong due to reduced supply from delayed harvests. Prices are 8% above last month's average.`, recommendation: 'Good time to purchase at current avg price before further increases.' },
            Rice: { minPrice: 4500, avgPrice: 4800, maxPrice: 5100, trend: 'stable', confidence: 82, insight: `Rice prices in ${district} remain stable as harvest season approaches. Supply is adequate for current demand levels.`, recommendation: 'Fair price for bulk purchase. Hold for better rates if possible.' },
            Cotton: { minPrice: 6800, avgPrice: 7200, maxPrice: 7600, trend: 'bullish', confidence: 90, insight: `Cotton is seeing high global demand. ${district} is commanding premium prices due to quality fiber content.`, recommendation: 'Buy now — prices expected to rise 5-8% next month.' },
            Mustard: { minPrice: 5100, avgPrice: 5400, maxPrice: 5700, trend: 'bearish', confidence: 78, insight: `Mustard supply is increasing as harvest peaks in ${district}. Prices softening from recent highs.`, recommendation: 'Wait 2 weeks for better rates as supply increases.' },
            Maize: { minPrice: 1650, avgPrice: 1800, maxPrice: 1950, trend: 'stable', confidence: 85, insight: `Maize market in ${district} is balanced. Feed industry demand remains constant.`, recommendation: 'Current prices are fair for standard quality procurement.' },
            Onion: { minPrice: 1000, avgPrice: 1200, maxPrice: 1500, trend: 'bullish', confidence: 91, insight: `Onion storage stocks are depleting in ${district}. Prices expected to surge before new crop arrives.`, recommendation: 'Buy immediately — prices will rise sharply in coming weeks.' },
        };

        const data = mockPrices[crop] || mockPrices.Wheat;
        return NextResponse.json({ success: true, data, source: 'mock' });
    }

    if (type === 'market-insights') {
        const prompt = `You are an expert Indian agricultural market analyst. Generate a comprehensive market analysis JSON for buyers in "${district}" district:
{
  "priceTrends": [
    {"month": "Oct", "wheat": <price>, "rice": <price>, "cotton": <price>},
    {"month": "Nov", "wheat": <price>, "rice": <price>, "cotton": <price>},
    <...6 months of data>
  ],
  "demandSupply": [
    {"crop": "Wheat", "demand": <0-100>, "supply": <0-100>},
    {"crop": "Rice", "demand": <0-100>, "supply": <0-100>},
    {"crop": "Cotton", "demand": <0-100>, "supply": <0-100>},
    {"crop": "Mustard", "demand": <0-100>, "supply": <0-100>},
    {"crop": "Maize", "demand": <0-100>, "supply": <0-100>}
  ],
  "qualityScores": [
    {"subject": "Freshness", "value": <0-100>},
    {"subject": "Purity", "value": <0-100>},
    {"subject": "Moisture", "value": <0-100>},
    {"subject": "Grade", "value": <0-100>},
    {"subject": "Packaging", "value": <0-100>}
  ],
  "summary": "<3 sentence market summary>"
}
Return ONLY valid JSON, no markdown.`;

        const result = await callGemini(prompt);
        if (result) {
            try {
                const cleaned = result.replace(/```json\n?|```\n?/g, '').trim();
                const parsed = JSON.parse(cleaned);
                return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
            } catch {
                console.error('Failed to parse Gemini insights:', result);
            }
        }

        // Mock fallback
        return NextResponse.json({
            success: true,
            source: 'mock',
            data: {
                priceTrends: [
                    { month: 'Oct', wheat: 2200, rice: 4500, cotton: 6800 },
                    { month: 'Nov', wheat: 2280, rice: 4550, cotton: 6900 },
                    { month: 'Dec', wheat: 2350, rice: 4600, cotton: 7000 },
                    { month: 'Jan', wheat: 2400, rice: 4700, cotton: 7100 },
                    { month: 'Feb', wheat: 2450, rice: 4800, cotton: 7200 },
                    { month: 'Mar', wheat: 2500, rice: 4850, cotton: 7350 },
                ],
                demandSupply: [
                    { crop: 'Wheat', demand: 85, supply: 72 },
                    { crop: 'Rice', demand: 78, supply: 80 },
                    { crop: 'Cotton', demand: 90, supply: 65 },
                    { crop: 'Mustard', demand: 60, supply: 75 },
                    { crop: 'Maize', demand: 55, supply: 68 },
                ],
                qualityScores: [
                    { subject: 'Freshness', value: 88 },
                    { subject: 'Purity', value: 92 },
                    { subject: 'Moisture', value: 75 },
                    { subject: 'Grade', value: 85 },
                    { subject: 'Packaging', value: 70 },
                ],
                summary: `Market conditions in ${district} are favorable for wheat and cotton procurement. Prices are trending upward due to reduced supply. Buyers should consider bulk purchases in the next 7 days before seasonal price hikes.`,
            },
        });
    }

    if (type === 'crop-demand') {
        const prompt = `You are a highly advanced Indian agricultural intelligence system. Your goal is to provide TRUTHFUL, REALISTIC demand and suitability data for the crop "${crop}" across these specific districts: Sirsa, Karnal, Hisar, Rohtak, Bhatinda, Ludhiana, Nashik, Indore, Kota, Jaipur.

For each district, analyze:
1. Soil-climate matching for ${crop} (Suitability 0-100).
2. Current market demand based on procurement seasonality (Demand Score 0-100).
3. Realistic average Mandi price (INR/quintal).
4. A sharp, actionable recommendation for a farmer in that district.

Output a RAW JSON ARRAY ONLY. NO MARKDOWN. NO BACKTICKS. Data format:
[
  {
    "district": "string",
    "suitability": number,
    "demandScore": number,
    "avgPrice": number,
    "recommendation": "string",
    "trend": "up/down/stable"
  }
]
IMPORTANT: Be geographically accurate. If ${crop} doesn't grow in a district (e.g. Rice in a desert district), give it low suitability. Use current seasonal data for ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.`;

        const result = await callGemini(prompt);
        if (result) {
            try {
                // More robust cleaning for multiple formats
                const cleaned = result.replace(/```json\n?|```\n?|`|JSON\s*/gi, '').trim();
                const parsed = JSON.parse(cleaned);
                return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
            } catch (e) {
                console.error('Failed to parse Gemini crop-demand:', result);
            }
        }

        // Mock fallback
        const mockData = [
            { district: 'Sirsa', suitability: 85, demandScore: 78, avgPrice: 2450, recommendation: 'Excellent growing region', trend: 'up' },
            { district: 'Karnal', suitability: 80, demandScore: 82, avgPrice: 2500, recommendation: 'Strong buyer demand', trend: 'up' },
            { district: 'Hisar', suitability: 78, demandScore: 75, avgPrice: 2400, recommendation: 'Good conditions overall', trend: 'stable' },
            { district: 'Rohtak', suitability: 72, demandScore: 70, avgPrice: 2380, recommendation: 'Moderate suitability', trend: 'stable' },
            { district: 'Bhatinda', suitability: 82, demandScore: 80, avgPrice: 2480, recommendation: 'High demand zone', trend: 'up' },
            { district: 'Ludhiana', suitability: 76, demandScore: 85, avgPrice: 2520, recommendation: 'Premium prices available', trend: 'up' },
            { district: 'Nashik', suitability: 55, demandScore: 60, avgPrice: 2300, recommendation: 'Consider other crops', trend: 'down' },
            { district: 'Indore', suitability: 68, demandScore: 72, avgPrice: 2350, recommendation: 'Moderate potential', trend: 'stable' },
            { district: 'Kota', suitability: 62, demandScore: 65, avgPrice: 2320, recommendation: 'Fair conditions', trend: 'stable' },
            { district: 'Jaipur', suitability: 58, demandScore: 55, avgPrice: 2280, recommendation: 'Low suitability zone', trend: 'down' },
        ];
        return NextResponse.json({ success: true, data: mockData, source: 'mock' });
    }

    return NextResponse.json({ success: false, error: 'Unknown type' }, { status: 400 });
}
