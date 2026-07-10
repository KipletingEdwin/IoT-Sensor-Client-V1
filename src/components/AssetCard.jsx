
import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import React from "react";

const AssetCard = ({ asset }) => {
  const getRiskColorClasses = (score) => {
    if (score >= 75)
      return {
        text: "text-rose-400",
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      };
    if (score >= 45)
      return {
        text: "text-amber-400",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    return {
      text: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  };

  const styleMap = getRiskColorClasses(asset.riskScore);
  const isHighRisk = asset.riskScore >= 75;

  return (
    <div
      className={`p-5 rounded-xl border border-slate-800 bg-slate-900 shadow-md flex flex-col justify-between transition-all relative overflow-hidden ${
        isHighRisk ? "ring-1 ring-rose-500/20" : ""
      }`}
    >
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
            className={`text-xl font-mono font-black leading-none ${styleMap.text}`}
          >
            {asset.riskScore}%
          </span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono mt-1">
            Failure Risk
          </span>
        </div>
      </div>

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
        <div>
          <span className="text-[9px] block text-slate-500 font-bold uppercase">
            Latency
          </span>
          <span className="text-slate-200 font-bold">
            {asset.telemetry.processing_latency}{" "}
            <span className="text-slate-500 text-[10px]">ms</span>
          </span>
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={13} className="text-slate-500" />
          <span>
            Total Run:{" "}
            <strong className="text-slate-300 font-bold">
              {asset.operating_hours}h
            </strong>
          </span>
        </div>
        <div
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${asset.operating_hours >= 90 ? "bg-rose-500/10 text-rose-400" : "bg-sky-500/10 text-sky-400"}`}
        >
          <span>
            Due in: <strong>{asset.dueDisplay}</strong>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800/60 font-mono tracking-wide uppercase">
        {asset.groundTruthLabel === 1 ? (
          <div className="text-rose-400 flex items-center gap-1 animate-pulse">
            <ShieldAlert size={12} />{" "}
            <span className="font-black">Imminent Failure Zone</span>
          </div>
        ) : (
          <div className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} />{" "}
            <span className="font-semibold">Component Healthy</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
