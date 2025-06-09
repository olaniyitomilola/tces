import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TopSummary from '../../components/TopSummary';
import InfoSection from '../../components/InfoSection';
import RecordedIssues from '../../components/RecordedIssues';
import { ArrowLeft } from 'lucide-react';
import VanActions from '../../components/VanActions';

const StaffVanDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const van = location.state?.van;


  const [refreshKey, setRefreshKey] = useState(0);

  const handleReportSubmit = () => {
    setRefreshKey((prev) => prev + 1); // Trigger re-fetch in RecordedIssues
  };

  if (!van) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-red-600">Van not found</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <TopSummary registration={van.registration} lastMileage={van.last_mileage} />
      <VanActions id={van.id} onReportSubmit={handleReportSubmit} history_id={van.history_id} pick_up_mileage={van.last_mileage} />
      <RecordedIssues refreshKey={refreshKey} />
    </div>
  );
};

export default StaffVanDetails;
