import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import PriorityQueue from "../components/PriorityQueue";
import { Download, Zap } from "lucide-react";
import AssetCard from "../components/AssetCard";
import { createConsumer } from "@rails/actioncable";

const Dashboard = () => {
  const [orderedAssets, setOrderedAssets] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const fleetRegistryRef = useRef({});
  const cableConsumerRef = useRef(null);
  const channelSubscriptionRef = useRef(null);

  // Track actual session wall-clock start time
  const sessionStartTimeRef = useRef(null);

  // Updated risk scoring algorithm matching ISO 10816-3 and motor thermal ceilings
  const calculateFailureRiskScore = (telemetry) => {
    const { motor_vibration, internal_temp, current_draw } = telemetry;

    // Industrial boundary parameters
    const limits = { maxVib: 7.0, maxTemp: 78.0, maxCurr: 13.5 };

    // Calculate baseline ratios clamped cleanly to a maximum threshold index of 1.0
    const vibRatio = Math.min(motor_vibration / limits.maxVib, 1.0);
    const tempRatio = Math.min(
      Math.max((internal_temp - 30) / (limits.maxTemp - 30), 0),
      1.0,
    );
    const currRatio = Math.min(current_draw / limits.maxCurr, 1.0);

    // Weighted index prioritising ISO vibration profiles first (40%), thermal (35%), current (25%)
    return Math.round(
      (vibRatio * 0.4 + tempRatio * 0.35 + currRatio * 0.25) * 100,
    );
  };

  useEffect(() => {
    // Note: Adjusted channel string from 'IotTelemetryChannel' to match the Rails backend 'airport_maintenance_stream' identifier
    cableConsumerRef.current = createConsumer("ws://localhost:3000/cable");
    setIsConnected(true);
    sessionStartTimeRef.current = Date.now();

    channelSubscriptionRef.current =
      cableConsumerRef.current.subscriptions.create(
        { channel: "IotTelemetryChannel" },
        {
          received(payload) {
            const {
              asset_id,
              asset_name,
              telemetry,
              state_label,
              hours_until_maintenance,
              timestamp,
            } = payload;

            const riskScore = calculateFailureRiskScore(telemetry);
            const elapsedSeconds =
              (Date.now() - sessionStartTimeRef.current) / 1000;
            const operatingHoursTracker = (elapsedSeconds * 0.025).toFixed(2);
            // 2. Convert the simulated hours float into standard time metrics
            const totalMinutesRemaining = Math.round(
              hours_until_maintenance * 60,
            );
            const countdownDays = Math.floor(totalMinutesRemaining / (24 * 60));
            const countdownHours = Math.floor(
              (totalMinutesRemaining % (24 * 60)) / 60,
            );
            const countdownMinutes = totalMinutesRemaining % 60;

            // 3. Format the display string dynamically
            let dueDisplayString = "";
            if (hours_until_maintenance === 0) {
              dueDisplayString = "OVERDUE (System Degrading)";
            } else if (countdownDays > 0) {
              dueDisplayString = `${countdownDays}d ${countdownHours}h ${countdownMinutes}m`;
            } else {
              dueDisplayString = `${countdownHours}h ${countdownMinutes}m`;
            }

            // Buffer structural properties into mutable ref pointer to block excessive rendering loops
            fleetRegistryRef.current[asset_id] = {
              id: asset_id,
              name: asset_name,
              telemetry,
              operating_hours: operatingHoursTracker,
              riskScore,
              stateLabel: state_label,
              dueDisplay: dueDisplayString,
              isOverdue: hours_until_maintenance === 0,
              lastUpdated: timestamp,
            };
          },
        },
      );

    // Throttled visual render loop ticking every 250ms to align with pipeline updates
    const renderThrottleInterval = setInterval(() => {
      const sortedQueue = Object.values(fleetRegistryRef.current).sort(
        (a, b) => b.riskScore - a.riskScore,
      );
      setOrderedAssets([...sortedQueue]);
    }, 250);

    return () => {
      clearInterval(renderThrottleInterval);
      if (channelSubscriptionRef.current)
        channelSubscriptionRef.current.unsubscribe();
      if (cableConsumerRef.current) cableConsumerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
      <Header isConnected={isConnected} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <PriorityQueue assets={orderedAssets} />
        </div>

        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs font-mono">
              <Zap size={14} /> Active Fleet Operations Grid
            </div>
            {/* <div>
              <button className="text-xs cursor-pointer border border-slate-800 p-2 rounded-xl bg-slate-900 flex items-center justify-center gap-1.5">
                <Download /> Export CSV
              </button>
            </div> */}
            <a
              href="http://localhost:3000/download_csv"
              download
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
            >
              Export CSV
            </a>
          </div>

          {orderedAssets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500 font-mono">
              Connecting to web socket data-negotiator...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderedAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
