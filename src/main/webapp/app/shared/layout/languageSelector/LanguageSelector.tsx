// src/main/webapp/app/shared/layout/LanguageSelector.tsx
import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { translate } from 'react-jhipster';

// Define flags and languages
const languages = [
  { code: 'en', name: 'English', flag: 'us.svg' },
  { code: 'fr', name: 'French', flag: 'fr.svg' },
  { code: 'ar', name: 'Arabic', flag: 'ar.svg' },
  // Add more as needed
];

const LanguageSelector = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const handleLanguageChange = lang => {
    setSelectedLang(lang);
    translate(lang.code); // JHipster i18n
  };

  return (
    <UncontrolledDropdown>
      {/* Main Button - NO TEXT, just flag icon */}
      <DropdownToggle
        tag="div"
        className="d-flex align-items-center justify-content-center rounded-circle bg-white border shadow-sm cursor-pointer p-2"
        style={{
          width: '40px',
          height: '40px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)')}
      >
        <img
          src={`content/images/languagesIcons/${selectedLang.flag}`}
          alt={selectedLang.name}
          style={{ width: '24px', height: '24px', borderRadius: '50%' }}
        />
      </DropdownToggle>

      {/* Dropdown Menu */}
      <DropdownMenu
        className="rounded-4 shadow-lg border p-0 mt-2"
        style={{
          minWidth: '220px',
          backgroundColor: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        {languages.map(lang => (
          <DropdownItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className="d-flex align-items-center gap-3 px-4 py-3 rounded-3"
            style={{
              fontSize: '1rem',
              fontWeight: 500,
              color: '#212529',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <span className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <img src={`content/images/languagesIcons/${lang.flag}`} alt={lang.name} style={{ width: '32px', height: '32px' }} />
            </span>
            <span>{lang.name}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default LanguageSelector;
