import React, { useState, useEffect } from 'react';
import { Upload, Trash2, UserCheck, CheckCircle2, Users } from 'lucide-react';

const KnownFaces = () => {
    const [faces, setFaces] = useState([]);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("Known");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchFaces = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("http://localhost:8000/persons", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFaces(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch faces", err);
        }
    };

    useEffect(() => {
        fetchFaces();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !newName) return;

        setLoading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append("name", newName);
        formData.append("category", newType);
        formData.append("file", file);

        try {
            await fetch("http://localhost:8000/persons", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            setNewName("");
            setFile(null);
            fetchFaces();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deletePerson = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:8000/persons/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchFaces();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white font-heading tracking-tight leading-none">Identity Database</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-cyan-500/30"></span> Secure Biometric Registry
                    </p>
                </div>
                <div className="flex items-center gap-4 glass-panel-light px-6 py-3 rounded-2xl border-white/5">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Records</div>
                        <div className="text-xl font-black text-cyan-400 font-heading leading-none mt-1">{faces.length}</div>
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <UserCheck className="w-6 h-6 text-cyan-500/50" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Registration Panel */}
                <div className="xl:col-span-1 glass-panel p-8 rounded-[2rem] border-white/5 h-fit sticky top-0 group hover-glow transition-all duration-500">
                    <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 font-heading">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <Upload className="w-4 h-4 text-cyan-400" />
                        </div>
                        Add Identity
                    </h3>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.05] transition-all"
                                placeholder="Enter full name..."
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categorization</label>
                            <select
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.05] appearance-none transition-all cursor-pointer"
                                value={newType}
                                onChange={e => setNewType(e.target.value)}
                            >
                                <option value="Employee" className="bg-slate-900">Personnel / Employee</option>
                                <option value="VIP" className="bg-slate-900">VIP / Executive</option>
                                <option value="Blacklist" className="bg-slate-900">Blacklisted / Restricted</option>
                                <option value="Visitor" className="bg-slate-900">Visitor / Temporary</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Face Profile</label>
                            <div className="glass-panel-light border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.05] transition-all cursor-pointer relative group-hover:border-cyan-500/30">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={e => setFile(e.target.files[0])}
                                    accept="image/*"
                                />
                                {file ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-2">
                                            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <span className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-2">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">
                                            <Upload className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Select Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${loading
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:shadow-cyan-500/25 hover:scale-[1.02]"
                                }`}
                        >
                            {loading ? "Registering..." : "Commit To Database"}
                        </button>
                    </form>
                </div>

                {/* Grid List */}
                <div className="xl:col-span-3">
                    {faces.length === 0 ? (
                        <div className="glass-panel rounded-[2rem] p-20 flex flex-col items-center justify-center border-white/5 text-slate-700 animate-pulse">
                            <Users className="w-20 h-20 mb-6 opacity-5" />
                            <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-600">No Biometric Records Found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {faces.map((face) => (
                                <div key={face.id} className="glass-panel p-4 rounded-[2rem] border-white/5 group hover-scale active:scale-95 transition-all duration-300 relative overflow-hidden">
                                    {/* Card Header Background */}
                                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent"></div>

                                    <div className="relative z-10 flex flex-col items-center pt-4 pb-2">
                                        <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-br from-white/10 to-transparent mb-6 shadow-2xl relative">
                                            <div className="w-full h-full rounded-[1.25rem] overflow-hidden border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                                                <img
                                                    src={`http://localhost:8000/faces/${face.image_path}`}
                                                    alt={face.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + face.name}
                                                />
                                            </div>
                                            {/* Status Dot */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#0a0f19] shadow-lg"></div>
                                        </div>

                                        <h4 className="font-black text-white text-lg font-heading tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">{face.name}</h4>

                                        <div className={`badge ${face.category === 'Blacklist' ? 'badge-red' :
                                            face.category === 'VIP' ? 'badge-gold' : 'badge-blue'}`}>
                                            {face.category}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-between items-center pr-2">
                                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">ID: {face.id.toString().padStart(4, '0')}</div>
                                            <button
                                                onClick={() => deletePerson(face.id)}
                                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center border border-red-500/10 group-hover:border-red-500/30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Reveal Glow */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0)] group-hover:shadow-[0_0_20px_rgba(6,182,212,1)] transition-all"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnownFaces;
