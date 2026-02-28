import { NextRequest, NextResponse } from 'next/server';

const AGRI_KEY = process.env.AGRI_MONITORING_API_KEY;
const BASE = 'https://api.agromonitoring.com/agro/1.0';

// Pre-defined bounding polygons for key Indian agricultural districts
const DISTRICT_POLYGONS: Record<string, [number, number][]> = {
    Sirsa: [[74.6, 29.4], [75.2, 29.4], [75.2, 29.9], [74.6, 29.9], [74.6, 29.4]],
    Hisar: [[75.6, 29.0], [76.2, 29.0], [76.2, 29.5], [75.6, 29.5], [75.6, 29.0]],
    Karnal: [[76.7, 29.5], [77.2, 29.5], [77.2, 29.9], [76.7, 29.9], [76.7, 29.5]],
    Ludhiana: [[75.5, 30.7], [76.1, 30.7], [76.1, 31.1], [75.5, 31.1], [75.5, 30.7]],
    Amritsar: [[74.6, 31.4], [75.2, 31.4], [75.2, 31.8], [74.6, 31.8], [74.6, 31.4]],
    Bhatinda: [[74.8, 29.8], [75.4, 29.8], [75.4, 30.3], [74.8, 30.3], [74.8, 29.8]],
    Agra: [[77.7, 26.9], [78.3, 26.9], [78.3, 27.4], [77.7, 27.4], [77.7, 26.9]],
    Nashik: [[73.4, 19.8], [74.0, 19.8], [74.0, 20.2], [73.4, 20.2], [73.4, 19.8]],
    Jaipur: [[75.5, 26.6], [76.1, 26.6], [76.1, 27.0], [75.5, 27.0], [75.5, 26.6]],
};

// Get center point of a district polygon for simpler weather/soil API calls
function getCenterCoords(district: string): { lat: number; lon: number } {
    const poly = DISTRICT_POLYGONS[district];
    if (!poly) return { lat: 29.53, lon: 74.85 }; // Default: Sirsa
    const avgLat = poly.reduce((s, p) => s + p[1], 0) / poly.length;
    const avgLon = poly.reduce((s, p) => s + p[0], 0) / poly.length;
    return { lat: avgLat, lon: avgLon };
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'soil';
    const district = searchParams.get('district') || 'Sirsa';

    if (!AGRI_KEY) {
        return NextResponse.json({ success: false, error: 'API key not configured' }, { status: 500 });
    }

    try {
        const { lat, lon } = getCenterCoords(district);

        if (type === 'weather') {
            // Current weather
            const res = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${AGRI_KEY}`);
            if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
            const data = await res.json();
            return NextResponse.json({
                success: true,
                district,
                type: 'weather',
                data: {
                    temp: Math.round((data.main?.temp ?? 300) - 273.15),
                    humidity: data.main?.humidity ?? 0,
                    windSpeed: data.wind?.speed ?? 0,
                    description: data.weather?.[0]?.description ?? 'N/A',
                    icon: data.weather?.[0]?.icon ?? '01d',
                    feelsLike: Math.round((data.main?.feels_like ?? 300) - 273.15),
                }
            });
        }

        if (type === 'soil') {
            // Current soil data
            const res = await fetch(`${BASE}/soil?lat=${lat}&lon=${lon}&appid=${AGRI_KEY}`);
            if (!res.ok) throw new Error(`Soil API error: ${res.status}`);
            const data = await res.json();
            return NextResponse.json({
                success: true,
                district,
                type: 'soil',
                data: {
                    surfaceTemp: Math.round((data.t0 ?? 300) - 273.15),
                    deepTemp: Math.round((data.t10 ?? 298) - 273.15),
                    moisture: parseFloat(((data.moisture ?? 0) * 100).toFixed(1)),
                    updatedAt: data.dt ? new Date(data.dt * 1000).toISOString() : null,
                }
            });
        }

        if (type === 'heatmap') {
            // Generate heatmap data for multiple districts using soil + weather
            const districts = ['Sirsa', 'Hisar', 'Karnal', 'Ludhiana', 'Bhatinda', 'Amritsar', 'Agra', 'Nashik', 'Jaipur'];
            const results = await Promise.allSettled(
                districts.map(async (d) => {
                    const { lat: dlat, lon: dlon } = getCenterCoords(d);
                    const [soilRes, weatherRes] = await Promise.all([
                        fetch(`${BASE}/soil?lat=${dlat}&lon=${dlon}&appid=${AGRI_KEY}`),
                        fetch(`${BASE}/weather?lat=${dlat}&lon=${dlon}&appid=${AGRI_KEY}`),
                    ]);
                    const soil = soilRes.ok ? await soilRes.json() : {};
                    const weather = weatherRes.ok ? await weatherRes.json() : {};
                    const moisture = parseFloat(((soil.moisture ?? 0) * 100).toFixed(1));
                    const temp = Math.round((weather.main?.temp ?? 300) - 273.15);
                    return {
                        district: d,
                        moisture,
                        soilTemp: Math.round((soil.t0 ?? 300) - 273.15),
                        airTemp: temp,
                        humidity: weather.main?.humidity ?? 0,
                        cropHealthIndex: Math.min(100, Math.round(moisture * 0.7 + (weather.main?.humidity ?? 0) * 0.3)),
                    };
                })
            );

            const heatmapData = results
                .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
                .map(r => r.value);

            return NextResponse.json({ success: true, type: 'heatmap', data: heatmapData });
        }

        return NextResponse.json({ success: false, error: 'Unknown type' }, { status: 400 });

    } catch (error: any) {
        // Return mock data on API failure so UI always renders in demo
        console.error('Agromonitoring API error:', error.message);
        return NextResponse.json({
            success: true,
            district,
            type,
            isMock: true,
            data: getMockData(type, district),
        });
    }
}

function getMockData(type: string, district: string) {
    if (type === 'soil') return { surfaceTemp: 28, deepTemp: 24, moisture: 42.3, updatedAt: new Date().toISOString() };
    if (type === 'weather') return { temp: 32, humidity: 55, windSpeed: 4.2, description: 'partly cloudy', icon: '02d', feelsLike: 34 };
    if (type === 'heatmap') return [
        { district: 'Sirsa', moisture: 42, soilTemp: 28, airTemp: 32, humidity: 55, cropHealthIndex: 71 },
        { district: 'Hisar', moisture: 38, soilTemp: 30, airTemp: 34, humidity: 48, cropHealthIndex: 61 },
        { district: 'Karnal', moisture: 58, soilTemp: 25, airTemp: 29, humidity: 65, cropHealthIndex: 80 },
        { district: 'Ludhiana', moisture: 61, soilTemp: 23, airTemp: 27, humidity: 70, cropHealthIndex: 84 },
        { district: 'Bhatinda', moisture: 35, soilTemp: 31, airTemp: 35, humidity: 45, cropHealthIndex: 58 },
        { district: 'Amritsar', moisture: 55, soilTemp: 24, airTemp: 28, humidity: 68, cropHealthIndex: 79 },
        { district: 'Agra', moisture: 32, soilTemp: 33, airTemp: 38, humidity: 40, cropHealthIndex: 54 },
        { district: 'Nashik', moisture: 47, soilTemp: 26, airTemp: 30, humidity: 60, cropHealthIndex: 73 },
        { district: 'Jaipur', moisture: 28, soilTemp: 34, airTemp: 36, humidity: 38, cropHealthIndex: 46 },
    ];
    return {};
}
