import React from 'react';
import MainLayout from '../../components/MainLayout';
import { Outlet } from 'react-router-dom';
import StaffSidebar from '../../components/StaffSideBar';

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <StaffSidebar />
      <div className="flex-1 flex overflow-hidden flex-col">
       
        <MainLayout >
          <Outlet />
        </MainLayout>
      </div>
    </div>
  );
};

export default Dashboard;