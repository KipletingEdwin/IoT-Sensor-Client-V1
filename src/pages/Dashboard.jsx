import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import PriorityQueue from "../components/PriorityQueue";
import { Zap } from "lucide-react";
import AssetCard from "../components/AssetCard";
import { createConsumer } from "@rails/actioncable";

const Dashboard = () => {
  const [orderedAssets, setOrderedAssets] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const fleetRegistryRef = useRef({});
  const cableConsumerRef = useRef(null);
  const channelSubscriptionRef = useRef(null);

  const calculateFailureRiskScore = (telemetry) => {
    const { motor_vibration, internal_temp, current_draw, processing_latency } =
      telemetry;
    const limits = { vib: 7.5, temp: 82.0, curr: 14.0, lat: 165.0 };

    const vibRatio = Math.min(motor_vibration / limits.vib, 1.0);
    const tempRatio = Math.min((internal_temp - 20) / (limits.temp - 20), 1.0);
    const currRatio = Math.min(current_draw / limits.curr, 1.0);
    const latRatio = Math.min(processing_latency / limits.lat, 1.0);

    return Math.round(
      (vibRatio * 0.3 + tempRatio * 0.3 + currRatio * 0.2 + latRatio * 0.2) *
        100,
    );
  };

  useEffect(() => {
    cableConsumerRef.current = createConsumer("ws://localhost:3000/cable");
    setIsConnected(true);

    channelSubscriptionRef.current =
      cableConsumerRef.current.subscriptions.create(
        { channel: "IotTelemetryChannel" },
        {
          // Find the received(payload) block inside src/pages/Dashboard.jsx and replace it with this logic:
          received(payload) {
            const {
              asset_id,
              asset_name,
              telemetry,
              operating_hours,
              service_lifetime_limit,
              failure_imminent_label,
              timestamp,
            } = payload;
            const riskScore = calculateFailureRiskScore(telemetry);

            // Extract the unique device-specific threshold limit directly from the payload frame
            const hoursRemaining = Math.max(
              service_lifetime_limit - operating_hours,
              0,
            );

            // Real-Clock Time Conversion: Break hours down into distinct Days, Hours, and Minutes counters
            const totalMinutesRemaining = Math.round(hoursRemaining * 60);
            const countdownDays = Math.floor(totalMinutesRemaining / (24 * 60));
            const countdownHours = Math.floor(
              (totalMinutesRemaining % (24 * 60)) / 60,
            );
            const countdownMinutes = totalMinutesRemaining % 60;

            // Construct a readable, deterministic timeline countdown string
            const dueDisplayString =
              countdownDays > 0
                ? `${countdownDays}d ${countdownHours}h ${countdownMinutes}m`
                : `${countdownHours}h ${countdownMinutes}m`;

            fleetRegistryRef.current[asset_id] = {
              id: asset_id,
              name: asset_name,
              telemetry,
              operating_hours: operating_hours.toFixed(2),
              dueDisplay: dueDisplayString, // Injects custom ticker into the card slot
              riskScore,
              groundTruthLabel: failure_imminent_label,
              lastUpdated: timestamp,
            };
          },
        },
      );

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

  const handleResetMetrics = () => {
    fleetRegistryRef.current = {};
    setOrderedAssets([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
      <Header isConnected={isConnected} onReset={handleResetMetrics} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <PriorityQueue assets={orderedAssets} />
        </div>

        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs font-mono">
            <Zap size={14} /> Active Fleet Operations Grid
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
