import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';
import { Alert, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { IClient } from 'app/shared/model/client.model';
import ClientImagePicker from 'app/custom/dashboard/modules/client/components/ClientImagePicker';

export interface TelephoneInputComponentProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface ClientFormProps {
  initialData?: IClient;
  onSubmit: (data: IClient) => Promise<unknown> | void;
  mode: 'create' | 'edit';
  telephoneInputComponent?: React.ComponentType<TelephoneInputComponentProps>;
}

type ClientFormState = {
  code: string;
  nomComplet: string;
  photoUrl: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  genre: string;
  fonction: string;
  languePreferee: string;
  telephonePrincipal: string;
  whatsapp: string;
  email: string;
  adressePersonnelle: string;
  adressesLivraison: string;
  reseauxSociaux: string;
  companyId: string;
  assignedUserId: string;
};

type FormErrors = Partial<Record<keyof ClientFormState, string>>;

const CLIENT_FORM_ID = 'client-form';
const CODE_MIN_NUMBER = 1000;
const LETTER_OPTIONS = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

const mapInitialDataToState = (data?: IClient): ClientFormState => ({
  code: data?.code ?? '',
  nomComplet: data?.nomComplet ?? '',
  photoUrl: data?.photoUrl ?? '',
  dateNaissance: data?.dateNaissance ? dayjs(data.dateNaissance).format('YYYY-MM-DD') : '',
  lieuNaissance: data?.lieuNaissance ?? '',
  nationalite: data?.nationalite ?? '',
  genre: data?.genre ?? '',
  fonction: data?.fonction ?? '',
  languePreferee: data?.languePreferee ?? '',
  telephonePrincipal: data?.telephonePrincipal ?? '',
  whatsapp: data?.whatsapp ?? '',
  email: data?.email ?? '',
  adressePersonnelle: data?.adressePersonnelle ?? '',
  adressesLivraison: data?.adressesLivraison ?? '',
  reseauxSociaux: data?.reseauxSociaux ?? '',
  companyId: data?.company?.id ? String(data.company.id) : '',
  assignedUserId: '',
});

const buildClientPayload = (values: ClientFormState, initial?: IClient): IClient => ({
  id: initial?.id,
  code: values.code.trim(),
  nomComplet: values.nomComplet.trim(),
  photoUrl: values.photoUrl || undefined,
  dateNaissance: values.dateNaissance ? dayjs(values.dateNaissance) : undefined,
  lieuNaissance: values.lieuNaissance || undefined,
  nationalite: values.nationalite.trim(),
  genre: values.genre || undefined,
  fonction: values.fonction || undefined,
  languePreferee: values.languePreferee || undefined,
  telephonePrincipal: values.telephonePrincipal.trim(),
  whatsapp: values.whatsapp || undefined,
  email: values.email || undefined,
  adressePersonnelle: values.adressePersonnelle || undefined,
  adressesLivraison: values.adressesLivraison || undefined,
  reseauxSociaux: values.reseauxSociaux || undefined,
  company: values.companyId ? { id: Number(values.companyId) } : undefined,
});

const DefaultTelephoneInput: React.FC<TelephoneInputComponentProps> = ({ id, value, onChange, disabled }) => (
  <Input id={id} value={value} onChange={event => onChange(event.target.value)} disabled={disabled} />
);

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, mode, telephoneInputComponent }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const companies = useAppSelector(state => state.company.entities);
  const companyLoading = useAppSelector(state => state.company.loading);
  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const internalUserLoading = useAppSelector(state => state.internalUser.loading);

  const [formValues, setFormValues] = useState<ClientFormState>(() => mapInitialDataToState(initialData));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [codePrefix, setCodePrefix] = useState<string>(() => {
    const match = initialData?.code?.match(/^([A-Z])(\d+)$/i);
    return match?.[1]?.toUpperCase() ?? LETTER_OPTIONS[0];
  });
  const [codeNumber, setCodeNumber] = useState<string>(() => {
    const match = initialData?.code?.match(/^([A-Z])(\d+)$/i);
    return match?.[2] ?? '';
  });
  const [initialCodePrefix, setInitialCodePrefix] = useState<string>(() => {
    const match = initialData?.code?.match(/^([A-Z])(\d+)$/i);
    return match?.[1]?.toUpperCase() ?? LETTER_OPTIONS[0];
  });
  const [initialCodeNumber, setInitialCodeNumber] = useState<string>(() => {
    const match = initialData?.code?.match(/^([A-Z])(\d+)$/i);
    return match?.[2] ?? '';
  });
  const [codeLoading, setCodeLoading] = useState(false);

  const referenceLoading = companyLoading || internalUserLoading;

  useEffect(() => {
    dispatch(getCompanies({ page: 0, size: 100, sort: 'name,asc' }));
    dispatch(getInternalUsers({ sort: 'fullName,asc' }));
  }, [dispatch]);

  useEffect(() => {
    if (!initialData) {
      return;
    }
    setFormValues(mapInitialDataToState(initialData));
    setFormErrors({});
    const match = initialData.code?.match(/^([A-Z])(\d+)$/i);
    const nextPrefix = match?.[1]?.toUpperCase() ?? LETTER_OPTIONS[0];
    const nextNumber = match?.[2] ?? '';
    setCodePrefix(nextPrefix);
    setInitialCodePrefix(nextPrefix);
    setInitialCodeNumber(nextNumber);
    setCodeNumber(nextNumber);
  }, [initialData?.id]);

  const handleChange = (field: keyof ClientFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handlePhotoChange = (url: string | null) => {
    setFormValues(prev => ({ ...prev, photoUrl: url ?? '' }));
  };

  const validate = () => {
    const errors: FormErrors = {};
    if (!(formValues.code ?? '').trim()) {
      errors.code = 'Le code client est requis';
    }
    if (!formValues.nomComplet.trim()) {
      errors.nomComplet = translate('crmApp.client.form.errors.nomComplet');
    }
    if (!formValues.nationalite.trim()) {
      errors.nationalite = translate('crmApp.client.form.errors.nationalite');
    }
    if (!formValues.telephonePrincipal.trim()) {
      errors.telephonePrincipal = translate('crmApp.client.form.errors.telephonePrincipalRequired');
    } else if (!/^\+[0-9]{8,15}$/.test(formValues.telephonePrincipal.trim())) {
      errors.telephonePrincipal = translate('crmApp.client.form.errors.telephonePrincipalFormat');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const entity = buildClientPayload(formValues, initialData);
      await onSubmit(entity);
    } catch (error) {
      const message =
        (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
          ? error.message
          : translate('crmApp.client.form.genericError')) ?? translate('crmApp.client.form.genericError');
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field: keyof ClientFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const TelephoneInputComponent = telephoneInputComponent ?? DefaultTelephoneInput;

  const updateTelephonePrincipal = (value: string) => {
    setFormValues(prev => ({ ...prev, telephonePrincipal: value }));
    if (formErrors.telephonePrincipal) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.telephonePrincipal;
        return next;
      });
    }
  };

  const title = useMemo(
    () => (mode === 'create' ? translate('crmApp.client.form.createTitle') : translate('crmApp.client.form.editTitle')),
    [mode],
  );

  const subtitle = useMemo(
    () => (mode === 'create' ? translate('crmApp.client.form.createSubtitle') : translate('crmApp.client.form.editSubtitle')),
    [mode],
  );

  const cancelTarget = useMemo(() => {
    if (mode === 'edit' && initialData?.id) {
      return `/dashboard/clients/${initialData.id}/view`;
    }
    return '/dashboard/clients';
  }, [mode, initialData?.id]);

  const handleCancel = () => {
    navigate(cancelTarget);
  };

  const updateCodeFromParts = (prefix: string, number: string) => {
    const combined = prefix && number ? `${prefix}${number}` : '';
    setFormValues(prev => ({ ...prev, code: combined }));
  };

  useEffect(() => {
    updateCodeFromParts(codePrefix, codeNumber);
  }, [codePrefix, codeNumber]);

  const fetchNextCodeNumber = async (prefix: string) => {
    if (!prefix) {
      setCodeNumber('');
      return;
    }

    setCodeLoading(true);
    setFormErrors(prev => {
      const next = { ...prev };
      delete next.code;
      return next;
    });

    try {
      const response = await axios.get<IClient[]>('/api/clients', {
        params: {
          page: 0,
          'code.contains': prefix,
          size: 2000,
          sort: 'code,desc',
          cacheBuster: Date.now(),
        },
      });
      const items = response.data ?? [];
      const highest = items.reduce((max, item) => {
        const match = item.code?.match(new RegExp(`^${prefix}(\\d+)$`, 'i'));
        if (!match) {
          return max;
        }
        const numeric = parseInt(match[1], 10);
        return Number.isFinite(numeric) && numeric > max ? numeric : max;
      }, CODE_MIN_NUMBER - 1);

      const nextNumber = String(Math.max(highest + 1, CODE_MIN_NUMBER)).padStart(4, '0');
      setCodeNumber(nextNumber);
    } catch (error) {
      setFormErrors(prev => ({ ...prev, code: translate('crmApp.client.form.genericError') }));
      const fallback = String((Date.now() % 9000) + CODE_MIN_NUMBER).padStart(4, '0');
      setCodeNumber(fallback);
    } finally {
      setCodeLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      fetchNextCodeNumber(codePrefix);
    }
  }, [codePrefix, mode]);

  useEffect(() => {
    if (mode === 'edit' && codePrefix !== initialCodePrefix) {
      fetchNextCodeNumber(codePrefix);
    }
  }, [codePrefix, mode, initialCodePrefix]);

  const handleCodePrefixChange = (next: string) => {
    setCodePrefix(next);
    if (mode === 'edit' && next === initialCodePrefix) {
      setCodeNumber(initialCodeNumber);
      return;
    }
    setCodeNumber('');
  };

  return (
    <Card className="shadow-sm border-0 client-form-wrapper">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h5 className="mb-1">{title}</h5>
            <p className="mb-0 text-muted">{subtitle}</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" outline onClick={handleCancel} disabled={submitting}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              <Translate contentKey={mode === 'create' ? 'crmApp.client.form.cancelCreate' : 'crmApp.client.form.cancelEdit'} />
            </Button>
            <Button color="primary" type="submit" form={CLIENT_FORM_ID} disabled={submitting || codeLoading}>
              {submitting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              <Translate contentKey="crmApp.client.form.save" />
            </Button>
          </div>
        </div>

        {submitError ? (
          <Alert color="danger" className="mb-4">
            {submitError}
          </Alert>
        ) : null}

        <Form id={CLIENT_FORM_ID} onSubmit={submit}>
          <Row className="g-4">
            <Col md="3">
              <FormGroup>
                <Label for="client-code-prefix">Lettre du code</Label>
                <Input
                  id="client-code-prefix"
                  type="select"
                  value={codePrefix}
                  onChange={event => handleCodePrefixChange(event.target.value)}
                  disabled={codeLoading}
                >
                  {LETTER_OPTIONS.map(letter => (
                    <option key={letter} value={letter}>
                      {letter}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label for="client-code">
                  <Translate contentKey="crmApp.client.code" />
                </Label>
                <Input id="client-code" value={formValues.code} readOnly placeholder="-" />
                <div className="text-muted small mt-1 d-flex align-items-center gap-2">
                  {codeLoading ? <Spinner size="sm" /> : null}
                  <span>Le numéro est généré automatiquement.</span>
                </div>
                {renderError('code')}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-nomComplet">
                  <Translate contentKey="crmApp.client.nomComplet" /> *
                </Label>
                <Input id="client-nomComplet" value={formValues.nomComplet} onChange={handleChange('nomComplet')} />
                {renderError('nomComplet')}
              </FormGroup>
            </Col>

            <Col md="4">
              <FormGroup className="d-flex flex-column align-items-center align-items-md-start">
                <Label className="form-label">
                  <Translate contentKey="crmApp.client.photoUrl" />
                </Label>
                <ClientImagePicker
                  name={formValues.nomComplet || translate('crmApp.client.dashboard.table.unnamed')}
                  photoUrl={formValues.photoUrl || undefined}
                  size={140}
                  clientId={initialData?.id}
                  onChange={handlePhotoChange}
                />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label for="client-dateNaissance">
                  <Translate contentKey="crmApp.client.dateNaissance" />
                </Label>
                <Input id="client-dateNaissance" type="date" value={formValues.dateNaissance} onChange={handleChange('dateNaissance')} />
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label for="client-lieuNaissance">
                  <Translate contentKey="crmApp.client.lieuNaissance" />
                </Label>
                <Input id="client-lieuNaissance" value={formValues.lieuNaissance} onChange={handleChange('lieuNaissance')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-nationalite">
                  <Translate contentKey="crmApp.client.nationalite" /> *
                </Label>
                <Input id="client-nationalite" value={formValues.nationalite} onChange={handleChange('nationalite')} />
                {renderError('nationalite')}
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label for="client-genre">
                  <Translate contentKey="crmApp.client.genre" />
                </Label>
                <Input type="select" id="client-genre" value={formValues.genre} onChange={handleChange('genre')}>
                  <option value="">{translate('crmApp.client.form.select')}</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="3">
              <FormGroup>
                <Label for="client-languePreferee">
                  <Translate contentKey="crmApp.client.languePreferee" />
                </Label>
                <Input type="select" id="client-languePreferee" value={formValues.languePreferee} onChange={handleChange('languePreferee')}>
                  <option value="">{translate('crmApp.client.form.select')}</option>
                  <option value="FR">Français</option>
                  <option value="AR">Arabe</option>
                  <option value="EN">Anglais</option>
                  <option value="Autre">Autre</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-fonction">
                  <Translate contentKey="crmApp.client.fonction" />
                </Label>
                <Input id="client-fonction" value={formValues.fonction} onChange={handleChange('fonction')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-telephonePrincipal">
                  <Translate contentKey="crmApp.client.telephonePrincipal" /> *
                </Label>
                <TelephoneInputComponent
                  id="client-telephonePrincipal"
                  value={formValues.telephonePrincipal}
                  onChange={updateTelephonePrincipal}
                  disabled={submitting}
                />
                {renderError('telephonePrincipal')}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-whatsapp">WhatsApp</Label>
                <Input id="client-whatsapp" value={formValues.whatsapp} onChange={handleChange('whatsapp')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-email">
                  <Translate contentKey="crmApp.client.email" />
                </Label>
                <Input id="client-email" type="email" value={formValues.email} onChange={handleChange('email')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-adressePersonnelle">
                  <Translate contentKey="crmApp.client.adressePersonnelle" />
                </Label>
                <Input id="client-adressePersonnelle" value={formValues.adressePersonnelle} onChange={handleChange('adressePersonnelle')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-adressesLivraison">
                  <Translate contentKey="crmApp.client.adressesLivraison" />
                </Label>
                <Input id="client-adressesLivraison" value={formValues.adressesLivraison} onChange={handleChange('adressesLivraison')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-reseauxSociaux">
                  <Translate contentKey="crmApp.client.reseauxSociaux" />
                </Label>
                <Input id="client-reseauxSociaux" value={formValues.reseauxSociaux} onChange={handleChange('reseauxSociaux')} />
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="client-company">
                  <Translate contentKey="crmApp.client.company" />
                </Label>
                <Input
                  type="select"
                  id="client-company"
                  value={formValues.companyId}
                  onChange={handleChange('companyId')}
                  disabled={referenceLoading}
                >
                  <option value="">{translate('crmApp.client.form.select')}</option>
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
                <Label for="client-assignedUser">
                  <Translate contentKey="crmApp.client.form.assignedUser" />
                </Label>
                <Input
                  type="select"
                  id="client-assignedUser"
                  value={formValues.assignedUserId}
                  onChange={handleChange('assignedUserId')}
                  disabled={referenceLoading}
                >
                  <option value="">{translate('crmApp.client.form.select')}</option>
                  {internalUsers.map(user => (
                    <option key={user.id} value={user.id ?? ''}>
                      {user.fullName ?? user.email ?? `Utilisateur #${user.id}`}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ClientForm;
export { CLIENT_FORM_ID };
