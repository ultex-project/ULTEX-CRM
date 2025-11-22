import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { TelephoneInputComponentProps } from 'app/entities/client/components/ClientForm';

const DashboardPhoneInput: React.FC<TelephoneInputComponentProps> = ({ id, value, onChange, disabled }) => {
  const phoneValue = value.startsWith('+') ? value.slice(1) : value;

  const handleChange = (phoneNumber: string) => {
    const sanitized = phoneNumber.replace(/^\+/, '');
    onChange(sanitized ? `+${sanitized}` : '');
  };

  return (
    <PhoneInput
      country="ma"
      value={phoneValue}
      onChange={handleChange}
      inputClass="form-control"
      containerClass="w-100"
      inputProps={{ id, name: 'telephonePrincipal', required: true, autoComplete: 'tel', 'data-testid': id }}
      disabled={disabled}
      specialLabel=""
      enableSearch
    />
  );
};

export default DashboardPhoneInput;
