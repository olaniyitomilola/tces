// src/components/DropOffForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ← import useNavigate
import { toast } from 'react-toastify';

const DropOffForm = ({
  vehicleId,
  onCancel,
  onDropOff,
  history_id,
  pick_up_mileage, // passed in as a prop
}) => {
  const navigate = useNavigate(); // ← initialize navigate
  
  //───────────────────────────────────────────────────────────────────────────────
  // Local state just for drop-off
  //───────────────────────────────────────────────────────────────────────────────
  const [dropoffType, setDropoffType] = useState('');
  const [mileage, setMileage] = useState('');
  const [toDriverId, setToDriverId] = useState('');
  const [brokenLocation, setBrokenLocation] = useState('');

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  const baseUrl = `http://localhost:4000`;
  const user = JSON.parse(localStorage.getItem('user'));

  //───────────────────────────────────────────────────────────────────────────────
  // Whenever this form mounts, fetch the list of drivers for “transfer”
  //───────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingDrivers(true);
    fetch(`${baseUrl}/api/vehicles/drivers`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load drivers');
        return res.json();
      })
      .then((data) => {
        // filter out current user
        const otherDrivers = data.drivers.filter((d) => d.id !== user.id);
        setDrivers(otherDrivers);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Could not load drivers list');
      })
      .finally(() => {
        setLoadingDrivers(false);
      });
  }, []);

  //───────────────────────────────────────────────────────────────────────────────
  // Validation + submit handler
  //───────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // 1) Must select a dropoffType
    if (!dropoffType) {
      toast.error('Please select a drop-off type');
      return;
    }

    // 2) Validate mileage (always required)
    if (!mileage.trim()) {
      toast.error('Please enter mileage before dropping off');
      return;
    }
    if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      toast.error('Mileage must be a non-negative number');
      return;
    }

    const enteredMileage = Number(mileage);
    const originalPickup = Number(pick_up_mileage);

    // 2.1) Verify drop-off mileage is not less than pick-up mileage
    if (enteredMileage < originalPickup) {
      toast.error(
        `Drop-off mileage (${enteredMileage}) cannot be less than pick-up mileage (${originalPickup}).`
      );
      return;
    }

    // 3) Type-specific validations
    if (dropoffType === 'transfer' && !toDriverId) {
      toast.error('Please select a driver to transfer the van to');
      return;
    }
    if (dropoffType === 'broken' && !brokenLocation.trim()) {
      toast.error('Please enter the broken-down location');
      return;
    }

    // 4) If transferring, look up the selected driver's name
    let toDriverName = '';
    if (dropoffType === 'transfer') {
      const selectedDriver = drivers.find((d) => d.id === toDriverId);
      if (!selectedDriver) {
        toast.error('Selected driver not found');
        return;
      }
      toDriverName = `${selectedDriver.first_name} ${selectedDriver.last_name}`;
    }

    // 5) Build payload (mileage always included)
    const driver = JSON.parse(localStorage.getItem('user'));
    const payload = {
      history_id: history_id,
      driver_id: driver.id,
      vehicle_id: vehicleId,
      type: dropoffType,
      mileage: enteredMileage,
      ...(dropoffType === 'transfer'
        ? { to_driver_id: toDriverId, to_driver_name: toDriverName }
        : {}),
      ...(dropoffType === 'broken' ? { location: brokenLocation.trim() } : {}),
    };

    console.log(payload);

    try {
      const res = await fetch(`${baseUrl}/api/vehicles/dropoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to drop off vehicle');

      toast.success('Drop-off recorded successfully');
      onDropOff?.(payload);
      navigate(-1); // ← navigate back to the previous page
    } catch (err) {
      toast.error('Error during drop-off');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border border-gray-200 rounded-lg shadow-sm text-sm">
      <h3 className="text-sm font-medium text-gray-700">Drop Off Vehicle</h3>

      {/* Drop-Off Type Selector */}
      <div>
        <label className="block text-gray-600 mb-1">Drop-Off Type:</label>
        <select
          value={dropoffType}
          onChange={(e) => {
            setDropoffType(e.target.value);
            // Reset type-specific fields
            setToDriverId('');
            setBrokenLocation('');
          }}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          <option value="">-- Select Type --</option>
          <option value="office">To Office</option>
          <option value="transfer">To Another Driver</option>
          <option value="broken">Broken Down</option>
        </select>
      </div>

      {/* Mileage (always required) */}
      <div>
        <label className="block text-gray-600 mb-1">Mileage at Drop:</label>
        <input
          type="number"
          min="0"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder="Enter current mileage"
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* If “To Another Driver”: show a dropdown */}
      {dropoffType === 'transfer' && (
        <div>
          <label className="block text-gray-600 mb-1">Select Driver:</label>
          {loadingDrivers ? (
            <div className="text-gray-500 text-sm">Loading drivers…</div>
          ) : (
            <select
              value={toDriverId}
              onChange={(e) => setToDriverId(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">-- Choose Driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* If “Broken Down”: show a location input */}
      {dropoffType === 'broken' && (
        <div>
          <label className="block text-gray-600 mb-1">Broken-down Location:</label>
          <input
            type="text"
            value={brokenLocation}
            onChange={(e) => setBrokenLocation(e.target.value)}
            placeholder="Enter location (e.g. “M25 Junction 10”)"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm transition"
        >
          Submit Drop-Off
        </button>
        <button
          onClick={onCancel}
          className="flex items-center justify-center px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm text-sm transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DropOffForm;
