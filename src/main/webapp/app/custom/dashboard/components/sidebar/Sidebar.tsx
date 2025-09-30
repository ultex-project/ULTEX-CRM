// src/main/webapp/app/custom/dashboard/components/sidebar/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard,
  faBuilding,
  faUserPlus,
  faChartLine,
  faCog,
  faChevronRight,
  faChevronLeft,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from 'app/config/store';
import './Sidebar.scss';

interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: propCollapsed, toggleCollapse }) => {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const account = useAppSelector(state => state.authentication.account);

  // Use prop if provided, otherwise use local state
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : localCollapsed;

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setLocalCollapsed(true);
  }, [isMobile]);

  const handleToggle = () => {
    if (toggleCollapse) {
      toggleCollapse();
    } else {
      setLocalCollapsed(!localCollapsed);
    }
  };

  // Menu structure with i18n keys
  const menuItems = [
    {
      id: 'overview',
      label: 'global.menu.overview',
      icon: faDashboard,
      path: '/dashboard',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'companies',
      label: 'global.menu.companies',
      icon: faBuilding,
      path: '/dashboard/company',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'contacts',
      label: 'global.menu.contacts',
      icon: faUserPlus,
      path: '/dashboard/contact',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'deals',
      label: 'global.menu.deals',
      icon: faChartLine,
      path: '/dashboard/deal',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'reports',
      label: 'global.menu.reports',
      icon: faChartLine,
      path: '/dashboard/report',
      roles: ['ROLE_ADMIN'],
    },
    {
      id: 'calendar',
      label: 'global.menu.calendar',
      icon: faUsers,
      path: '/dashboard/calendar',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'admin',
      label: 'global.menu.admin.main',
      icon: faCog,
      path: '/dashboard/admin',
      roles: ['ROLE_ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.roles || item.roles.some(role => account?.authorities?.includes(role)));

  return (
    <aside className={`rhombus-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          {!isCollapsed && (
            <>
              <div className="logo-icon">Ultex</div>
              <span className="logo-text">
                <Translate contentKey="global.title">CRM</Translate>
              </span>
            </>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={handleToggle}
          aria-label={translate(isCollapsed ? 'global.menu.expand' : 'global.menu.collapse')}
        >
          <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </span>
        </button>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {filteredMenuItems.map(item => (
          <a key={item.id} href={item.path} className={`menu-item ${item.id === 'overview' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={item.icon} className="menu-icon" />
            {!isCollapsed && (
              <span className="menu-label">
                <Translate contentKey={item.label} />
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">
            <img src="content/images/adminIcon.jpg" alt="User" />
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <span className="username">{account?.login || 'Admin'}</span>
              <span className="user-role">{account?.authorities?.join(', ') || 'Admin'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
