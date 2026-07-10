
import { LayoutDashboard, RefreshCcw } from "lucide-react";
import React from "react";

const Header = ({ isConnected, onReset }) => {
  return (
    <header className="mb-8 border-b border-slate-900 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-xs ">
          <LayoutDashboard size={14} /> Heathrow Airport Holdings 
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">
          Intelligent Predictive Maintenance (PdM) Control Center
        </h1>
      </div>

      <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 px-5 py-3 rounded-xl shadow-lg">
        <div>
          <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
            Stream Connection
          </span>
          <span className="text-sm font-bold mt-0.5 flex items-center justify-center gap-1.5 text-emerald-400 font-mono">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}
            ></span>
            {isConnected ? "LIVE_STREAM_ACTIVE" : "OFFLINE"}
          </span>
        </div>
        <div className="w-px h-8 bg-slate-800"></div>
        <button
          onClick={onReset}
          className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-all cursor-pointer"
          title="Reset Local Registry View"
        >
          <RefreshCcw size={14} />
        </button>
      </div>
    </header>
  );
};

export default Header;
