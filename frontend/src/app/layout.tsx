import type { Metadata } from "next";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
    title: "KrishiSetu — Smart Agricultural Marketplace",
    description: "India's Digital Agricultural Intelligence Platform — Real-time crop prices, AI prediction, demand insights, and logistics for farmers",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <div className="tricolor-bar"></div>
                <AuthProvider>
                    <LocationProvider>
                        {children}
                    </LocationProvider>
                </AuthProvider>
            </body>

        </html>
    );
}



