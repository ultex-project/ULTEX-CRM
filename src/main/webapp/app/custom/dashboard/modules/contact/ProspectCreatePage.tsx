import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, reset as resetProspect } from 'app/entities/prospect/prospect.reducer';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';
import { ProspectStatus } from 'app/shared/model/enumerations/prospect-status.model';
import { IProspect } from 'app/shared/model/prospect.model';

import './ProspectCreatePage.scss';

type ProspectFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone1: string;
  phone2: string;
  source: string;
  status: keyof typeof ProspectStatus;
  companyId: string;
  convertedById: string;
  address: string;
  city: string;
  country: string;
  referredBy: string;
};

type FormErrors = Partial<Record<keyof ProspectFormState, string>>;

const ProspectCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const statusOptions = useMemo(() => Object.keys(ProspectStatus) as Array<keyof typeof ProspectStatus>, []);

  const [formValues, setFormValues] = useState<ProspectFormState>(() => {
    const defaultStatus: ProspectFormState['status'] = statusOptions.find(option => option === 'NEW') ?? statusOptions[0] ?? 'NEW';
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone1: '',
      phone2: '',
      source: '',
      status: defaultStatus,
      companyId: '',
      convertedById: '',
      address: '',
      city: '',
      country: '',
      referredBy: '',
    };
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const companies = useAppSelector(state => state.company.entities);
  const companyLoading = useAppSelector(state => state.company.loading);
  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const internalUserLoading = useAppSelector(state => state.internalUser.loading);
  const prospectUpdating = useAppSelector(state => state.prospect.updating);
  const updateSuccess = useAppSelector(state => state.prospect.updateSuccess);
  const prospectError = useAppSelector(state => state.prospect.errorMessage);

  useEffect(() => {
    dispatch(resetProspect());
    dispatch(getCompanies({ page: 0, size: 50, sort: 'name,asc' }));
    dispatch(getInternalUsers({ sort: 'fullName,asc' }));

    return () => {
      dispatch(resetProspect());
    };
  }, [dispatch]);

  useEffect(() => {
    if (internalUsers.length > 0 && !formValues.convertedById) {
      const defaultInternalUserId = internalUsers[0].id ? internalUsers[0].id.toString() : '';
      if (defaultInternalUserId) {
        setFormValues(prev => ({ ...prev, convertedById: defaultInternalUserId }));
      }
    }
  }, [internalUsers, formValues.convertedById]);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/dashboard/contact');
    }
  }, [updateSuccess, navigate]);

  const handleChange = (field: keyof ProspectFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isValidStatus = (value: string): value is ProspectFormState['status'] => statusOptions.some(option => option === value);

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!formValues.firstName.trim()) {
      nextErrors.firstName = 'First name is required';
    }
    if (!formValues.lastName.trim()) {
      nextErrors.lastName = 'Last name is required';
    }
    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required';
    }
    if (!formValues.convertedById) {
      nextErrors.convertedById = 'Please assign an owner';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildEntity = (): IProspect => {
    const payload: IProspect = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim(),
      status: formValues.status,
      convertedBy: { id: Number(formValues.convertedById) },
    };

    if (formValues.phone1.trim()) {
      payload.phone1 = formValues.phone1.trim();
    }
    if (formValues.phone2.trim()) {
      payload.phone2 = formValues.phone2.trim();
    }
    if (formValues.source.trim()) {
      payload.source = formValues.source.trim();
    }
    if (formValues.address.trim()) {
      payload.address = formValues.address.trim();
    }
    if (formValues.city.trim()) {
      payload.city = formValues.city.trim();
    }
    if (formValues.country.trim()) {
      payload.country = formValues.country.trim();
    }
    if (formValues.referredBy.trim()) {
      payload.referredBy = formValues.referredBy.trim();
    }
    if (formValues.companyId) {
      payload.company = { id: Number(formValues.companyId) };
    }

    return payload;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    dispatch(createEntity(buildEntity()));
  };

  const renderError = (field: keyof ProspectFormState) => {
    if (!formErrors[field]) {
      return null;
    }
    return <div className="text-danger small mt-1">{formErrors[field]}</div>;
  };

  const renderSelectError = (field: keyof ProspectFormState) => {
    if (!formErrors[field]) {
      return null;
    }
    return <div className="text-danger small">{formErrors[field]}</div>;
  };

  const referenceLoading = companyLoading || internalUserLoading;

  return (
    <div className="prospect-create-page">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Add New Prospect</h5>
            <p className="mb-0 text-muted">Capture the details of a new lead to keep your pipeline up to date.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" tag={Link} to="/dashboard/contact" outline>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Prospects
            </Button>
            <Button color="primary" form="prospect-create-form" type="submit" disabled={prospectUpdating}>
              {prospectUpdating ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              Save Prospect
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {prospectError ? (
            <Alert color="danger" className="mb-4">
              {prospectError}
            </Alert>
          ) : null}

          <Form id="prospect-create-form" onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-firstName">First Name *</Label>
                  <Input
                    id="prospect-firstName"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange('firstName')}
                    placeholder="Enter first name"
                  />
                  {renderError('firstName')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-lastName">Last Name *</Label>
                  <Input
                    id="prospect-lastName"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange('lastName')}
                    placeholder="Enter last name"
                  />
                  {renderError('lastName')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-email">Email *</Label>
                  <Input
                    id="prospect-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    placeholder="name@example.com"
                  />
                  {renderError('email')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-phone1">Primary Phone</Label>
                  <Input
                    id="prospect-phone1"
                    name="phone1"
                    value={formValues.phone1}
                    onChange={handleChange('phone1')}
                    placeholder="(+1) 555-0100"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-phone2">Secondary Phone</Label>
                  <Input
                    id="prospect-phone2"
                    name="phone2"
                    value={formValues.phone2}
                    onChange={handleChange('phone2')}
                    placeholder="(+1) 555-0101"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-source">Source</Label>
                  <Input
                    id="prospect-source"
                    name="source"
                    value={formValues.source}
                    onChange={handleChange('source')}
                    placeholder="Campaign, referral, website..."
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-company">Company</Label>
                  <Input
                    type="select"
                    id="prospect-company"
                    name="company"
                    value={formValues.companyId}
                    onChange={handleChange('companyId')}
                    disabled={referenceLoading}
                  >
                    <option value="">Select company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id ?? ''}>
                        {company.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-status">Status</Label>
                  <Input
                    type="select"
                    id="prospect-status"
                    name="status"
                    value={formValues.status}
                    onChange={event => {
                      const nextStatus = event.target.value;
                      if (isValidStatus(nextStatus)) {
                        setFormValues(prev => ({ ...prev, status: nextStatus }));
                      }
                    }}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-convertedBy">Owner *</Label>
                  <Input
                    type="select"
                    id="prospect-convertedBy"
                    name="convertedBy"
                    value={formValues.convertedById}
                    onChange={handleChange('convertedById')}
                    disabled={referenceLoading}
                  >
                    <option value="">Select owner</option>
                    {internalUsers.map(user => (
                      <option key={user.id} value={user.id ?? ''}>
                        {user.fullName ?? user.email ?? `User #${user.id}`}
                      </option>
                    ))}
                  </Input>
                  {renderSelectError('convertedById')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-address">Address</Label>
                  <Input
                    id="prospect-address"
                    name="address"
                    value={formValues.address}
                    onChange={handleChange('address')}
                    placeholder="Street address"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="prospect-city">City</Label>
                  <Input id="prospect-city" name="city" value={formValues.city} onChange={handleChange('city')} placeholder="City" />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="prospect-country">Country</Label>
                  <Input
                    id="prospect-country"
                    name="country"
                    value={formValues.country}
                    onChange={handleChange('country')}
                    placeholder="Country"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="prospect-referredBy">Referred By</Label>
                  <Input
                    id="prospect-referredBy"
                    name="referredBy"
                    value={formValues.referredBy}
                    onChange={handleChange('referredBy')}
                    placeholder="Referral source"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProspectCreatePage;
