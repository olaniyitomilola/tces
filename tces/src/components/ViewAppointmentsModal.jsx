import React, { useState, useEffect } from 'react';
import { Pencil, Trash, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewAppointmentsModal = ({ garage, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ service: '', appointment_date: '', appointment_time: '' });
  const [filter, setFilter] = useState('upcoming');
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';

  useEffect(() => {
    fetchAppointments();
  }, [garage]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/garage/appointments/${garage.id}`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/garage/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success('Appointment deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete appointment');
    }
  };

  const handleEditClick = (appointment) => {
    setEditing(appointment.id);
    setForm({
      service: appointment.service,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/garage/appointments/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      toast.success('Appointment rescheduled');
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update appointment');
    }
  };

  const now = new Date();
  const filteredAppointments = appointments.filter((a) => {
    const dateTime = new Date(`${a.appointment_date}T${a.appointment_time}`);
    return filter === 'upcoming' ? dateTime >= now : dateTime < now;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[50vh] relative flex flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
          <X />
        </button>
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-lg font-semibold mb-4">Appointments for {garage.name}</h2>

          <div className="flex gap-4 mb-4 text-sm">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 rounded ${filter === 'upcoming' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-3 py-1 rounded ${filter === 'past' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'}`}
            >
              Past
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-sm text-gray-500">No {filter} appointments found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredAppointments.map((a) => {
                const dateTime = new Date(`${a.appointment_date}T${a.appointment_time}`);
                const isPast = dateTime < now;
                const borderColor = isPast ? 'border-gray-300 bg-gray-50' : 'border-green-300 bg-green-50';
                return (
                  <li key={a.id} className={`border rounded p-3 shadow-sm ${borderColor}`}>
                    {editing === a.id ? (
                      <form onSubmit={handleEditSubmit} className="space-y-2">
                        <input
                          type="text"
                          name="service"
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full border rounded px-3 py-2 text-sm"
                          placeholder="Service"
                        />
                        <input
                          type="date"
                          name="appointment_date"
                          value={form.appointment_date}
                          onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <input
                          type="time"
                          name="appointment_time"
                          value={form.appointment_time}
                          onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="px-4 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">Service: {a.service}</p>
                          <p className="text-sm text-gray-600">Date: {new Date(a.appointment_date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Time: {a.appointment_time}</p>
                          <p className="text-sm text-gray-600">Van: {a.van_registration || 'N/A'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(a)} className="text-blue-600 hover:text-blue-800">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentsModal;
