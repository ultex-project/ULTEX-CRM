import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, reset } from 'app/entities/company/company.reducer';
import { ICompany } from 'app/shared/model/company.model';

type CompanyFormState = {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
};

type FormErrors = Partial<Record<keyof CompanyFormState, string>>;

const FORM_ID = 'company-create-form';

const CompanyCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<CompanyFormState>({
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [createdAt] = useState(() => dayjs());
  const [updatedAt, setUpdatedAt] = useState(() => dayjs());

  const loading = useAppSelector(state => state.company.loading);
  const updating = useAppSelector(state => state.company.updating);
  const updateSuccess = useAppSelector(state => state.company.updateSuccess);
  const companyError = useAppSelector(state => state.company.errorMessage);

  const industryOptions = useMemo(() => ['Technology', 'Manufacturing', 'Logistics', 'Finance', 'Healthcare', 'Other'], []);

  useEffect(() => {
    dispatch(reset());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/dashboard/company/list');
    }
  }, [updateSuccess, navigate]);

  const handleChange = (field: keyof CompanyFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!formValues.name.trim()) {
      nextErrors.name = "Le nom de l'entreprise est obligatoire";
    }
    const emailValue = formValues.email.trim();
    if (!emailValue) {
      nextErrors.email = "L'adresse email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = 'Veuillez saisir une adresse email valide';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (created: dayjs.Dayjs, updated: dayjs.Dayjs): ICompany => {
    const payload: ICompany = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      createdAt: created,
      updatedAt: updated,
    };

    if (formValues.address.trim()) {
      payload.address = formValues.address.trim();
    }
    if (formValues.city.trim()) {
      payload.city = formValues.city.trim();
    }
    if (formValues.country.trim()) {
      payload.country = formValues.country.trim();
    }
    if (formValues.phone.trim()) {
      payload.phone = formValues.phone.trim();
    }
    if (formValues.website.trim()) {
      payload.website = formValues.website.trim();
    }
    if (formValues.industry) {
      payload.industry = formValues.industry;
    }

    return payload;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const now = dayjs();
    setUpdatedAt(now);

    const payload = buildPayload(createdAt, now);
    dispatch(createEntity(payload));
  };

  const renderError = (field: keyof CompanyFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const formatTimestamp = (value: dayjs.Dayjs) => value.format('YYYY-MM-DD HH:mm');

  return (
    <div className="company-create-page">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Créer une nouvelle entreprise</h5>
            <p className="mb-0 text-muted">Renseignez les informations essentielles de l&apos;entreprise.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" tag={Link} to="/dashboard/company/list" outline>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour à la liste
            </Button>
            <Button color="primary" form={FORM_ID} type="submit" disabled={updating || loading}>
              {updating || loading ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {companyError ? (
            <Alert color="danger" className="mb-4">
              {companyError}
            </Alert>
          ) : null}

          <Form id={FORM_ID} onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="6">
                <FormGroup>
                  <Label for="company-name">Nom de l&apos;entreprise *</Label>
                  <Input
                    id="company-name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange('name')}
                    placeholder="Nom de l'entreprise"
                  />
                  {renderError('name')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-email">Email *</Label>
                  <Input
                    id="company-email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    placeholder="contact@entreprise.com"
                  />
                  {renderError('email')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-phone">Téléphone</Label>
                  <Input
                    id="company-phone"
                    name="phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={handleChange('phone')}
                    placeholder="(+33) 1 23 45 67 89"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-website">Site web</Label>
                  <Input
                    id="company-website"
                    name="website"
                    type="url"
                    value={formValues.website}
                    onChange={handleChange('website')}
                    placeholder="https://www.entreprise.com"
                  />
                </FormGroup>
              </Col>
              <Col md="8">
                <FormGroup>
                  <Label for="company-address">Adresse</Label>
                  <Input
                    id="company-address"
                    name="address"
                    value={formValues.address}
                    onChange={handleChange('address')}
                    placeholder="Adresse complète"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="company-city">Ville</Label>
                  <Input id="company-city" name="city" value={formValues.city} onChange={handleChange('city')} placeholder="Ville" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-country">Pays</Label>
                  <Input
                    id="company-country"
                    name="country"
                    value={formValues.country}
                    onChange={handleChange('country')}
                    placeholder="Pays"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-industry">Secteur</Label>
                  <Input
                    type="select"
                    id="company-industry"
                    name="industry"
                    value={formValues.industry}
                    onChange={handleChange('industry')}
                  >
                    <option value="">Sélectionnez un secteur</option>
                    {industryOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-createdAt">Créé le</Label>
                  <Input id="company-createdAt" value={formatTimestamp(createdAt)} disabled readOnly />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="company-updatedAt">Mis à jour le</Label>
                  <Input id="company-updatedAt" value={formatTimestamp(updatedAt)} disabled readOnly />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanyCreatePage;
