// src/utils/fetchCounts.js

export async function fetchCounts() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
    try {
      // fire off all three requests in parallel
      const [clientsRes, vansRes, staffRes] = await Promise.all([
        fetch(`${baseUrl}/api/client`),
        fetch(`${baseUrl}/api/vehicles`),
        fetch(`${baseUrl}/api/staff`)
      ]);
  
      if (!clientsRes.ok) throw new Error('Failed to fetch clients');
      if (!vansRes.ok)    throw new Error('Failed to fetch vans');
      if (!staffRes.ok)   throw new Error('Failed to fetch staff');
  
      // parse JSON bodies
      const [clients, vans, staff] = await Promise.all([
        clientsRes.json(),
        vansRes.json(),
        staffRes.json()
      ]);
  
      return {
        clientCount: Array.isArray(clients) ? clients.length : (clients.data?.length ?? 0),
        vanCount:    Array.isArray(vans)    ? vans.length    : (vans.data?.length    ?? 0),
        staffCount:  Array.isArray(staff)   ? staff.length   : (staff.data?.length   ?? 0),
      };
    } catch (err) {
      console.error('fetchCounts error:', err);
      return {
        clientCount: 0,
        vanCount:    0,
        staffCount:  0,
      };
    }
  }
  