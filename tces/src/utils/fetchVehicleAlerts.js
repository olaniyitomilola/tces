// src/utils/fetchVehicleAlerts.js

export async function fetchVehicleAlerts() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
    // fetch all vans
    const res = await fetch(`${baseUrl}/api/vehicles`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    const vehicles = await res.json();
    if (!Array.isArray(vehicles)) return [];
  
    const today = new Date();
  
    // helper to build an alert object
    const makeAlert = (vehicle, label, dateField) => {
      const date = new Date(vehicle[dateField]);
      const diffMs = date - today;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        id: `${vehicle.id}-${label.toLowerCase()}`,
        registration: vehicle.registration,
        label,
        due: date,
        dueDateString: date.toLocaleDateString(),
        daysLeft
      };
    };
  
    // collect all MOT alerts (expired or within 30 days)
    const motAlerts = vehicles
      .filter(v => v.mot_expiry)
      .map(v => makeAlert(v, 'MOT', 'mot_expiry'))
      .filter(a => a.daysLeft <= 30)           // expired (daysLeft<0) or soon (≤30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  
    // collect all Tax alerts (expired or within 30 days)
    const taxAlerts = vehicles
      .filter(v => v.tax_expiry)
      .map(v => makeAlert(v, 'Tax', 'tax_expiry'))
      .filter(a => a.daysLeft <= 30)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  
    return [...motAlerts, ...taxAlerts];
  }
  