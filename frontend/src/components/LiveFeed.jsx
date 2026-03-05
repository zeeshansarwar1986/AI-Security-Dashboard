import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize2, MoreVertical, Radio, Settings, AlertTriangle } from 'lucide-react';

const LiveFeed = () => {
    const videoRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [latestLogs, setLatestLogs] = useState([]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Webcam Error:", err);
        }
    };

    const fetchLatest = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://localhost:8000/logs?limit=5", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const logs = await res.json();
                // Filter logs from last 10 seconds to keep overlays fresh
                const now = new Date();
                const freshLogs = logs.filter(log => (now - new Date(log.timestamp)) < 10000);
                setLatestLogs(freshLogs);
            }
        } catch (err) {
            console.error("Feed detection log error:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            await startCamera();
        };
        init();
        const interval = setInterval(fetchLatest, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full glass-panel rounded-3xl overflow-hidden animate-in shadow-2xl relative border-white/5">
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 p-10 flex justify-between items-start z-20 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500/20 text-red-400 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 border border-red-500/40 backdrop-blur-xl tracking-[0.2em] shadow-2xl shadow-red-500/20">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></div> LIVE FEED
                        </div>
                        <div className="bg-white/10 text-white text-[10px] font-black px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/20 tracking-[0.2em] uppercase shadow-xl ring-1 ring-white/10">
                            Cam Node 01 • Sector A-7
                        </div>
                    </div>
                    <div className="text-[10px] text-white/60 font-black font-mono pl-1 flex items-center gap-3 tracking-widest">
                        <span className="w-8 h-[1px] bg-white/20"></span>
                        31.5204° N, 74.3587° E • ALT: 182m
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white/5 text-slate-300 hover:text-cyan-400 hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover-scale flex items-center justify-center shadow-lg group">
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 text-slate-300 hover:text-cyan-400 hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover-scale flex items-center justify-center shadow-lg group">
                        <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Video Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center scan-effect group">
                {!isStreaming && (
                    <div className="text-center animate-pulse">
                        <Camera className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-600 font-heading font-medium tracking-widest uppercase text-xs">Establishing Secure Connection...</p>
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
                />

                {/* Cyberpunk Detection Overlays */}
                {isStreaming && latestLogs.map((log, idx) => (
                    <div
                        key={log.id}
                        className={`absolute flex flex-col transition-all duration-700 animate-in`}
                        style={{
                            left: `${25 + (idx % 3) * 15}%`,
                            top: `${30 + (idx % 2) * 20}%`,
                            width: '240px',
                        }}
                    >
                        {/* Corner Brackets */}
                        <div className={`absolute -inset-2 border-2 rounded-2xl opacity-60 ${log.category === 'Blacklist' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                            log.category === 'VIP' ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' :
                                'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            }`}>
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-inherit -mt-[2px] -ml-[2px] rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-inherit -mt-[2px] -mr-[2px] rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-inherit -mb-[2px] -ml-[2px] rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-inherit -mb-[2px] -mr-[2px] rounded-br-lg"></div>
                        </div>

                        {/* Identity Badge */}
                        <div className={`flex items-center gap-3 p-2 rounded-2xl glass-panel-light backdrop-blur-xl border-white/20 translate-y-[-120%] animate-in`}>
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg shadow-black/50">
                                <img
                                    src={`http://localhost:8000/evidence/${log.image}`}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            </div>
                            <div className="min-w-0 pr-1">
                                <div className="text-[11px] font-black text-white leading-none tracking-tight truncate">{log.name}</div>
                                <div className={`text-[9px] font-bold mt-1 inline-flex px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${log.category === 'Blacklist' ? 'bg-red-500/20 text-red-300' :
                                    log.category === 'VIP' ? 'bg-indigo-500/20 text-indigo-300' :
                                        'bg-cyan-500/20 text-cyan-300'
                                    }`}>
                                    {log.category} • {(log.confidence * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Telemetry */}
            <div className="h-16 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-8">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Radio className="w-4 h-4 text-cyan-500 shadow-lg shadow-cyan-500/50" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signal: <span className="text-white">Encrypted AES-256</span></span>
                    </div>
                    <div className="h-4 w-px bg-white/5"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FPS: <span className="text-cyan-400">30.0</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-[9px] font-black text-slate-500 font-mono flex gap-6 tracking-widest uppercase">
                        <div className="flex items-center gap-2"><span className="w-1 h-3 bg-cyan-500/40 rounded-full"></span>CPU 08.4%</div>
                        <div className="flex items-center gap-2"><span className="w-1 h-3 bg-indigo-500/40 rounded-full"></span>GPU 22.1%</div>
                        <div className="flex items-center gap-2"><span className="w-1 h-3 bg-white/10 rounded-full"></span>MEM 1.2GB</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveFeed;
