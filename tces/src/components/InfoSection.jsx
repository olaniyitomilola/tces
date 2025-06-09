// src/components/InfoSection.jsx
import React from 'react';
import { BadgeInfo, Calendar, FileText, AlertTriangle } from 'lucide-react';

const InfoSection = ({ name, motExpiry, taxExpiry, recall }) => {
  const formatDate = date =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'N/A';

  const items = [
    {
      key: 'name',
      Icon: BadgeInfo,
      label: 'Name',
      value: name
    },
    {
      key: 'mot',
      Icon: Calendar,
      label: 'MOT Expiry',
      value: formatDate(motExpiry)
    },
    {
      key: 'tax',
      Icon: FileText,
      label: 'Tax Expiry',
      value: formatDate(taxExpiry)
    },
    {
      key: 'recall',
      Icon: AlertTriangle,
      label: 'Recall',
      value: recall === 'Unknown' ? 'No' : 'Yes'
    }
  ];

  return (
    <div className="bg-orange-50 border border-orange-100 p-6 rounded-lg shadow-sm space-y-6">
      {items.map(({ key, Icon, label, value }) => (
        <div key={key} className="flex items-center">
          <Icon className="w-6 h-6 text-orange-600 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoSection;
