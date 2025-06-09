import ViewProjects from '../components/ViewProjects';

{/* …inside your .map(client)… */}
<button
  onClick={() => setSelectedClient(client)}
  className="px-4 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded"
>
  View Projects
</button>// src/components/ViewProjects.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// your existing helper (move this into e.g. src/utils/railWeeks.js if you like)
const getRailWeeks = (year) => {
  const weeks = [];
  const start = new Date(year, 3, 1); // April 1
  let count = 1;
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  // week 1 ends on the first Friday on or after April 1
  const week1End = new Date(start);
  while (week1End.getDay() !== 5) week1End.setDate(week1End.getDate() + 1);
  weeks.push({ number: count, start: new Date(start), end: new Date(week1End) });
  count++;

  let nextStart = new Date(week1End);
  nextStart.setDate(nextStart.getDate() + 1); // Saturday

  // build weeks 2–53
  while (
    nextStart.getFullYear() === year ||
    (nextStart.getFullYear() === year + 1 && count <= 52)
  ) {
    const end = new Date(nextStart);
    end.setDate(end.getDate() + 6); // through the next Friday
    weeks.push({ number: count, start: new Date(nextStart), end: end });
    nextStart.setDate(nextStart.getDate() + 7);
    count++;
  }

  return weeks;
};

const ViewProjects = ({ clientId }) => {
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';

  // on mount, build weeks and pick "today"'s
  useEffect(() => {
    const year = new Date().getFullYear();
    const all = getRailWeeks(year);
    setWeeks(all);
    const today = new Date();
    const current = all.find(w => today >= w.start && today <= w.end) || all[0];
    setSelectedWeek(current);
  }, []);

  // whenever clientId or selectedWeek changes, fetch
  useEffect(() => {
    if (!clientId || !selectedWeek) return;
    const sd = selectedWeek.start.toLocaleDateString('en-CA').slice(0,10);
    const ed = selectedWeek.end.toLocaleDateString('en-CA').slice(0,10);
    setLoading(true);
    fetch(`${baseUrl}/api/projects/${clientId}/filter?startDate=${sd}&endDate=${ed}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then(json => {
        setProjects(json.data || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Could not load projects for that week.');
      })
      .finally(() => setLoading(false));
  }, [clientId, selectedWeek]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="font-medium">Rail Week:</label>
        <select
          value={selectedWeek?.number || ''}
          onChange={e => {
            const num = +e.target.value;
            setSelectedWeek(weeks.find(w => w.number === num));
          }}
          className="px-3 py-1 border rounded"
        >
          {weeks.map(w => (
            <option key={w.number} value={w.number}>
              {w.number}: {w.start.toLocaleDateString()}–{w.end.toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects this week.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map(proj => (
            <li key={proj.project_id} className="border p-4 rounded shadow-sm">
              <h3 className="font-semibold">{proj.location}</h3>
              {Object.entries(proj.shifts).map(([date, shifts]) => (
                <div key={date} className="mt-2">
                  <p className="font-medium">{new Date(date).toLocaleDateString()}</p>
                  {shifts.map((s,i) => (
                    <div key={i} className="ml-4 mt-1">
                      <p>
                        <span className="font-semibold">{s.start_time}</span> –{' '}
                        <span className="font-semibold">{s.end_time}</span>
                      </p>
                      <ul className="list-disc ml-6">
                        {s.roles.map((r,j) => (
                          <li key={j}>
                            {r.role} × {r.required_count}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewProjects;


{/* somewhere near the bottom: */}
{selectedClient && (
  <Modal onClose={() => setSelectedClient(null)}>
    <ViewProjects clientId={selectedClient.id} />
  </Modal>
)}
