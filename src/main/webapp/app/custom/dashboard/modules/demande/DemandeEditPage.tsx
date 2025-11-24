import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import Select, { MultiValue, SingleValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { reset as resetDemande } from 'app/entities/demande-client/demande-client.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntities as getDevises } from 'app/entities/devise/devise.reducer';
import { getEntities as getIncoterms } from 'app/entities/incoterm/incoterm.reducer';
import { getEntities as getSousServices } from 'app/entities/sous-service/sous-service.reducer';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
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
  clientId: string;
  remarqueGenerale: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

type SousServiceOption = { value: string; label: string };
type ClientOption = { value: string; label: string };

const DemandeEditPage = () => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clients = useAppSelector(state => state.client.entities);
  const clientsLoading = useAppSelector(state => state.client.loading);
  const devises = useAppSelector(state => state.devise.entities);
  const devisesLoading = useAppSelector(state => state.devise.loading);
  const incoterms = useAppSelector(state => state.incoterm.entities);
  const incotermsLoading = useAppSelector(state => state.incoterm.loading);
  const sousServices = useAppSelector(state => state.sousService.entities);
  const sousServicesLoading = useAppSelector(state => state.sousService.loading);

  const servicePrincipalOptions = Object.keys(ServicePrincipal);
  const typeDemandeOptions = Object.keys(TypeDemande);
  const clientOptions = useMemo<ClientOption[]>(
    () =>
      clients
        .filter(c => c.id !== undefined && c.id !== null)
        .map(c => ({
          value: String(c.id),
          label: c.nomComplet ?? c.email ?? String(c.id),
        })),
    [clients],
  );
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
    reference: '',
    dateDemande: dayjs().format('YYYY-MM-DD'),
    servicePrincipal: '',
    typeDemande: '',
    sousServices: [],
    provenance: '',
    incotermId: '',
    deviseId: '',
    clientId: '',
    remarqueGenerale: '',
  }));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(resetDemande());
    dispatch(getClients({}));
    dispatch(getDevises({}));
    dispatch(getIncoterms({}));
    dispatch(getSousServices({}));
  }, [dispatch]);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/demandes', { replace: true });
      return;
    }

    const fetchDemande = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get<IDemandeClient>(`api/demande-clients/${id}`);
        const demande = response.data;
        if (!demande) {
          setLoadError(translate('crmApp.demandeClient.home.notFound'));
          return;
        }
        setFormValues({
          reference: demande.reference ?? '',
          dateDemande: demande.dateDemande ? dayjs(demande.dateDemande).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          servicePrincipal: demande.servicePrincipal ?? '',
          typeDemande: demande.typeDemande ?? '',
          sousServices: demande.sousServices?.filter(ss => ss.id !== undefined && ss.id !== null).map(ss => String(ss.id)) ?? [],
          provenance: demande.provenance ?? '',
          incotermId: demande.incoterm?.id ? String(demande.incoterm.id) : '',
          deviseId: demande.devise?.id ? String(demande.devise.id) : '',
          clientId: demande.client?.id ? String(demande.client.id) : '',
          remarqueGenerale: demande.remarqueGenerale ?? '',
        });
      } catch (err) {
        setLoadError(translate('crmApp.demandeClient.home.notFound'));
      } finally {
        setLoading(false);
      }
    };

    fetchDemande();
  }, [id, navigate]);

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
  const selectedClientOption = useMemo(
    () => clientOptions.find(option => option.value === formValues.clientId) ?? null,
    [clientOptions, formValues.clientId],
  );

  const handleSousServicesChange = (selected: MultiValue<SousServiceOption>) => {
    const selectedOptions = selected.map(option => option.value);
    setFormValues(prev => ({ ...prev, sousServices: selectedOptions }));
  };
  const handleClientChange = (selected: SingleValue<ClientOption>) => {
    setFormValues(prev => ({ ...prev, clientId: selected?.value ?? '' }));
    if (formErrors.clientId) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.clientId;
        return next;
      });
    }
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
    if (!formValues.clientId) {
      nextErrors.clientId = translate('crmApp.client.view.empty');
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const sousServicesPayload = formValues.sousServices.filter(s => s !== '').map(s => ({ id: Number(s) }));

    const payload: IDemandeClient = {
      id: Number(id),
      reference: formValues.reference,
      dateDemande: dayjs(formValues.dateDemande),
      servicePrincipal: formValues.servicePrincipal as keyof typeof ServicePrincipal,
      typeDemande: formValues.typeDemande as keyof typeof TypeDemande,
      sousServices: sousServicesPayload,
      provenance: formValues.provenance.trim(),
      incoterm: formValues.incotermId ? { id: Number(formValues.incotermId) } : undefined,
      devise: formValues.deviseId ? { id: Number(formValues.deviseId) } : undefined,
      remarqueGenerale: formValues.remarqueGenerale.trim() || undefined,
      client: formValues.clientId ? { id: Number(formValues.clientId) } : undefined,
    };

    axios
      .put(`api/demande-clients/${id}`, payload)
      .then(() => {
        navigate('/dashboard/demandes', {
          replace: true,
          state: { successMessage: translate('crmApp.demandeClient.updated') },
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

  if (loading) {
    return (
      <Card className="shadow-sm border-0">
        <CardBody className="text-center py-5">
          <Spinner color="primary" />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="client-demand-create-page py-4">
      <Breadcrumb listClassName="bg-transparent px-0">
        <BreadcrumbItem>
          <Link to="/dashboard">
            <Translate contentKey="crmApp.client.edit.breadcrumb.dashboard" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/dashboard/demandes">
            <Translate contentKey="crmApp.client.edit.breadcrumb.clients" />
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <Translate contentKey="crmApp.client.edit.breadcrumb.current" />
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
              <Button color="secondary" outline tag={Link} to="/dashboard/demandes">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                <Translate contentKey="crmApp.demandeClient.create.back" />
              </Button>
              <Button color="primary" form="client-demand-form" type="submit" disabled={submitting}>
                {submitting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
                <Translate contentKey="crmApp.demandeClient.create.save" />
              </Button>
            </div>
          </div>

          {loadError ? (
            <Alert color="danger" className="mb-4">
              {loadError}
            </Alert>
          ) : null}

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
                  <Input id="demande-reference" value={formValues.reference} onChange={handleChange('reference')} />
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
                    <option value="">{translate('crmApp.demandeClient.create.selectPlaceholder')}</option>
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
                    <option value="">{translate('crmApp.demandeClient.create.selectPlaceholder')}</option>
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

              <Col md="4">
                <FormGroup>
                  <Label for="demande-client">
                    <Translate contentKey="crmApp.demandeClient.client" /> *
                  </Label>
                  <Select
                    inputId="demande-client"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    isDisabled={clientsLoading}
                    isLoading={clientsLoading}
                    options={clientOptions}
                    value={selectedClientOption}
                    onChange={handleClientChange}
                    placeholder={translate('crmApp.demandeClient.create.selectPlaceholder')}
                    noOptionsMessage={() => translate('crmApp.demandeClient.create.sousServicesNoOptions')}
                  />
                  {renderError('clientId')}
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

export default DemandeEditPage;
