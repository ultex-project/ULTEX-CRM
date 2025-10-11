import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';

import { IClient } from 'app/shared/model/client.model';

import './ClientCreatePage.scss';
import { createEntity, reset as resetClient } from 'app/entities/client/client.reducer';
import dayjs from 'dayjs';

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

const ClientCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<ClientFormState>({
    code: '',
    nomComplet: '',
    photoUrl: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    genre: '',
    fonction: '',
    languePreferee: '',
    telephonePrincipal: '',
    whatsapp: '',
    email: '',
    adressePersonnelle: '',
    adressesLivraison: '',
    reseauxSociaux: '',
    companyId: '',
    assignedUserId: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const companies = useAppSelector(state => state.company.entities);
  const companyLoading = useAppSelector(state => state.company.loading);
  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const internalUserLoading = useAppSelector(state => state.internalUser.loading);
  const clientUpdating = useAppSelector(state => state.client.updating);
  const updateSuccess = useAppSelector(state => state.client.updateSuccess);
  const clientError = useAppSelector(state => state.client.errorMessage);

  useEffect(() => {
    dispatch(resetClient());
    dispatch(getCompanies({ page: 0, size: 50, sort: 'name,asc' }));
    dispatch(getInternalUsers({ sort: 'fullName,asc' }));

    return () => {
      dispatch(resetClient());
    };
  }, [dispatch]);

  // Generate unique client code
  const generateCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const getRandom = (chars: string, len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code = getRandom(letters, 2) + getRandom(digits, 3);
    setFormValues(prev => ({ ...prev, code }));
  };

  useEffect(() => {
    if (!formValues.code) generateCode();
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/dashboard/clients');
    }
  }, [updateSuccess, navigate]);

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

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!formValues.nomComplet.trim()) nextErrors.nomComplet = 'Le nom complet est requis';
    if (!formValues.nationalite.trim()) nextErrors.nationalite = 'La nationalité est requise';
    if (!formValues.telephonePrincipal.trim()) nextErrors.telephonePrincipal = 'Le téléphone principal est requis';
    else if (!/^\+[0-9]{8,15}$/.test(formValues.telephonePrincipal.trim())) nextErrors.telephonePrincipal = 'Format invalide (+212...)';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildEntity = (): IClient => ({
    code: formValues.code.trim(),
    nomComplet: formValues.nomComplet.trim(),
    photoUrl: formValues.photoUrl || undefined,
    dateNaissance: formValues.dateNaissance ? dayjs(formValues.dateNaissance) : undefined,
    lieuNaissance: formValues.lieuNaissance || undefined,
    nationalite: formValues.nationalite.trim(),
    genre: formValues.genre || undefined,
    fonction: formValues.fonction || undefined,
    languePreferee: formValues.languePreferee || undefined,
    telephonePrincipal: formValues.telephonePrincipal.trim(),
    whatsapp: formValues.whatsapp || undefined,
    email: formValues.email || undefined,
    adressePersonnelle: formValues.adressePersonnelle || undefined,
    adressesLivraison: formValues.adressesLivraison || undefined,
    reseauxSociaux: formValues.reseauxSociaux || undefined,
    company: formValues.companyId ? { id: Number(formValues.companyId) } : undefined,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    dispatch(createEntity(buildEntity()));
  };

  const renderError = (field: keyof ClientFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const referenceLoading = companyLoading || internalUserLoading;

  return (
    <div className="client-create-page">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Ajouter un nouveau client</h5>
            <p className="mb-0 text-muted">Complétez les informations du client pour l’enregistrer dans la base.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" tag={Link} to="/dashboard/clients" outline>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour à la liste
            </Button>
            <Button color="primary" form="client-create-form" type="submit" disabled={clientUpdating}>
              {clientUpdating ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              Enregistrer
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {clientError ? (
            <Alert color="danger" className="mb-4">
              {clientError}
            </Alert>
          ) : null}

          <Form id="client-create-form" onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="4">
                <FormGroup>
                  <Label for="client-code">Code (auto)</Label>
                  <Input id="client-code" value={formValues.code} disabled />
                </FormGroup>
              </Col>

              <Col md="8">
                <FormGroup>
                  <Label for="client-nomComplet">Nom complet *</Label>
                  <Input
                    id="client-nomComplet"
                    value={formValues.nomComplet}
                    onChange={handleChange('nomComplet')}
                    placeholder="Ex: Youssef El Amrani"
                  />
                  {renderError('nomComplet')}
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-photoUrl">Photo (URL)</Label>
                  <Input
                    id="client-photoUrl"
                    value={formValues.photoUrl}
                    onChange={handleChange('photoUrl')}
                    placeholder="https://exemple.com/photo.jpg"
                  />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label for="client-dateNaissance">Date de naissance</Label>
                  <Input id="client-dateNaissance" type="date" value={formValues.dateNaissance} onChange={handleChange('dateNaissance')} />
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label for="client-lieuNaissance">Lieu de naissance</Label>
                  <Input
                    id="client-lieuNaissance"
                    value={formValues.lieuNaissance}
                    onChange={handleChange('lieuNaissance')}
                    placeholder="Casablanca"
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-nationalite">Nationalité *</Label>
                  <Input
                    id="client-nationalite"
                    value={formValues.nationalite}
                    onChange={handleChange('nationalite')}
                    placeholder="Marocaine"
                  />
                  {renderError('nationalite')}
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label for="client-genre">Genre</Label>
                  <Input type="select" id="client-genre" value={formValues.genre} onChange={handleChange('genre')}>
                    <option value="">Sélectionnez</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="3">
                <FormGroup>
                  <Label for="client-languePreferee">Langue</Label>
                  <Input
                    type="select"
                    id="client-languePreferee"
                    value={formValues.languePreferee}
                    onChange={handleChange('languePreferee')}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="FR">Français</option>
                    <option value="AR">Arabe</option>
                    <option value="EN">Anglais</option>
                    <option value="Autre">Autre</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-fonction">Fonction</Label>
                  <Input
                    id="client-fonction"
                    value={formValues.fonction}
                    onChange={handleChange('fonction')}
                    placeholder="Ex: Directeur Achats"
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-telephonePrincipal">Téléphone principal *</Label>
                  <Input
                    id="client-telephonePrincipal"
                    value={formValues.telephonePrincipal}
                    onChange={handleChange('telephonePrincipal')}
                    placeholder="+212612345678"
                  />
                  {renderError('telephonePrincipal')}
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-whatsapp">WhatsApp</Label>
                  <Input id="client-whatsapp" value={formValues.whatsapp} onChange={handleChange('whatsapp')} placeholder="+212612345678" />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange('email')}
                    placeholder="exemple@domaine.com"
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-adressePersonnelle">Adresse personnelle</Label>
                  <Input
                    id="client-adressePersonnelle"
                    value={formValues.adressePersonnelle}
                    onChange={handleChange('adressePersonnelle')}
                    placeholder="Rue, numéro, quartier..."
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-adressesLivraison">Adresses de livraison</Label>
                  <Input
                    id="client-adressesLivraison"
                    value={formValues.adressesLivraison}
                    onChange={handleChange('adressesLivraison')}
                    placeholder="Plusieurs adresses séparées par une virgule"
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-reseauxSociaux">Réseaux sociaux</Label>
                  <Input
                    id="client-reseauxSociaux"
                    value={formValues.reseauxSociaux}
                    onChange={handleChange('reseauxSociaux')}
                    placeholder="LinkedIn, Facebook..."
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="client-company">Entreprise</Label>
                  <Input
                    type="select"
                    id="client-company"
                    value={formValues.companyId}
                    onChange={handleChange('companyId')}
                    disabled={referenceLoading}
                  >
                    <option value="">Sélectionnez une entreprise</option>
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
                  <Label for="client-assignedUser">Responsable</Label>
                  <Input
                    type="select"
                    id="client-assignedUser"
                    value={formValues.assignedUserId}
                    onChange={handleChange('assignedUserId')}
                    disabled={referenceLoading}
                  >
                    <option value="">Sélectionnez un responsable</option>
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
    </div>
  );
};

export default ClientCreatePage;
