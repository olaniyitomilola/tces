// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Home, Users, Truck, CreditCard, Wrench, X, CalendarDays, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo/track_civil.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Home',    icon: Home,       path: '/manager-dashboard/home'    },
    { name: 'Staff',   icon: Users,      path: '/manager-dashboard/staff'   },
    { name: 'Vans',    icon: Truck,      path: '/manager-dashboard/van'     },
    { name: 'Cards',   icon: CreditCard, path: '/manager-dashboard/card'    },
    { name: 'Tools',   icon: Wrench,     path: '/manager-dashboard/tool'    },
    { name: 'Clients', icon: UserRound,  path: '/manager-dashboard/clients' },
    { name: 'Planner', icon: CalendarDays, path: '/manager-dashboard/planner' }
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow">
        <button onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }}>
          {isOpen ? (
            <X size={24} className="text-orange-600" />
          ) : (
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-orange-600" />
              <div className="w-6 h-0.5 bg-orange-600" />
              <div className="w-6 h-0.5 bg-orange-600" />
            </div>
          )}
        </button>
      </div>

      {/* Sidebar panel */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-md
        transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0
        md:block md:min-w-[250px] lg:min-w-[300px]
        p-4 z-40
      `}>
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Track Civil Logo" className="h-12 object-contain" />
        </div>
        <nav className="flex flex-col space-y-6">
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}
                className={`
                  flex items-center gap-3 px-2 py-2 rounded-md
                  ${location.pathname === item.path
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}
                `}
              >
                <IconComponent size={20} />
                <span className="inline text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
