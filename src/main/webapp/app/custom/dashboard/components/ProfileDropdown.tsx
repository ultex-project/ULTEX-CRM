// src/main/webapp/app/shared/layout/ProfileDropdown.tsx
import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faInfoCircle, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from 'app/config/store';

const ProfileDropdown = () => {
  const account = useAppSelector(state => state.authentication.account);
  const [isOpen, setIsOpen] = useState(false);

  // Fallback data if no account
  const user = {
    firstName: account?.firstName || 'User',
    lastName: account?.lastName || '',
    email: account?.email || 'user@example.com',
    imageUrl: account?.imageUrl || 'content/images/adminIcon.jpg',
  };

  const handleSignOut = () => {
    window.location.href = '/logout'; // Or dispatch logout action
  };

  return (
    <UncontrolledDropdown>
      {/* Trigger Button */}
      <DropdownToggle
        tag="div"
        className="d-flex align-items-center gap-2 cursor-pointer rounded-pill px-3 py-2 bg-white border shadow-sm rounded-circle "
        style={{
          backgroundColor: '#f8f9fa',
          transition: 'all 0.2s ease',
        }}
      >
        <img src={user.imageUrl} alt="Profile" className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
        <FontAwesomeIcon icon={faChevronDown} size="sm" className="text-muted d-none d-md-inline" />
        {user.lastName}
      </DropdownToggle>

      {/* Dropdown Menu */}
      <DropdownMenu
        className="rounded-4 shadow-lg border p-0 mt-2"
        style={{
          minWidth: '240px',
          backgroundColor: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
            />
            <div>
              <div className="fw-bold">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-muted small">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <DropdownItem
            tag="button"
            onClick={() => (window.location.href = '/account/settings')}
            className="d-flex align-items-center gap-3 px-4 py-2 rounded-0"
            style={{
              fontSize: '0.875rem',
              color: '#212529',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <FontAwesomeIcon icon={faUser} className="text-primary" />
            Edit profile
          </DropdownItem>

          <DropdownItem
            tag="button"
            onClick={() => (window.location.href = '/account/settings')}
            className="d-flex align-items-center gap-3 px-4 py-2 rounded-0"
            style={{
              fontSize: '0.875rem',
              color: '#212529',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <FontAwesomeIcon icon={faCog} className="text-primary" />
            Account settings
          </DropdownItem>

          <DropdownItem
            tag="button"
            onClick={() => (window.location.href = '/support')}
            className="d-flex align-items-center gap-3 px-4 py-2 rounded-0"
            style={{
              fontSize: '0.875rem',
              color: '#212529',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="text-primary" />
            Support
          </DropdownItem>
        </div>

        {/* Divider */}
        <hr className="my-2 mx-4" />

        {/* Sign Out */}
        <DropdownItem
          tag="button"
          onClick={handleSignOut}
          className="d-flex align-items-center gap-3 px-4 py-2 rounded-0 text-danger"
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffebee')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ProfileDropdown;
