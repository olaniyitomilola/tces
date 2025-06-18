import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CheckCircle,
  XCircle,
  HardHat,
  TrainTrack,
  Wrench,
  Truck,
  Briefcase,
  CalendarCheck2,
  Mail,
  Phone,
  Home,
  IdCard,
  BadgeInfo,
  User,
  ClipboardList,
  ArrowLeft,
  Pencil,
  Palmtree
} from 'lucide-react';

// Helper to normalize boolean values (in case they're stored as strings)
const bool = (val) => val === true || val === 'true';

const Account = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const testingUrl = 'http://localhost:4000'; // For local testing, change as needed
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if(staff) return
    const fetchStaff = async () => {
        setLoading(true);
      try {
        console.log(currentUser.id)
        const response = await fetch(`${baseUrl}/api/staff/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch staff details');
        const data = await response.json();
        localStorage.setItem('staff', JSON.stringify(data)); // Update local storage
        setStaff(data);
        console.log(data)
      } catch (error) {
        console.error(error);
        toast.error('Error fetching staff details');
      } finally{
        setLoading(false);
      }
    };

    if (!staff) {
      fetchStaff();
    }
  }, [currentUser.id, staff]);

 if(loading){
    return (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin" />
        </div>
      );
 }
  
  if (!staff) {
    return <p className="p-4 text-red-600">Staff not found.</p>;
  }

  const {
    first_name,
    last_name,
    role,
    email,
    phone,
    nin,
    address,
    is_driver,
    license_number,
    has_pts,
    pts_number,
    ticket_coss,
    ticket_es,
    ticket_mc,
    ticket_ss,
    ticket_points,
    ticket_lxa,
    ticket_dumper,
    ticket_roller,
    ticket_small_tools,
    ticket_hand_trolley,
    available_monday,
    available_tuesday,
    available_wednesday,
    available_thursday,
    available_friday,
    available_saturday,
    available_sunday,
    jobtype_civils,
    jobtype_surveying,
    jobtype_hbe,
    jobtype_management,
    employment_type
  } = staff;

 

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      



      {/* Staff Profile Summary */}
      <div className="bg-orange-50 border border-orange-100 shadow rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-600" />
              {first_name} {last_name}
            </h2>
            <p className="text-gray-600 font-medium flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-orange-500" />
              {role}
            </p>
          </div>

  <div className="flex flex-wrap gap-3 justify-end mt-2">
    <button
    //   onClick={() => navigate(`/manager-dashboard/staff/${id}/edit`)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-md shadow-sm transition-all"
    >
      <Palmtree className="w-4 h-4" />
      Request Holiday
    </button>
   
  </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 mt-4">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-orange-500" />
            <span>
              <span className="font-semibold">Email:</span> {email}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-500" />
            <span>
              <span className="font-semibold">Phone:</span> {phone}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-orange-500" />
            <span>
              <span className="font-semibold">NIN:</span> {nin}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Home className="w-4 h-4 text-orange-500" />
            <span>
              <span className="font-semibold">Address:</span> {address}
            </span>
          </p>
        </div>
      </div>

      {/* Employment Information & Tickets */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100">
        <p className="text-sm flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-600" />
          <span>
            <span className="font-semibold">Employment Type:</span> {employment_type}
          </span>
        </p>

        {is_driver && (
          <p className="text-sm flex items-center gap-2">
            <IdCard className="w-4 h-4 text-gray-600" />
            <span>
              <span className="font-semibold">License Number:</span> {license_number}
            </span>
          </p>
        )}

        {has_pts && (
          <p className="text-sm flex items-center gap-2">
            <IdCard className="w-4 h-4 text-gray-600" />
            <span>
              <span className="font-semibold">PTS Number:</span> {pts_number}
            </span>
          </p>
        )}

        {/* Ticket Groups */}
        <div className="space-y-4">
          {/* RAIL TICKETS */}
          <div>
            <p className="font-semibold flex items-center gap-2 mb-1">
              <TrainTrack className="w-4 h-4 text-orange-600" />
              Rail Tickets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'COSS', value: ticket_coss },
                { label: 'ES', value: ticket_es },
                { label: 'MC', value: ticket_mc },
                { label: 'SS', value: ticket_ss },
                { label: 'Points', value: ticket_points },
                { label: 'LXA', value: ticket_lxa }
              ]
                .filter((t) => t.value)
                .map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                    {t.label}
                  </span>
                ))}
              {![ticket_coss, ticket_es, ticket_mc, ticket_ss, ticket_points, ticket_lxa].some(Boolean) && (
                <p className="text-gray-500 text-sm">None</p>
              )}
            </div>
          </div>

          {/* MACHINE TICKETS */}
          <div>
            <p className="font-semibold flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-orange-600" />
              Machine Tickets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Dumper', value: ticket_dumper },
                { label: 'Roller', value: ticket_roller }
              ]
                .filter((t) => t.value)
                .map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {t.label}
                  </span>
                ))}
              {![ticket_dumper, ticket_roller].some(Boolean) && (
                <p className="text-gray-500 text-sm">None</p>
              )}
            </div>
          </div>

          {/* TOOL TICKETS */}
          <div>
            <p className="font-semibold flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-orange-600" />
              Tool Tickets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Small Tools', value: ticket_small_tools },
                { label: 'Hand Trolley', value: ticket_hand_trolley }
              ]
                .filter((t) => t.value)
                .map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {t.label}
                  </span>
                ))}
              {![ticket_small_tools, ticket_hand_trolley].some(Boolean) && (
                <p className="text-gray-500 text-sm">None</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Types & Availability */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100">
        {/* JOB TYPES */}
        <div>
          <p className="font-semibold flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-orange-600" />
            Job Types
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Civils', value: jobtype_civils },
              { label: 'Surveying', value: jobtype_surveying },
              { label: 'HBE', value: jobtype_hbe },
              { label: 'Management', value: jobtype_management }
            ]
              .filter((j) => j.value)
              .map((j, i) => (
                <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  {j.label}
                </span>
              ))}
            {![jobtype_civils, jobtype_surveying, jobtype_hbe, jobtype_management].some(Boolean) && (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>
        </div>

        {/* AVAILABILITY */}
        <div>
          <p className="font-semibold flex items-center gap-2 mb-1">
            <CalendarCheck2 className="w-4 h-4 text-orange-600" />
            Availability
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Monday', value: bool(available_monday) },
              { label: 'Tuesday', value: bool(available_tuesday) },
              { label: 'Wednesday', value: bool(available_wednesday) },
              { label: 'Thursday', value: bool(available_thursday) },
              { label: 'Friday', value: bool(available_friday) },
              { label: 'Saturday', value: bool(available_saturday) },
              { label: 'Sunday', value: bool(available_sunday) }
            ]
              .filter((d) => d.value)
              .map((d, i) => (
                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {d.label}
                </span>
              ))}
            {![
              bool(available_monday),
              bool(available_tuesday),
              bool(available_wednesday),
              bool(available_thursday),
              bool(available_friday),
              bool(available_saturday),
              bool(available_sunday)
            ].some(Boolean) && <p className="text-gray-500 text-sm">None</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
