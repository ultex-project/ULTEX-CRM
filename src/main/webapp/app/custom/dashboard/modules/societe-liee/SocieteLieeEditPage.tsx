import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, reset, updateEntity } from 'app/entities/societe-liee/societe-liee.reducer';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';

type SocieteLieeFormState = {
  raisonSociale: string;
  formeJuridique: string;
  ice: string;
  rc: string;
  nif: string;
  secteurActivite: string;
  tailleEntreprise: string;
  adresseSiege: string;
  representantLegal: string;
};

type FormErrors = Partial<Record<keyof SocieteLieeFormState, string>>;

const FORM_ID = 'societe-liee-edit-form';

const SocieteLieeEditPage = () => {
  const { id } = useParams<'id'>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<SocieteLieeFormState>({
    raisonSociale: '',
    formeJuridique: '',
    ice: '',
    rc: '',
    nif: '',
    secteurActivite: '',
    tailleEntreprise: '',
    adresseSiege: '',
    representantLegal: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const societeLieeEntity = useAppSelector(state => state.societeLiee.entity);
  const loading = useAppSelector(state => state.societeLiee.loading);
  const updating = useAppSelector(state => state.societeLiee.updating);
  const updateSuccess = useAppSelector(state => state.societeLiee.updateSuccess);
  const societeLieeError = useAppSelector(state => state.societeLiee.errorMessage);

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
    if (societeLieeEntity) {
      setFormValues({
        raisonSociale: societeLieeEntity.raisonSociale ?? '',
        formeJuridique: societeLieeEntity.formeJuridique ?? '',
        ice: societeLieeEntity.ice ?? '',
        rc: societeLieeEntity.rc ?? '',
        nif: societeLieeEntity.nif ?? '',
        secteurActivite: societeLieeEntity.secteurActivite ?? '',
        tailleEntreprise: societeLieeEntity.tailleEntreprise ?? '',
        adresseSiege: societeLieeEntity.adresseSiege ?? '',
        representantLegal: societeLieeEntity.representantLegal ?? '',
      });
    }
  }, [societeLieeEntity]);

  useEffect(() => {
    if (updateSuccess) {
      navigate('/dashboard/societe-liee/list');
    }
  }, [updateSuccess, navigate]);

  const handleChange =
    (field: keyof SocieteLieeFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formValues.raisonSociale.trim()) {
      nextErrors.raisonSociale = 'La raison sociale est obligatoire';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): ISocieteLiee => {
    const payload: ISocieteLiee = {
      id: societeLieeEntity?.id ?? (id ? Number(id) : undefined),
      raisonSociale: formValues.raisonSociale.trim(),
    };

    if (formValues.formeJuridique.trim()) {
      payload.formeJuridique = formValues.formeJuridique.trim();
    }
    if (formValues.ice.trim()) {
      payload.ice = formValues.ice.trim();
    }
    if (formValues.rc.trim()) {
      payload.rc = formValues.rc.trim();
    }
    if (formValues.nif.trim()) {
      payload.nif = formValues.nif.trim();
    }
    if (formValues.secteurActivite.trim()) {
      payload.secteurActivite = formValues.secteurActivite.trim();
    }
    if (formValues.tailleEntreprise.trim()) {
      payload.tailleEntreprise = formValues.tailleEntreprise.trim();
    }
    if (formValues.adresseSiege.trim()) {
      payload.adresseSiege = formValues.adresseSiege.trim();
    }
    if (formValues.representantLegal.trim()) {
      payload.representantLegal = formValues.representantLegal.trim();
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

  const renderError = (field: keyof SocieteLieeFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const isLoadingEntity = loading && !societeLieeEntity?.id;

  return (
    <div className="societe-liee-edit-page">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Modifier la société liée</h5>
            <p className="mb-0 text-muted">Mettre à jour les informations de la société liée.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" tag={Link} to="/dashboard/societe-liee/list" outline>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour à la liste
            </Button>
            <Button color="primary" form={FORM_ID} type="submit" disabled={updating || isLoadingEntity}>
              {updating || isLoadingEntity ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {societeLieeError ? (
            <Alert color="danger" className="mb-4">
              {societeLieeError}
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
                    <Label htmlFor="societe-raisonSociale">Raison sociale *</Label>
                    <Input
                      id="societe-raisonSociale"
                      name="raisonSociale"
                      value={formValues.raisonSociale}
                      onChange={handleChange('raisonSociale')}
                      placeholder="Nom légal de la société"
                    />
                    {renderError('raisonSociale')}
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-formeJuridique">Forme juridique</Label>
                    <Input
                      id="societe-formeJuridique"
                      name="formeJuridique"
                      value={formValues.formeJuridique}
                      onChange={handleChange('formeJuridique')}
                      placeholder="SARL, SA..."
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-ice">ICE</Label>
                    <Input id="societe-ice" name="ice" value={formValues.ice} onChange={handleChange('ice')} placeholder="ICE" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-rc">RC</Label>
                    <Input
                      id="societe-rc"
                      name="rc"
                      value={formValues.rc}
                      onChange={handleChange('rc')}
                      placeholder="Registre de commerce"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-nif">NIF</Label>
                    <Input id="societe-nif" name="nif" value={formValues.nif} onChange={handleChange('nif')} placeholder="Numéro fiscal" />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-secteurActivite">Secteur d&apos;activité</Label>
                    <Input
                      id="societe-secteurActivite"
                      name="secteurActivite"
                      value={formValues.secteurActivite}
                      onChange={handleChange('secteurActivite')}
                      placeholder="Industrie, services..."
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-tailleEntreprise">Taille de l&apos;entreprise</Label>
                    <Input
                      id="societe-tailleEntreprise"
                      name="tailleEntreprise"
                      value={formValues.tailleEntreprise}
                      onChange={handleChange('tailleEntreprise')}
                      placeholder="PME, GE..."
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="societe-representantLegal">Représentant légal</Label>
                    <Input
                      id="societe-representantLegal"
                      name="representantLegal"
                      value={formValues.representantLegal}
                      onChange={handleChange('representantLegal')}
                      placeholder="Nom du représentant"
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="societe-adresseSiege">Adresse du siège</Label>
                    <Input
                      id="societe-adresseSiege"
                      name="adresseSiege"
                      type="textarea"
                      value={formValues.adresseSiege}
                      onChange={handleChange('adresseSiege')}
                      placeholder="Adresse complète du siège social"
                    />
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

export default SocieteLieeEditPage;
