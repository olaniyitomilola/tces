import React, { useState, useEffect } from 'react';
import { PlusCircle, X, Pencil, Trash } from 'lucide-react';
import BookAppointmentModal from './BookingAppointmentModal';
import ViewAppointmentsModal from './ViewAppointmentsModal';
import toast from 'react-hot-toast';

const Garage = () => {
  const [garages, setGarages] = useState([]);
  const [newGarage, setNewGarage] = useState({ name: '', address: '', phone: '' });
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingGarage, setBookingGarage] = useState(null);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [viewingAppointments, setViewingAppointments] = useState(false);
  const [editingGarage, setEditingGarage] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/garage`);
      if (!response.ok) throw new Error('Failed to fetch garages');
      const data = await response.json();
      setGarages(data);
    } catch (err) {
      console.error('Error fetching garages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewGarage({ ...newGarage, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const validateInput = () => {
    if (!newGarage.name.trim() || !newGarage.address.trim() || !newGarage.phone.trim()) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (!/\+?\d{7,15}/.test(newGarage.phone.trim())) {
      setErrorMessage('Enter a valid contact number.');
      return false;
    }
    return true;
  };

  const handleAddGarage = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      const url = editingGarage
        ? `${baseUrl}/api/garage/${editingGarage.id}`
        : '${baseUrl}/api/garage';
      const method = editingGarage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGarage)
      });

      if (!response.ok) throw new Error('Failed to save garage');

      const savedGarage = await response.json();

      if (editingGarage) {
        setGarages((prev) =>
          prev.map((g) => (g.id === editingGarage.id ? savedGarage : g))
        );
        toast.success('Garage updated successfully');
      } else {
        setGarages([savedGarage, ...garages]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }

      setNewGarage({ name: '', address: '', phone: '' });
      setShowForm(false);
      setEditingGarage(null);
    } catch (error) {
      console.error('Error saving garage:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleEdit = (garage) => {
    setNewGarage({ name: garage.name, address: garage.address, phone: garage.phone });
    setEditingGarage(garage);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this garage?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/garage/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete garage');
      setGarages((prev) => prev.filter((g) => g.id !== id));
      toast.success('Garage deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting garage');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Garages</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewGarage({ name: '', address: '', phone: '' });
            setEditingGarage(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer text-sm font-medium rounded-md shadow-sm transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add New Garage'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGarage} className="space-y-4 bg-white p-4 rounded-md shadow border">
          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
          <input
            type="text"
            name="name"
            value={newGarage.name}
            onChange={handleChange}
            placeholder="Garage Name"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="text"
            name="address"
            value={newGarage.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="text"
            name="phone"
            value={newGarage.phone}
            onChange={handleChange}
            placeholder="Contact Number (e.g. +1234567890)"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingGarage(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-sm font-medium rounded-md shadow-sm transition-all"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer text-sm font-medium rounded-md shadow-sm transition-all"
            >
              {editingGarage ? 'Update Garage' : 'Save Garage'}
            </button>
          </div>
        </form>
      )}

      {showToast && (
        <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-600 text-white px-4 py-2 rounded shadow-md animate-fadeIn">
          Garage added successfully!
        </div>
      )}

      {loading ? (
        <div className="text-center text-sm text-gray-500 py-4">Loading garages...</div>
      ) : garages.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-4">No garages available.</div>
      ) : (
        garages.map((garage) => (
          <div
            key={garage.id}
            className="border p-4 rounded-md shadow-sm hover:shadow-md transition bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
              {garage.name}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(garage)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(garage.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </h3>
            <p className="text-sm text-gray-600">Address: {garage.address}</p>
            <p className="text-sm text-gray-600 mb-2">Contact: {garage.phone}</p>
            <div className="flex gap-3">
              <button
                className="px-4 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer text-sm rounded shadow-sm"
                onClick={() => {
                  setSelectedGarage(garage);
                  setViewingAppointments(true);
                }}
              >
                View Appointments
              </button>
              <button
                className="px-4 py-1 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer text-sm rounded shadow-sm"
                onClick={() => setBookingGarage(garage)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))
      )}

      {bookingGarage && (
        <BookAppointmentModal
          garage={bookingGarage}
          onClose={() => {
            setBookingGarage(null);
            fetchGarages();
          }}
        />
      )}

      {viewingAppointments && selectedGarage && (
        <ViewAppointmentsModal
          garage={selectedGarage}
          onClose={() => {
            setViewingAppointments(false);
            setSelectedGarage(null);
            fetchGarages();
          }}
        />
      )}
    </div>
  );
};

export default Garage;
