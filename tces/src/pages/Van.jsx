import React, { useEffect, useState } from 'react';
import VanCard from '../components/VanCard';
import Tabs from '../components/Tabs';
import AddNewVan from '../components/AddNewVan';
import Garage from '../components/Garage';

const Van = () => {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL


  useEffect(() => {
    const fetchVans = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/vehicles`);
        if (!response.ok) {
          throw new Error('Network response not ok');
        }
        const data = await response.json();
        setVans(data);
        localStorage.setItem('vans', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch vans:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const cachedVans = localStorage.getItem('vans');
    if (cachedVans) {
      setVans(JSON.parse(cachedVans));
      setLoading(false);
      fetchVans();
    } else {
      fetchVans();
    }
  }, []);

  const handleVanAdded = () => {
    const updatedVans = JSON.parse(localStorage.getItem('vans')) || [];
    setVans(updatedVans);
    setActiveTab(0);
  };

  const today = new Date();

  const untaxedVans = vans.filter(van => van.tax === 'Untaxed');
  const expiredMotVans = vans.filter(van => {
    if (!van.mot_expiry) return false;
    return new Date(van.mot_expiry) < today;
  });

  const tabs = [
    {
      label: `All Vans (${vans.length})`,
      content: loading ? (
        <div className="flex flex-col justify-center items-center h-40 space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 border-opacity-50"></div>
          <p className="text-gray-600 text-sm">Fetching vans...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-40 space-y-3">
          <p className="text-red-600 font-semibold">Failed to load vans.</p>
          <p className="text-gray-500 text-sm">Please check your network and try again.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vans.map((van) => (
            <VanCard
              key={van.id}
              id={van.id}
              plate={van.registration}
              name={van.name}
              tax={van.tax}
              taxExpiry={van.tax_expiry}
              motTest={van.mot_test}
              motExpiry={van.mot_expiry}
              recall={van.recall}
            />
          ))}
        </div>
      )
    },
    {
      label: `Untaxed Vans (${untaxedVans.length})`,
      content: (
        <div className="space-y-4">
          {untaxedVans.length > 0 ? untaxedVans.map((van) => (
            <VanCard
              key={van.id}
              id={van.id}
              plate={van.registration}
              name={van.name}
              tax={van.tax}
              taxExpiry={van.tax_expiry}
              motTest={van.mot_test}
              motExpiry={van.mot_expiry}
              recall={van.recall}
            />
          )) : <p className="text-gray-600 text-center">No untaxed vans found.</p>}
        </div>
      )
    },
    {
      label: `Expired MOT (${expiredMotVans.length})`,
      content: (
        <div className="space-y-4">
          {expiredMotVans.length > 0 ? expiredMotVans.map((van) => (
            <VanCard
              key={van.id}
              id={van.id}
              plate={van.registration}
              name={van.name}
              tax={van.tax}
              taxExpiry={van.tax_expiry}
              motTest={van.mot_test}
              motExpiry={van.mot_expiry}
              recall={van.recall}
            />
          )) : <p className="text-gray-600 text-center">No vans with expired MOT found.</p>}
        </div>
      )
    },
    {
      label: 'Add New Van',
      content: (
        <AddNewVan onVanAdded={handleVanAdded} />
      )
    },
    {
      label: 'Garage',
      content: (
        <Garage />
      )
    }
  ];

  return (
    <div className="p-4">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Van;
