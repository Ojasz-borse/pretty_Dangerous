// ============================================
// 🌾 CROPS MASTER DATA - API ROUTE
// Location: /api/farmer/crops
// Returns list of available crops
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CropMaster } from '@/types/farmer';

const cropsData: CropMaster[] = [
    // Cereals
    {
        id: 'rice_basmati',
        name: 'Rice (Basmati)',
        nameHindi: 'बासमती चावल',
        category: 'cereals',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 3500
    },
    {
        id: 'rice_common',
        name: 'Rice (Common)',
        nameHindi: 'साधारण चावल',
        category: 'cereals',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 2200
    },
    {
        id: 'wheat',
        name: 'Wheat',
        nameHindi: 'गेहूं',
        category: 'cereals',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 2250
    },
    {
        id: 'maize',
        name: 'Maize',
        nameHindi: 'मक्का',
        category: 'cereals',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 2000
    },

    // Pulses
    {
        id: 'chickpea',
        name: 'Chickpea (Gram)',
        nameHindi: 'चना',
        category: 'pulses',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 5500
    },
    {
        id: 'pigeon_pea',
        name: 'Pigeon Pea (Toor)',
        nameHindi: 'अरहर',
        category: 'pulses',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 6500
    },
    {
        id: 'moong',
        name: 'Moong (Green Gram)',
        nameHindi: 'मूंग',
        category: 'pulses',
        season: 'zaid',
        unit: 'Quintal',
        avgPrice: 7000
    },

    // Vegetables
    {
        id: 'tomato',
        name: 'Tomato',
        nameHindi: 'टमाटर',
        category: 'vegetables',
        season: 'all_season',
        unit: 'Quintal',
        avgPrice: 1000
    },
    {
        id: 'onion',
        name: 'Onion',
        nameHindi: 'प्याज',
        category: 'vegetables',
        season: 'all_season',
        unit: 'Quintal',
        avgPrice: 1750
    },
    {
        id: 'potato',
        name: 'Potato',
        nameHindi: 'आलू',
        category: 'vegetables',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 750
    },
    {
        id: 'cauliflower',
        name: 'Cauliflower',
        nameHindi: 'गोभी',
        category: 'vegetables',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 1200
    },
    {
        id: 'brinjal',
        name: 'Brinjal',
        nameHindi: 'बैंगन',
        category: 'vegetables',
        season: 'all_season',
        unit: 'Quintal',
        avgPrice: 800
    },

    // Fruits
    {
        id: 'mango',
        name: 'Mango',
        nameHindi: 'आम',
        category: 'fruits',
        season: 'zaid',
        unit: 'Quintal',
        avgPrice: 5000
    },
    {
        id: 'banana',
        name: 'Banana',
        nameHindi: 'केला',
        category: 'fruits',
        season: 'all_season',
        unit: 'Quintal',
        avgPrice: 2500
    },
    {
        id: 'grapes',
        name: 'Grapes',
        nameHindi: 'अंगूर',
        category: 'fruits',
        season: 'zaid',
        unit: 'Quintal',
        avgPrice: 6000
    },

    // Spices
    {
        id: 'chilli',
        name: 'Chilli',
        nameHindi: 'मिर्च',
        category: 'spices',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 12000
    },
    {
        id: 'turmeric',
        name: 'Turmeric',
        nameHindi: 'हल्दी',
        category: 'spices',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 8000
    },
    {
        id: 'garlic',
        name: 'Garlic',
        nameHindi: 'लहसुन',
        category: 'spices',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 6000
    },
    {
        id: 'ginger',
        name: 'Ginger',
        nameHindi: 'अदरक',
        category: 'spices',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 7000
    },

    // Oilseeds
    {
        id: 'soybean',
        name: 'Soybean',
        nameHindi: 'सोयाबीन',
        category: 'oilseeds',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 4000
    },
    {
        id: 'groundnut',
        name: 'Groundnut',
        nameHindi: 'मूंगफली',
        category: 'oilseeds',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 5500
    },
    {
        id: 'mustard',
        name: 'Mustard',
        nameHindi: 'सरसों',
        category: 'oilseeds',
        season: 'rabi',
        unit: 'Quintal',
        avgPrice: 4800
    },

    // Cash Crops
    {
        id: 'cotton',
        name: 'Cotton',
        nameHindi: 'कपास',
        category: 'cash_crops',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 5850
    },
    {
        id: 'sugarcane',
        name: 'Sugarcane',
        nameHindi: 'गन्ना',
        category: 'cash_crops',
        season: 'all_season',
        unit: 'Quintal',
        avgPrice: 375
    },
    {
        id: 'jute',
        name: 'Jute',
        nameHindi: 'जूट',
        category: 'cash_crops',
        season: 'kharif',
        unit: 'Quintal',
        avgPrice: 4500
    }
];

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');
        const season = searchParams.get('season');
        const search = searchParams.get('search');

        let filteredCrops = [...cropsData];

        if (category) {
            filteredCrops = filteredCrops.filter(c => c.category === category);
        }

        if (season) {
            filteredCrops = filteredCrops.filter(c => c.season === season || c.season === 'all_season');
        }

        if (search) {
            const searchLower = search.toLowerCase();
            filteredCrops = filteredCrops.filter(
                c => c.name.toLowerCase().includes(searchLower) ||
                    c.nameHindi.includes(search)
            );
        }

        const response: ApiResponse<CropMaster[]> = {
            success: true,
            data: filteredCrops,
            message: `Found ${filteredCrops.length} crops`,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching crops:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch crops data',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
