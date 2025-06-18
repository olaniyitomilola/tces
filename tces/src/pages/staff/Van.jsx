// src/pages/staff/Van.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AvailableVansDropdown from "../../components/AvailableVansDropDown";
import VanCard from "../../components/VanCard";

export default function Van() {
  const navigate = useNavigate();
  const [myVans, setMyVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchMyVans() {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/vehicles/drivers/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vans");
        }
        const vans = await response.json();
        console.log(vans.myVans)
        setMyVans(vans.myVans);
      } catch (err) {
        console.error("Error fetching vans:", err);
        toast.error("Unable to fetch your vans");
      } finally {
        setLoading(false);
      }
    }

    fetchMyVans();
  }, [baseUrl, user.id]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePickUp = async ({ van, mileage }) => {
    try {
      const response = await fetch(`${baseUrl}/api/vehicles/pickup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: user.id,
          vanId: van.id,
          pick_up_mileage: mileage,
        }),
      });
      if (!response.ok) throw new Error("Failed to pick up van");
      toast.success(`Picked up ${van.registration} at ${mileage} miles`);
      let newVan = await response.json()
      newVan = newVan[0];
      van.history_id = newVan.id
     
      navigate(`${van.id}`, { state: { van } });
    } catch (err) {
      console.error(err);
      toast.error("Could not complete pickup");
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-600 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex  md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl font-semibold">Vans</h1>
        <AvailableVansDropdown onSelect={handlePickUp} />
      </div>

      {myVans.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          You currently have no van in your possession.
        </div>
      ) : (
        <div className="space-y-4">
          {myVans.map((van) => (
            <VanCard
              key={van.id}
              id={van.id}
              plate={van.registration}
              name={van.name}
              tax={van.tax_expiry ? "Taxed" : "Not Taxed"}
              taxExpiry={formatDate(van.tax_expiry)}
              motTest={van.mot_expiry ? "Valid" : "Invalid"}
              motExpiry={formatDate(van.mot_expiry)}
              recall={van.recall || "Unknown"}
              van={van}
            />
          ))}
        </div>
      )}
    </div>
  );
}
