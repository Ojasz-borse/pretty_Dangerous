'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, User, Phone, Lock, ArrowRight, Loader2, MapPin, Building, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { district, state } = useLocation();

    const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        password: '',
        buyerType: 'consumer',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role,
                    location: { district, state }
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                router.push(role === 'farmer' ? '/' : '/buyer');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Could not connect to server. Ensure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full animate-fade-in">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Leaf className="w-8 h-8 text-green-600" />
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            Krishi<span className="text-green-600">Setu</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium">Create your secure account</p>
                </div>

                <div className="card p-8 shadow-xl border-t-4 border-green-600">
                    {/* Role Selector */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                        <button
                            onClick={() => setRole('farmer')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'farmer' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}
                        >
                            <User className="w-4 h-4" /> Farmer
                        </button>
                        <button
                            onClick={() => setRole('buyer')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === 'buyer' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                        >
                            <ShoppingCart className="w-4 h-4" /> Buyer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg animate-shake">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    className="input-field pl-10"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="tel"
                                    className="input-field pl-10"
                                    placeholder="10-digit number"
                                    value={formData.mobile}
                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {role === 'buyer' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Buyer Type</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className="select-field pl-10 w-full"
                                        value={formData.buyerType}
                                        onChange={e => setFormData({ ...formData, buyerType: e.target.value })}
                                    >
                                        <option value="consumer">Direct Consumer</option>
                                        <option value="retailer">Retailer / Shop</option>
                                        <option value="institution">Hotel / Institution</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Auto Location</p>
                                    <p className="text-xs font-bold text-slate-700">{district}, {state}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn-primary w-full justify-center py-3 text-base shadow-lg shadow-green-600/20 group ${role === 'buyer' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : ''}`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Join KrishiSetu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-100">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account? {' '}
                            <Link href="/login" className="text-green-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-8">
                    By joining, you agree to KrishiSetu's Terms & Conditions
                    <br />© 2024 Ministry of Agriculture, Govt. of India
                </p>
            </div>
        </div>
    );
}
