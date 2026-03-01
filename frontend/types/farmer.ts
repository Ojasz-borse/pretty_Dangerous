// ============================================
// 🌾 Shared Types for Farmer Module
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}

// --------------------------------------------
// Crop Master & Price Data
// --------------------------------------------
export interface CropMaster {
    id: string;
    name: string;
    nameHindi: string;
    category: string;
    season: string;
    unit: string;
    avgPrice: number;
}

export interface CropPrice {
    id: string;
    cropName: string;
    cropNameHindi?: string;
    district: string;
    state: string;
    market: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    unit: string;
    arrivalDate: string;
    variety: string;
    grade: string;
}

export interface PriceQuery {
    cropName?: string;
    district?: string;
    state?: string;
}

// --------------------------------------------
// Price Prediction
// --------------------------------------------
export interface PriceDataPoint {
    date: string;
    price: number;
    isPredicted: boolean;
}

export interface WeatherImpact {
    temperature: number;
    humidity: number;
    rainfall: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export interface PricePrediction {
    cropName: string;
    district: string;
    historicalPrices: PriceDataPoint[];
    predictedPrices: PriceDataPoint[];
    riskLevel: 'Low' | 'Medium' | 'High';
    confidence: number;
    weatherImpact: WeatherImpact;
    trendDirection: 'up' | 'down' | 'stable';
}

// --------------------------------------------
// Crop Detection
// --------------------------------------------
export interface HealthIndicator {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'critical';
}

export interface MarketInsight {
    currentPrice: number;
    predictedPrice: number;
    growthPercent: number;
    demandIndex: number;
    recommendation: 'WAIT' | 'SELL';
    reason?: string;
    riskLevel?: string;
}

export interface CropDetectionResult {
    id: string;
    cropName: string;
    confidence: number;
    qualityGrade: 'A' | 'B' | 'C' | 'D' | string;
    qualityScore: number;
    detectedVariety?: string;
    estimatedWeight?: number;
    healthIndicators: HealthIndicator[];
    recommendations: string[];
    marketInsight?: MarketInsight;
    imageUrl: string;
    timestamp: string;
}

// --------------------------------------------
// Sell Recommendation
// --------------------------------------------
export interface SellAnalysisInput {
    cropName: string;
    quantity: number;
    storageCostPerDay?: number;
}

export interface SellRecommendation {
    id: string;
    cropName: string;
    currentPrice: number;
    predictedPrice: number;
    recommendation: 'WAIT' | 'SELL_NOW';
    waitDays?: number;
    expectedGain: number;
    reason: string;
    storageCost: number;
    demandIndex: number;
    netProfit: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    timestamp: string;
}

// --------------------------------------------
// Trust Score 
// --------------------------------------------
export interface TrustComponent {
    name: string;
    score: number;
    weight: number;
    description: string;
}

export interface TransactionSummary {
    totalTransactions: number;
    successfulDeliveries: number;
    averageRating: number;
    totalValue: number;
    onTimeDeliveryRate: number;
}

export interface VerificationBadge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedDate: string;
}

export interface TrustScore {
    farmerId: string;
    overallScore: number;
    reliabilityLevel: 'Low' | 'Medium' | 'High' | 'Excellent';
    components: TrustComponent[];
    transactionHistory: TransactionSummary;
    verificationBadges: VerificationBadge[];
    lastUpdated: string;
}

// --------------------------------------------
// Logistics & Transport
// --------------------------------------------
export interface Location {
    address: string;
    district: string;
    state: string;
    pincode: string;
}

export interface TransportOption {
    id: string;
    type: string;
    name: string;
    capacity: number;
    costPerKm: number;
    totalCost: number;
    estimatedTime: number;
    provider: string;
    rating: number;
    available: boolean;
}

export interface ProfitCalculation {
    cropName: string;
    quantity: number;
    pricePerQuintal: number;
    grossAmount: number;
    transportCost: number;
    loadingCost: number;
    marketFee: number;
    otherExpenses: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
}

export interface LogisticsInfo {
    id: string;
    pickupLocation: Location;
    deliveryLocation: Location;
    distance: number;
    estimatedTime: number;
    transportOptions: TransportOption[];
    recommendedOption: TransportOption;
    netProfitCalculation: ProfitCalculation;
}

// --------------------------------------------
// Demand Forecast
// --------------------------------------------
export interface DemandCrop {
    rank: number;
    cropName: string;
    demandScore: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    arrivalVolume: number;
    priceCorrelation: number;
}

export interface FestivalImpact {
    name: string;
    date: string;
    cropsImpacted: string[];
    expectedDemandIncrease: number;
}

export interface RegionalDemand {
    state: string;
    district: string;
    highDemandCrops: string[];
    demandScore: number;
}

export interface DemandForecast {
    topCrops: DemandCrop[];
    demandMeter: number;
    seasonalTrend: 'increasing' | 'decreasing' | 'stable';
    upcomingFestivals: FestivalImpact[];
    regionalInsights: RegionalDemand[];
    lastUpdated: string;
}
