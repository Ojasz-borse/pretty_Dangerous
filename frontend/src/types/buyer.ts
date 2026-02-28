export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface FarmerListing {
    id: string;
    cropName: string;
    cropNameHindi?: string;
    farmerName: string;
    location: {
        district: string;
        state: string;
    };
    pricePerQuintal: number;
    quantity: number;
    qualityGrade: string;
    verified: boolean;
    trustScore: number;
    reliabilityLevel: string;
    distance: number;
    rating: number;
    listedAt: string;
    totalSales: number;
}

export interface FairPriceAnalysis {
    buyerBidPrice: number;
    priceStatus: 'exploitative' | 'below_fair' | 'fair' | 'above_fair';
    exploitationRisk: 'none' | 'low' | 'medium' | 'high';
    recommendation: string;
    fairPriceRange: {
        min: number;
        avg: number;
        max: number;
    };
    marketFactors: {
        factor: string;
        description: string;
        impact: 'neutral' | 'positive' | 'negative';
        percentageChange: number;
    }[];
}
