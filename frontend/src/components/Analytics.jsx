import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Mock data logic or fetch from /analytics
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:8000/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (e) { console.error(e) }
        };
        fetchData();
    }, []);

    if (!data) return <div className="text-white">Loading stats...</div>;

    const chartData = {
        labels: Object.keys(data.by_category),
        datasets: [
            {
                data: Object.values(data.by_category),
                backgroundColor: [
                    'rgba(6, 182, 212, 0.5)',   // Cyan
                    'rgba(99, 102, 241, 0.5)',  // Indigo
                    'rgba(239, 68, 68, 0.5)',   // Red
                    'rgba(245, 158, 11, 0.5)',  // Amber
                ],
                borderColor: [
                    'rgba(6, 182, 212, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
                ],
                borderWidth: 2,
                hoverOffset: 20,
                spacing: 10,
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', weight: 'bold', size: 10 },
                    padding: 20,
                    usePointStyle: true,
                }
            }
        },
        cutout: '75%',
    };

    return (
        <div className="flex flex-col gap-8 animate-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white font-heading tracking-tight leading-none">Security Analytics</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-cyan-500/30"></span> Operational Intelligence Dash
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Detections" value={data.total_events} icon={<Activity className="text-cyan-400" />} trend="+12" />
                <StatCard label="Unique Identities" value={Object.keys(data.by_category).length} icon={<Users className="text-indigo-400" />} />
                <StatCard label="Alert Level" value="Low" icon={<Shield className="text-green-400" />} />
                <StatCard label="Node Uptime" value="99.9%" icon={<Radio className="text-emerald-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Distribution Chart */}
                <div className="lg:col-span-5 glass-panel p-8 rounded-[2rem] border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8">
                        <BarChart3 className="w-12 h-12 text-white/5" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 font-heading">Traffic Distribution</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-10">Historical Category Breakdown</p>

                    <div className="relative aspect-square max-w-[320px] mx-auto">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth</span>
                            <span className="text-3xl font-black text-white font-heading">+24%</span>
                        </div>
                    </div>
                </div>

                {/* Bar Chart or Secondary Stats */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 flex-1 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent"></div>
                        <h3 className="text-lg font-black text-white mb-2 font-heading relative z-10">Recognition Velocity</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 relative z-10">Detections per node (Last 24h)</p>

                        <div className="h-[240px] relative z-10">
                            {/* Simplified mock bar representation for high-end look */}
                            <div className="flex items-end justify-between h-full gap-4 px-4">
                                {[60, 40, 80, 50, 90, 70, 45].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar select-none">
                                        <div
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-t-xl transition-all duration-500 group-hover/bar:bg-cyan-500/20 group-hover/bar:border-cyan-500/40 relative"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                                <span className="text-[10px] font-black text-cyan-400 bg-black/80 px-2 py-1 rounded border border-cyan-500/30">{h * 12}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Day {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend }) => (
    <div className="glass-panel p-6 rounded-[2rem] border-white/5 group hover-scale active:scale-95 transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl glass-panel-light flex items-center justify-center text-xl shadow-lg border-white/5 group-hover:border-cyan-500/30 transition-colors">
                {icon}
            </div>
            {trend && (
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg tracking-tighter">
                    ▲ {trend}%
                </span>
            )}
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-3xl font-black text-white font-heading tracking-tight group-hover:text-cyan-400 transition-colors">{value}</div>
    </div>
);

export default Analytics;
