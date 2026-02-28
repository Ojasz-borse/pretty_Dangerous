'use client';

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle2, Shield, Truck, Package } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    crop: string;
    variety: string;
    price: string;
    farmer: string;
    trustScore: number;
    image: string;
    quantity: string;
}

export default function PaymentModal({ isOpen, onClose, crop, variety, price, farmer, trustScore, image, quantity }: PaymentModalProps) {
    const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [qty, setQty] = useState(10);

    if (!isOpen) return null;

    const numericPrice = parseInt(price.replace(/[^\d]/g, '')) || 2450;
    const totalAmount = qty * numericPrice;
    const platformFee = Math.round(totalAmount * 0.02);
    const grandTotal = totalAmount + platformFee;

    const handlePay = () => {
        setStep('success');
        setTimeout(() => {
            setStep('details');
            onClose();
        }, 4000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {step === 'success' ? (
                    <div className="p-10 text-center animate-scale-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Payment Successful! 🎉</h2>
                        <p className="text-slate-500 mb-4">Order placed for <span className="font-bold text-green-600">{qty} Quintals</span> of {crop}</p>
                        <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mb-4">
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Transaction ID</p>
                            <p className="font-mono text-lg font-bold text-slate-800">KS-{Date.now().toString(36).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-blue-500" /> Expected in 3-5 days</div>
                        </div>
                    </div>
                ) : step === 'payment' ? (
                    <div className="p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Select Payment Method</h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <div className="space-y-3 mb-6">
                            {[
                                { id: 'upi' as const, label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
                                { id: 'card' as const, label: 'Card', desc: 'Credit / Debit Card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { id: 'netbanking' as const, label: 'Net Banking', desc: 'All major banks', icon: Building2, color: 'text-green-600', bg: 'bg-green-50' },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === method.id ? 'border-green-500 bg-green-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className={`w-12 h-12 ${method.bg} rounded-xl flex items-center justify-center`}>
                                        <method.icon className={`w-6 h-6 ${method.color}`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{method.label}</p>
                                        <p className="text-xs text-slate-400">{method.desc}</p>
                                    </div>
                                    {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                                </button>
                            ))}
                        </div>

                        {paymentMethod === 'upi' && (
                            <div className="mb-6 animate-slide-up">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">UPI ID</label>
                                <input className="input-field" placeholder="yourname@upi" defaultValue="farmer@ybl" />
                            </div>
                        )}
                        {paymentMethod === 'card' && (
                            <div className="space-y-3 mb-6 animate-slide-up">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Card Number</label>
                                    <input className="input-field" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Expiry</label>
                                        <input className="input-field" placeholder="12/28" defaultValue="12/28" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">CVV</label>
                                        <input className="input-field" placeholder="***" type="password" defaultValue="123" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-bold text-slate-800">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Platform Fee (2%)</span>
                                <span className="font-medium text-slate-600">₹{platformFee.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-slate-200 my-2"></div>
                            <div className="flex justify-between text-base">
                                <span className="font-bold text-slate-800">Total</span>
                                <span className="font-extrabold text-green-600 text-xl">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={handlePay} className="btn-primary w-full justify-center text-base py-3.5 pulse-glow">
                            <Shield className="w-5 h-5" /> Pay ₹{grandTotal.toLocaleString()} Securely
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                            <Shield className="w-3 h-3" /> 256-bit SSL Encrypted · PCI DSS Compliant
                        </p>
                    </div>
                ) : (
                    <div className="p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-slate-800">Order Summary</h3>
                            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        {/* Crop Card */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
                            <img src={image} alt={crop} className="w-20 h-20 rounded-xl object-cover" />
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 text-lg">{crop}</p>
                                <p className="text-xs text-slate-400">{variety} · Available: {quantity}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-bold text-green-600">{price}</span>
                                    <span className="badge-green text-[10px]">Trust: {trustScore}/100</span>
                                </div>
                            </div>
                        </div>

                        {/* Farmer */}
                        <div className="flex items-center gap-3 p-3 mb-5 bg-green-50 rounded-xl border border-green-100">
                            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-sm">{farmer.charAt(0)}</div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">{farmer}</p>
                                <p className="text-xs text-green-600 font-medium">Verified Farmer · KrishiSetu</p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Quantity (Quintals)</label>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setQty(Math.max(1, qty - 5))} className="btn-outline px-4 py-2">-5</button>
                                <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="input-field text-center text-xl font-bold w-24" />
                                <button onClick={() => setQty(qty + 5)} className="btn-outline px-4 py-2">+5</button>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-500">{qty} Qtl × ₹{numericPrice.toLocaleString()}</span>
                                <span className="font-bold text-slate-800">₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={() => setStep('payment')} className="btn-primary w-full justify-center text-base py-3.5">
                            <Package className="w-5 h-5" /> Proceed to Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
