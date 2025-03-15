import React, { useState, useEffect } from 'react';
import { LogOut, AlertTriangle, Power, RefreshCw, Droplets } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WaterMetrics {
  ph: number;
  tds: number;
  temperature: number;
  turbidity: number;
  filterHealth: number;
}

export default function Dashboard() {
  const { signOut } = useAuth();
  const [isFilterRunning, setIsFilterRunning] = useState(false);
  const [metrics, setMetrics] = useState<WaterMetrics>({
    ph: 7.2,
    tds: 150,
    temperature: 25,
    turbidity: 2.4,
    filterHealth: 85,
  });

  const [dataHistory, setDataHistory] = useState<number[][]>([[], [], [], []]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = {
        ph: +(metrics.ph + (Math.random() - 0.5) * 0.1).toFixed(2),
        tds: Math.round(metrics.tds + (Math.random() - 0.5) * 5),
        temperature: +(metrics.temperature + (Math.random() - 0.5) * 0.2).toFixed(1),
        turbidity: +(metrics.turbidity + (Math.random() - 0.5) * 0.1).toFixed(2),
        filterHealth: Math.max(0, metrics.filterHealth - (isFilterRunning ? 0.2 : 0)),
      };

      setMetrics(newMetrics);

      // Update data history for the graph
      setDataHistory((prev) => [
        [...prev[0], newMetrics.ph].slice(-10),
        [...prev[1], newMetrics.tds].slice(-10),
        [...prev[2], newMetrics.temperature].slice(-10),
        [...prev[3], newMetrics.turbidity].slice(-10),
      ]);

      setTimeLabels((prev) => [...prev, new Date().toLocaleTimeString()].slice(-10));
    }, 5000);

    return () => clearInterval(interval);
  }, [isFilterRunning, metrics]);

  const handleFilterToggle = () => {
    setIsFilterRunning(!isFilterRunning);
    toast.success(isFilterRunning ? 'Filter stopped' : 'Filter started');
  };

  // Graph data configuration
  const graphData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'pH Level',
        data: dataHistory[0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'TDS (ppm)',
        data: dataHistory[1],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Temperature (°C)',
        data: dataHistory[2],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Turbidity (NTU)',
        data: dataHistory[3],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  // Graph options
  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12, font: { size: 10 } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 10 } },
      },
      x: {
        ticks: { font: { size: 10 } },
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 1.5 },
      point: { radius: 2 },
    },
  };

  const getStatusColor = (value: number, min: number, max: number) =>
    value >= min && value <= max ? 'text-green-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Water Monitoring System</h1>
            </div>
            <button onClick={signOut} className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-Time Graph */}
          <div className="bg-white rounded-lg shadow p-6 col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Water Metrics</h2>
            <div style={{ height: '300px', maxHeight: '300px' }}>  {/* Adjusted graph height */}
              <Line data={graphData} options={graphOptions} />
            </div>
          </div>

          {/* Metric Blocks */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'pH Level', value: metrics.ph, min: 6.5, max: 8.5 },
              { label: 'TDS (ppm)', value: metrics.tds, min: 50, max: 250 },
              { label: 'Temperature (°C)', value: metrics.temperature, min: 20, max: 30 },
              { label: 'Turbidity (NTU)', value: metrics.turbidity, min: 0, max: 5 },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900">{metric.label}</h3>
                <p className={`text-3xl font-bold ${getStatusColor(metric.value, metric.min, metric.max)}`}>
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500">Optimal: {metric.min} - {metric.max}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Control */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Control</h3>
          <button onClick={handleFilterToggle} className="w-full py-2 text-white rounded-md shadow-md bg-blue-600 hover:bg-blue-700">
            {isFilterRunning ? 'Stop Filter' : 'Start Filter'}
          </button>
          <p className="text-gray-500 mt-2">Status: {isFilterRunning ? 'Running' : 'Stopped'}</p>
        </div>
      </main>
    </div>
  );
}
