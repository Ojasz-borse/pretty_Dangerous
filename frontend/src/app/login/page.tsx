'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Phone, Lock, ArrowRight, Loader2, Shield, ShoppingCart, TrendingUp, Zap, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                router.push(data.user.role === 'farmer' ? '/' : '/buyer');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Could not connect to server. Ensure backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="tricolor-bar"></div>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full animate-fade-in">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg">
                                <Leaf className="w-9 h-9 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                            Krishi<span className="text-green-600">Setu</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Digital Agricultural Intelligence</p>
                    </div>

                    <div className="card p-8 shadow-2xl border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg animate-shake">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="tel"
                                        className="input-field pl-10"
                                        placeholder="10-digit number"
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
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
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full justify-center py-3 text-base shadow-lg shadow-green-600/20 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500 font-medium">
                                Don't have an account? {' '}
                                <Link href="/signup" className="text-green-600 font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure Login</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1M+ Registered</span>
                    </div>
                </div>
            </div>

            <footer className="py-6 border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        © 2024 Ministry of Agriculture & Farmers Welfare · Government of India
                    </p>
                </div>
            </footer>
        </div>
    );
}

