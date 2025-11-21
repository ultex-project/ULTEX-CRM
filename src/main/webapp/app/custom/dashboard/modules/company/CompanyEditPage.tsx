import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, reset, updateEntity } from 'app/entities/company/company.reducer';
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

const FORM_ID = 'company-edit-form';

const CompanyEditPage = () => {
  const { id } = useParams<'id'>();
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

  const companyEntity = useAppSelector(state => state.company.entity);
  const loading = useAppSelector(state => state.company.loading);
  const updating = useAppSelector(state => state.company.updating);
  const updateSuccess = useAppSelector(state => state.company.updateSuccess);
  const companyError = useAppSelector(state => state.company.errorMessage);

  useEffect(() => {
    dispatch(reset());
    if (id) {
      dispatch(getEntity(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (companyEntity) {
      setFormValues({
        name: companyEntity.name ?? '',
        address: companyEntity.address ?? '',
        city: companyEntity.city ?? '',
        country: companyEntity.country ?? '',
        phone: companyEntity.phone ?? '',
        email: companyEntity.email ?? '',
        website: companyEntity.website ?? '',
        industry: companyEntity.industry ?? '',
      });
    }
  }, [companyEntity]);

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
    } else if (!emailValue.includes('@')) {
      nextErrors.email = 'Veuillez saisir une adresse email valide';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): ICompany => {
    const payload: ICompany = {
      id: companyEntity?.id ?? (id ? Number(id) : undefined),
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      createdAt: companyEntity?.createdAt,
      updatedAt: dayjs(),
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
    dispatch(updateEntity(buildPayload()));
  };

  const renderError = (field: keyof CompanyFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const isLoadingEntity = loading && !companyEntity?.id;

  return (
    <div className="company-edit-page">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Modifier l&apos;entreprise</h5>
            <p className="mb-0 text-muted">Mettre à jour les informations de l&apos;entreprise.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" tag={Link} to="/dashboard/company/list" outline>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour à la liste
            </Button>
            <Button color="primary" form={FORM_ID} type="submit" disabled={updating || isLoadingEntity}>
              {updating || isLoadingEntity ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
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

          {isLoadingEntity ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner />
            </div>
          ) : (
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
                      <option value="Technology">Technology</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanyEditPage;
