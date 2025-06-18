// src/components/VanActions.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DropOffForm from './DropOffForm';

const VanActions = ({ onReportSubmit, onDropOff, id, history_id, pick_up_mileage }) => {
  const [mode, setMode] = useState('');
  const [issue, setIssue] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  const handleCancelAll = () => {
    setMode('');
    setIssue('');
  };

  const handleSubmitIssue = async () => {
    if (!issue.trim()) {
      toast.error('Please fill in the issue description');
      return;
    }
    const driver = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch(`${baseUrl}/api/vehicles/reg/${id}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: issue.trim(),
          driver_id: driver.id,
        }),
      });
      if (!res.ok) throw new Error('Failed to report issue');

      toast.success('Issue reported successfully');
      onReportSubmit?.({ description: issue.trim(), driver_id: driver.id });
      handleCancelAll();
    } catch (err) {
      toast.error('Error reporting issue');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 mt-6 mb-6">
      {mode === '' && (
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setMode('report')}
            className="flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm text-sm transition cursor-pointer"
          >
            Report Issue
          </button>

          <button
            onClick={() => setMode('dropoff')}
            className="flex items-center justify-center cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm transition"
          >
            Drop Off
          </button>
        </div>
      )}

      {mode === 'report' && (
        <div className="space-y-3 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Report an Issue</h3>
          <textarea
            rows={3}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSubmitIssue}
              className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm transition"
            >
              Send Report
            </button>
            <button
              onClick={handleCancelAll}
              className="flex items-center justify-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {mode === 'dropoff' && (
        <DropOffForm
          vehicleId={id}
          history_id={history_id}
          pick_up_mileage={pick_up_mileage}
          onCancel={handleCancelAll}
          onDropOff={(payload) => {
            onDropOff?.(payload);
            handleCancelAll();
          }}
        />
      )}
    </div>
  );
};

export default VanActions;
