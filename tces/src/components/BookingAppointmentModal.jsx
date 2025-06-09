import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const BookAppointmentModal = ({ garage, onClose }) => {
  const [vanId, setVanId] = useState('');
  const [service, setService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [vans, setVans] = useState([]);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vans');
        const data = await response.json();
        setVans(data);
      } catch (err) {
        console.error('Error loading vans:', err);
      }
    };

    fetchVans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const selectedDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (selectedDateTime < now) {
      setError('You cannot select a past date or time.');
      return;
    }

    if (!vanId || !service || !appointmentDate || !appointmentTime) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/garage/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          van_id: vanId,
          garage_id: garage.id,
          service,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime
        })
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      toast.success('Appointment booked successfully');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Could not book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Book Appointment at {garage.name}</h2>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={vanId}
            onChange={(e) => setVanId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Van</option>
            {vans.map((van) => (
              <option key={van.id} value={van.id}>
                {van.registration}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Service Description"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={today}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
