import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@apollo/client";
import { GET_METRICS } from "@/mutations";
import { useNavigate } from "react-router-dom";

interface MetricsData {
  id: string;
  status: string;
  responseTime: number;
}

function WebChecker() {
  const [url, setUrl] = useState<string>('');
  const navigate = useNavigate();

  const [getMetrics, { data, loading, error }] = useMutation<{ getMetrics: MetricsData }>(GET_METRICS);

  const handleCheck = async () => {
    if (url.trim() === '') return; // Ensure URL is not empty
    try {
      const { data } = await getMetrics({ variables: { url } });
      // Navigate to the new page after successful data retrieval
      navigate('/freeDashboard', { state: { metrics: data?.getMetrics } });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm space-y-8">
      <Input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button type="button" onClick={handleCheck} variant="outline">
        Check Status
      </Button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default WebChecker;
