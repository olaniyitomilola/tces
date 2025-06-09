// src/components/RecordedIssues.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';

const RecordedIssues = ({ refreshKey }) => {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingIssueId, setUpdatingIssueId] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // ← collapsed by default

  const user = JSON.parse(localStorage.getItem('user'));
  const hasFixAccess = user?.access === 1;

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/vehicles/reg/${id}/issues`);
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const data = await response.json();

      const visibleIssues = hasFixAccess
        ? data
        : data.filter((issue) => !issue.fixed);
      setIssues(visibleIssues);
      setError('');
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchIssues();
    }
  }, [id, refreshKey, isOpen]);

  const handleMarkAsFixed = async (issueId) => {
    try {
      setUpdatingIssueId(issueId);
      const response = await fetch(
        `${baseUrl}/api/vehicles/reg/${id}/issues/${issueId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fixed: true }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update issue');
      }

      await fetchIssues();
    } catch (err) {
      console.error('Error updating issue:', err);
      alert('Failed to mark issue as fixed.');
    } finally {
      setUpdatingIssueId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2 bg-orange-400 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition cursor-pointer"
      >
        {isOpen ? 'Hide Reported Issues' : 'View Reported Issues'}
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <>
          <h3 className="text-xl font-bold text-gray-800">Reported Issues</h3>

          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-orange-600 border-opacity-50"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          ) : issues.length === 0 ? (
            <p className="text-gray-600">No reported issues found.</p>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.issue_id} className="border-b pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-semibold">{issue.description}</p>
                    <span
                      className={`text-xs font-bold ${
                        issue.fixed ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {!issue.fixed ? 'Open' : hasFixAccess ? 'Fixed' : null}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-600">
                    <p>Reported by: {issue.reported_by}</p>
                    <p>Added: {new Date(issue.created_at).toLocaleDateString()}</p>
                  </div>

                  {!issue.fixed && hasFixAccess && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleMarkAsFixed(issue.issue_id)}
                        disabled={updatingIssueId === issue.issue_id}
                        className={`mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded shadow ${
                          updatingIssueId === issue.issue_id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        {updatingIssueId === issue.issue_id ? 'Updating...' : 'Mark as Fixed'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordedIssues;
