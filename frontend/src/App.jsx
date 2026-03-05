import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Shield, Users, Activity, BarChart3, Video, LogOut, Settings, Bell, Search, Upload, Trash2, UserCheck, CheckCircle2 } from 'lucide-react';
import LiveFeed from './components/LiveFeed';
import EventLog from './components/EventLog';
import KnownFaces from './components/KnownFaces';
import Login from './components/Login';
import Analytics from './components/Analytics';
import CameraManager from './components/CameraManager';
import { AuthProvider, useAuth } from './AuthContext';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-row h-screen w-full bg-[#020408] text-slate-100 selection:bg-cyan-500/30 font-sans overflow-hidden">
      {/* Sidebar - Fixed Width and Alignment */}
      <aside className="w-[300px] flex-shrink-0 flex flex-col glass-panel m-6 rounded-[2.5rem] overflow-hidden z-20 shadow-2xl border-white/5">
        <div className="p-10 flex items-center gap-5 border-b border-white/5 bg-white/[0.02]">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-cyan-500/20 ring-1 ring-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter font-heading leading-tight italic">SENTIN<span className="text-cyan-400">EYE</span></h1>
            <span className="text-[9px] text-cyan-400/80 font-black uppercase tracking-[0.3em] mt-0.5">Quantum Node</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
          <nav className="space-y-4">
            <div className="text-[10px] font-black text-slate-500 mb-6 px-4 uppercase tracking-[0.2em] font-heading opacity-60">Operations</div>
            <NavLink to="/" icon={<Activity />} label="Live Monitor" active={location.pathname === '/'} />
            <NavLink to="/analytics" icon={<BarChart3 />} label="Security Intel" active={location.pathname === '/analytics'} />
            <NavLink to="/faces" icon={<Users />} label="Identity Matrix" active={location.pathname === '/faces'} />
            <NavLink to="/cameras" icon={<Video />} label="Tactical Nodes" active={location.pathname === '/cameras'} />
          </nav>

          <nav className="space-y-4">
            <div className="text-[10px] font-black text-slate-500 mb-6 px-4 uppercase tracking-[0.2em] font-heading opacity-60">Control</div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/20"
            >
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-black text-[11px] font-heading uppercase tracking-widest">Terminate Session</span>
            </button>
          </nav>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="glass-panel-light p-5 rounded-3xl flex flex-col gap-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">Encrypted</div>
              </div>
              <div className="text-[10px] font-black text-slate-600">v4.5</div>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-0 flex flex-col min-w-0 mr-6 my-6 overflow-hidden">
        {/* Header Bar */}
        <header className="h-24 glass-panel rounded-[2.5rem] flex items-center justify-between px-10 mb-6 flex-shrink-0 shadow-2xl border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] font-heading mb-1">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</span>
            <span className="text-xl font-black text-white tracking-tighter leading-none">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group hidden xl:block w-96">
              <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Query Biometric Records..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.08] transition-all font-black"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-2xl glass-panel-light flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020408]"></span>
              </button>
              <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white tracking-tight">Zeeshan</span>
                  <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest opacity-60">Administrator</span>
                </div>
                <div className="w-12 h-12 rounded-2xl glass-panel-light p-1 border-white/10 group-hover:border-cyan-500/50 transition-all overflow-hidden bg-slate-900 shadow-xl">
                  <img
                    src="https://ui-avatars.com/api/?name=Zeeshan&background=020408&color=22d3ee&bold=true"
                    alt="User"
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Action Space */}
        <div className="flex-1 overflow-auto rounded-[2.5rem] relative animate-in custom-scrollbar scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group relative active:scale-95 ${active
      ? 'text-white bg-white/[0.08] border border-white/5 shadow-xl shadow-black/20'
      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
      }`}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
    )}
    <div className={`transition-all duration-300 ${active ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-500 group-hover:text-cyan-400'}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className={`font-black text-[11px] font-heading uppercase tracking-widest transition-all ${active ? 'text-white' : 'group-hover:translate-x-1'}`}>
      {label}
    </span>
  </Link>
);

const Dashboard = () => (
  <div className="grid grid-cols-12 gap-6 h-full">
    <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
      <LiveFeed />
    </div>
    <div className="col-span-12 lg:col-span-3 h-full">
      <EventLog />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/faces" element={<Layout><KnownFaces /></Layout>} />
          <Route path="/cameras" element={<Layout><CameraManager /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
