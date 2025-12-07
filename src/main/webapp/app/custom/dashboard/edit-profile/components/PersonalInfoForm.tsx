import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

export type PersonalInfoFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  phone?: string;
  langKey: string;
  imageUrl?: string;
};

export type PersonalInfoFormErrors = Partial<Record<keyof PersonalInfoFormValues, string>>;

type LanguageOption = { value: string; label: string };

type Props = {
  values: PersonalInfoFormValues;
  errors: PersonalInfoFormErrors;
  onChange: (field: keyof PersonalInfoFormValues, value: string) => void;
  languageOptions: LanguageOption[];
};

const renderError = (message?: string) => {
  if (!message) {
    return null;
  }
  return <div className="text-danger small mt-1">{message}</div>;
};

const PersonalInfoForm: React.FC<Props> = ({ values, errors, onChange, languageOptions }) => {
  return (
    <div className="personal-info-form">
      <Row className="g-3">
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-firstName">First name *</Label>
            <Input
              id="edit-profile-firstName"
              value={values.firstName}
              onChange={event => onChange('firstName', event.target.value)}
              placeholder="First name"
            />
            {renderError(errors.firstName)}
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-lastName">Last name *</Label>
            <Input
              id="edit-profile-lastName"
              value={values.lastName}
              onChange={event => onChange('lastName', event.target.value)}
              placeholder="Last name"
            />
            {renderError(errors.lastName)}
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-login">Username *</Label>
            <Input
              id="edit-profile-login"
              value={values.login}
              onChange={event => onChange('login', event.target.value)}
              placeholder="Username"
            />
            {renderError(errors.login)}
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-email">Email</Label>
            <Input id="edit-profile-email" value={values.email} readOnly plaintext={false} disabled />
            {renderError(errors.email)}
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-phone">Phone</Label>
            <Input
              id="edit-profile-phone"
              value={values.phone ?? ''}
              onChange={event => onChange('phone', event.target.value)}
              placeholder="Phone number"
            />
            {renderError(errors.phone)}
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="edit-profile-langKey">Language *</Label>
            <Input
              id="edit-profile-langKey"
              type="select"
              value={values.langKey}
              onChange={event => onChange('langKey', event.target.value)}
            >
              <option value="">Select a language</option>
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
            {renderError(errors.langKey)}
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInfoForm;
