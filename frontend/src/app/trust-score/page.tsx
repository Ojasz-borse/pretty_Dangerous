'use client';
import Navbar from '@/components/Navbar';
import TrustScore from '@/components/farmer/TrustScore';
import { Star } from 'lucide-react';
import Link from 'next/link';

export default function TrustScorePage() {
    return (
        <>
            <Navbar />

            {/* Full-Width Header */}
            <div className="relative h-[300px] sm:h-[400px] w-full overflow-hidden shadow-lg flex items-center mb-8">
                <img src="/5.jpg" alt="Growth and Reliability" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-12 w-full flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center sm:text-left text-white animate-fade-in">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <div className="section-icon bg-yellow-500 shadow-lg shadow-yellow-500/20">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-yellow-400 font-black tracking-widest text-xs uppercase drop-shadow-md">Reputation Systems</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl mb-4">Your <span className="text-yellow-400">Trust Score</span></h1>
                        <p className="text-white/90 text-lg leading-relaxed drop-shadow-md font-medium max-w-lg">Build your digital reputation. High trust scores unlock better credit, faster logistics, and premium buyers.</p>
                    </div>

                    {/* Side Badge Stats */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white hidden lg:block animate-fade-in-right">
                        <div className="flex flex-col gap-4 text-center">
                            <div>
                                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Platform Status</p>
                                <p className="text-xl font-black text-green-400">Premium Seller</p>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Trust Level</p>
                                <p className="text-xl font-black">Level 4</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-wrapper !pt-0">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <span>Trust Score</span>
                </div>
                <TrustScore />
            </div>
        </>
    );
}
