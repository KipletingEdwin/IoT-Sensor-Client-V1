import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import React from "react";

const AssetCard = ({ asset }) => {
  // 1. Unified function maps styling tokens dynamically based on the explicit state label
  const getStateConfiguration = (stateLabel) => {
    switch (stateLabel) {
      case "Failure":
        return {
          text: "text-rose-400",
          ring: "ring-1 ring-rose-500/30",
          icon: <ShieldAlert size={12} />,
          statusText: "Critical Failure Zone",
          badge: "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
        };
      case "Degradation":
        return {
          text: "text-amber-400",
          ring: "ring-1 ring-amber-500/20",
          icon: <AlertTriangle size={12} />,
          statusText: "Degradation Warning",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/20"
        };
      case "Normal":
      default:
        return {
          text: "text-emerald-400",
          ring: "",
          icon: <CheckCircle2 size={12} />,
          statusText: "Component Healthy",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        };
    }
  };

  // Extract precise style parameters according to state machine values
  const config = getStateConfiguration(asset.stateLabel);

  return (
    <div
      className={`p-5 rounded-xl border border-slate-800 bg-slate-900 shadow-md flex flex-col justify-between transition-all relative overflow-hidden ${config.ring}`}
    >
      {/* Upper Registry Grid: Displays Name, IDs, and Risk Percentages */}
      <div className="flex justify-between items-start mb-4">
        <div className="truncate pr-2">
          <h3 className="text-sm font-bold text-white tracking-tight truncate font-sans">
            {asset.name}
          </h3>
          <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
            Asset ID: {asset.id}
          </span>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end">
          <span
            className={`text-xl font-mono font-black leading-none ${config.text}`}
          >
            {asset.riskScore}%
          </span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono mt-1">
            Failure Risk
          </span>
        </div>
      </div>

      {/* Telemetry Sensor Dashboard Window */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 border border-slate-800/60 rounded-xl mb-4 text-xs font-mono">
        <div>
          <span className="text-[9px] block text-slate-500 font-bold uppercase">
            Vibration
          </span>
          <span className="text-slate-200 font-bold">
            {asset.telemetry.motor_vibration}{" "}
            <span className="text-slate-500 text-[10px]">mm/s</span>
          </span>
        </div>
        <div>
          <span className="text-[9px] block text-slate-500 font-bold uppercase">
            Internal Temp
          </span>
          <span className="text-slate-200 font-bold">
            {asset.telemetry.internal_temp}{" "}
            <span className="text-slate-500 text-[10px]">°C</span>
          </span>
        </div>
        <div>
          <span className="text-[9px] block text-slate-500 font-bold uppercase">
            Current Draw
          </span>
          <span className="text-slate-200 font-bold">
            {asset.telemetry.current_draw}{" "}
            <span className="text-slate-500 text-[10px]">A</span>
          </span>
        </div>
      </div>

{/* Lower Metrics Section: Tracks ongoing life hours and maintenance countdowns */}
<div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2 text-[11px] font-mono">
  
  {/* Row 1: Running Hours */}
  {/* <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 text-center">
    Simulated Runtime: <strong>{asset.operating_hours} hrs</strong>
  </div> */}

  {/* Row 2: Dynamic Maintenance Countdown Badge */}
  <div 
    className={`px-2 py-1 rounded text-[10px] font-bold border text-center ${
      asset.isOverdue 
        ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-bounce" 
        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
    }`}
  >
    <span>
      Maintenance Due in: <strong>{asset.dueDisplay}</strong>
    </span>
  </div>

</div>


      {/* Bottom Container: Displays Ground Truth Labels from Simulator */}
      <div className={`mt-4 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 px-3 rounded-lg border font-mono tracking-wide uppercase ${config.badge}`}>
        <div className="flex items-center gap-1">
          {config.icon}
          <span className={asset.stateLabel === "Failure" ? "font-black" : "font-semibold"}>
            {config.statusText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
