import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import Select, { MultiValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { reset as resetDemande } from 'app/entities/demande-client/demande-client.reducer';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { getEntities as getDevises } from 'app/entities/devise/devise.reducer';
import { getEntities as getIncoterms } from 'app/entities/incoterm/incoterm.reducer';
import { getEntities as getSousServices } from 'app/entities/sous-service/sous-service.reducer';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';

interface FormState {
  reference: string;
  dateDemande: string;
  servicePrincipal: string;
  typeDemande: string;
  sousServices: string[];
  provenance: string;
  incotermId: string;
  deviseId: string;
  remarqueGenerale: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

type SousServiceOption = { value: string; label: string };

const ClientDemandCreatePage = () => {
  const { clientId } = useParams<'clientId'>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const devises = useAppSelector(state => state.devise.entities);
  const devisesLoading = useAppSelector(state => state.devise.loading);
  const incoterms = useAppSelector(state => state.incoterm.entities);
  const incotermsLoading = useAppSelector(state => state.incoterm.loading);
  const sousServices = useAppSelector(state => state.sousService.entities);
  const sousServicesLoading = useAppSelector(state => state.sousService.loading);

  const servicePrincipalOptions = Object.keys(ServicePrincipal);
  const typeDemandeOptions = Object.keys(TypeDemande);
  const sousServiceOptions = useMemo<SousServiceOption[]>(
    () =>
      sousServices
        .filter(ss => ss.id !== undefined && ss.id !== null)
        .map(ss => ({
          value: String(ss.id),
          label: ss.libelle ?? ss.code ?? String(ss.id),
        })),
    [sousServices],
  );

  const [formValues, setFormValues] = useState<FormState>(() => ({
    reference: `DEM-${Date.now()}`,
    dateDemande: dayjs().format('YYYY-MM-DD'),
    servicePrincipal: servicePrincipalOptions[0] ?? '',
    typeDemande: typeDemandeOptions[0] ?? '',
    sousServices: [],
    provenance: '',
    incotermId: '',
    deviseId: '',
    remarqueGenerale: '',
  }));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clientIdNumber = useMemo(() => (clientId ? Number(clientId) : null), [clientId]);

  useEffect(() => {
    dispatch(resetDemande());
    dispatch(getDevises({}));
    dispatch(getIncoterms({}));
    dispatch(getSousServices({}));
  }, [dispatch]);

  useEffect(() => {
    if (!clientIdNumber) {
      navigate('/dashboard/clients', { replace: true });
    }
  }, [clientIdNumber, navigate]);

  const handleChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const selectedSousServiceOptions = useMemo(
    () => sousServiceOptions.filter(option => formValues.sousServices.includes(option.value)),
    [sousServiceOptions, formValues.sousServices],
  );

  const handleSousServicesChange = (selected: MultiValue<SousServiceOption>) => {
    const selectedOptions = selected.map(option => option.value);
    setFormValues(prev => ({ ...prev, sousServices: selectedOptions }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!formValues.servicePrincipal) {
      nextErrors.servicePrincipal = translate('crmApp.demandeClient.create.errors.servicePrincipal');
    }
    if (!formValues.typeDemande) {
      nextErrors.typeDemande = translate('crmApp.demandeClient.create.errors.typeDemande');
    }
    if (!formValues.provenance.trim()) {
      nextErrors.provenance = translate('crmApp.demandeClient.create.errors.provenance');
    }
    if (!formValues.incotermId) {
      nextErrors.incotermId = translate('crmApp.demandeClient.create.errors.incoterm');
    }
    if (!formValues.deviseId) {
      nextErrors.deviseId = translate('crmApp.demandeClient.create.errors.devise');
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clientIdNumber) {
      return;
    }
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const sousServicesPayload = formValues.sousServices.filter(id => id !== '').map(id => ({ id: Number(id) }));

    const payload: IDemandeClient = {
      reference: formValues.reference,
      dateDemande: dayjs(formValues.dateDemande),
      servicePrincipal: formValues.servicePrincipal as keyof typeof ServicePrincipal,
      typeDemande: formValues.typeDemande as keyof typeof TypeDemande,
      sousServices: sousServicesPayload,
      provenance: formValues.provenance.trim(),
      incoterm: formValues.incotermId ? { id: Number(formValues.incotermId) } : undefined,
      devise: formValues.deviseId ? { id: Number(formValues.deviseId) } : undefined,
      remarqueGenerale: formValues.remarqueGenerale.trim() || undefined,
      client: { id: clientIdNumber },
    };

    axios
      .post('api/demande-clients', payload)
      .then(() => {
        navigate(`/dashboard/clients/${clientIdNumber}/view`, {
          replace: true,
          state: { successMessage: translate('crmApp.demandeClient.create.success') },
        });
      })
      .catch(() => {
        setSubmitError(translate('crmApp.demandeClient.create.errorSubmit'));
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const renderError = (field: keyof FormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  return (
    <div className="client-demand-create-page py-4">
      <Breadcrumb listClassName="bg-transparent px-0">
        <BreadcrumbItem>
          <Link to="/dashboard">
            <Translate contentKey="crmApp.client.edit.breadcrumb.dashboard" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/dashboard/clients">
            <Translate contentKey="crmApp.client.edit.breadcrumb.clients" />
          </Link>
        </BreadcrumbItem>
        {clientIdNumber ? (
          <BreadcrumbItem>
            <Link to={`/dashboard/clients/${clientIdNumber}/view`}>
              <Translate contentKey="crmApp.demandeClient.create.breadcrumb.client" />
            </Link>
          </BreadcrumbItem>
        ) : null}
        <BreadcrumbItem active>
          <Translate contentKey="crmApp.demandeClient.create.breadcrumb.current" />
        </BreadcrumbItem>
      </Breadcrumb>

      <Card className="shadow-sm border-0">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="mb-1">
                <Translate contentKey="crmApp.demandeClient.create.title" />
              </h4>
              <p className="mb-0 text-muted">
                <Translate contentKey="crmApp.demandeClient.create.subtitle" />
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                color="secondary"
                outline
                tag={Link}
                to={clientIdNumber ? `/dashboard/clients/${clientIdNumber}/view` : '/dashboard/clients'}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                <Translate contentKey="crmApp.demandeClient.create.back" />
              </Button>
              <Button color="primary" form="client-demand-form" type="submit" disabled={submitting}>
                {submitting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
                <Translate contentKey="crmApp.demandeClient.create.save" />
              </Button>
            </div>
          </div>

          {submitError ? (
            <Alert color="danger" className="mb-4">
              {submitError}
            </Alert>
          ) : null}

          <Form id="client-demand-form" onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="4">
                <FormGroup>
                  <Label for="demande-reference">
                    <Translate contentKey="crmApp.demandeClient.reference" />
                  </Label>
                  <Input id="demande-reference" value={formValues.reference} disabled />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="demande-date">
                    <Translate contentKey="crmApp.demandeClient.dateDemande" />
                  </Label>
                  <Input id="demande-date" type="date" value={formValues.dateDemande} onChange={handleChange('dateDemande')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="demande-servicePrincipal">
                    <Translate contentKey="crmApp.demandeClient.servicePrincipal" /> *
                  </Label>
                  <Input
                    id="demande-servicePrincipal"
                    type="select"
                    value={formValues.servicePrincipal}
                    onChange={handleChange('servicePrincipal')}
                  >
                    {servicePrincipalOptions.map(option => (
                      <option key={option} value={option}>
                        {translate(`crmApp.ServicePrincipal.${option}`)}
                      </option>
                    ))}
                  </Input>
                  {renderError('servicePrincipal')}
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="demande-typeDemande">
                    <Translate contentKey="crmApp.demandeClient.typeDemande" /> *
                  </Label>
                  <Input id="demande-typeDemande" type="select" value={formValues.typeDemande} onChange={handleChange('typeDemande')}>
                    {typeDemandeOptions.map(option => (
                      <option key={option} value={option}>
                        {translate(`crmApp.TypeDemande.${option}`)}
                      </option>
                    ))}
                  </Input>
                  {renderError('typeDemande')}
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="demande-sousServices">
                    <Translate contentKey="crmApp.demandeClient.sousServices" />
                  </Label>
                  <Select
                    inputId="demande-sousServices"
                    name="sousServices"
                    data-cy="sousServices"
                    classNamePrefix="react-select"
                    isMulti
                    isDisabled={sousServicesLoading}
                    isLoading={sousServicesLoading}
                    options={sousServiceOptions}
                    value={selectedSousServiceOptions}
                    onChange={handleSousServicesChange}
                    placeholder={translate('crmApp.demandeClient.create.sousServicesPlaceholder')}
                    noOptionsMessage={() => translate('crmApp.demandeClient.create.sousServicesNoOptions')}
                    closeMenuOnSelect={false}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="demande-provenance">
                    <Translate contentKey="crmApp.demandeClient.provenance" /> *
                  </Label>
                  <Input id="demande-provenance" value={formValues.provenance} onChange={handleChange('provenance')} />
                  {renderError('provenance')}
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="demande-incoterm">
                    <Translate contentKey="crmApp.demandeClient.incoterm" /> *
                  </Label>
                  <Input
                    id="demande-incoterm"
                    type="select"
                    value={formValues.incotermId}
                    onChange={handleChange('incotermId')}
                    disabled={incotermsLoading}
                  >
                    <option value="">{translate('crmApp.demandeClient.create.selectPlaceholder')}</option>
                    {incoterms.map(option => {
                      const label = [option.code, option.description].filter(Boolean).join(' • ') || option.code || option.description;
                      return (
                        <option key={option.id} value={option.id ?? ''}>
                          {label}
                        </option>
                      );
                    })}
                  </Input>
                  {renderError('incotermId')}
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="demande-devise">
                    <Translate contentKey="crmApp.demandeClient.devise" /> *
                  </Label>
                  <Input
                    id="demande-devise"
                    type="select"
                    value={formValues.deviseId}
                    onChange={handleChange('deviseId')}
                    disabled={devisesLoading}
                  >
                    <option value="">{translate('crmApp.demandeClient.create.selectPlaceholder')}</option>
                    {devises.map(option => {
                      const label =
                        [option.code, option.symbole].filter(Boolean).join(' ') || option.nomComplet || option.code || option.symbole;
                      return (
                        <option key={option.id} value={option.id ?? ''}>
                          {label}
                        </option>
                      );
                    })}
                  </Input>
                  {renderError('deviseId')}
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="demande-remarqueGenerale">
                    <Translate contentKey="crmApp.demandeClient.remarqueGenerale" />
                  </Label>
                  <Input
                    id="demande-remarqueGenerale"
                    type="textarea"
                    rows={4}
                    value={formValues.remarqueGenerale}
                    onChange={handleChange('remarqueGenerale')}
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

export default ClientDemandCreatePage;
