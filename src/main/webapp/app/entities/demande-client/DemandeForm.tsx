import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { IDevise } from 'app/shared/model/devise.model';
import { IIncoterm } from 'app/shared/model/incoterm.model';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

interface FormState {
  reference: string;
  dateDemande: string;
  servicePrincipal: string;
  sousServices: string;
  provenance: string;
  deviseId: string;
  incotermId: string;
  nombreProduits: string;
  remarqueGenerale: string;
}

type DemandeField = keyof FormState;
type FormErrors = Partial<Record<DemandeField, string>>;

type ProduitField = Exclude<keyof IProduitDemande, 'id' | 'demande'>;

const NUMERIC_PRODUIT_FIELDS = [
  'quantite',
  'prix',
  'fraisExpedition',
  'poidsKg',
  'volumeTotalCbm',
  'nombreCartons',
  'piecesParCarton',
  'prixCible',
] as const satisfies readonly ProduitField[];

type NumericProduitField = (typeof NUMERIC_PRODUIT_FIELDS)[number];

const isNumericProduitField = (field: ProduitField): field is NumericProduitField =>
  NUMERIC_PRODUIT_FIELDS.includes(field as NumericProduitField);

const PRODUCT_FIELD_CONFIG: Array<{
  key: ProduitField;
  label: string;
  type?: 'number' | 'text' | 'textarea';
  step?: string;
}> = [
  { key: 'typeProduit', label: 'Type de produit' },
  { key: 'typeDemande', label: 'Type de demande' },
  { key: 'nomProduit', label: 'Nom du produit' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'quantite', label: 'Quantité', type: 'number', step: '0.01' },
  { key: 'unite', label: 'Unité' },
  { key: 'prix', label: 'Prix', type: 'number', step: '0.01' },
  { key: 'fraisExpedition', label: "Frais d'expédition", type: 'number', step: '0.01' },
  { key: 'poidsKg', label: 'Poids (kg)', type: 'number', step: '0.01' },
  { key: 'volumeTotalCbm', label: 'Volume total (CBM)', type: 'number', step: '0.01' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'nombreCartons', label: 'Nombre de cartons', type: 'number', step: '1' },
  { key: 'piecesParCarton', label: 'Pièces par carton', type: 'number', step: '1' },
  { key: 'hsCode', label: 'HS Code' },
  { key: 'prixCible', label: 'Prix cible', type: 'number', step: '0.01' },
  { key: 'ficheTechniqueUrl', label: 'URL fiche technique' },
  { key: 'photosUrl', label: 'URL photos' },
  { key: 'piecesJointesUrl', label: 'URL pièces jointes' },
];

interface DemandeFormProps {
  demandeId?: number;
  initialDemande?: Partial<IDemandeClient>;
  initialProduits?: IProduitDemande[];
  onSaved?: (demande: IDemandeClient, produits: IProduitDemande[]) => void;
  onCancel?: () => void;
}

const buildInitialFormState = (overrides?: Partial<IDemandeClient>): FormState => {
  const base: FormState = {
    reference: '',
    dateDemande: displayDefaultDateTime(),
    servicePrincipal: '',
    sousServices: '',
    provenance: '',
    deviseId: '',
    incotermId: '',
    nombreProduits: '0',
    remarqueGenerale: '',
  };

  if (!overrides) {
    return base;
  }

  return {
    reference: overrides.reference ?? base.reference,
    dateDemande: overrides.dateDemande ? (convertDateTimeFromServer(overrides.dateDemande) ?? base.dateDemande) : base.dateDemande,
    servicePrincipal: overrides.servicePrincipal ?? base.servicePrincipal,
    sousServices: overrides.sousServices ?? base.sousServices,
    provenance: overrides.provenance ?? base.provenance,
    deviseId: overrides.devise?.id !== undefined && overrides.devise?.id !== null ? String(overrides.devise.id) : base.deviseId,
    incotermId: overrides.incoterm?.id !== undefined && overrides.incoterm?.id !== null ? String(overrides.incoterm.id) : base.incotermId,
    nombreProduits: overrides.nombreProduits !== undefined ? String(overrides.nombreProduits) : base.nombreProduits,
    remarqueGenerale: overrides.remarqueGenerale ?? base.remarqueGenerale,
  };
};

const DemandeForm = ({ demandeId, initialDemande, initialProduits, onSaved, onCancel }: DemandeFormProps) => {
  const isEditMode = useMemo(() => demandeId !== undefined && demandeId !== null, [demandeId]);

  const [formValues, setFormValues] = useState<FormState>(() => buildInitialFormState(initialDemande));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [produits, setProduits] = useState<IProduitDemande[]>(() => initialProduits ?? []);
  const [removedProduitIds, setRemovedProduitIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [currentDemande, setCurrentDemande] = useState<Partial<IDemandeClient> | null>(() =>
    initialDemande ? { ...initialDemande } : null,
  );
  const [devises, setDevises] = useState<IDevise[]>([]);
  const [incoterms, setIncoterms] = useState<IIncoterm[]>([]);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialDemande) {
      setCurrentDemande(prev => ({ ...(prev ?? {}), ...initialDemande }));
      setFormValues(buildInitialFormState(initialDemande));
    }
  }, [initialDemande]);

  useEffect(() => {
    let ignore = false;
    const fetchReferenceData = async () => {
      setOptionsLoading(true);
      try {
        const [deviseResponse, incotermResponse] = await Promise.all([
          axios.get<IDevise[]>(`api/devises`, { params: { size: 1000, cacheBuster: Date.now() } }),
          axios.get<IIncoterm[]>(`api/incoterms`, { params: { size: 1000, cacheBuster: Date.now() } }),
        ]);

        if (ignore) {
          return;
        }

        setDevises(deviseResponse.data ?? []);
        setIncoterms(incotermResponse.data ?? []);
      } catch (error) {
        if (!ignore) {
          setSubmissionError(prev => prev ?? 'Impossible de charger les données de référence. Veuillez réessayer.');
        }
      } finally {
        if (!ignore) {
          setOptionsLoading(false);
        }
      }
    };

    fetchReferenceData();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    let ignore = false;
    const fetchData = async () => {
      setInitialLoading(true);
      setSubmissionError(null);
      try {
        const [demandeResponse, produitsResponse] = await Promise.all([
          axios.get<IDemandeClient>(`api/demande-clients/${demandeId}`),
          axios.get<IProduitDemande[]>(`api/produit-demandes`, {
            params: { size: 1000, cacheBuster: Date.now() },
          }),
        ]);

        if (ignore) {
          return;
        }

        const demandeData = demandeResponse.data;
        const demandeProduits = produitsResponse.data.filter(item => item.demande?.id === demandeData.id);

        setCurrentDemande(demandeData);
        setFormValues(buildInitialFormState({ ...demandeData, nombreProduits: demandeProduits.length }));
        setProduits(demandeProduits);
        setRemovedProduitIds([]);
      } catch (error) {
        if (!ignore) {
          setSubmissionError('Impossible de charger la demande. Veuillez réessayer.');
        }
      } finally {
        if (!ignore) {
          setInitialLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [demandeId, isEditMode]);

  useEffect(() => {
    setFormValues(prev => {
      const nextCount = String(produits.length);
      if (prev.nombreProduits === nextCount) {
        return prev;
      }
      return { ...prev, nombreProduits: nextCount };
    });
  }, [produits]);

  const handleFieldChange =
    (field: DemandeField) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prevErrors => {
          const next = { ...prevErrors };
          delete next[field];
          return next;
        });
      }
    };

  const updateProduitValue = useCallback(
    <K extends ProduitField>(produit: IProduitDemande, field: K, val: IProduitDemande[K]): IProduitDemande => ({
      ...produit,
      [field]: val,
    }),
    [],
  );

  const handleProductChange = useCallback(
    (index: number, field: ProduitField, value: string) => {
      setProduits(prev =>
        prev.map((item, idx) => {
          if (idx !== index) {
            return item;
          }
          if (isNumericProduitField(field)) {
            const numeric = value === '' ? null : Number(value);
            const finalValue: IProduitDemande[NumericProduitField] = numeric === null || Number.isNaN(numeric) ? null : numeric;
            return updateProduitValue(item, field, finalValue);
          }
          const finalValue: IProduitDemande[Exclude<ProduitField, NumericProduitField>] = value === '' ? null : value;
          return updateProduitValue(item, field, finalValue);
        }),
      );
    },
    [updateProduitValue],
  );

  const addProduct = useCallback(() => {
    setProduits(prev => [...prev, {}]);
  }, []);

  const removeProduct = useCallback((index: number) => {
    setProduits(prev => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.id !== undefined && removed.id !== null) {
        setRemovedProduitIds(ids => (ids.includes(removed.id) ? ids : [...ids, removed.id]));
      }
      return next;
    });
  }, []);

  const validate = useCallback(() => {
    const errors: FormErrors = {};
    if (!formValues.reference.trim()) {
      errors.reference = 'La référence est obligatoire.';
    }
    if (!formValues.dateDemande.trim()) {
      errors.dateDemande = 'La date de demande est obligatoire.';
    }
    if (!formValues.provenance.trim()) {
      errors.provenance = 'La provenance est obligatoire.';
    }
    if (!formValues.incotermId) {
      errors.incotermId = "L'incoterm est obligatoire.";
    }
    if (!formValues.deviseId) {
      errors.deviseId = 'La devise est obligatoire.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  const parseDemandePayload = useCallback((): IDemandeClient => {
    const nombreProduits = produits.length;
    const client = currentDemande?.client;
    const devise = formValues.deviseId ? { id: Number(formValues.deviseId) } : undefined;
    const incoterm = formValues.incotermId ? { id: Number(formValues.incotermId) } : undefined;
    return {
      id: currentDemande?.id ?? demandeId,
      reference: formValues.reference.trim(),
      dateDemande: convertDateTimeToServer(formValues.dateDemande) ?? dayjs(),
      servicePrincipal: formValues.servicePrincipal.trim() || undefined,
      sousServices: formValues.sousServices.trim() || undefined,
      provenance: formValues.provenance.trim(),
      incoterm,
      devise,
      nombreProduits,
      remarqueGenerale: formValues.remarqueGenerale.trim() || undefined,
      client,
    };
  }, [currentDemande, demandeId, formValues, produits.length]);

  const buildProduitPayload = useCallback(
    (produit: IProduitDemande, demande: IDemandeClient): IProduitDemande => ({
      ...produit,
      demande: demande.id ? { id: demande.id } : undefined,
    }),
    [],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    setSubmissionError(null);

    try {
      const demandePayload = parseDemandePayload();
      const demandeRequest = isEditMode
        ? axios.put<IDemandeClient>(`api/demande-clients/${demandePayload.id}`, cleanEntity(demandePayload))
        : axios.post<IDemandeClient>('api/demande-clients', cleanEntity(demandePayload));

      const demandeResponse = await demandeRequest;
      const savedDemande = demandeResponse.data;
      setCurrentDemande(savedDemande);

      const productPromises = produits.map(produit => {
        const payload = cleanEntity(buildProduitPayload(produit, savedDemande));
        if (produit.id) {
          return axios.put<IProduitDemande>(`api/produit-demandes/${produit.id}`, payload);
        }
        return axios.post<IProduitDemande>('api/produit-demandes', payload);
      });

      const productResponses = await Promise.all(productPromises);
      const savedProduits = productResponses.map(response => response.data);

      if (removedProduitIds.length > 0) {
        await Promise.all(removedProduitIds.map(id => axios.delete(`api/produit-demandes/${id}`)));
      }

      setProduits(savedProduits);
      setRemovedProduitIds([]);

      if (onSaved) {
        onSaved(savedDemande, savedProduits);
      }
    } catch (error) {
      setSubmissionError('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field: DemandeField) =>
    formErrors[field] ? (
      <FormFeedback className="d-block" data-field={field}>
        {formErrors[field]}
      </FormFeedback>
    ) : null;

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white border-0">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h5 className="mb-1">{isEditMode ? 'Modifier la demande' : 'Créer une demande'}</h5>
            <p className="mb-0 text-muted">Complétez les informations principales puis ajoutez les produits demandés.</p>
          </div>
          <div className="d-flex gap-2">
            <Button color="secondary" outline type="button" onClick={onCancel} disabled={loading || initialLoading}>
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              Annuler
            </Button>
            <Button color="primary" type="submit" form="demande-form" disabled={loading || initialLoading || optionsLoading}>
              {loading ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              Sauvegarder
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {submissionError ? (
          <Alert color="danger" className="mb-4">
            {submissionError}
          </Alert>
        ) : null}
        {initialLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner color="primary" />
          </div>
        ) : (
          <Form id="demande-form" onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md="6">
                <FormGroup>
                  <Label for="demande-reference">Référence</Label>
                  <Input
                    id="demande-reference"
                    type="text"
                    value={formValues.reference}
                    onChange={handleFieldChange('reference')}
                    invalid={Boolean(formErrors.reference)}
                    placeholder="Référence interne"
                  />
                  {renderError('reference')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="demande-date">Date de la demande</Label>
                  <Input
                    id="demande-date"
                    type="datetime-local"
                    value={formValues.dateDemande}
                    onChange={handleFieldChange('dateDemande')}
                    invalid={Boolean(formErrors.dateDemande)}
                  />
                  {renderError('dateDemande')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="demande-service">Service principal</Label>
                  <Input
                    id="demande-service"
                    type="text"
                    value={formValues.servicePrincipal}
                    onChange={handleFieldChange('servicePrincipal')}
                    placeholder="Service concerné"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="demande-sous-services">Sous-services</Label>
                  <Input
                    id="demande-sous-services"
                    type="text"
                    value={formValues.sousServices}
                    onChange={handleFieldChange('sousServices')}
                    placeholder="Séparer par des virgules"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="demande-provenance">Provenance</Label>
                  <Input
                    id="demande-provenance"
                    type="text"
                    value={formValues.provenance}
                    onChange={handleFieldChange('provenance')}
                    invalid={Boolean(formErrors.provenance)}
                    placeholder="Origine du besoin"
                  />
                  {renderError('provenance')}
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="demande-incoterm">Incoterm</Label>
                  <Input
                    id="demande-incoterm"
                    type="select"
                    value={formValues.incotermId}
                    onChange={handleFieldChange('incotermId')}
                    invalid={Boolean(formErrors.incotermId)}
                    disabled={optionsLoading}
                  >
                    <option value="">Sélectionnez un incoterm</option>
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
              <Col md="3">
                <FormGroup>
                  <Label for="demande-devise">Devise</Label>
                  <Input
                    id="demande-devise"
                    type="select"
                    value={formValues.deviseId}
                    onChange={handleFieldChange('deviseId')}
                    invalid={Boolean(formErrors.deviseId)}
                    disabled={optionsLoading}
                  >
                    <option value="">Sélectionnez une devise</option>
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
              <Col md="3">
                <FormGroup>
                  <Label for="demande-nombre-produits">Nombre de produits</Label>
                  <Input id="demande-nombre-produits" type="number" value={formValues.nombreProduits} readOnly />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="demande-remarque">Remarque générale</Label>
                  <Input
                    id="demande-remarque"
                    type="textarea"
                    value={formValues.remarqueGenerale}
                    onChange={handleFieldChange('remarqueGenerale')}
                    rows={3}
                    placeholder="Notes ou précisions supplémentaires"
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <h6 className="mb-0">Produits demandés</h6>
                <Badge color="primary" pill>
                  {produits.length}
                </Badge>
              </div>
              <Button color="success" type="button" onClick={addProduct} disabled={loading || initialLoading}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Ajouter un produit
              </Button>
            </div>

            {produits.length === 0 ? (
              <Alert color="info">Ajoutez un premier produit pour détailler la demande.</Alert>
            ) : (
              <div className="d-flex flex-column gap-3">
                {produits.map((produit, index) => (
                  <Card key={produit.id ?? index} className="shadow-sm border">
                    <CardHeader className="d-flex justify-content-between align-items-center bg-light">
                      <span className="fw-semibold">Produit #{index + 1}</span>
                      <Button
                        color="danger"
                        outline
                        size="sm"
                        type="button"
                        onClick={() => removeProduct(index)}
                        disabled={loading || initialLoading}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                        Supprimer
                      </Button>
                    </CardHeader>
                    <CardBody>
                      <Row className="g-3">
                        {PRODUCT_FIELD_CONFIG.map(field => (
                          <Col md="6" key={`${field.key}-${index}`}>
                            <FormGroup>
                              <Label for={`${field.key}-${index}`}>{field.label}</Label>
                              {field.type === 'textarea' ? (
                                <Input
                                  id={`${field.key}-${index}`}
                                  type="textarea"
                                  value={(produit[field.key] as string | null) ?? ''}
                                  rows={3}
                                  onChange={event => handleProductChange(index, field.key, event.target.value)}
                                />
                              ) : (
                                <Input
                                  id={`${field.key}-${index}`}
                                  type={field.type ?? 'text'}
                                  step={field.type === 'number' ? (field.step ?? '0.01') : undefined}
                                  value={(() => {
                                    const value = produit[field.key];
                                    if (value === null || value === undefined) {
                                      return '';
                                    }
                                    return String(value);
                                  })()}
                                  onChange={event => handleProductChange(index, field.key, event.target.value)}
                                />
                              )}
                            </FormGroup>
                          </Col>
                        ))}
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default DemandeForm;
