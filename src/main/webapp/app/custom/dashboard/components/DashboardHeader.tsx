// DashboardHeader.tsx
import React from 'react';
import { Navbar, Nav, NavItem, Form, InputGroup, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import { faBell, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';
import LanguageSelector from 'app/shared/layout/languageSelector/LanguageSelector';
import ProfileDropdown from 'app/custom/dashboard/components/ProfileDropdown';

const DashboardHeader = () => {
  const account = useAppSelector(state => state.authentication.account);

  return (
    <Navbar color="light" light expand="md" className="px-3 shadow-sm border-bottom">
      {/* CENTER: Search */}
      <Form className="d-none d-md-flex mx-4 flex-grow-1" style={{ maxWidth: '400px' }}>
        <InputGroup>
          <Input placeholder="Search clients, prospects..." />
          <Button color="secondary" type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </InputGroup>
      </Form>

      {/* RIGHT: Icons */}
      <Nav className="ms-auto d-flex align-items-center" navbar>
        <NavItem>
          <LanguageSelector />
        </NavItem>
        <NavItem>
          <Button color="link" className="nav-link p-2 position-relative">
            <FontAwesomeIcon icon={faBell} size="lg" />
            <span className="badge bg-danger rounded-pill position-absolute top-0 end-0">3</span>
          </Button>
        </NavItem>
        <NavItem>
          <Button color="link" className="nav-link p-2 position-relative">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            <span className="badge bg-info rounded-pill position-absolute top-0 end-0">2</span>
          </Button>
        </NavItem>
        <NavItem>
          <ProfileDropdown />
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default DashboardHeader;
