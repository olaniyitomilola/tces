import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import StaffCard from '../components/StaffCard';
import AddStaff from '../components/AddStaff';
import { toast } from 'react-toastify';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/staff`);
        if (!response.ok) throw new Error('Failed to fetch staff');
        const data = await response.json();
        localStorage.setItem('staff',JSON.stringify(data))
        setStaff(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  const filteredStaff = staff.filter((s) =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (newStaff) => {
    setStaff((prev) => {
      const updated = [...prev, newStaff];
      localStorage.setItem('staff', JSON.stringify(updated)); // optional, for caching
      return updated;
    });
    toast.success('Staff added successfully');
    setActiveTab(0);
  };

  const renderStaffList = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleInputChange}
        className="mb-4 w-full px-4 py-2 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
      />

      {loading ? (
        <p className="text-sm text-gray-500">Loading staff...</p>
      ) : error ? (
        <p className="text-sm text-red-600">Failed to load staff. Try again later.</p>
      ) : filteredStaff.length > 0 ? (
        filteredStaff.map((s) => (
          <StaffCard
            key={s.id}
            id={s.id}
            firstName={s.first_name}
            lastName={s.last_name}
            role={s.role}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No staff match your search.</p>
      )}
    </div>
  );

  const tabs = [
    {
      label: `All Staff (${staff.length})`,
      content: renderStaffList()
    },
    ...(currentUser?.role === 'Managing Director'
      ? [
          {
            label: 'Add New Staff',
            content: <AddStaff onAdd={handleAdd} />
          }
        ]
      : [])
  ];

  return (
    <div className="p-4">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Staff;
