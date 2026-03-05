import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
                <div className="flex justify-center mb-6">
                    <Shield className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Security Login</h2>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-blue-500 outline-none"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-blue-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-medium mt-4">
                        Access Dashboard
                    </button>
                    <div className="text-center text-xs text-slate-500 mt-4">
                        Default: admin / admin123
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
