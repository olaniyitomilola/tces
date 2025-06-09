// src/pages/VanDetails.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopSummary from '../components/TopSummary';
import RecordedIssues from '../components/RecordedIssues';
import DriverHistory from '../components/DriverHistory'; // ← import the new component
import { ArrowLeft } from 'lucide-react';

const VanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vans = JSON.parse(localStorage.getItem('vans')) || [];
  const van = vans.find((v) => v.id === id);

  // A key to trigger re-fetch in both RecordedIssues and DriverHistory
  const [refreshKey, setRefreshKey] = useState(0);

  if (!van) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Van List
          </button>
        </div>

        <h2 className="text-2xl font-bold text-red-600">Van not found</h2>
      </div>
    );
  }

  // Whenever an issue is reported or a drop-off happens, bump refreshKey:
  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="p-4 space-y-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Van List
        </button>
      </div>

      <TopSummary
        registration={van.registration}
        lastMileage={van.last_mileage}
      />

      <div className="space-y-6">
        <RecordedIssues refreshKey={refreshKey} />
        <DriverHistory refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default VanDetails;
