// ============================================
// ⭐ TRUST SCORE MODULE - API ROUTE
// Location: /api/farmer/trust-score
// Farmer reliability and reputation system
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, TrustScore, TrustComponent, TransactionSummary, VerificationBadge } from '@/types/farmer';

// Generate trust score components
function generateTrustComponents(): TrustComponent[] {
    return [
        {
            name: 'Delivery Reliability',
            score: 85 + Math.floor(Math.random() * 15),
            weight: 0.25,
            description: 'Based on on-time delivery history and commitment fulfillment'
        },
        {
            name: 'Product Quality',
            score: 80 + Math.floor(Math.random() * 20),
            weight: 0.20,
            description: 'Average quality rating from buyers and inspection reports'
        },
        {
            name: 'Payment History',
            score: 90 + Math.floor(Math.random() * 10),
            weight: 0.15,
            description: 'Track record of honest transactions and dispute resolution'
        },
        {
            name: 'Verification Status',
            score: 75 + Math.floor(Math.random() * 25),
            weight: 0.15,
            description: 'Identity, land, and bank account verification completion'
        },
        {
            name: 'Market Engagement',
            score: 70 + Math.floor(Math.random() * 30),
            weight: 0.15,
            description: 'Active participation in marketplace and response rate'
        },
        {
            name: 'Community Standing',
            score: 75 + Math.floor(Math.random() * 25),
            weight: 0.10,
            description: 'Reviews, referrals, and community contributions'
        }
    ];
}

// Generate transaction summary
function generateTransactionSummary(): TransactionSummary {
    const totalTransactions = 50 + Math.floor(Math.random() * 150);
    const successRate = 0.92 + Math.random() * 0.08;

    return {
        totalTransactions,
        successfulDeliveries: Math.round(totalTransactions * successRate),
        averageRating: 4.2 + Math.random() * 0.7,
        totalValue: Math.round(500000 + Math.random() * 2000000), // in rupees
        onTimeDeliveryRate: Math.round(85 + Math.random() * 15)
    };
}

// Generate verification badges
function generateVerificationBadges(): VerificationBadge[] {
    const allBadges: VerificationBadge[] = [
        {
            id: 'verified_identity',
            name: 'Identity Verified',
            icon: '✅',
            description: 'Aadhaar and PAN card verified',
            earnedDate: '2023-06-15'
        },
        {
            id: 'verified_land',
            name: 'Land Verified',
            icon: '🏡',
            description: 'Land documents verified',
            earnedDate: '2023-07-20'
        },
        {
            id: 'verified_bank',
            name: 'Bank Verified',
            icon: '🏦',
            description: 'Bank account linked and verified',
            earnedDate: '2023-06-16'
        },
        {
            id: 'top_seller',
            name: 'Top Seller',
            icon: '🏆',
            description: 'Among top 10% sellers this month',
            earnedDate: '2024-01-01'
        },
        {
            id: 'quality_excellence',
            name: 'Quality Excellence',
            icon: '⭐',
            description: 'Consistently high-quality produce',
            earnedDate: '2023-12-15'
        },
        {
            id: 'early_adopter',
            name: 'Early Adopter',
            icon: '🚀',
            description: 'Platform member since early days',
            earnedDate: '2023-05-01'
        }
    ];

    // Return 3-5 random badges
    const numBadges = 3 + Math.floor(Math.random() * 3);
    return allBadges.sort(() => Math.random() - 0.5).slice(0, numBadges);
}

// Calculate overall trust score
function calculateOverallScore(components: TrustComponent[]): number {
    return Math.round(
        components.reduce((sum, c) => sum + c.score * c.weight, 0)
    );
}

// Determine reliability level
function getReliabilityLevel(score: number): 'Low' | 'Medium' | 'High' | 'Excellent' {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const farmerId = searchParams.get('farmerId') || 'default_farmer';

        const components = generateTrustComponents();
        const overallScore = calculateOverallScore(components);
        const transactionSummary = generateTransactionSummary();
        const verificationBadges = generateVerificationBadges();

        const trustScore: TrustScore = {
            farmerId,
            overallScore,
            reliabilityLevel: getReliabilityLevel(overallScore),
            components,
            transactionHistory: transactionSummary,
            verificationBadges,
            lastUpdated: new Date().toISOString()
        };

        const response: ApiResponse<TrustScore> = {
            success: true,
            data: trustScore,
            message: 'Trust score retrieved successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching trust score:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to retrieve trust score',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { farmerId } = body;

        const components = generateTrustComponents();
        const overallScore = calculateOverallScore(components);
        const transactionSummary = generateTransactionSummary();
        const verificationBadges = generateVerificationBadges();

        const trustScore: TrustScore = {
            farmerId: farmerId || 'default_farmer',
            overallScore,
            reliabilityLevel: getReliabilityLevel(overallScore),
            components,
            transactionHistory: transactionSummary,
            verificationBadges,
            lastUpdated: new Date().toISOString()
        };

        const response: ApiResponse<TrustScore> = {
            success: true,
            data: trustScore,
            message: 'Trust score calculated successfully',
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error calculating trust score:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to calculate trust score',
                timestamp: new Date().toISOString()
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}
