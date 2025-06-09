// // src/components/ViewProjectsModal.jsx
// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import getRailWeeks from './Railweeks';
// import RailWeekDropdown from './RailWeekDropdown';
// import TimeFilterTabs from './TimeFilterTabs';
// import getWeekForDate from './GetWeekForDate';

// const ViewProjectsModal = ({ client, onClose }) => {
//   const [weeks, setWeeks]               = useState([]);
//   const [selectedWeek, setSelectedWeek] = useState(null);
//   const [projects, setProjects]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState('');
//   const [filterType, setFilterType] = useState('upcing')

//   // build rail‐weeks once
//   useEffect(() => {
//     const year = new Date().getFullYear();
//     const all  = getRailWeeks(year);



//     setWeeks(all);

//     // default to “this” week
//     const today    = new Date();




// const currentWeek = getWeekForDate(all,today)




//     setSelectedWeek(currentWeek);
//   }, []);

//   // fetch whenever client or week changes
//   useEffect(() => {
//     if (!client?.id || !selectedWeek) return;
//     setLoading(true);
//     setError('');
//     const sd = selectedWeek.start.toISOString().slice(0,10);
//     const ed = selectedWeek.end.toISOString().slice(0,10);

//     fetch(
//       `${baseUrl}/api/projects/${client.id}/filter?startDate=${sd}&endDate=${ed}`
//     )
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to load projects');
//         return res.json();
//       })
//       .then(json => setProjects(json.data || []))
//       .catch(err => {
//         console.error(err);
//         setError('Could not load projects for that week.');
//         toast.error('Could not load projects.');
//       })
//       .finally(() => setLoading(false));
//   }, [client, selectedWeek]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-6">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//         >
//           <X size={20} />
//         </button>
//         <h2 className="text-xl font-semibold mb-4">Projects for {client.name}</h2>

//         <div className="flex items-center justify-between mb-4">
//             <RailWeekDropdown
//                 weeks={weeks}
//                 selectedWeek={selectedWeek}
//                 onChange={num => {
//                 const w = weeks.find(w => w.number === num);
//                 if (w) setSelectedWeek(w);
//                 }}
//             />
//             <TimeFilterTabs value={filterType} onChange={setFilterType} />
//         </div>

//         {loading ? (
//           <p className="text-sm text-gray-500">Loading projects…</p>
//         ) : error ? (
//           <p className="text-red-600 text-sm">{error}</p>
//         ) : projects.length === 0 ? (
//           <p className="text-sm text-gray-500">No projects found for this week.</p>
//         ) : (
//           projects.map(proj => (
//             <div key={proj.project_id} className="mb-8">
//               <h3 className="text-lg font-medium">{proj.location}</h3>

//               {Object.entries(proj.shifts).map(([date, shifts]) => (
//                 <div key={date} className="mt-4">
//                   <p className="font-semibold text-gray-700">
//                     {new Date(date).toLocaleDateString()}
//                   </p>
//                   <ul className="mt-2 space-y-3">
//                     {shifts.map((shift, i) => (
//                       <li
//                         key={i}
//                         className="border rounded p-3 shadow-sm bg-gray-50"
//                       >
//                         <p className="font-medium">
//                           {shift.start_time} – {shift.end_time}
//                         </p>
//                         <ul className="mt-1 space-y-1 pl-4">
//                           {shift.roles.map((r, j) => (
//                             <li
//                               key={j}
//                               className="flex justify-between text-sm"
//                             >
//                               <span>{r.role}</span>
//                               <span>Required: {r.required_count}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewProjectsModal;


// src/components/ViewProjectsModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import Tabs from './Tabs';
import RailWeekDropdown from './RailWeekDropdown';
import getRailWeeks from './Railweeks';
import getWeekForDate from './GetWeekForDate';

export default function ViewProjectsModal({ client, onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [weekError,setWeekError] = useState('')
  const [activeTab, setActiveTab] = useState(0);
  const [weekProjects, setWeekProjects] = useState([]); // for “By Week”
  const [weekLoading, setWeekLoading] = useState(false);
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  // compute rail-weeks and pick the one containing today
  const allWeeks = getRailWeeks(new Date().getFullYear());
  const today = new Date();
  const [selectedWeek, setSelectedWeek] = useState(() => {
    return (
      getWeekForDate(allWeeks,today)
    );
  });

  useEffect(() => {
    (async () => {
      try {

        console.log(selectedWeek)
        const res = await fetch(`${baseUrl}/api/projects/${client.id}`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const json = await res.json();
        setProjects(json.data || []);
      } catch (err) {
        console.error(err);
        setError('Could not load projects.');
      } finally {
        setLoading(false);
      }
    })();
  }, [client]);

  useEffect(() => {
    if (activeTab !== 1) return;

    setWeekLoading(true);
    setWeekError('');
    const start = selectedWeek.start.toLocaleDateString('en-CA').slice(0,10);
    //use en-C to get the YYYY-MM-DD format
    const end   = selectedWeek.end  .toLocaleDateString('en-CA').slice(0,10);

    console.log(selectedWeek.start,start)

    fetch(
      `${baseUrl}/api/projects/${client.id}/filter?startDate=${start}&endDate=${end}`
    )
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(json => setWeekProjects(json.data || []))
      .catch(() => setWeekError('Failed to load projects for that week.'))
      .finally(() => setWeekLoading(false));
  }, [activeTab, selectedWeek, client.id]);

  // helpers to filter a project's shifts by a predicate on the date
  const filterProjects = (pred) =>
    projects
      .map(proj => ({
        ...proj,
        shifts: Object.fromEntries(
          Object.entries(proj.shifts)
            .filter(([date]) => pred(new Date(date)))
        )
      }))
      .filter(proj => Object.keys(proj.shifts).length > 0);

  // Tab contents
  const tabs = [
    {
        label: 'By Week',
        content: (() => {
          const startStr = selectedWeek.start.toLocaleDateString('en-CA').slice(0, 10);
          const endStr   = selectedWeek.end  .toLocaleDateString('en-CA').slice(0, 10);
      
          const weekProjects = projects
            .map(proj => ({
              ...proj,
              shifts: Object.fromEntries(
                // keep only dates between startStr and endStr _inclusive_
                Object.entries(proj.shifts)
                      .filter(([date]) => date >= startStr && date <= endStr)
              )
            }))
            .filter(proj => Object.keys(proj.shifts).length > 0);
      
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <RailWeekDropdown
                  weeks={allWeeks}
                  selectedWeek={selectedWeek}
                  onChange={num => {
                    const w = allWeeks.find(w => w.number === num);
                    if (w) setSelectedWeek(w);
                  }}
                />
              </div>
      
              {weekProjects.length > 0
                ? weekProjects.map(renderProject)
                : <p className="text-sm text-gray-500">No projects in this week.</p>
              }
            </>
          );
        })()
      },
    {
      label: 'Past',
      content: (
        <>
          {filterProjects(d => d < today)
            .map(renderProject)}
          {filterProjects(d => d < today).length === 0 &&
            <p className="text-sm text-gray-500">No past projects.</p>
          }
        </>
      )
    },
    {
      label: 'Today',
      content: (
        <>
          {filterProjects(d => {
            const ds = d.toLocaleDateString().split('T')[0];
            const ts = today.toLocaleDateString().split('T')[0];
            return ds === ts;
          }).map(renderProject)}
          {filterProjects(d => {
            const ds = d.toLocaleDateString().split('T')[0];
            const ts = today.toLocaleDateString().split('T')[0];
            return ds === ts;
          }).length === 0 &&
            <p className="text-sm text-gray-500">No projects for today.</p>
          }
        </>
      )
    },
    {
      label: 'Upcoming',
      content: (
        <>
          {filterProjects(d => d > today)
            .map(renderProject)}
          {filterProjects(d => d > today).length === 0 &&
            <p className="text-sm text-gray-500">No upcoming projects.</p>
          }
        </>
      )
    }
  ];

  // factored out render function for each project block
  function renderProject(proj) {
    return (
      <div key={proj.project_id} className="mb-8">
        <h3 className="text-lg font-medium">{proj.location}</h3>
        {Object.entries(proj.shifts).map(([date, shifts]) => (
          <div key={date} className="mt-4">
            <p className="font-semibold text-gray-700">{new Date(date).toLocaleDateString()}</p>
            <ul className="mt-2 space-y-3">
              {shifts.map((shift, i) => (
                <li key={i} className="border rounded p-3 shadow-sm bg-gray-50">
                  <p className="font-medium">{shift.start_time} – {shift.end_time}</p>
                  <ul className="mt-1 space-y-1 pl-4">
                    {shift.roles.map((r, j) => (
                      <li key={j} className="flex justify-between text-sm">
                        <span>{r.role}</span>
                        <span>Required: {r.required_count}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Projects for {client.name}</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading projects…</p>
        ) : error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : (
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}
