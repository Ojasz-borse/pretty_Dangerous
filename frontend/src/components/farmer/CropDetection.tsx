'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, XCircle, Loader2, Leaf, Award, Trash2 } from 'lucide-react';
import type { CropDetectionResult, ApiResponse } from '@/types/farmer';

export default function CropDetection() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<CropDetectionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file); setError(null); setResult(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true); setError(null); setResult(null);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await fetch('/api/farmer/detect-crop', { method: 'POST', body: formData });
            const data: ApiResponse<CropDetectionResult> = await response.json();
            if (data.success && data.data) setResult(data.data);
            else setError(data.error || 'Failed to analyze image');
        } catch (err) { setError('Failed to connect. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file); setError(null); setResult(null);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const getGradeBadge = (grade: string) => {
        switch (grade) {
            case 'A': return 'badge-green';
            case 'B': return 'badge-blue';
            case 'C': return 'badge-amber';
            case 'D': return 'badge-red';
            default: return 'badge-gray';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'good': return 'badge-green';
            case 'warning': return 'badge-amber';
            case 'critical': return 'badge-red';
            default: return 'badge-gray';
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload */}
            <div className="card p-6">
                <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${selectedFile ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !selectedFile && fileInputRef.current?.click()}
                >
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" suppressHydrationWarning />
                    {previewUrl ? (
                        <div className="space-y-3">
                            <img src={previewUrl} alt="Preview" className="max-h-56 mx-auto rounded-xl shadow-md border border-slate-200" />
                            <p className="text-sm text-slate-500">{selectedFile?.name}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center"><Upload className="w-8 h-8 text-orange-400" /></div>
                            <p className="text-slate-500 font-medium">Drag and drop your crop image, or <span className="text-orange-500 hover:underline">browse files</span></p>
                            <p className="text-xs text-slate-400">Supports: JPG, PNG, WEBP (Max 10MB)</p>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 mt-4">
                    <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); setError(null); }} disabled={!selectedFile} className="btn-outline disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /> Clear</button>
                    <button onClick={handleUpload} disabled={!selectedFile || loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Scan className="w-4 h-4" /> Detect Crop</>}
                    </button>
                </div>
            </div>

            {error && (
                <div className="card p-4 card-red"><div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-red-500" /><p className="text-red-600 text-sm">{error}</p></div></div>
            )}

            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Main Result */}
                    <div className="card overflow-hidden card-green">
                        <div className="bg-green-50 p-6 border-b border-green-200">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center"><Leaf className="w-8 h-8 text-white" /></div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{result.cropName}</h2>
                                        {result.detectedVariety && <p className="text-slate-500">Variety: {result.detectedVariety}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Confidence</p>
                                    <p className="text-xl font-bold text-green-600">{result.confidence}%</p>
                                    <div className="progress-bar w-32 mt-1"><div className="progress-fill progress-green" style={{ width: `${result.confidence}%` }}></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-amber-500" />
                                <div><p className="text-xs text-slate-400">Quality Grade</p><span className={`${getGradeBadge(result.qualityGrade)} text-base px-4 py-1`}>Grade {result.qualityGrade}</span></div>
                            </div>
                            <div className="text-right"><p className="text-xs text-slate-400">Score</p><p className="text-2xl font-bold text-blue-600">{result.qualityScore}/100</p></div>
                        </div>
                    </div>

                    {/* Health */}
                    <div className="card p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Health Indicators</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.healthIndicators.map((ind, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        {ind.status === 'good' ? <CheckCircle className="w-4 h-4 text-green-500" /> : ind.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                        <div><p className="font-medium text-sm text-slate-700">{ind.name}</p><p className="text-xs text-slate-400">{ind.value}</p></div>
                                    </div>
                                    <span className={getStatusBadge(ind.status)}>{ind.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="card p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Recommendations</h3>
                        <ul className="space-y-2.5">
                            {result.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">{idx + 1}</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* AgriTrust AI - Market Intelligence */}
                    {result.marketInsight && (
                        <div className={`card overflow-hidden border-2 ${result.marketInsight.recommendation === 'WAIT' ? 'border-blue-500/30' : 'border-orange-500/30'}`}>
                            <div className={`${result.marketInsight.recommendation === 'WAIT' ? 'bg-blue-600' : 'bg-orange-600'} p-4 text-white flex items-center justify-between`}>
                                <div className="flex items-center gap-2">
                                    <Scan className="w-5 h-5" />
                                    <h3 className="font-black uppercase tracking-widest text-sm">Market Intelligence</h3>
                                </div>
                                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                                    {result.marketInsight.recommendation === 'WAIT' ? '💰 PROFIT MAXIMIZATION' : '⚡ QUICK LIQUIDATION'}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Price</p>
                                        <p className="text-2xl font-black text-slate-800">₹{result.marketInsight.currentPrice}<span className="text-xs text-slate-400 ml-1">/kg</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Predicted Price</p>
                                        <p className="text-2xl font-black text-green-600">₹{result.marketInsight.predictedPrice.toFixed(2)}<span className="text-xs text-slate-400 ml-1">/kg</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Growth</p>
                                        <p className={`text-2xl font-black ${result.marketInsight.growthPercent > 0 ? 'text-blue-600' : 'text-slate-600'}`}>+{result.marketInsight.growthPercent}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Demand Index</p>
                                        <p className="text-2xl font-black text-slate-800">{result.marketInsight.demandIndex}<span className="text-xs text-slate-400 ml-1">/100</span></p>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 ${result.marketInsight.recommendation === 'WAIT' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result.marketInsight.recommendation === 'WAIT' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {result.marketInsight.recommendation === 'WAIT' ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">AI Recommendation</p>
                                            <h4 className={`text-4xl font-black ${result.marketInsight.recommendation === 'WAIT' ? 'text-blue-700' : 'text-orange-700'}`}>
                                                {result.marketInsight.recommendation}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-right">
                                        <p className="text-sm font-medium text-slate-600 max-w-xs leading-tight">
                                            {result.marketInsight.reason || (result.marketInsight.recommendation === 'WAIT'
                                                ? "Holding stock is advised as prices are expected to rise significantly."
                                                : "Optimal market price reached. Selling now will maximize your immediate ROI.")
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
