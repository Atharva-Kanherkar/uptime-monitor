 // src/components/FreeDashboard.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './navbar';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const METRICS_HISTORY_QUERY = gql`
  query MetricsHistory($url: String!) {
    metricsHistory(url: $url) {
      responseTime
      status
    }
  }
`;

const GET_METRICS_MUTATION = gql`
  mutation GetMetrics($url: String!) {
    getMetrics(url: $url) {
      responseTime
      status
      url
    }
  }
`;

interface MetricsData {
  url : string;
  responseTime: number;
  status: string;
}

function FreeDashboard() {
  const location = useLocation();
  const [url, setUrl] = useState<string | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<MetricsData | null>(null);

  const { data: historyData, loading: historyLoading, error: historyError } = useQuery(METRICS_HISTORY_QUERY, {
    variables: { url },
    skip: !url,
  });

  const [getMetrics, { data: metricsData, loading: metricsLoading, error: metricsError }] = useMutation(GET_METRICS_MUTATION);

  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state && (location.state as { metrics?: { url: string } }).metrics?.url) {
      const url = (location.state as { metrics: { url: string } }).metrics.url;
      setUrl(url);
      getMetrics({ variables: { url } });
    }
  }, [location.state, getMetrics]);

  useEffect(() => {
    console.log('URL:', url);
  }, [url]);

  useEffect(() => {
    console.log('Metrics Data:', metricsData);
    if (metricsData && metricsData.getMetrics) {
      setCurrentMetrics(metricsData.getMetrics);
    }
  }, [metricsData]);

  useEffect(() => {
    console.log('History Data:', historyData);
  }, [historyData]);

  if (metricsLoading || historyLoading) return <p>Loading...</p>;
  if (metricsError) return <p>Error: {metricsError.message}</p>;
  if (historyError) return <p>Error: {historyError.message}</p>;

  const chartData = {
    labels: historyData?.metricsHistory.map((_: any, index: number) => `Data Point ${index + 1}`) || [],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: historyData?.metricsHistory.map((metric: MetricsData) => metric.responseTime) || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const statusData = {
    labels: historyData?.metricsHistory.map((_: any, index: number) => `Data Point ${index + 1}`) || [],
    datasets: [
      {
        label: 'Status',
        data: historyData?.metricsHistory.map((metric: MetricsData) => (metric.status === 'Up' ? 1 : 0)) || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
        stepped: true,
      },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="-mt-16">
        <Navbar />
      </div>
      <div className="pt-4 px-4">
        <h3 className="text-3xl font-extrabold mb-6 text-blue-500">Metrics Dashboard</h3>
        {currentMetrics ? (
              <> <h4 className="text-lg font-semibold mb-2">Current Metrics</h4>
              <div className="overflow-x-auto">
                <table className="w-auto bg-gray-900 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-800 text-gray-200 text-sm">
                      <th className="p-2">URL</th>
                      <th className="p-2">Response Time</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-700 transition-colors duration-300 text-sm">
                      <td className="p-2">{currentMetrics.url}</td>
                      <td className="p-2">{currentMetrics.responseTime} ms</td>
                      <td className={`p-2 ${currentMetrics.status === 'Up' ? 'text-green-300' : 'text-red-300'}`}>
                        {currentMetrics.status}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              </>
        ) : (
          <p>No current metrics available.</p>
        )}
        <div className="mb-6">
          <h4 className="text-xl font-bold mb-4">Response Time History</h4>
          <div className="max-w-3xl mx-auto">
            <Line data={chartData} options={{ maintainAspectRatio: false }} height={200} />
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Website Status History (Up/Down)</h4>
          <div className="max-w-3xl mx-auto">
            <Line data={statusData} options={{ maintainAspectRatio: false }} height={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreeDashboard;
