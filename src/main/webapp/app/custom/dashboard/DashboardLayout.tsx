// src/main/webapp/app/modules/dashboard/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'reactstrap';
import DashboardHeader from './components/DashboardHeader';
import './dashboard.scss';
import Sidebar from 'app/custom/dashboard/components/sidebar/Sidebar';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-layout d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Sidebar - Pass toggle function */}
      <Sidebar isCollapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
      <div className="d-flex flex-grow-1">
        {/* Main Area */}
        <main className={`dashboard-main flex-grow-1 ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <DashboardHeader />
          <Container fluid className="py-4 px-4">
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
