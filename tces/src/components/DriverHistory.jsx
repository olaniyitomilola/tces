// src/components/DriverHistory.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const baseUrl = 'http://localhost:4000';

const DriverHistory = ({ refreshKey }) => {
  const { id: vehicleId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/vehicles/reg/${vehicleId}/history`
      );
      if (!response.ok) throw new Error('Failed to fetch driver history');
      const data = await response.json();

      setHistory(data);
      setError('');
    } catch (err) {
      console.error('Error fetching driver history:', err);
      setError('Unable to load driver history.');
      toast.error('Error loading driver history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [vehicleId, refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 font-semibold">{error}</p>;
  }

  // Find the current (open) entry: dropoff_date === null
  const currentEntry = history.find((entry) => entry.dropoff_date === null);

  // Past entries: those with a dropoff_date
  const pastEntries = history.filter((entry) => entry.dropoff_date !== null);

  return (
    <div className="space-y-6">
      {/* Current Driver Section */}
      {currentEntry ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Current Driver
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Name: </span>
              {currentEntry.driver_name}
            </div>
            <div>
              <span className="font-medium">Pick-Up Date: </span>
              {new Date(currentEntry.pickup_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Pick-Up Mileage: </span>
              {currentEntry.pick_up_mileage ?? '—'}
            </div>
           
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center">Van currently not assigned to anyone.</p>
      )}

      {/* History Table for Past Entries */}
      {pastEntries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Driver
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Pick-Up Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Drop-Off Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Pick-Up Mileage
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Drop-Off Mileage
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
              {pastEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{entry.driver_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.pickup_date
                      ? new Date(entry.pickup_date).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.dropoff_date
                      ? new Date(entry.dropoff_date).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.pick_up_mileage ?? '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.drop_off_mileage ?? '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{entry.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No past driver history available.</p>
      )}
    </div>
  );
};

export default DriverHistory;
