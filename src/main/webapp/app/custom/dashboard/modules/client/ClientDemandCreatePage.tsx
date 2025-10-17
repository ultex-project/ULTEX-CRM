import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import Select, { MultiValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPen, faPlus, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { reset as resetDemande } from 'app/entities/demande-client/demande-client.reducer';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { getEntities as getDevises } from 'app/entities/devise/devise.reducer';
import { getEntities as getIncoterms } from 'app/entities/incoterm/incoterm.reducer';
import { getEntities as getSousServices } from 'app/entities/sous-service/sous-service.reducer';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';
import { TypeProduit } from 'app/shared/model/enumerations/type-produit.model';

interface FormState {
  reference: string;
  dateDemande: string;
  servicePrincipal: string;
  typeDemande: string;
  sousServices: string[];
  provenance: string;
  incotermId: string;
  deviseId: string;
  nombreProduits: string;
  remarqueGenerale: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface ProductFormState {
  typeProduit: string;
  nomProduit: string;
  description: string;
  quantite: string;
  unite: string;
  prix: string;
  poidsKg: string;
  volumeTotalCbm: string;
  hsCode: string;
  prixCible: string;
  origine: string;
  fournisseur: string;
  contact: string;
  adresseChargement: string;
  adresseDechargement: string;
}

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

const UNITE_OPTIONS = ['pcs', 'kg', 'm3'] as const;
type LocalProduitDemande = IProduitDemande & { contact?: string | null };
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
  const typeProduitOptions = useMemo(() => Object.keys(TypeProduit), []);
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
    nombreProduits: '0',
    remarqueGenerale: '',
  }));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [produits, setProduits] = useState<LocalProduitDemande[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productFormValues, setProductFormValues] = useState<ProductFormState>(() => ({
    typeProduit: typeProduitOptions[0] ?? '',
    nomProduit: '',
    description: '',
    quantite: '',
    unite: UNITE_OPTIONS[0],
    prix: '',
    poidsKg: '',
    volumeTotalCbm: '',
    hsCode: '',
    prixCible: '',
    origine: '',
    fournisseur: '',
    contact: '',
    adresseChargement: '',
    adresseDechargement: '',
  }));
  const [productFormErrors, setProductFormErrors] = useState<ProductFormErrors>({});
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clientIdNumber = useMemo(() => (clientId ? Number(clientId) : null), [clientId]);

  const getActiveProductFields = (servicePrincipalValue: string, typeDemandeValue: string): Array<keyof ProductFormState> => {
    const service = servicePrincipalValue as keyof typeof ServicePrincipal;
    const type = typeDemandeValue as keyof typeof TypeDemande;

    if (service === 'IMPORT') {
      switch (type) {
        case 'PROFORMA':
          return ['quantite', 'unite', 'prix', 'poidsKg', 'volumeTotalCbm', 'hsCode', 'prixCible'];
        case 'SOURCING':
          return ['origine', 'fournisseur', 'prixCible'];
        case 'NEGOCIATION':
          return ['fournisseur', 'prix', 'contact'];
        default:
          return ['quantite', 'prix', 'hsCode'];
      }
    }

    if (service === 'EXPORT') {
      return ['quantite', 'unite', 'adresseChargement', 'adresseDechargement', 'poidsKg', 'volumeTotalCbm'];
    }

    return ['quantite', 'prix'];
  };

  const activeProductFields = useMemo(
    () => getActiveProductFields(formValues.servicePrincipal, formValues.typeDemande),
    [formValues.servicePrincipal, formValues.typeDemande],
  );

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

  useEffect(() => {
    setFormValues(prev => ({ ...prev, nombreProduits: String(produits.length) }));
  }, [produits]);

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
    if (produits.length === 0) {
      nextErrors.nombreProduits = translate('crmApp.demandeClient.create.errors.nombreProduits');
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetProductForm = () => {
    setProductFormValues({
      typeProduit: typeProduitOptions[0] ?? '',
      nomProduit: '',
      description: '',
      quantite: '',
      unite: UNITE_OPTIONS[0],
      prix: '',
      poidsKg: '',
      volumeTotalCbm: '',
      hsCode: '',
      prixCible: '',
      origine: '',
      fournisseur: '',
      contact: '',
      adresseChargement: '',
      adresseDechargement: '',
    });
    setProductFormErrors({});
    setEditingProductIndex(null);
  };

  const toggleProductModal = () => {
    setProductModalOpen(prev => !prev);
  };

  const handleOpenCreateProduct = () => {
    resetProductForm();
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (index: number) => {
    const produit = produits[index];
    setProductFormValues({
      typeProduit: produit.typeProduit ?? typeProduitOptions[0] ?? '',
      nomProduit: produit.nomProduit ?? '',
      description: produit.description ?? '',
      quantite: produit.quantite !== undefined && produit.quantite !== null ? String(produit.quantite) : '',
      unite: produit.unite ?? UNITE_OPTIONS[0],
      prix: produit.prix !== undefined && produit.prix !== null ? String(produit.prix) : '',
      poidsKg: produit.poidsKg !== undefined && produit.poidsKg !== null ? String(produit.poidsKg) : '',
      volumeTotalCbm: produit.volumeTotalCbm !== undefined && produit.volumeTotalCbm !== null ? String(produit.volumeTotalCbm) : '',
      hsCode: produit.hsCode ?? '',
      prixCible: produit.prixCible !== undefined && produit.prixCible !== null ? String(produit.prixCible) : '',
      origine: produit.origine ?? '',
      fournisseur: produit.fournisseur ?? '',
      contact: produit.contact ?? '',
      adresseChargement: produit.adresseChargement ?? '',
      adresseDechargement: produit.adresseDechargement ?? '',
    });
    setProductFormErrors({});
    setEditingProductIndex(index);
    setProductModalOpen(true);
  };

  const handleProductFieldChange =
    (field: keyof ProductFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setProductFormValues(prev => ({ ...prev, [field]: value }));
      if (productFormErrors[field]) {
        setProductFormErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const productFieldLabels: Record<keyof ProductFormState, string> = {
    typeProduit: 'Type de produit',
    nomProduit: 'Nom du produit',
    description: 'Description',
    quantite: 'Quantité',
    unite: 'Unité',
    prix: 'Prix',
    poidsKg: 'Poids (kg)',
    volumeTotalCbm: 'Volume total (CBM)',
    hsCode: 'HS Code',
    prixCible: 'Prix cible',
    origine: 'Origine',
    fournisseur: 'Fournisseur',
    contact: 'Contact',
    adresseChargement: 'Adresse de chargement',
    adresseDechargement: 'Adresse de déchargement',
  };

  const numericFields: Array<keyof ProductFormState> = ['quantite', 'prix', 'poidsKg', 'volumeTotalCbm', 'prixCible'];
  const strictlyPositiveFields: Array<keyof ProductFormState> = ['quantite', 'poidsKg', 'volumeTotalCbm'];
  const nonNegativeFields: Array<keyof ProductFormState> = ['prix', 'prixCible'];

  const validateProductForm = () => {
    const nextErrors: ProductFormErrors = {};
    const mandatoryFields: Array<keyof ProductFormState> = ['typeProduit', 'nomProduit', ...activeProductFields];

    mandatoryFields.forEach(field => {
      const rawValue = productFormValues[field];
      const value = typeof rawValue === 'string' ? rawValue.trim() : '';
      if (!value) {
        nextErrors[field] = `${productFieldLabels[field]} est obligatoire.`;
        return;
      }

      if (numericFields.includes(field)) {
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
          nextErrors[field] = `${productFieldLabels[field]} doit être un nombre valide.`;
          return;
        }
        if (strictlyPositiveFields.includes(field) && parsed <= 0) {
          nextErrors[field] = `${productFieldLabels[field]} doit être supérieur à 0.`;
        }
        if (nonNegativeFields.includes(field) && parsed < 0) {
          nextErrors[field] = `${productFieldLabels[field]} ne peut pas être négatif.`;
        }
      }
    });

    setProductFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateProductForm()) {
      return;
    }

    const activeFieldSet = new Set(activeProductFields);
    const toNumberOrUndefined = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return undefined;
      }
      const parsed = Number(trimmed);
      return Number.isNaN(parsed) ? undefined : parsed;
    };
    const getStringValue = (field: keyof ProductFormState) => {
      const raw = productFormValues[field];
      if (typeof raw !== 'string') {
        return undefined;
      }
      const trimmed = raw.trim();
      return trimmed || undefined;
    };

    const produit: LocalProduitDemande = {
      typeProduit: productFormValues.typeProduit as keyof typeof TypeProduit,
      nomProduit: productFormValues.nomProduit.trim(),
      description: productFormValues.description.trim() || undefined,
      quantite: activeFieldSet.has('quantite') ? toNumberOrUndefined(productFormValues.quantite) : undefined,
      unite: activeFieldSet.has('unite') ? getStringValue('unite') : undefined,
      prix: activeFieldSet.has('prix') ? toNumberOrUndefined(productFormValues.prix) : undefined,
      poidsKg: activeFieldSet.has('poidsKg') ? toNumberOrUndefined(productFormValues.poidsKg) : undefined,
      volumeTotalCbm: activeFieldSet.has('volumeTotalCbm') ? toNumberOrUndefined(productFormValues.volumeTotalCbm) : undefined,
      hsCode: activeFieldSet.has('hsCode') ? getStringValue('hsCode') : undefined,
      prixCible: activeFieldSet.has('prixCible') ? toNumberOrUndefined(productFormValues.prixCible) : undefined,
      origine: activeFieldSet.has('origine') ? getStringValue('origine') : undefined,
      fournisseur: activeFieldSet.has('fournisseur') ? getStringValue('fournisseur') : undefined,
      contact: activeFieldSet.has('contact') ? getStringValue('contact') : undefined,
      adresseChargement: activeFieldSet.has('adresseChargement') ? getStringValue('adresseChargement') : undefined,
      adresseDechargement: activeFieldSet.has('adresseDechargement') ? getStringValue('adresseDechargement') : undefined,
    };

    setProduits(prev => {
      if (editingProductIndex !== null) {
        return prev.map((item, idx) => (idx === editingProductIndex ? { ...item, ...produit } : item));
      }
      return [...prev, produit];
    });

    resetProductForm();
    setProductModalOpen(false);
  };

  const handleDeleteProduct = (index: number) => {
    setProduits(prev => prev.filter((_, idx) => idx !== index));
  };

  const renderProductError = (field: keyof ProductFormState) =>
    productFormErrors[field] ? <div className="text-danger small mt-1">{productFormErrors[field]}</div> : null;

  const renderProductField = (field: keyof ProductFormState) => {
    const colSize = field === 'description' ? 12 : 6;
    const id = `produit-${field}`;
    const commonProps = {
      id,
      value: productFormValues[field],
      onChange: handleProductFieldChange(field),
    };
    const isRequired = field === 'typeProduit' || field === 'nomProduit' || activeProductFields.includes(field);

    let inputNode: React.ReactNode;

    switch (field) {
      case 'typeProduit':
        inputNode = (
          <Input {...commonProps} type="select">
            {typeProduitOptions.map(option => (
              <option key={option} value={option}>
                {translate(`crmApp.TypeProduit.${option}`)}
              </option>
            ))}
          </Input>
        );
        break;
      case 'unite':
        inputNode = (
          <Input {...commonProps} type="select">
            {UNITE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option === 'm3' ? 'm³' : option}
              </option>
            ))}
          </Input>
        );
        break;
      case 'description':
        inputNode = <Input {...commonProps} type="textarea" rows={3} />;
        break;
      case 'adresseChargement':
      case 'adresseDechargement':
        inputNode = <Input {...commonProps} type="textarea" rows={2} />;
        break;
      case 'quantite':
      case 'prix':
      case 'poidsKg':
      case 'volumeTotalCbm':
      case 'prixCible':
        inputNode = <Input {...commonProps} type="number" step="0.01" min={field === 'prix' || field === 'prixCible' ? '0' : '0.01'} />;
        break;
      default:
        inputNode = <Input {...commonProps} />;
        break;
    }

    return (
      <Col md={colSize} key={field}>
        <FormGroup>
          <Label for={id}>
            {productFieldLabels[field]}
            {isRequired ? ' *' : ''}
          </Label>
          {inputNode}
          {renderProductError(field)}
        </FormGroup>
      </Col>
    );
  };

  const formatNumber = (value?: number | null) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
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

    const produitsPayload = produits.map(produit =>
      cleanEntity({
        typeProduit: produit.typeProduit,
        nomProduit: produit.nomProduit,
        description: produit.description,
        quantite: produit.quantite,
        unite: produit.unite,
        prix: produit.prix,
        poidsKg: produit.poidsKg,
        volumeTotalCbm: produit.volumeTotalCbm,
        hsCode: produit.hsCode,
        prixCible: produit.prixCible,
        origine: produit.origine,
        fournisseur: produit.fournisseur,
        contact: produit.contact,
        adresseChargement: produit.adresseChargement,
        adresseDechargement: produit.adresseDechargement,
      }),
    );

    axios
      .post('api/demande-clients', cleanEntity({ ...payload, produits: produitsPayload }))
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

            <hr className="my-5" />

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h5 className="mb-0">📦 Produits demandés</h5>
              <Button color="success" size="sm" type="button" onClick={handleOpenCreateProduct}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Ajouter un produit
              </Button>
            </div>

            {produits.length === 0 ? (
              <Alert color="info" className="mb-0">
                Aucun produit ajouté pour le moment.
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table bordered hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Produit</th>
                      <th>Détails</th>
                      <th className="text-center" style={{ width: 160 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map((produit, index) => (
                      <tr key={`${produit.nomProduit ?? 'produit'}-${index}`}>
                        <td style={{ width: '32%' }}>
                          <div className="fw-semibold">{produit.nomProduit || '--'}</div>
                          <div className="text-muted small">
                            {produit.typeProduit ? translate(`crmApp.TypeProduit.${produit.typeProduit}`) : '--'}
                          </div>
                          {produit.description ? <div className="text-muted small mt-2">{produit.description}</div> : null}
                        </td>
                        <td>
                          {(() => {
                            const chips: React.ReactNode[] = [];
                            if (produit.quantite !== undefined && produit.quantite !== null) {
                              chips.push(
                                <span key={`quantite-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Quantité:</span>
                                  <span className="fw-semibold">
                                    {formatNumber(produit.quantite)}
                                    {produit.unite ? ` ${produit.unite === 'm3' ? 'm³' : produit.unite}` : ''}
                                  </span>
                                </span>,
                              );
                            }
                            if (produit.prix !== undefined && produit.prix !== null) {
                              chips.push(
                                <span key={`prix-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Prix:</span>
                                  <span className="fw-semibold">{formatNumber(produit.prix)}</span>
                                </span>,
                              );
                            }
                            if (produit.prixCible !== undefined && produit.prixCible !== null) {
                              chips.push(
                                <span key={`prixCible-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Prix cible:</span>
                                  <span className="fw-semibold">{formatNumber(produit.prixCible)}</span>
                                </span>,
                              );
                            }
                            if (produit.poidsKg !== undefined && produit.poidsKg !== null) {
                              chips.push(
                                <span key={`poids-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Poids:</span>
                                  <span className="fw-semibold">{formatNumber(produit.poidsKg)} kg</span>
                                </span>,
                              );
                            }
                            if (produit.volumeTotalCbm !== undefined && produit.volumeTotalCbm !== null) {
                              chips.push(
                                <span key={`volume-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Volume:</span>
                                  <span className="fw-semibold">{formatNumber(produit.volumeTotalCbm)} CBM</span>
                                </span>,
                              );
                            }
                            if (produit.hsCode) {
                              chips.push(
                                <span key={`hs-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">HS Code:</span>
                                  <span className="fw-semibold">{produit.hsCode}</span>
                                </span>,
                              );
                            }
                            if (produit.origine) {
                              chips.push(
                                <span key={`origine-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Origine:</span>
                                  <span className="fw-semibold">{produit.origine}</span>
                                </span>,
                              );
                            }
                            if (produit.fournisseur) {
                              chips.push(
                                <span key={`fournisseur-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Fournisseur:</span>
                                  <span className="fw-semibold">{produit.fournisseur}</span>
                                </span>,
                              );
                            }
                            if (produit.contact) {
                              chips.push(
                                <span key={`contact-${index}`} className="badge bg-light text-dark border fw-normal">
                                  <span className="text-muted me-1">Contact:</span>
                                  <span className="fw-semibold">{produit.contact}</span>
                                </span>,
                              );
                            }

                            return chips.length > 0 ? (
                              <div className="d-flex flex-wrap gap-2">{chips}</div>
                            ) : (
                              <span className="text-muted small">--</span>
                            );
                          })()}

                          {produit.adresseChargement || produit.adresseDechargement ? (
                            <div className="small text-muted mt-3">
                              {produit.adresseChargement ? <div>Chargement: {produit.adresseChargement}</div> : null}
                              {produit.adresseDechargement ? <div>Déchargement: {produit.adresseDechargement}</div> : null}
                            </div>
                          ) : null}
                        </td>
                        <td className="text-center">
                          <Button color="link" size="sm" className="text-decoration-none me-2" onClick={() => handleOpenEditProduct(index)}>
                            <FontAwesomeIcon icon={faPen} className="me-1" />
                            Éditer
                          </Button>
                          <Button
                            color="link"
                            size="sm"
                            className="text-danger text-decoration-none"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Form>
        </CardBody>
      </Card>

      <Modal isOpen={productModalOpen} toggle={toggleProductModal} centered>
        <Form onSubmit={handleSaveProduct}>
          <ModalHeader toggle={toggleProductModal}>
            {editingProductIndex !== null ? 'Modifier le produit' : 'Ajouter un produit'}
          </ModalHeader>
          <ModalBody>
            <Row className="gy-3">
              {renderProductField('typeProduit')}
              {renderProductField('nomProduit')}
              {renderProductField('description')}
              {activeProductFields.map(field => renderProductField(field))}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline type="button" onClick={toggleProductModal}>
              Annuler
            </Button>
            <Button color="primary" type="submit">
              <FontAwesomeIcon icon={faSave} className="me-2" />
              {editingProductIndex !== null ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientDemandCreatePage;
