// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import AddShiftModal from '../components/AddShiftModal';
import ViewProjectsModal from '../components/ViewProjectsModal';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL

  // fetch clients on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseURL}/api/client`);
        if (!res.ok) throw new Error('Failed to fetch clients');
        setClients(await res.json());
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // add client
  const handleAddClient = async () => {
    if (!newClient.trim()) return;
    try {
      const res = await fetch(`${baseURL}/api/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClient.trim() })
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setClients(cs => [saved, ...cs]);
      setNewClient('');
      setShowForm(false);
      setError('');
      toast.success('Client added');
    } catch {
      setError('Failed to add client. Please try again.');
    }
  };

  // filter by search
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clients</h2>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-md shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {/* search */}
      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
      />

      {/* add‐client form */}
      {showForm && (
        <div className="bg-white p-4 rounded-md shadow border space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Client Name"
            value={newClient}
            onChange={e => setNewClient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddClient}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded"
            >
              Save Client
            </button>
          </div>
        </div>
      )}

      {/* no results */}
      {filtered.length === 0 && !showForm && (
        <p className="text-sm text-gray-500 text-center">No clients found.</p>
      )}

      {/* client list */}
      <ul className="space-y-4">
        {filtered.map(client => (
          <li
            key={client.id}
            className="bg-white border rounded p-4 shadow-sm flex justify-between items-center"
          >
            <p className="text-lg font-semibold text-gray-800">{client.name}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setViewingClient(client)}
                className="px-4 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded shadow-sm"
              >
                View Projects
              </button>
              <button
                onClick={() => setSelectedClient(client)}
                className="px-4 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded shadow-sm"
              >
                Add Project
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* modals */}
      {selectedClient && (
        <AddShiftModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          disablePastDates
          validateDates
        />
      )}
      {viewingClient && (
        <ViewProjectsModal
          client={viewingClient}
          onClose={() => setViewingClient(null)}
        />
      )}
    </div>
  );
};

export default Clients;
