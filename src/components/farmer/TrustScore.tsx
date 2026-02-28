'use client';

import React, { useState, useEffect } from 'react';
import { Star, Shield, Award, TrendingUp, CheckCircle, Truck, Users, Clock, IndianRupee, ThumbsUp } from 'lucide-react';
import type { TrustScore, ApiResponse } from '@/types/farmer';

export default function TrustScore() {
    const [trustData, setTrustData] = useState<TrustScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchTrustScore(); }, []);

    const fetchTrustScore = async () => {
        try {
            const response = await fetch('/api/farmer/trust-score');
            const data: ApiResponse<TrustScore> = await response.json();
            if (data.success && data.data) setTrustData(data.data);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return { text: 'text-green-600', bg: 'bg-green-500', ring: 'border-green-300', fill: 'bg-green-50' };
        if (score >= 75) return { text: 'text-blue-600', bg: 'bg-blue-500', ring: 'border-blue-300', fill: 'bg-blue-50' };
        if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', ring: 'border-amber-300', fill: 'bg-amber-50' };
        return { text: 'text-red-600', bg: 'bg-red-500', ring: 'border-red-300', fill: 'bg-red-50' };
    };

    if (loading) return <div className="card p-12 flex items-center justify-center"><div className="w-8 h-8 border-3 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div></div>;
    if (!trustData) return null;

    const sc = getScoreColor(trustData.overallScore);

    return (
        <div className="space-y-6">
            {/* Main Score */}
            <div className={`card overflow-hidden card-amber`}>
                <div className={`${sc.fill} p-8`}>
                    <div className="flex items-center gap-8 flex-wrap">
                        <div className={`w-28 h-28 rounded-full border-4 ${sc.ring} ${sc.fill} flex items-center justify-center`}>
                            <div className="text-center">
                                <Star className={`w-6 h-6 mx-auto mb-1 ${sc.text}`} />
                                <span className={`text-4xl font-bold ${sc.text}`}>{trustData.overallScore}</span>
                                <span className="text-sm text-slate-400">/100</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-1">Trust Score</h2>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-slate-400" />
                                <span className={`text-lg font-semibold ${sc.text}`}>Reliability: {trustData.reliabilityLevel}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-2">Last updated: {new Date(trustData.lastUpdated).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Components */}
            <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500" /> Score Components</h3>
                <div className="space-y-4">
                    {trustData.components.map((comp, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <div><p className="font-semibold text-slate-700">{comp.name}</p><p className="text-xs text-slate-400">{comp.description}</p></div>
                                <div className="text-right"><span className="text-lg font-bold text-blue-600">{comp.score}</span><span className="text-xs text-slate-400">/100</span></div>
                            </div>
                            <div className="progress-bar"><div className="progress-fill progress-blue" style={{ width: `${comp.score}%` }}></div></div>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Weight: {(comp.weight * 100).toFixed(0)}%</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-green-500" /> Transaction History</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: CheckCircle, value: trustData.transactionHistory.successfulDeliveries, label: 'Deliveries', color: 'text-green-600', bg: 'bg-green-50' },
                        { icon: Users, value: trustData.transactionHistory.totalTransactions, label: 'Transactions', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { icon: Star, value: trustData.transactionHistory.averageRating.toFixed(1), label: 'Avg Rating', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { icon: Clock, value: `${trustData.transactionHistory.onTimeDeliveryRate}%`, label: 'On-Time', color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((s, i) => (
                        <div key={i} className="stat-card text-center">
                            <div className={`w-10 h-10 mx-auto mb-2 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2"><IndianRupee className="w-5 h-5 text-blue-600" /><span className="font-medium text-slate-700">Total Value</span></div>
                    <span className="text-xl font-bold text-blue-600">₹{trustData.transactionHistory.totalValue.toLocaleString()}</span>
                </div>
            </div>

            {/* Badges */}
            <div className="card p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trustData.verificationBadges.map((badge) => (
                        <div key={badge.id} className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                            <span className="text-3xl">{badge.icon}</span>
                            <div><p className="font-semibold text-slate-700">{badge.name}</p><p className="text-xs text-slate-400">{badge.description}</p><span className="badge-gray text-[10px] mt-1">Earned: {new Date(badge.earnedDate).toLocaleDateString()}</span></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="card p-6 card-green bg-green-50">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><ThumbsUp className="w-5 h-5" /> Improve Your Score</h3>
                <ul className="space-y-2">
                    {['Complete all verification steps (Identity, Land, Bank)', 'Maintain consistent on-time deliveries', 'Respond to buyer inquiries within 24 hours', 'Ensure high-quality produce in all transactions', 'Build long-term relationships with buyers'].map((tip, i) => (
                        <li key={i} className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /><span className="text-sm text-green-700">{tip}</span></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
