import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

const StaffEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const staffList = JSON.parse(localStorage.getItem('staff')) || [];
  const staffMember = staffList.find((s) => s.id === id);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({ ...staffMember });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedList = staffList.map((s) => (s.id === form.id ? form : s));
    localStorage.setItem('staff', JSON.stringify(updatedList));
    navigate('/manager-dashboard/staff');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Role" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="text" name="nin" value={form.nin} onChange={handleChange} placeholder="NIN" className="px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" className="col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm" />
        <select name="employment_type" value={form.employment_type} onChange={handleChange} className="col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_driver" checked={form.is_driver} onChange={handleChange} /> Driver
        </label>
        {form.is_driver && (
          <input type="text" name="license_number" value={form.license_number} onChange={handleChange} placeholder="License Number" className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full" />
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="has_pts" checked={form.has_pts} onChange={handleChange} /> Has PTS
        </label>
        {form.has_pts && (
          <input type="text" name="pts_number" value={form.pts_number} onChange={handleChange} placeholder="PTS Number" className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full" />
        )}
      </div>

      <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <legend className="font-semibold col-span-full text-sm text-orange-700 mb-1">Tickets</legend>
        {[
  'ticket_coss',
  'ticket_es',
  'ticket_mc',
  'ticket_points',
  'ticket_lxa',
  'ticket_dumper',
  'ticket_roller',
  'ticket_small_tools',
  'ticket_hand_trolley'
].map((ticket) => (
  <label key={ticket} className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      name={ticket}
      checked={form[ticket]}
      onChange={handleChange}
    />
    {ticket.replace('ticket_', '').replace(/_/g, ' ').toUpperCase()}
  </label>
))}

      </fieldset>

      <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <legend className="font-semibold col-span-full text-sm text-orange-700 mb-1">Job Types</legend>
        {['jobtype_civils', 'jobtype_surveying', 'jobtype_hbe', 'jobtype_management'].map((job) => (
          <label key={job} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={job}
              checked={form[job]}
              onChange={handleChange}
            />
            {job.replace('jobtype_', '').toUpperCase()}
          </label>
        ))}
      </fieldset>

      <fieldset className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <legend className="font-semibold col-span-full text-sm text-orange-700 mb-1">Availability</legend>
        {['available_monday', 'available_tuesday', 'available_wednesday', 'available_thursday', 'available_friday', 'available_saturday', 'available_sunday'].map((day) => (
          <label key={day} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={day}
              checked={form[day]}
              onChange={handleChange}
            />
            {day.replace('available_', '').charAt(0).toUpperCase() + day.replace('available_', '').slice(1)}
          </label>
        ))}
      </fieldset>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-all"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StaffEdit;
