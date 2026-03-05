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
    <div className="flex h-screen w-full bg-[#020408] text-slate-100 selection:bg-cyan-500/30 font-sans">
      {/* Sidebar - Fixed Width and Alignment */}
      <aside className="w-[300px] flex-shrink-0 m-6 flex flex-col glass-panel rounded-[2rem] overflow-hidden z-20 transition-all shadow-2xl">
        <div className="h-28 flex items-center gap-5 px-10 border-b border-white/5 bg-white/[0.03]">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-cyan-500/20 ring-1 ring-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter font-heading leading-tight">SENTIN<span className="text-cyan-400">EYE</span></h1>
            <span className="text-[10px] text-cyan-400/80 font-black uppercase tracking-[0.25em] mt-0.5">Core System</span>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
          <div>
            <div className="text-[10px] font-black text-slate-500 mb-6 px-4 uppercase tracking-[0.2em] font-heading">Operations Center</div>
            <nav className="space-y-3">
              <NavLink to="/" icon={<Activity />} label="Live Monitor" active={location.pathname === '/'} />
              <NavLink to="/analytics" icon={<BarChart3 />} label="Security Intel" active={location.pathname === '/analytics'} />
              <NavLink to="/faces" icon={<Users />} label="Identity Matrix" active={location.pathname === '/faces'} />
              <NavLink to="/cameras" icon={<Video />} label="Tactical Nodes" active={location.pathname === '/cameras'} />
            </nav>
          </div>

          <div>
            <div className="text-[10px] font-black text-slate-500 mb-6 px-4 uppercase tracking-[0.2em] font-heading">System Control</div>
            <nav className="space-y-3">
              <NavLink to="/settings" icon={<Settings />} label="Configuration" active={location.pathname === '/settings'} />
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all group duration-300 border border-transparent hover:border-red-500/10"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-black text-xs font-heading uppercase tracking-widest">Logout Session</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="p-8 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div className="glass-panel-light p-5 rounded-3xl flex flex-col gap-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse"></div>
                <div className="text-[11px] font-black text-white tracking-[0.1em] uppercase">Status: Online</div>
              </div>
              <div className="text-[10px] font-bold text-slate-500">v4.2.0</div>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
              <span>Bandwidth 84%</span>
              <span>Latency 12ms</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative mr-6 my-6">
        {/* Header Bar - More prominent */}
        <header className="h-24 flex-shrink-0 glass-panel rounded-[2rem] flex items-center justify-between px-10 mb-6 z-10 shadow-2xl overflow-hidden">
          <div className="flex flex-col gap-0.5 min-w-[150px]">
            <span className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] font-heading">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</span>
            <span className="text-lg font-black text-white tracking-tighter leading-none whitespace-nowrap">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-end">
            <div className="relative group hidden lg:block max-w-[400px] w-full">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search Biometric Logs..."
                className="bg-white/[0.04] border border-white/10 rounded-[1.5rem] pl-14 pr-8 py-3.5 text-sm text-white w-full focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:bg-white/[0.08] transition-all placeholder:text-slate-600 font-black"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-[1.25rem] glass-panel-light flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all relative hover-scale shadow-lg border-white/5">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border-2 border-slate-900"></span>
              </button>

              <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-black text-white leading-tight tracking-tight">Zeeshan</span>
                  <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest opacity-80 mt-0.5">Admin</span>
                </div>
                <div className="w-12 h-12 rounded-[1.25rem] glass-panel-light p-1.5 border-white/10 group-hover:border-cyan-500/50 transition-all shadow-xl hover-scale overflow-hidden">
                  <img
                    src="https://ui-avatars.com/api/?name=Zeeshan&background=020408&color=22d3ee&bold=true"
                    alt="Profile"
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto rounded-[2.5rem] relative animate-in custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-5 px-5 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden active:scale-95 ${active
      ? 'text-white bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
      }`}
  >
    {/* Active Indicator Glow */}
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
    )}

    <div className={`transition-all duration-500 transform group-hover:scale-110 ${active ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse' : 'text-slate-500 group-hover:text-cyan-400'
      }`}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>

    <span className={`font-black text-xs font-heading uppercase tracking-[0.15em] transition-all duration-500 ${active ? 'text-white' : 'group-hover:translate-x-1'}`}>
      {label}
    </span>

    {active && (
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 blur-[50px] -z-10"></div>
    )}
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
