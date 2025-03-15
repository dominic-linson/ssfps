import React, { useState, useEffect } from 'react';
import { LogOut, AlertTriangle, Power, RefreshCw, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        ph: +(prev.ph + (Math.random() - 0.5) * 0.1).toFixed(2),
        tds: Math.round(prev.tds + (Math.random() - 0.5) * 5),
        temperature: +(prev.temperature + (Math.random() - 0.5) * 0.2).toFixed(1),
        turbidity: +(prev.turbidity + (Math.random() - 0.5) * 0.1).toFixed(2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterToggle = () => {
    setIsFilterRunning(!isFilterRunning);
    toast.success(isFilterRunning ? 'Filter stopped' : 'Filter started');
  };

  const getStatusColor = (value: number, type: keyof WaterMetrics) => {
    const ranges = {
      ph: { min: 6.5, max: 8.5 },
      tds: { min: 50, max: 250 },
      temperature: { min: 20, max: 30 },
      turbidity: { min: 0, max: 5 },
      filterHealth: { min: 60, max: 100 },
    };

    const range = ranges[type];
    return value >= range.min && value <= range.max ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Water Monitoring System</h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Metrics Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">pH Level</h3>
            <p className={`text-3xl font-bold ${getStatusColor(metrics.ph, 'ph')}`}>
              {metrics.ph}
            </p>
            <p className="text-sm text-gray-500 mt-2">Optimal range: 6.5-8.5</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">TDS (ppm)</h3>
            <p className={`text-3xl font-bold ${getStatusColor(metrics.tds, 'tds')}`}>
              {metrics.tds}
            </p>
            <p className="text-sm text-gray-500 mt-2">Optimal range: 50-250 ppm</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temperature (°C)</h3>
            <p className={`text-3xl font-bold ${getStatusColor(metrics.temperature, 'temperature')}`}>
              {metrics.temperature}
            </p>
            <p className="text-sm text-gray-500 mt-2">Optimal range: 20-30°C</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Turbidity (NTU)</h3>
            <p className={`text-3xl font-bold ${getStatusColor(metrics.turbidity, 'turbidity')}`}>
              {metrics.turbidity}
            </p>
            <p className="text-sm text-gray-500 mt-2">Optimal range: 0-5 NTU</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Health</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-3xl font-bold ${getStatusColor(metrics.filterHealth, 'filterHealth')}`}>
                    {metrics.filterHealth}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${metrics.filterHealth}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    metrics.filterHealth > 60 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
            {metrics.filterHealth < 60 && (
              <div className="mt-4 flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="text-sm">Filter replacement recommended</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Control</h3>
            <button
              onClick={handleFilterToggle}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isFilterRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isFilterRunning ? (
                <>
                  <Power className="h-5 w-5 mr-2" />
                  Stop Filter
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Start Filter
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Status: {isFilterRunning ? 'Running' : 'Stopped'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}