import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const VanCard = ({ id, plate, name, tax, taxExpiry, motTest, motExpiry, recall,van }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCardClick = () => {
    //incase  object is passed
     van? navigate(`${id}`, {state:{van}}) : navigate(`${id}`);
  };

 return (
  <div
    onClick={handleCardClick}
    className="flex flex-col md:flex-row items-start md:items-center justify-between border-b p-4 gap-4 cursor-pointer hover:bg-orange-50 transition transform hover:-translate-y-1 hover:shadow-md"
  >
    {/* Plate Number */}
    <div className="bg-yellow-300 text-black font-bold text-center px-4 py-2 rounded-md w-full md:w-32 flex items-center justify-center">
      {plate}
    </div>

    {/* Name */}
    <div className="flex items-center justify-start pl-0 md:pl-6">
      <div className="text-gray-800 font-semibold text-lg">{name}</div>
    </div>

    {/* Status Info */}
    <div className="flex flex-col items-start md:items-end text-sm text-left md:text-right space-y-1 w-full md:w-auto">
      <div className="flex items-center gap-1">
        {tax === 'Taxed' ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
        <span className={tax === 'Taxed' ? 'text-green-600' : 'text-red-600'}>
          Tax: {formatDate(taxExpiry)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {motTest === 'Valid' ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
        <span className={motTest === 'Valid' ? 'text-green-600' : 'text-red-600'}>
          MOT: {formatDate(motExpiry)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {recall === 'Unknown' ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
        <span className={recall === 'Unknown' ? 'text-green-600' : 'text-red-600'}>
          Recall: {recall === 'Unknown' ? 'No' : 'Yes'}
        </span>
      </div>
    </div>
  </div>
);
};

export default VanCard;