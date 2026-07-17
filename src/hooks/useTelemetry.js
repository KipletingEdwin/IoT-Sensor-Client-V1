
import { useEffect, useState } from 'react';
import { createConsumer } from '@rails/actioncable';

const BACKEND_WS_URL = 'ws://localhost:3000/cable';

export function useTelemetry() {
  const [assets, setAssets] = useState({});

  useEffect(() => {
    const consumer = createConsumer(BACKEND_WS_URL);
    
    const subscription = consumer.subscriptions.create('TelemetryChannel', {
      received(data) {
        // Dynamically update the state for the specific asset ID
        setAssets((prevAssets) => ({
          ...prevAssets,
          [data.asset_id]: data
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, []);

  return Object.values(assets); // Returns an array of real-time asset states
}
