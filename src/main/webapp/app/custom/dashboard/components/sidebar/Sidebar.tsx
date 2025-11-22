// src/main/webapp/app/custom/dashboard/components/sidebar/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faDashboard,
  faBuilding,
  faUserPlus,
  faChartLine,
  faCog,
  faChevronRight,
  faChevronLeft,
  faUsers,
  faFileAlt,
  faClock,
  faChevronDown,
  faDatabase,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from 'app/config/store';
import './sidebar.scss';

interface SidebarProps {
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: IconDefinition;
  roles?: string[];
  path?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: propCollapsed, toggleCollapse }) => {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const account = useAppSelector(state => state.authentication.account);
  const authorities = account?.authorities ?? [];

  const ROLE_DATA = 'ROLE_DATA';
  const dataRoleMenuIds = new Set(['overview', 'contacts', 'clients', 'data']);

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
  const hasRoleAccess = (roles?: string[]) => !roles || roles.some(role => authorities.includes(role));

  const isDataOnly = authorities.includes(ROLE_DATA) && authorities.every(role => role === ROLE_DATA);

  const toggleSubmenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'global.menu.overview',
      icon: faDashboard,
      path: '/dashboard',
      roles: ['ROLE_ADMIN', 'ROLE_USER', ROLE_DATA],
    },
    {
      id: 'societe-liee',
      label: 'crmApp.societeLiee.home.title',
      icon: faBuilding,
      path: '/dashboard/societe-liee/list',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    {
      id: 'contacts',
      label: 'global.menu.contacts',
      icon: faUserPlus,
      path: '/dashboard/contact',
      roles: ['ROLE_ADMIN', 'ROLE_USER', ROLE_DATA],
    },
    {
      id: 'clients',
      label: 'global.menu.clients.main',
      icon: faUsers,
      roles: ['ROLE_ADMIN', 'ROLE_USER', ROLE_DATA],
      children: [
        {
          id: 'clients-list',
          label: 'global.menu.clients.list',
          icon: faFileAlt,
          path: '/dashboard/clients',
          roles: ['ROLE_ADMIN', 'ROLE_USER', ROLE_DATA],
        },
        {
          id: 'clients-history',
          label: 'global.menu.clients.history',
          icon: faClock,
          path: '/dashboard/client-history',
          roles: ['ROLE_ADMIN'],
        },
      ],
    },
    {
      id: 'data',
      label: 'global.menu.data',
      icon: faDatabase,
      path: '/dashboard/data',
      roles: ['ROLE_ADMIN', 'ROLE_DATA'],
    },
    {
      id: 'sous-services',
      label: 'global.menu.sousServices',
      icon: faList,
      path: '/dashboard/sous-services',
      roles: ['ROLE_ADMIN', 'ROLE_DATA'],
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

  const filteredMenuItems = menuItems
    .filter(item => !isDataOnly || dataRoleMenuIds.has(item.id))
    .map(item => {
      if (item.children) {
        const visibleChildren = item.children.filter(child => hasRoleAccess(child.roles));
        if (!hasRoleAccess(item.roles) || visibleChildren.length === 0) {
          return null;
        }
        return { ...item, children: visibleChildren };
      }
      return hasRoleAccess(item.roles) ? item : null;
    })
    .filter((item): item is MenuItem => !!item);

  return (
    <aside className={`rhombus-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          {!isCollapsed && (
            <>
              <div className="logo-icon">
                <img src={'/content/images/logo.svg'} />
              </div>
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
        {filteredMenuItems.map(item =>
          item.children ? (
            <div key={item.id} className={`menu-group ${expandedMenus[item.id] ? 'expanded' : ''}`}>
              <button type="button" className="menu-item menu-parent" onClick={() => toggleSubmenu(item.id)}>
                <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                {!isCollapsed && (
                  <span className="menu-label">
                    <Translate contentKey={item.label} />
                  </span>
                )}
                {!isCollapsed && (
                  <FontAwesomeIcon icon={expandedMenus[item.id] ? faChevronDown : faChevronRight} className="submenu-toggle-icon" />
                )}
              </button>
              {!isCollapsed && (
                <div className={`submenu ${expandedMenus[item.id] ? 'open' : ''}`}>
                  {item.children.map(child => (
                    <a key={child.id} href={child.path} className="submenu-item">
                      <FontAwesomeIcon icon={child.icon} className="menu-icon" />
                      <span className="menu-label">
                        <Translate contentKey={child.label} />
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={item.id} href={item.path} className={`menu-item ${item.id === 'overview' ? 'active' : ''}`}>
              <FontAwesomeIcon icon={item.icon} className="menu-icon" />
              {!isCollapsed && (
                <span className="menu-label">
                  <Translate contentKey={item.label} />
                </span>
              )}
            </a>
          ),
        )}
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
