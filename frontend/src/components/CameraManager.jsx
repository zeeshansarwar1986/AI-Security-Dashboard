import React, { useState, useEffect } from 'react';
import { Video, Plus, Server } from 'lucide-react';

const CameraManager = () => {
    const [cameras, setCameras] = useState([]);
    const [newCam, setNewCam] = useState({ name: '', rtsp_url: '', location: '' });

    const fetchCameras = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/cameras', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setCameras(await res.json());
    };

    useEffect(() => { fetchCameras(); }, []);

    const addCamera = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch('http://localhost:8000/cameras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newCam)
        });
        setNewCam({ name: '', rtsp_url: '', location: '' });
        fetchCameras();
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="text-green-400" /> Add New Camera
                </h3>
                <form onSubmit={addCamera} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        placeholder="Camera Name (e.g. Front Gate)"
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        value={newCam.name} onChange={e => setNewCam({ ...newCam, name: e.target.value })}
                        required
                    />
                    <input
                        placeholder="RTSP/HTTP Stream URL"
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        value={newCam.rtsp_url} onChange={e => setNewCam({ ...newCam, rtsp_url: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Location"
                        className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                        value={newCam.location} onChange={e => setNewCam({ ...newCam, location: e.target.value })}
                    />
                    <button className="bg-green-600 hover:bg-green-500 rounded font-medium text-white">
                        Add Camera
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameras.map(cam => (
                    <div key={cam.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                        <div className="bg-slate-950 p-4 flex justify-between items-center">
                            <h4 className="font-semibold">{cam.name}</h4>
                            <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded">Offline</span>
                        </div>
                        <div className="p-4 space-y-2 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <Server className="w-4 h-4" />
                                <span className="truncate">{cam.rtsp_url}</span>
                            </div>
                            <div>Location: {cam.location || "N/A"}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CameraManager;
