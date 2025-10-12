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

interface FormState {
  reference: string;
  dateDemande: string;
  servicePrincipal: string;
  sousServices: string[];
  provenance: string;
  incotermId: string;
  deviseId: string;
  nombreProduits: string;
  remarqueGenerale: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface ProductFormState {
  nomProduit: string;
  description: string;
  quantite: string;
  unite: string;
  prix: string;
  hsCode: string;
  typeDemande: string;
}

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

const UNITE_OPTIONS = ['pcs', 'kg', 'm3'] as const;

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

  const [formValues, setFormValues] = useState<FormState>(() => ({
    reference: `DEM-${Date.now()}`,
    dateDemande: dayjs().format('YYYY-MM-DD'),
    servicePrincipal: servicePrincipalOptions[0] ?? '',
    sousServices: [],
    provenance: '',
    incotermId: '',
    deviseId: '',
    nombreProduits: '0',
    remarqueGenerale: '',
  }));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [produits, setProduits] = useState<IProduitDemande[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productFormValues, setProductFormValues] = useState<ProductFormState>(() => ({
    nomProduit: '',
    description: '',
    quantite: '',
    unite: UNITE_OPTIONS[0],
    prix: '',
    hsCode: '',
    typeDemande: typeDemandeOptions[0] ?? '',
  }));
  const [productFormErrors, setProductFormErrors] = useState<ProductFormErrors>({});
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
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

  const handleMultiSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setFormValues(prev => ({ ...prev, sousServices: selectedOptions }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!formValues.servicePrincipal) {
      nextErrors.servicePrincipal = translate('crmApp.demandeClient.create.errors.servicePrincipal');
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
      nomProduit: '',
      description: '',
      quantite: '',
      unite: UNITE_OPTIONS[0],
      prix: '',
      hsCode: '',
      typeDemande: typeDemandeOptions[0] ?? '',
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
      nomProduit: produit.nomProduit ?? '',
      description: produit.description ?? '',
      quantite: produit.quantite !== undefined && produit.quantite !== null ? String(produit.quantite) : '',
      unite: produit.unite ?? UNITE_OPTIONS[0],
      prix: produit.prix !== undefined && produit.prix !== null ? String(produit.prix) : '',
      hsCode: produit.hsCode ?? '',
      typeDemande: produit.typeDemande ?? typeDemandeOptions[0] ?? '',
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

  const validateProductForm = () => {
    const nextErrors: ProductFormErrors = {};
    if (!productFormValues.nomProduit.trim()) {
      nextErrors.nomProduit = 'Le nom du produit est obligatoire.';
    }
    if (!productFormValues.quantite.trim()) {
      nextErrors.quantite = 'La quantité est obligatoire.';
    } else if (Number(productFormValues.quantite) <= 0) {
      nextErrors.quantite = 'La quantité doit être supérieure à 0.';
    }
    if (!productFormValues.prix.trim()) {
      nextErrors.prix = 'Le prix est obligatoire.';
    } else if (Number(productFormValues.prix) < 0) {
      nextErrors.prix = 'Le prix doit être positif ou nul.';
    }
    setProductFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateProductForm()) {
      return;
    }

    const produit: IProduitDemande = {
      nomProduit: productFormValues.nomProduit.trim(),
      description: productFormValues.description.trim() || undefined,
      quantite: Number(productFormValues.quantite),
      unite: productFormValues.unite,
      prix: Number(productFormValues.prix),
      hsCode: productFormValues.hsCode.trim() || undefined,
      typeDemande: productFormValues.typeDemande as keyof typeof TypeDemande,
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
      sousServices: sousServicesPayload,
      provenance: formValues.provenance.trim(),
      incoterm: formValues.incotermId ? { id: Number(formValues.incotermId) } : undefined,
      devise: formValues.deviseId ? { id: Number(formValues.deviseId) } : undefined,
      nombreProduits: produits.length,
      remarqueGenerale: formValues.remarqueGenerale.trim() || undefined,
      client: { id: clientIdNumber },
    };

    const produitsPayload = produits.map(produit => ({
      nomProduit: produit.nomProduit,
      description: produit.description,
      quantite: produit.quantite,
      unite: produit.unite,
      prix: produit.prix,
      hsCode: produit.hsCode,
      typeDemande: produit.typeDemande,
    }));

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

              <Col md="6">
                <FormGroup>
                  <Label for="demande-sousServices">
                    <Translate contentKey="crmApp.demandeClient.sousServices" />
                  </Label>
                  <Input
                    id="demande-sousServices"
                    type="select"
                    multiple
                    value={formValues.sousServices}
                    onChange={event => handleMultiSelectChange}
                    disabled={sousServicesLoading}
                  >
                    {sousServicesLoading ? (
                      <option value="" disabled>
                        Chargement...
                      </option>
                    ) : null}
                    {sousServices
                      .filter(ss => ss.id !== undefined && ss.id !== null)
                      .map(ss => (
                        <option key={ss.id} value={String(ss.id)}>
                          {ss.libelle ?? ss.code ?? ss.id}
                        </option>
                      ))}
                  </Input>
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
                  <Label for="demande-nombreProduits">
                    <Translate contentKey="crmApp.demandeClient.nombreProduits" /> *
                  </Label>
                  <Input id="demande-nombreProduits" type="number" value={formValues.nombreProduits} readOnly />
                  {renderError('nombreProduits')}
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
                      <th>Nom du produit</th>
                      <th>Description</th>
                      <th className="text-end" style={{ width: 120 }}>
                        Quantité
                      </th>
                      <th style={{ width: 110 }}>Unité</th>
                      <th style={{ width: 160 }}>Type de demande</th>
                      <th className="text-end" style={{ width: 130 }}>
                        Prix
                      </th>
                      <th style={{ width: 150 }}>HS Code</th>
                      <th className="text-center" style={{ width: 140 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map((produit, index) => (
                      <tr key={`${produit.nomProduit ?? 'produit'}-${index}`}>
                        <td>{produit.nomProduit || '--'}</td>
                        <td className="text-muted small">{produit.description || '--'}</td>
                        <td className="text-end">{produit.quantite ?? '--'}</td>
                        <td>{produit.unite ? (produit.unite === 'm3' ? 'm³' : produit.unite) : '--'}</td>
                        <td>
                          {produit.typeDemande ? (
                            <span className="badge bg-light text-primary fw-semibold">
                              {translate(`crmApp.TypeDemande.${produit.typeDemande}`)}
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="text-end">{produit.prix ?? '--'}</td>
                        <td>{produit.hsCode || '--'}</td>
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
              <Col md="12">
                <FormGroup>
                  <Label for="produit-nom">Nom du produit</Label>
                  <Input id="produit-nom" value={productFormValues.nomProduit} onChange={handleProductFieldChange('nomProduit')} />
                  {renderProductError('nomProduit')}
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="produit-description">Description</Label>
                  <Input
                    id="produit-description"
                    type="textarea"
                    rows={3}
                    value={productFormValues.description}
                    onChange={handleProductFieldChange('description')}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="produit-quantite">Quantité</Label>
                  <Input
                    id="produit-quantite"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productFormValues.quantite}
                    onChange={handleProductFieldChange('quantite')}
                  />
                  {renderProductError('quantite')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="produit-unite">Unité</Label>
                  <Input id="produit-unite" type="select" value={productFormValues.unite} onChange={handleProductFieldChange('unite')}>
                    {UNITE_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option === 'm3' ? 'm³' : option}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="produit-typeDemande">Type de demande</Label>
                  <Input
                    id="produit-typeDemande"
                    type="select"
                    value={productFormValues.typeDemande}
                    onChange={handleProductFieldChange('typeDemande')}
                  >
                    {typeDemandeOptions.map(option => (
                      <option key={option} value={option}>
                        {translate(`crmApp.TypeDemande.${option}`)}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="produit-prix">Prix</Label>
                  <Input
                    id="produit-prix"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productFormValues.prix}
                    onChange={handleProductFieldChange('prix')}
                  />
                  {renderProductError('prix')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="produit-hscode">HS Code</Label>
                  <Input id="produit-hscode" value={productFormValues.hsCode} onChange={handleProductFieldChange('hsCode')} />
                </FormGroup>
              </Col>
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
