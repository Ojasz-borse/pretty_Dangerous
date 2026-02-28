'use client';
import Navbar from '@/components/Navbar';
import PricePrediction from '@/components/farmer/PricePrediction';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';

export default function PredictionPage() {
    const { district } = useLocation();
    return (
        <>
            <Navbar />

            {/* Full-Width Header */}
            <div className="relative h-[300px] sm:h-[400px] w-full overflow-hidden shadow-lg flex items-center mb-8">
                <img src="/4.jpg" alt="Modern Tractor" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-12 w-full flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center sm:text-left text-white animate-fade-in">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <div className="section-icon bg-blue-500 shadow-lg shadow-blue-500/20">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-blue-400 font-black tracking-widest text-xs uppercase drop-shadow-md">AI Powered Analysis</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl mb-4">AI Price <span className="text-blue-400">Forecast</span></h1>
                        <p className="text-white/90 text-lg leading-relaxed drop-shadow-md font-medium max-w-lg">Advanced 7-day predictions leveraging historical patterns and local weather signals.</p>
                    </div>

                    {/* Side Badge Stats */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white hidden lg:block animate-fade-in-right">
                        <div className="flex flex-col gap-4 text-center">
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Confidence Score</p>
                                <p className="text-xl font-black">94.2%</p>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div>
                                <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Model Status</p>
                                <p className="text-xl font-black uppercase">Optimal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-wrapper !pt-0">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <span>Price Forecast</span>
                </div>
                <PricePrediction cropName="Wheat" district={district || 'Sirsa'} />
            </div>
        </>
    );
}
