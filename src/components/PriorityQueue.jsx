
import { Layers } from "lucide-react";
import React from "react";

const PriorityQueue = ({ assets }) => {
  // Helper mapping function to calculate visual priority indicator badges
  const getRiskColorClasses = (score) => {
    if (score >= 75)
      return {
        border: "border-rose-500/40",
        bg: "bg-rose-950/20",
        text: "text-rose-400",
      };
    if (score >= 45)
      return {
        border: "border-amber-500/40",
        bg: "bg-amber-950/20",
        text: "text-amber-400",
      };
    return {
      border: "border-emerald-500/30",
      bg: "bg-slate-900",
      text: "text-emerald-400",
    };
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl h-fit">
      <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-xs font-mono mb-4">
        <Layers size={14} /> Dynamic Action Priority Queue
      </div>
      <p className="text-xs text-slate-400 leading-relaxed mb-4 font-sans">
        Leaderboard sorts assets automatically. Real-time telemetry processing
        forces high-risk devices to float to the top for proactive engineer
        deployment.
      </p>

      <div className="space-y-2 max-h-150 overflow-y-auto pr-1">
        {assets.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-600 font-mono border border-dashed border-slate-800 rounded-xl">
            Awaiting inbound socket streams...
          </div>
        ) : (
          assets.map((asset, index) => {
            const colors = getRiskColorClasses(asset.riskScore);
            return (
              <div
                key={asset.id}
                className={`p-3 rounded-lg border ${colors.border} ${colors.bg} flex items-center justify-between transition-all duration-300 shadow-sm`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-mono font-bold text-slate-500 w-5">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-200 block truncate font-sans">
                      {asset.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mt-0.5 block">
                      ID: {asset.id}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span
                    className={`text-sm font-mono font-black ${colors.text}`}
                  >
                    {asset.riskScore}%
                  </span>
                  <span className="text-[9px] block text-slate-500 font-bold font-mono tracking-wider uppercase">
                    RISK
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default PriorityQueue;
