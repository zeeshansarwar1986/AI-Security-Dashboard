import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Filter, MoreHorizontal, User } from 'lucide-react';

const EventLog = () => {
    const [events, setEvents] = useState([]);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://localhost:8000/logs", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setEvents(await res.json());
            }
        } catch (err) {
            console.error("Log fetch error:", err);
        }
    };

    useEffect(() => {
        const loadLogs = async () => {
            await fetchLogs();
        };
        loadLogs();
        const interval = setInterval(fetchLogs, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="glass-panel rounded-[2rem] flex flex-col h-full shadow-2xl overflow-hidden border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h3 className="text-xl font-black text-white font-heading tracking-tight">Intelligence Feed</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Recognition Activity</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                        <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6 ring-1 ring-white/5">
                            <Clock className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Syncing Stream...</p>
                    </div>
                ) : events.map(log => (
                    <div key={log.id} className="group flex items-center gap-5 p-4 rounded-3xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all cursor-pointer hover-scale active:scale-[0.98] shadow-lg">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden relative border border-white/10 shadow-xl group-hover:border-cyan-500/50 transition-colors">
                                <img
                                    src={log.image ? `http://localhost:8000/evidence/${log.image}` : `https://ui-avatars.com/api/?name=${log.name}&background=1e2335&color=fff&bold=true`}
                                    alt={log.name}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-slate-900 flex items-center justify-center shadow-lg ${log.category === 'Blacklist' ? 'bg-red-500 shadow-red-500/50' :
                                    log.category === 'VIP' ? 'bg-indigo-500 shadow-indigo-500/50' :
                                        'bg-cyan-500 shadow-cyan-500/50'
                                }`}>
                                {log.category === 'Blacklist' ? <AlertTriangle className="w-2.5 h-2.5 text-white" /> :
                                    log.name !== 'Unknown' ? <CheckCircle2 className="w-2.5 h-2.5 text-white" /> :
                                        <User className="w-2.5 h-2.5 text-white" />}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1.5">
                                <h4 className="font-black text-white truncate text-sm tracking-tight">{log.name}</h4>
                                <span className="text-[10px] font-black text-slate-500 tracking-tighter opacity-60 bg-white/5 px-2 py-0.5 rounded-md">{formatTime(log.timestamp)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] px-2 py-1 rounded-lg font-black tracking-widest uppercase ${log.category === 'Blacklist' ? 'text-red-400 bg-red-500/10 border border-red-500/20' :
                                        log.category === 'VIP' ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' :
                                            'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                                    }`}>
                                    {log.category}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-3 bg-white/10 rounded-full"></div>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Confidence: <span className="text-white">{(log.confidence * 100).toFixed(0)}%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <button className="w-full py-4 rounded-2xl bg-cyan-500/10 text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/30">
                    Audit All Activity 🔐
                </button>
            </div>
        </div>
    );
};

export default EventLog;
