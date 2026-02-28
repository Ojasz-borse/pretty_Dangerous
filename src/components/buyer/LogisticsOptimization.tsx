'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, Navigation, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LogisticsOptimization() {
    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="border-purple-100 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="bg-indigo-950 p-10 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tight">Logistics Hub</h2>
                        </div>

                        <h3 className="text-5xl font-black mb-6 italic leading-tight">
                            Optimize Your <br />
                            <span className="text-indigo-400">Supply Chain</span>
                        </h3>

                        <p className="text-indigo-200/80 mb-10 max-w-md leading-relaxed">
                            Reduce transportation costs by up to 22% using our dynamic route optimization and multi-modal transit engine.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: Clock, text: 'Real-time vehicle tracking' },
                                { icon: ShieldCheck, text: 'Automatic insurance coverage' },
                                { icon: Navigation, text: 'Traffic-aware route planning' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-indigo-100">
                                    <item.icon className="w-4 h-4 text-indigo-400" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        <Button className="mt-12 bg-white text-indigo-950 font-black rounded-xl px-10 h-14 hover:bg-indigo-50 shadow-2xl transition-all italic border-0">
                            Book Shipment
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="p-8 bg-white space-y-8">
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Active Shipments</h4>
                            <div className="space-y-4">
                                {[
                                    { id: 'TR-1082', status: 'In Transit', from: 'Sirsa', to: 'Delhi', progress: 65 },
                                    { id: 'TR-1194', status: 'Loading', from: 'Karnal', to: 'Chandigarh', progress: 15 }
                                ].map((ship, i) => (
                                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-gray-800 tracking-tight">{ship.id}</span>
                                                    <Badge className="bg-indigo-100 text-indigo-600 text-[10px] font-black h-4 px-1.5 border-indigo-200 uppercase">{ship.status}</Badge>
                                                </div>
                                                <p className="text-xs font-bold text-gray-400">{ship.from} → {ship.to}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-indigo-600 italic leading-none mb-1">{ship.progress}%</p>
                                            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="bg-indigo-500 h-full" style={{ width: `${ship.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-indigo-600 mt-1" />
                                <div>
                                    <h4 className="font-black text-indigo-900 italic tracking-tight mb-2 uppercase text-sm">Nearby Hubs</h4>
                                    <p className="text-xs text-indigo-700/70 font-bold mb-4">3 major procurement centers found within 50km of Sirsa.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-white text-indigo-600 border-indigo-100">Sirsa North</Badge>
                                        <Badge className="bg-white text-indigo-600 border-indigo-100">Fatehabad Main</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
