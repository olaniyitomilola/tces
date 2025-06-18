// src/components/AvailableVansDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ChevronDown } from 'lucide-react';

export default function AvailableVansDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New state: which van was clicked, and the entered mileage
  const [selectedVan, setSelectedVan] = useState(null);
  const [mileage, setMileage] = useState('');
  const hasFetchedVans = useRef(false);
  const hasAttemptedFetch = useRef(false)

  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const containerRef = useRef();

  const toggleDropdown = () => {
    if (isOpen) {
      setSelectedVan(null);
      setMileage('');
    }
    setIsOpen(prev => !prev);
  };

  // Fetch available vans when dropdown opens (and we haven't loaded them yet)
  useEffect(() => {
    if (!isOpen || hasFetchedVans.current || hasAttemptedFetch.current) return;
    if (vans.length || loading) return;

    setLoading(true);
    hasAttemptedFetch.current = true
    fetch(`${baseUrl}/api/vehicles/available`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch available vans');
        return res.json();
      })
      .then(data => {
        // assume the endpoint returns { data: [...] }
        setVans(data.data || []);
        hasFetchedVans.current = true;
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('Could not load available vans');
        toast.error('Unable to fetch available vans');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, vans.length, loading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedVan(null);
        setMileage('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVanClick = (van) => {
    setSelectedVan(van);
    setMileage('');
  };

  const handleConfirm = () => {
    if (!mileage.trim()) {
      toast.error('Please enter the mileage');
      return;
    }
    if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      toast.error('Mileage must be a non-negative number');
      return;
    }

    // Pass both van and mileage back to parent
    onSelect({ van: selectedVan, mileage: Number(mileage) });
    // Close and reset
    setIsOpen(false);
    setSelectedVan(null);
    setMileage('');
  };

  const handleCancelSelection = () => {
    setSelectedVan(null);
    setMileage('');
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 bg-white hover:bg-orange-700 text-orange-600 hover:text-white cursor-pointer 
                   text-sm sm:text-base px-3 py-1.5 rounded-md shadow transition"
      >
        Pick Up <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {loading ? (
            <div className="p-2 text-gray-600">Loading…</div>
          ) : error ? (
            <div className="p-2 text-red-600">{error}</div>
          ) : vans.length === 0 ? (
            <div className="p-2 text-gray-600">No vans available.</div>
          ) : selectedVan ? (
            // Show mileage input + confirm/cancel when a van is selected
            <div className="p-4 space-y-3">
              <div className="text-gray-800 font-medium">
                {selectedVan.name} ({selectedVan.registration})
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Enter Mileage:</label>
                <input
                  type="number"
                  min="0"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelSelection}
                  className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            // Show list of vans to choose from
            <ul className="max-h-60 overflow-y-auto">
              {vans.map(van => (
                <li key={van.id}>
                  <button
                    onClick={() => handleVanClick(van)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
                  >
                    {van.name} ({van.registration})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
