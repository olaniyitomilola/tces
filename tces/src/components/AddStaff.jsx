import React, { useState } from 'react';

const initialFormState = {
  firstName: '',
  lastName: '',
  role: '',
  email: '',
  phone: '',
  nin: '',
  address: '',
  isDriver: false,
  licenseNumber: '',
  hasPTS: false,
  ptsNumber: '',
  tickets: {
    COSS: false,
    ES: false,
    MC: false,
    SS: false,
    Points: false,
    LXA: false,
    Dumper: false,
    Roller: false,
    SmallTools: false,
    HandTrolley: false
  },
  employmentType: 'full-time',
  availability: {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  },
  jobTypes: {
    Civils: false,
    Surveying: false,
    HBE: false,
    Management: false
  }
};

const AddStaff = ({ onAdd }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (['isDriver', 'hasPTS'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (Object.keys(initialFormState.tickets).includes(name)) {
      setForm((prev) => ({
        ...prev,
        tickets: { ...prev.tickets, [name]: checked }
      }));
    } else if (Object.keys(initialFormState.availability).includes(name)) {
      setForm((prev) => ({
        ...prev,
        availability: { ...prev.availability, [name]: checked }
      }));
    } else if (Object.keys(initialFormState.jobTypes).includes(name)) {
      setForm((prev) => ({
        ...prev,
        jobTypes: { ...prev.jobTypes, [name]: checked }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setError('');
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, role, email, phone } = form;

    if (!firstName || !lastName || !role || !email || !phone) {
      setError('All basic fields are required.');
      setLoading(false);
      return;
    }

    if (form.isDriver && !form.licenseNumber) {
      setError('License number is required for drivers.');
      setLoading(false);
      return;
    }

    if (form.hasPTS && !form.ptsNumber) {
      setError('PTS number is required if staff has PTS.');
      setLoading(false);
      return;
    }

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      role: form.role,
      email: form.email,
      phone: form.phone,
      nin: form.nin,
      address: form.address,
      is_driver: form.isDriver,
      license_number: form.licenseNumber,
      has_pts: form.hasPTS,
      pts_number: form.ptsNumber,
      ticket_coss: form.tickets.COSS,
      ticket_es: form.tickets.ES,
      ticket_mc: form.tickets.MC,
      ticket_ss: form.tickets.SS,
      ticket_points: form.tickets.Points,
      ticket_lxa: form.tickets.LXA,
      ticket_dumper: form.tickets.Dumper,
      ticket_roller: form.tickets.Roller,
      ticket_small_tools: form.tickets.SmallTools,
      ticket_hand_trolley: form.tickets.HandTrolley,
      available_monday: form.availability.Monday,
      available_tuesday: form.availability.Tuesday,
      available_wednesday: form.availability.Wednesday,
      available_thursday: form.availability.Thursday,
      available_friday: form.availability.Friday,
      available_saturday: form.availability.Saturday,
      available_sunday: form.availability.Sunday,
      jobtype_civils: form.jobTypes.Civils,
      jobtype_surveying: form.jobTypes.Surveying,
      jobtype_hbe: form.jobTypes.HBE,
      jobtype_management: form.jobTypes.Management,
      employment_type: form.employmentType,
      is_activated: false
    };

    try {
      const res = await fetch(`${baseUrl}/api/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save staff');

      const saved = await res.json();

      onAdd(saved);
      setForm(initialFormState);
    } catch (err) {
      setError('Error saving staff. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderTicketGroup = (title, keys) => (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{title}</label>
      <div className="flex flex-wrap gap-4">
        {keys.map((ticket) => (
          <label key={ticket} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={ticket}
              checked={form.tickets[ticket]}
              onChange={handleFormChange}
            />
            <span>{ticket}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-4">Add New Staff</h3>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <form onSubmit={handleAddStaff} className="space-y-4">
        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <input type="text" name="role" placeholder="Role" value={form.role} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <input type="text" name="nin" placeholder="National Insurance Number" value={form.nin} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleFormChange} className="w-full px-3 py-2 border rounded"></textarea>
        <label className="block text-sm font-semibold">Employment Type</label>

        <select name="employmentType" value={form.employmentType} onChange={handleFormChange} className="w-full px-3 py-2 border rounded">

          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
        </select>
        <label className="block text-sm font-semibold">Availability</label>

        <div className="flex flex-wrap gap-4">
          {Object.keys(form.availability).map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input type="checkbox" name={day} checked={form.availability[day]} onChange={handleFormChange} />
              <span>{day}</span>
            </label>
          ))}
        </div>
        <label className="block text-sm font-semibold">Job types</label>

        <div className="flex flex-wrap gap-4">
          {Object.keys(form.jobTypes).map((job) => (
            <label key={job} className="flex items-center space-x-2">
              <input type="checkbox" name={job} checked={form.jobTypes[job]} onChange={handleFormChange} />
              <span>{job}</span>
            </label>
          ))}
        </div>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="isDriver" checked={form.isDriver} onChange={handleFormChange} />
          <span>Does staff Drive?</span>
        </label>
        {form.isDriver && (
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={form.licenseNumber}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border rounded"
          />
        )}

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="hasPTS" checked={form.hasPTS} onChange={handleFormChange} />
          <span>Has PTS?</span>
        </label>
        {form.hasPTS && (
          <input
            type="text"
            name="ptsNumber"
            placeholder="PTS Number"
            value={form.ptsNumber}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border rounded"
          />
        )}

        {renderTicketGroup("Rail Tickets", ['COSS', 'ES', 'MC', 'Points', 'LXA'])}
        {renderTicketGroup("Machine Tickets", ['Dumper', 'Roller'])}
        {renderTicketGroup("Tool Tickets", ['SmallTools', 'HandTrolley'])}

        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Adding Staff...' : 'Add Staff'}
        </button>
      </form>
    </div>
  );
};

export default AddStaff;
