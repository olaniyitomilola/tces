// src/components/StaffCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeInfo } from 'lucide-react';

const StaffCard = ({ id, firstName, lastName, role }) => {
  const navigate = useNavigate();
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div
      onClick={() => navigate(`/manager-dashboard/staff/${id}`)}
      className="flex items-center justify-between border-b py-3 px-2 cursor-pointer hover:bg-orange-50 hover:shadow-sm transition-all rounded-md"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <div className="text-sm md:text-base font-medium text-gray-800">
          {firstName} {lastName}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-1 text-sm text-orange-800 font-medium bg-orange-100 px-2 py-1 rounded-full">
        <BadgeInfo className="w-4 h-4" />
        {role}
      </div>
    </div>
  );
};

export default StaffCard;
