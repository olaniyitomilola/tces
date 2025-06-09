import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const ShiftTimeFields = ({ dateIndex, shiftIndex, shift, onTimeChange, onAddRole, onRemoveRole, onRoleChange, onRemoveShift }) => {
  return (
    <div className="space-y-2 border rounded p-3 bg-gray-50">
      <div className="flex items-center gap-3">
        <input
          type="time"
          value={shift.startTime}
          onChange={(e) => onTimeChange(dateIndex, shiftIndex, 'startTime', e.target.value)}
          className="w-1/2 px-3 py-2 border rounded text-sm"
        />
        <input
          type="time"
          value={shift.endTime}
          onChange={(e) => onTimeChange(dateIndex, shiftIndex, 'endTime', e.target.value)}
          className="w-1/2 px-3 py-2 border rounded text-sm"
        />
        {shiftIndex > 0 && (
          <button type="button" onClick={() => onRemoveShift(dateIndex, shiftIndex)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>

      {shift.roles.map((roleItem, roleIndex) => (
        <div key={roleIndex} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Role"
            value={roleItem.role}
            onChange={(e) => onRoleChange(dateIndex, shiftIndex, roleIndex, 'role', e.target.value)}
            className="w-1/2 px-3 py-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Number"
            value={roleItem.count}
            onChange={(e) => onRoleChange(dateIndex, shiftIndex, roleIndex, 'count', e.target.value)}
            className="w-1/2 px-3 py-2 border rounded text-sm"
          />
          <button type="button" onClick={() => onRemoveRole(dateIndex, shiftIndex, roleIndex)}>
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onAddRole(dateIndex, shiftIndex)}
        className="flex items-center text-sm text-green-700 hover:underline"
      >
        <PlusCircle className="w-4 h-4 mr-1" /> Add Role
      </button>
    </div>
  );
};

export default ShiftTimeFields;
