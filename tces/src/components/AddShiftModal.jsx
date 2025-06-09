import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast'

const AddShiftModal = ({
  client,
  onClose,
  disablePastDates = false,
  validateDates = false
}) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRanges, setDateRanges] = useState([]);
  const [sameTime, setSameTime] = useState(false);
  const [sharedTime, setSharedTime] = useState({
    startTime: '',
    endTime: '',
    roles: [
      {
        role: '',
        count: '',
        specType: 'none',
        jobTypes: {},
        tickets: {}
      }
    ]
  });
  const [error, setError] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net';


  const jobTypeOptions = ['Civils', 'Surveying', 'HBE', 'Management'];
  const ticketOptions = [
    'COSS','ES','MC','SS','Points','LXA','Dumper','Roller','SmallTools','HandTrolley'
  ];

  useEffect(() => {
    if (!startDate) {
      setDateRanges([]);
      return;
    }
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    const ranges = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
      const dateStr = d.toISOString().split('T')[0];
      ranges.push({
        date: dateStr,
        shifts: [{
          startTime: '',
          endTime: '',
          roles: [{
            role: '',
            count: '',
            specType: 'none',
            jobTypes: {},
            tickets: {}
          }]
        }]
      });
    }
    setDateRanges(ranges);
  }, [startDate, endDate]);

  const handleTimeChange = (d,s,f,v) => {
    const copy = [...dateRanges];
    copy[d].shifts[s][f] = v;
    setDateRanges(copy);
  };
  const addShiftRow = d => {
    const copy = [...dateRanges];
    copy[d].shifts.push({
      startTime:'', endTime:'', roles:[{ role:'', count:'', specType:'none', jobTypes:{}, tickets:{} }]
    });
    setDateRanges(copy);
  };
  const handleRoleChange = (d,s,r,field,val) => {
    const copy = [...dateRanges];
    copy[d].shifts[s].roles[r][field] = val;
    setDateRanges(copy);
  };
  const addRoleRequirement = (d,s) => {
    const copy = [...dateRanges];
    copy[d].shifts[s].roles.push({ role:'',count:'',specType:'none',jobTypes:{},tickets:{} });
    setDateRanges(copy);
  };
  const removeRoleRequirement = (d,s,r) => {
    const copy = [...dateRanges];
    copy[d].shifts[s].roles.splice(r,1);
    setDateRanges(copy);
  };

  const applySameTimeToAll = () => {
    setDateRanges(dateRanges.map(day=>({
      ...day,
      shifts: day.shifts.map(()=>({
        startTime: sharedTime.startTime,
        endTime:   sharedTime.endTime,
        roles: sharedTime.roles.map(r=>({ ...r }))
      }))
    })));
  };
  const applySameRequirementsToAll = () => {
    setDateRanges(dateRanges.map(day=>({
      ...day,
      shifts: day.shifts.map(shift=>({
        ...shift,
        roles: sharedTime.roles.map(r=>({ ...r }))
      }))
    })));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!location||!startDate) { setError('Location and dates are required'); return; }
    if (disablePastDates && new Date(startDate)<new Date(today)) { setError('Start date cannot be in the past'); return; }
    if (disablePastDates && endDate && new Date(endDate)<new Date(today)) { setError('End date cannot be in the past'); return; }
    if (validateDates && endDate && new Date(endDate)<new Date(startDate)) { setError('End date must be after start date'); return; }
    for (const day of dateRanges) {
      for (const shift of day.shifts) {
        if (!shift.startTime||!shift.endTime) { setError('All time fields are required'); return; }
        for (const role of shift.roles) {
          if (!role.role||!role.count) { setError('All project requirements must be filled'); return; }
        }
      }
    }
    try {
      const payloads = dateRanges.flatMap(day=>
        day.shifts.map(shift=>({
          client_id: client.id,
          location,
          start_date: day.date,
          end_date:   day.date,
          start_time: shift.startTime,
          end_time:   shift.endTime,
          roles:      shift.roles
        }))
      );
      console.log(payloads);
      const res = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads)
      });
      if (!res.ok) throw new Error('Failed to save project');
      toast.success('Project added successfully!');   
      // wait 1 second (1000ms) before closing the modal
        setTimeout(() => {
          onClose();
        }, 1000);
    } catch {
      setError('Something went wrong while saving the shifts.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <X size={18}/>
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Shift for {client.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <input
            type="text" placeholder="Location"
            value={location} onChange={e=>setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            required
          />

          <label className="block text-sm text-gray-600">Start Date</label>
          <input
            type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
            required
          />

          <label className="block text-sm text-gray-600">End Date (optional)</label>
          <input
            type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          />

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={sameTime} onChange={()=>setSameTime(!sameTime)}/>
            Use same time & requirements for all days
          </label>

          {sameTime && (
            <div className="space-y-4 border p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Start Time</label>
                  <input
                    type="time" value={sharedTime.startTime}
                    onChange={e=>setSharedTime({...sharedTime,startTime:e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">End Time</label>
                  <input
                    type="time" value={sharedTime.endTime}
                    onChange={e=>setSharedTime({...sharedTime,endTime:e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <p className="text-sm font-medium mt-2">Project Requirements</p>
              {sharedTime.roles.map((r,idx)=>(
                <div key={idx} className="space-y-2 border border-gray-200 rounded p-2">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <input
                      type="text" placeholder="Role" value={r.role}
                      onChange={e=>{
                        const roles=[...sharedTime.roles];
                        roles[idx].role=e.target.value;
                        setSharedTime({...sharedTime,roles});
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number" placeholder="Count" value={r.count}
                      onChange={e=>{
                        const roles=[...sharedTime.roles];
                        roles[idx].count=e.target.value;
                        setSharedTime({...sharedTime,roles});
                      }}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                  </div>

                  <label className="block text-sm font-medium text-gray-700">Specify by:</label>
                  <select
                    value={r.specType}
                    onChange={e=>{
                      const roles=[...sharedTime.roles];
                      roles[idx].specType=e.target.value;
                      roles[idx].jobTypes={}; roles[idx].tickets={};
                      setSharedTime({...sharedTime,roles});
                    }}
                    className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="none">None</option>
                    <option value="jobType">Job Type</option>
                    <option value="ticket">Ticket</option>
                  </select>

                  {r.specType==='jobType' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobTypeOptions.map(jt=>(
                        <label key={jt} className="inline-flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={r.jobTypes[jt]||false}
                            onChange={e=>{
                              const roles=[...sharedTime.roles];
                              roles[idx].jobTypes[jt]=e.target.checked;
                              setSharedTime({...sharedTime,roles});
                            }}
                          />
                          {jt}
                        </label>
                      ))}
                    </div>
                  )}

                  {r.specType==='ticket' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ticketOptions.map(tk=>(
                        <label key={tk} className="inline-flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={r.tickets[tk]||false}
                            onChange={e=>{
                              const roles=[...sharedTime.roles];
                              roles[idx].tickets[tk]=e.target.checked;
                              setSharedTime({...sharedTime,roles});
                            }}
                          />
                          {tk}
                        </label>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={()=>{
                      const roles=[...sharedTime.roles];
                      roles.splice(idx,1);
                      setSharedTime({...sharedTime,roles});
                    }}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Remove Role
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={()=>
                  setSharedTime({
                    ...sharedTime,
                    roles:[
                      ...sharedTime.roles,
                      { role:'',count:'',specType:'none',jobTypes:{},tickets:{} }
                    ]
                  })
                }
                className="text-blue-600 hover:underline mt-1 text-sm"
              >
                + Add Another Role
              </button>

              <div className="text-right space-x-4 mt-2">
                <button
                  type="button"
                  onClick={applySameTimeToAll}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Apply Time to all days
                </button>
                <button
                  type="button"
                  onClick={applySameRequirementsToAll}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Apply Requirements to all days
                </button>
              </div>
            </div>
          )}

          {/* ––– Per-day shifts with “Specify by” in each role ––– */}
          {dateRanges.map((day,dayIdx)=>(
            <div key={day.date} className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {day.date}
                <button
                  type="button"
                  onClick={()=>addShiftRow(dayIdx)}
                  className="text-green-600 hover:text-green-800"
                >
                  <PlusCircle size={16}/>
                </button>
              </p>
              {day.shifts.map((shift,sIdx)=>(
                <div key={sIdx} className="space-y-2 mt-2 border p-2 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Start Time</label>
                      <input
                        type="time" value={shift.startTime}
                        onChange={e=>handleTimeChange(dayIdx,sIdx,'startTime',e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">End Time</label>
                      <input
                        type="time" value={shift.endTime}
                        onChange={e=>handleTimeChange(dayIdx,sIdx,'endTime',e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                        required
                      />
                    </div>
                  </div>

                  <p className="text-sm font-medium mt-2">Project Requirements</p>
                  {shift.roles.map((r,rIdx)=>(
                    <div key={rIdx} className="space-y-2 border border-gray-200 rounded p-2">
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <input
                          type="text" placeholder="Role" value={r.role}
                          onChange={e=>handleRoleChange(dayIdx,sIdx,rIdx,'role',e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number" placeholder="Count" value={r.count}
                          onChange={e=>handleRoleChange(dayIdx,sIdx,rIdx,'count',e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                        />
                      </div>

                      {/* per-day “Specify by” */}
                      <label className="block text-sm font-medium text-gray-700">Specify by:</label>
                      <select
                        value={r.specType}
                        onChange={e=>handleRoleChange(dayIdx,sIdx,rIdx,'specType',e.target.value)}
                        className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="none">None</option>
                        <option value="jobType">Job Type</option>
                        <option value="ticket">Ticket</option>
                      </select>

                      {r.specType==='jobType' && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {jobTypeOptions.map(jt=>(
                            <label key={jt} className="inline-flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={r.jobTypes[jt]||false}
                                onChange={e=>{
                                  const val = e.target.checked;
                                  handleRoleChange(dayIdx,sIdx,rIdx,'jobTypes',{
                                    ...r.jobTypes, [jt]: val
                                  });
                                }}
                              />{jt}
                            </label>
                          ))}
                        </div>
                      )}

                      {r.specType==='ticket' && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ticketOptions.map(tk=>(
                            <label key={tk} className="inline-flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={r.tickets[tk]||false}
                                onChange={e=>{
                                  const val=e.target.checked;
                                  handleRoleChange(dayIdx,sIdx,rIdx,'tickets',{
                                    ...r.tickets, [tk]: val
                                  });
                                }}
                              />{tk}
                            </label>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={()=>removeRoleRequirement(dayIdx,sIdx,rIdx)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove Role
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={()=>addRoleRequirement(dayIdx,sIdx)}
                    className="text-blue-600 hover:underline mt-1 text-sm"
                  >
                    + Add Another Role
                  </button>
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              Save Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShiftModal;
