// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard       from '../components/StatsCard';
import ShiftsBarChart  from '../components/ShiftsBarChart';
import ProjectsPieChart from '../components/ProjectsPieChart';
import AlertsPanel     from '../components/AlertsPanel';
import QuickActions    from '../components/QuickActions';
import { PlusCircle, FilePlus, Calendar, UserPlus } from 'lucide-react';
import { fetchCounts }         from '../utils/fetchCounts';
import { fetchVehicleAlerts }  from '../utils/fetchVehicleAlerts';
import {fetchShiftCounts} from '../utils/fetchShiftCounts'
import getRailWeeks from '../components/Railweeks';
import getWeekForDate from '../components/GetWeekForDate';

const Home = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({ clientCount: 0, vanCount: 0, staffCount: 0 });
  const [alerts, setAlerts] = useState([]);
  const [shifts, setShifts] = useState({total: 0, sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0});
  const [clientShifts, setClientShifts] = useState([]);

  const allWeeks = getRailWeeks(new Date().getFullYear());
  const today = new Date();
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const week = getWeekForDate(allWeeks, today);
    if (!week) {
      console.warn('No rail week found for today:', today);
      return { start: today, end: today }; // Fallback
    }
    return week;
  });

  useEffect( () => {
    fetchCounts().then(setCounts);
    fetchVehicleAlerts().then(setAlerts).catch(console.error);
    

  }, []);
  useEffect(() => {
    if (!selectedWeek?.start || !selectedWeek?.end) return;
  
    fetchShiftCounts(selectedWeek.start, selectedWeek.end)
      .then((data) => {
        setShifts(data.count);
        setClientShifts(data.clients);
      })
      .catch(console.error);
  }, [selectedWeek]);
  

  

  const stats = useMemo(() => ([
    { title: 'Clients',       value: counts.clientCount },
    { title: 'Vehicles',      value: counts.vanCount    },
    { title: 'Shifts for Week',  value: shifts.total /* TODO */    },
    { title: 'Staff Members', value: counts.staffCount  },
  ]), [counts]);

  const actions = [
    { label: 'Add Client',  icon: PlusCircle, onClick: () => navigate('/clients') },
    { label: 'Add Project', icon: FilePlus,   onClick: () => navigate('/projects/add') },
    { label: 'Book Shift',  icon: Calendar,   onClick: () => navigate('/shifts/add') },
    { label: 'Add Staff',   icon: UserPlus,   onClick: () => navigate('/staff/add') },
  ];

  return (
    <div className="bg-orange-50 min-h-screen p-6">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(s => (
            <StatsCard key={s.title} title={s.title} value={s.value} />
          ))}
        </div>

        {/* Alerts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <AlertsPanel alerts={alerts} />
          {/* <QuickActions actions={actions} /> */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Shifts by Day (This Rail Week)
            </h3>
            <ShiftsBarChart days = {shifts} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Weekly Shift Breakdown
            </h3>
            <ProjectsPieChart clients = {clientShifts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
