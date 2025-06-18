import React, { useState } from 'react';

const AddNewVan = ({ onVanAdded }) => {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedVan, setFetchedVan] = useState(null);
  const [currentMileage, setCurrentMileage] = useState('');
  const [mileageError, setMileageError] = useState('');
  const [error, setError] = useState('');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;


  const handleFetchVan = async (e) => {
    e.preventDefault();
    if (!plate) return;

    const localVans = JSON.parse(localStorage.getItem('vans')) || [];
    const vanExists = localVans.some((v) => v.registration.toUpperCase() === plate.toUpperCase());

    if (vanExists) {
      setError('Vehicle already exists in your system.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${baseUrl}/api/vehicles/reg/${plate}`);
      if (!response.ok) throw new Error('Vehicle not found');
      const data = await response.json();
      setFetchedVan(data);
    } catch (err) {
      console.error(err);
      setError('Vehicle not found. Please check the registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVan = async () => {
    if (fetchedVan && !mileageError && currentMileage) {
      try {
        const payload = {
          ...fetchedVan,
          last_mileage: parseInt(currentMileage, 10) || 0,
        };

        const response = await fetch(`${baseUrl}/api/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to save vehicle');

        const vansResponse = await fetch(`${baseUrl}/api/vehicles`);
        const updatedVans = await vansResponse.json();
        localStorage.setItem('vans', JSON.stringify(updatedVans));

        setFetchedVan(null);
        setPlate('');
        setCurrentMileage('');
        setMileageError('');
        onVanAdded();
      } catch (error) {
        console.error('Error saving vehicle:', error);
        alert('Something went wrong while saving or refreshing the vehicles.');
      }
    }
  };

  const handleCancel = () => {
    setFetchedVan(null);
    setPlate('');
    setCurrentMileage('');
    setMileageError('');
  };

  const handleMileageChange = (e) => {
    const value = e.target.value;
    setCurrentMileage(value);

    if (!value) {
      setMileageError('Mileage is required');
    } else if (parseInt(value, 10) <= 0) {
      setMileageError('Mileage must be greater than 0');
    } else if (parseInt(value, 10) > 1000000) {
      setMileageError('Mileage must be less than 1,000,000');
    } else {
      setMileageError('');
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <form onSubmit={handleFetchVan} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="Enter Plate Number"
          className="bg-yellow-300 text-black font-bold text-center px-4 py-3 rounded-md w-full text-lg tracking-widest uppercase shadow-inner placeholder-gray-600 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded shadow disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="text-center text-sm text-red-600 font-medium">{error}</div>
      )}

      {fetchedVan && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 border">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{fetchedVan.name}</h3>
            <p className="text-sm text-gray-500">Is this your vehicle?</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Current Mileage</label>
            <input
              type="number"
              id="mileage"
              placeholder="Enter Current Mileage"
              className={`w-full px-4 py-2 border rounded ${mileageError ? 'border-red-500' : 'border-gray-300'}`}
              value={currentMileage}
              onChange={handleMileageChange}
              required
            />
            {mileageError && (
              <p className="text-xs text-red-500">{mileageError}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddVan}
              disabled={!currentMileage || mileageError}
              className={`px-5 py-2 text-white text-sm font-medium rounded shadow-sm ${
                (!currentMileage || mileageError)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Add Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewVan;
