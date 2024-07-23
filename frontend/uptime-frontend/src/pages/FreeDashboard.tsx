import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import './FreeDashboard.css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
 
import Modal from '@/components/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const METRICS_HISTORY_QUERY = gql`
  query MetricsHistory($url: String!) {
    metricsHistory(url: $url) {
      responseTime
      status
    }
  }
`;

const SEND_DEMO_EMAIL = gql`
  mutation SendDemoEmail($email: String!) {
    sendDemoEmail(email: $email)
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
  url: string;
  responseTime: number;
  status: string;
}

function FreeDashboard() {
  const location = useLocation();
  const [url, setUrl] = useState<string | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<MetricsData | null>(null);
  const [email, setEmail] = useState<string>('');
  const [sendDemoEmail] = useMutation(SEND_DEMO_EMAIL);
  const [emailSent, setEmailSent] = useState(false);

  const { data: historyData, loading: historyLoading, error: historyError } = useQuery(METRICS_HISTORY_QUERY, {
    variables: { url },
    skip: !url,
  });
 


  const [getMetrics, { data: metricsData, loading: metricsLoading, error: metricsError }] = useMutation(GET_METRICS_MUTATION);

  useEffect(() => {
    if (location.state && (location.state as { metrics?: { url: string } }).metrics?.url) {
      const url = (location.state as { metrics: { url: string } }).metrics.url;
      setUrl(url);
      getMetrics({ variables: { url } });
    }
  }, [location.state, getMetrics]);

  useEffect(() => {
    if (metricsData && metricsData.getMetrics) {
      setCurrentMetrics(metricsData.getMetrics);
    }
  }, [metricsData]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await sendDemoEmail({ variables: { email } });
      console.log('Email sent successfully');
      setEmailSent(true);
      // Optionally, show a success message or reset the form
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  // Inside the FreeDashboard component, add the following state to manage the modal visibility
 // Initialization of isModalOpen state
const [isModalOpen, setIsModalOpen] = useState(false);

// useEffect to open the modal after 10 seconds
useEffect(() => {
  const timer = setTimeout(() => {
    setIsModalOpen(true);
  }, 10000); 

  return () => clearTimeout(timer);
}, []);
 

  if (metricsLoading || historyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (metricsError || historyError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">
          Error: {metricsError ? metricsError.message : historyError?.message}
        </p>
      </div>
    );
  }

  const calculateAverages = (metricsHistory: MetricsData[]) => {
    const totalResponseTime = metricsHistory.reduce((total, metric) => total + metric.responseTime, 0);
    const upCount = metricsHistory.reduce((count, metric) => count + (metric.status === 'Up' ? 1 : 0), 0);

    const avgResponseTime = metricsHistory.length ? totalResponseTime / metricsHistory.length : 0;
    const avgUpStatus = metricsHistory.length ? (upCount / metricsHistory.length) * 100 : 0;

    return { avgResponseTime, avgUpStatus };
  };

  const { avgResponseTime, avgUpStatus } = calculateAverages(historyData?.metricsHistory || []);

  const chartData = {
    labels: historyData?.metricsHistory.map((_: any, index: number) => `Data ${index + 1}`) || [],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: historyData?.metricsHistory.map((metric: MetricsData) => metric.responseTime) || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
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
        tension: 0.4,
        stepped: true,
      },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-gray-200">
      <div className="pt-20 px-4 fade-in">
        <h3 className="text-3xl font-extrabold mb-6 text-blue-500 text-center">Metrics Dashboard</h3>
        {currentMetrics ? (
          <>
            <h4 className="text-lg font-semibold mb-2 text-center">Current Metrics</h4>
            <div className="flex justify-center mb-6 fade-in">
              <div className="overflow-x-auto">
                <Table className="bg-gray-900 text-gray-200 border border-gray-700">
                  <TableCaption>Website's Current Metrics.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">URL</TableHead>
                      <TableHead>Response Time (ms)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{currentMetrics.url}</TableCell>
                      <TableCell>{currentMetrics.responseTime}</TableCell>
                      <TableCell className={currentMetrics.status === 'Up' ? 'text-green-300' : 'text-red-300'}>
                        {currentMetrics.status}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter></TableFooter>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">No current metrics available.</p>
        )}
        <div className="mb-6 fade-in">
          <h4 className="text-xl font-bold mb-4 text-center">Average Metrics</h4>
          <div className="flex justify-center mb-6 fade-in">
            <div className="overflow-x-auto">
              <Table className="bg-gray-900 text-gray-200 border border-gray-700">
                <TableCaption>Website's Average Metrics.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Average Response Time (ms)</TableHead>
                    <TableHead>Average Up Status (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{avgResponseTime.toFixed(2)}</TableCell>
                    <TableCell>{avgUpStatus.toFixed(2)}%</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
            </div>
          </div>
        </div>
        <div className="mb-6 fade-in">
          <h4 className="text-xl font-bold mb-4 text-center">Response Time History</h4>
          <div className="max-w-3xl mx-auto">
            <Line data={chartData} options={{ maintainAspectRatio: false }} height={200} />
          </div>
        </div>
        <div className="mb-6 fade-in">
          <h4 className="text-xl font-bold mb-4 text-center">Website Status History (Up/Down)</h4>
          <div className="max-w-3xl mx-auto">
            <Line data={statusData} options={{ maintainAspectRatio: false }} height={200} />
          </div>
        </div>
     
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>{!emailSent ? (
        <form onSubmit={handleEmailSubmit} className="w-full max-w-md mx-auto mt-8 fade-in">
          <div className="text-center mb-4">
            <h5 className="text-xl font-bold text-blue-500">Subscribe for a Free Demo</h5>
            <p className="text-sm text-gray-400">Get a free demo sent to your email</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-2"
            />
            <Button type="submit" className="bg-blue-500 text-gray-900 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out px-4 py-2 rounded-lg">
              Subscribe
            </Button>
          </div>
        </form>
         ) : (
          <div className="text-center">
            <h5 className="text-xl font-bold text-green-500">Email Sent!</h5>
            <p className="text-sm text-gray-400">Thank you for subscribing.</p>
          </div>
        )} 
</Modal>;
    </div>
  );
}

export default FreeDashboard;
