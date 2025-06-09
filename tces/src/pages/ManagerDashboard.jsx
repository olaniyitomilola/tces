// src/pages/ManagerDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import MainLayout from '../components/MainLayout';
import { Outlet } from 'react-router-dom';

const ManagerDashboard = () => {
  return (
    // make the whole viewport flex and hide overflow
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* right‐hand area: flex column, hide its overflow too */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainLayout>
          <Outlet />
        </MainLayout>
      </div>
    </div>
  );
};

export default ManagerDashboard;
