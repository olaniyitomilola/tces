// src/components/ShiftModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShiftModal({
  isOpen,
  onClose,
  clientName,
  location,
  date,
  startTime,
  endTime,
  roles,
  users = [],           // array of staff objects
  assignedForDay,  // Set of user IDs already assigned for this day
  onAssign         // callback(roleIdx, slotIdx, userId) if you want to notify parent
}) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    // initialize one slot per required_count, empty string = unassigned
    setAssignments(roles.map(r => Array(r.required_count).fill('')));
  }, [isOpen, roles]);

  const handleAssignmentChange = (roleIdx, slotIdx, staffId) => {
    setAssignments(prev => {
      const copy = prev.map(arr => [...arr]);
      copy[roleIdx][slotIdx] = staffId;
      return copy;
    });
    if (onAssign) onAssign(roleIdx, slotIdx, staffId);
  };

  // filter out already assigned today
  const unassignedUsers = users.filter(u => !assignedForDay.has(u.id));

  // return only those users satisfying all role requirements
  const getEligibleUsers = (roleObj) => {
    const { jobTypes = [], tickets = [] } = roleObj.requirement || {};
    return unassignedUsers.filter(user => {
      // all required jobTypes must be true
      const jobsOk = jobTypes.every(jt => user[`jobtype_${jt}`]);
      // all required tickets must be true
      const ticketsOk = tickets.every(tk => user[`ticket_${tk}`]);
      return jobsOk && ticketsOk;
    });
  };

  const handleSave = () => {
    // Here you could POST assignments + shift info
    console.log({ assignments });
    toast.success('Assignments saved!', { duration: 1000 });
    setTimeout(onClose, 1000);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X size={18}/>
        </button>
        <h2 className="text-lg font-semibold mb-4">Shift Details</h2>
        <p className="mb-2"><strong>Client:</strong> {clientName}</p>
        <p className="mb-2"><strong>Location:</strong> {location}</p>
        <p className="mb-2">
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}
        </p>
        <p className="mb-4">
          <strong>Time:</strong> {startTime}–{endTime}
        </p>

        <h3 className="font-medium mb-2">Assign Roles</h3>
        <div className="space-y-4">
          {roles.map((roleObj, roleIdx) => {
            const eligible = getEligibleUsers(roleObj);
            return (
              <div key={roleIdx} className="bg-gray-50 border rounded p-3">
                <p className="font-medium mb-2">
                  {roleObj.role} × {roleObj.required_count}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {assignments[roleIdx]?.map((sel, slotIdx) => (
                    <select
                      key={slotIdx}
                      value={sel}
                      onChange={e =>
                        handleAssignmentChange(roleIdx, slotIdx, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">— Select staff —</option>
                      {eligible.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.first_name} {u.last_name}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
          >
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
}
