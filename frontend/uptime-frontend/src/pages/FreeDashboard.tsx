import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface MetricsData {
  id: string;
  status: string;
  responseTime: number;
}

function FreeDashboard() {
  const location = useLocation();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  useEffect(() => {
    if (location.state && (location.state as { metrics?: MetricsData }).metrics) {
      setMetrics((location.state as { metrics: MetricsData }).metrics);
    }
  }, [location.state]);

  if (!metrics) return <p>No metrics data available.</p>;

  return (
    <div>
      <h3>Metrics Dashboard</h3>
      <p>ID: {metrics.id}</p>
      <p>Status: {metrics.status}</p>
      <p>Response Time: {metrics.responseTime} ms</p>
    </div>
  );
}

export default FreeDashboard;
