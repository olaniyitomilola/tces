import React, { useState, useEffect, useMemo } from 'react';
import getRailWeeks from '../components/Railweeks';
import { fetchShiftCounts } from '../utils/fetchShiftCounts';
import ShiftModal from '../components/ShiftModal';
import extractRequirements from '../utils/extractRequirements';
import { RadiusIcon } from 'lucide-react';
const getCurrentRailWeek = (weeks) => {
  // Helper: take any Date or ISO string, return a new Date at 00:00:00 local time
  const toDateOnly = (d) => {
    const dt = d instanceof Date ? new Date(d) : new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  const todayDateOnly = toDateOnly(new Date());

  return (
    weeks.find(w => {
      // turn both w.start and w.end into Date‐objects at midnight
      const startDate = toDateOnly(w.start);
      const endDate   = toDateOnly(w.end);

      return todayDateOnly >= startDate && todayDateOnly <= endDate;
    })?.number || ''
  );
};





const WeekPlanner = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selected, setSelected] = useState('');
  const [shifts, setShifts] = useState({});
  const [modalData, setModalData] = useState(null);
  const [staff,setStaff] = useState([]);  
  const [assignedStaff, setAssignedStaff] = useState({});
  const railWeeks = useMemo(() => getRailWeeks(new Date().getFullYear()), []);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';

 // 1. Once railWeeks arrives, default the dropdown to current week
useEffect(() => {
  if (railWeeks.length && !selectedWeek) {
    const currentWeek = getCurrentRailWeek(railWeeks)
        console.log('computed currentWeek:', currentWeek);

    setSelectedWeek(currentWeek.toString())
  }
}, [railWeeks, selectedWeek])

// 2. Whenever selectedWeek changes, pick out the matching week object
useEffect(() => {
  if (!selectedWeek) return
  const match = railWeeks.find(w => w.number.toString() === selectedWeek)
  setSelected(match)
}, [railWeeks, selectedWeek])

// 3. Whenever `selected` is set, fetch the shifts for that range
useEffect(() => {
  if (!selected) return
  fetchShiftCounts(selected.start, selected.end)
    .then(data => {
      setShifts(data.shifts? data.shifts : {});
      console.log(data.shifts)
      // store in state, etc…
    })
    .catch(console.error)
}, [selected])

  // 4. Fetch staff list for modal
useEffect(() => {
  fetch(`${baseUrl}/api/staff`) 
    .then(response => response.json())
    .then(data => {
      setStaff(data)
    })
    .catch(console.error);
}, []); 


  const days = selected
    ? Array.from({ length: 7 }, (_, i) => {
        const d = new Date(selected.start);
        d.setDate(d.getDate() + i);
        return d;
      })
    : [];

    const onAssignStaff = (date, userId) => {
      setAssignedStaff(prev => {
        const prevSet = new Set(prev[date] || []);
        prevSet.add(userId);
        return { 
          ...prev, 
          [date]: prevSet 
        };
      });
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Week Planner</h2>
        <select
          value={selectedWeek || ''}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="px-4 py-2 border rounded text-sm"
        >
          <option value="">Select Rail Week</option>
          {railWeeks.map((week) => (
            <option key={week.number} value={week.number}>
              Week {week.number} ({week.start.toLocaleDateString()} - {week.end.toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="p-4 bg-white rounded shadow space-y-4">
          <h3 className="text-md font-semibold mb-2">Week {selectedWeek}</h3>
          <p className="text-sm text-gray-600">
            {selected.start.toDateString()} to {selected.end.toDateString()}
          </p>

          <div
            className="overflow-x-auto overflow-y-auto max-h-[60vh] bg-white rounded shadow"
            style={{ padding: '0.5rem' }}
          >
            <table className="min-w-max w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-orange-100">
                  <th className="border px-4 py-2 text-left">Client</th>
                  <th className="border px-4 py-2 text-left">Location</th>
                  {days.map((day, index) => (
                    <th key={index} className="border px-4 py-2 text-center whitespace-nowrap">
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}<br />
                      {day.toLocaleDateString()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(shifts).flatMap(([clientName, projects]) =>
                  projects.map((proj, projIdx) => (
                    <tr key={`${clientName}-${projIdx}`}>
                      {projIdx === 0 && (
                        <td
                          className="border px-4 py-2  font-medium text-center align-middle bg-green-100"
                          rowSpan={projects.length}
                        >
                          {clientName}
                        </td>
                      )}
                      <td className="border px-4 py-2 bg-red-50">{proj.location}</td>

                      {days.map(day => {
  const dateKey = day.toLocaleDateString('en-CA');
  const shiftsForDay = proj.shifts[dateKey] || [];

  // Group by start/end time
  const grouped = Object.values(
    shiftsForDay.reduce((acc, sh) => {
      const key = `${sh.start_time}-${sh.end_time}`;
      if (!acc[key]) {
        acc[key] = {
          start_time: sh.start_time,
          end_time:   sh.end_time,
          roles:      []
        };
      }
      const requirement = extractRequirements(sh);
      acc[key].roles.push({
        role:           sh.role,
        required_count: sh.required_count,
        requirement: requirement
      });
      return acc;
    }, {})
  );

  return (
    <td key={dateKey} className="border px-2 py-2 text-center align-middle">
      {grouped.length === 0 ? (
        <span className="text-gray-400">—</span>
      ) : grouped.map((g, i) => (
        <div key={i} className="mb-3 last:mb-0 cursor-pointer hover:bg-gray-100 p-2  rounded"
          onClick={() => setModalData({
            clientName,
            location: proj.location,
            date: dateKey,
            startTime: g.start_time.slice(0,5),
            endTime:   g.end_time.slice(0,5),
            roles:     g.roles,
            users: staff,
            assignedForDay: assignedStaff[dateKey] || new Set(),

          })}
        >
          <p className="font-medium mb-1">
            {g.start_time.slice(0,5)}–{g.end_time.slice(0,5)}
          </p>
          {/* List all roles under that time */}
          <ul className="text-sm pl-2 space-y-1   ">
            {g.roles.map((r, j) => (
              <li key={j} className="flex justify-between items-center gap-y-1 bg-gray-100 rounded px-2 py-1">
                <span>{r.role}</span>
                <span>x{r.required_count}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </td>
  );
})}

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* render modal */}
     <ShiftModal
       isOpen={!!modalData}
       onClose={() => setModalData(null)}
       onAssign = {(userId)=> onAssignStaff(modalData.date, userId)}
       {...modalData}
     />
    </div>
  );
};

export default WeekPlanner;
