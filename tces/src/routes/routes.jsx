import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ManagerDashboard from '../pages/ManagerDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Staff from '../pages/Staff';
import Van from '../pages/Van';
import VanDetails from '../pages/VanDetails';
import Card from '../pages/Card';
import Tool from '../pages/Tool';
import Clients from '../pages/Clients';
import StaffDetails from '../pages/StaffDetails';
import StaffEdit from '../pages/StaffEdit';
import WeekPlanner from '../pages/WeekPlanner';


//for non-manager-staff

import Dashboard from '../pages/staff/Dashboard';
import StaffVan from '../pages/staff/Van';
import Account from '../pages/staff/Account';
import Shifts from '../pages/staff/Shifts';
import Tools from '../pages/staff/Tools';
import StaffHome from '../pages/staff/StaffHome';
import StaffVanDetails from '../pages/staff/staffVanDetails';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute requireManagerAccess>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="staff" element={<Staff />} />
          <Route path="staff/:id" element={<StaffDetails />} />
          <Route path="staff/:id/edit" element={<StaffEdit />} />
          <Route path="van" element={<Van />} />
          <Route path="van/:id" element={<VanDetails />} />
          <Route path="card" element={<Card />} />
          <Route path="tool" element={<Tool />} />
          <Route path="clients" element={<Clients />} />
          <Route path="planner" element={<WeekPlanner/>}/>
        </Route>
       
       
       
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }>

            <Route index element={<StaffHome />} />
            <Route path="account" element={<Account />} />
            <Route path="shifts" element={<Shifts />} />
            <Route path="van" element={<StaffVan />} />
            <Route path='van/:id' element= {<StaffVanDetails/>}/>
            <Route path="tools" element={<Tools />} />

          </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;