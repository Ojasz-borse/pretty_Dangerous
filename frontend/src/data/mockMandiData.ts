export interface MandiItem {
    id: string;
    name: string;
    hindiName: string;
    imageIcon: string; // Emoji for simplicity and low-literacy users
    pricePerKg: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
    quality: string;
}

export interface MarketLocation {
    id: string;
    name: string;
    state: string;
    items: MandiItem[];
}

export const mockMarkets: MarketLocation[] = [
    {
        id: "mkt_pune",
        name: "Pune APMC",
        state: "Maharashtra",
        items: [
            { id: "1", name: "Tomato", hindiName: "टमाटर", imageIcon: "🍅", pricePerKg: 25, trend: "up", trendPercentage: 5, quality: "Grade A" },
            { id: "2", name: "Onion", hindiName: "प्याज", imageIcon: "🧅", pricePerKg: 30, trend: "stable", trendPercentage: 0, quality: "Grade A" },
            { id: "3", name: "Potato", hindiName: "आलू", imageIcon: "🥔", pricePerKg: 18, trend: "down", trendPercentage: 2, quality: "Medium" },
            { id: "4", name: "Wheat", hindiName: "गेहूँ", imageIcon: "🌾", pricePerKg: 28, trend: "up", trendPercentage: 1.5, quality: "Premium" },
            { id: "5", name: "Rice", hindiName: "चावल", imageIcon: "🍚", pricePerKg: 45, trend: "up", trendPercentage: 3, quality: "Basmati" }
        ]
    },
    {
        id: "mkt_nashik",
        name: "Nashik Onion Market",
        state: "Maharashtra",
        items: [
            { id: "1", name: "Tomato", hindiName: "टमाटर", imageIcon: "🍅", pricePerKg: 22, trend: "down", trendPercentage: 3, quality: "Grade A" },
            { id: "2", name: "Onion", hindiName: "प्याज", imageIcon: "🧅", pricePerKg: 28, trend: "down", trendPercentage: 4, quality: "Grade A" },
            { id: "3", name: "Potato", hindiName: "आलू", imageIcon: "🥔", pricePerKg: 20, trend: "up", trendPercentage: 1, quality: "Medium" },
            { id: "4", name: "Grapes", hindiName: "अंगूर", imageIcon: "🍇", pricePerKg: 60, trend: "up", trendPercentage: 8, quality: "Export Quality" },
            { id: "5", name: "Garlic", hindiName: "लहसुन", imageIcon: "🧄", pricePerKg: 120, trend: "up", trendPercentage: 12, quality: "Premium" }
        ]
    }
];
