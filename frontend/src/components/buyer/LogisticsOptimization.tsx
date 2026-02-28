'use client';

import React from 'react';
import { Truck, MapPin, Navigation, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LogisticsOptimization() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="card card-purple overflow-hidden">
                    <div className="hero-banner p-8 sm:p-10" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #312e81 100%)' }}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-white tracking-tight">Logistics Hub</h2>
                            </div>

                            <h3 className="text-4xl font-extrabold mb-6 leading-tight text-white">
                                Optimize Your <br />
                                <span className="text-indigo-300">Supply Chain</span>
                            </h3>

                            <p className="text-white/80 mb-8 max-w-md leading-relaxed text-sm">
                                Reduce transportation costs by up to 22% using our dynamic route optimization and multi-modal transit engine.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Clock, text: 'Real-time vehicle tracking' },
                                    { icon: ShieldCheck, text: 'Automatic insurance coverage' },
                                    { icon: Navigation, text: 'Traffic-aware route planning' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/90">
                                        <item.icon className="w-4 h-4 text-indigo-300" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>

                            <button className="btn-primary mt-10 bg-white text-indigo-900 hover:bg-indigo-50">
                                Book Shipment
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    {/* Active Shipments */}
                    <div className="card p-6">
                        <div className="section-header">
                            <div className="section-icon bg-purple-50">
                                <Truck className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Active Shipments</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'TR-1082', status: 'In Transit', from: 'Sirsa', to: 'Delhi', progress: 65 },
                                { id: 'TR-1194', status: 'Loading', from: 'Karnal', to: 'Chandigarh', progress: 15 }
                            ].map((ship, i) => (
                                <div key={i} className="card-flat p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-400">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800">{ship.id}</span>
                                                <span className="badge-purple text-[10px]">{ship.status}</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-400">{ship.from} → {ship.to}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-purple-600 leading-none mb-2">{ship.progress}%</p>
                                        <div className="progress-bar w-16">
                                            <div className="progress-fill progress-purple" style={{ width: `${ship.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nearby Hubs */}
                    <div className="card card-blue p-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-800 mb-1">Nearby Procurement Hubs</h4>
                                <p className="text-xs text-slate-500 font-medium mb-4">3 major procurement centers found within 50km of Sirsa.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="badge-blue">Sirsa North</span>
                                    <span className="badge-blue">Fatehabad Main</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
