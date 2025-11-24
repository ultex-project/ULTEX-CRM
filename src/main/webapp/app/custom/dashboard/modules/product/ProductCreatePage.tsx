import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch } from 'app/config/store';
import { createEntity } from 'app/entities/produit-demande/produit-demande.reducer';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { TypeProduit } from 'app/shared/model/enumerations/type-produit.model';

import './ProductCreatePage.scss';

type ProductFormState = {
  typeProduit: string;
  nomProduit: string;
  description: string;
  quantite: string;
  unite: string;
  prix: string;
  poidsKg: string;
  volumeTotalCbm: string;
  dimensions: string;
  hsCode: string;
  prixCible: string;
  fraisExpedition: string;
  origine: string;
  fournisseur: string;
  adresseChargement: string;
  adresseDechargement: string;
  ficheTechniqueUrl: string;
  photosUrl: string;
  piecesJointesUrl: string;
};

type FormErrors = Partial<Record<keyof ProductFormState, string>>;

const PRODUCT_FORM_ID = 'product-form';

const mapStateToPayload = (values: ProductFormState): IProduitDemande => {
  const toNumber = (value: string) => {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const toStringOrUndefined = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  };

  return {
    typeProduit: values.typeProduit as keyof typeof TypeProduit,
    nomProduit: values.nomProduit.trim(),
    description: toStringOrUndefined(values.description),
    quantite: toNumber(values.quantite),
    unite: toStringOrUndefined(values.unite),
    prix: toNumber(values.prix),
    poidsKg: toNumber(values.poidsKg),
    volumeTotalCbm: toNumber(values.volumeTotalCbm),
    dimensions: toStringOrUndefined(values.dimensions),
    hsCode: toStringOrUndefined(values.hsCode),
    prixCible: toNumber(values.prixCible),
    fraisExpedition: toNumber(values.fraisExpedition),
    origine: toStringOrUndefined(values.origine),
    fournisseur: toStringOrUndefined(values.fournisseur),
    adresseChargement: toStringOrUndefined(values.adresseChargement),
    adresseDechargement: toStringOrUndefined(values.adresseDechargement),
    ficheTechniqueUrl: toStringOrUndefined(values.ficheTechniqueUrl),
    photosUrl: toStringOrUndefined(values.photosUrl),
    piecesJointesUrl: toStringOrUndefined(values.piecesJointesUrl),
  };
};

const ProductCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const typeOptions = useMemo(() => Object.keys(TypeProduit), []);

  const [formValues, setFormValues] = useState<ProductFormState>(() => ({
    typeProduit: typeOptions[0] ?? '',
    nomProduit: '',
    description: '',
    quantite: '',
    unite: '',
    prix: '',
    poidsKg: '',
    volumeTotalCbm: '',
    dimensions: '',
    hsCode: '',
    prixCible: '',
    fraisExpedition: '',
    origine: '',
    fournisseur: '',
    adresseChargement: '',
    adresseDechargement: '',
    ficheTechniqueUrl: '',
    photosUrl: '',
    piecesJointesUrl: '',
  }));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange =
    (field: keyof ProductFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const renderError = (field: keyof ProductFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const validate = () => {
    const errors: FormErrors = {};
    if (!formValues.typeProduit.trim()) {
      errors.typeProduit = translate('entity.validation.required');
    }
    if (!formValues.nomProduit.trim()) {
      errors.nomProduit = translate('entity.validation.required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    navigate('/dashboard/products');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      const payload = mapStateToPayload(formValues);
      await dispatch(createEntity(payload)).unwrap();
      navigate('/dashboard/products', { replace: true });
    } catch (error) {
      const message =
        (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
          ? error.message
          : translate('crmApp.produitDemande.home.notFound')) ?? translate('crmApp.produitDemande.home.notFound');
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-create-page">
      <Card className="shadow-sm border-0 product-form-wrapper">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h5 className="mb-1">
                <Translate contentKey="crmApp.produitDemande.home.createLabel" />
              </h5>
              <p className="mb-0 text-muted">
                <Translate contentKey="crmApp.produitDemande.home.title" />
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button color="secondary" outline onClick={handleCancel} disabled={submitting}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                <Translate contentKey="entity.action.back" />
              </Button>
              <Button color="primary" type="submit" form={PRODUCT_FORM_ID} disabled={submitting}>
                {submitting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
                <Translate contentKey="entity.action.save" />
              </Button>
            </div>
          </div>

          {submitError ? (
            <Alert color="danger" className="mb-4">
              {submitError}
            </Alert>
          ) : null}

          <Form id={PRODUCT_FORM_ID} onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="6">
                <FormGroup>
                  <Label for="product-typeProduit">
                    <Translate contentKey="crmApp.produitDemande.typeProduit" /> *
                  </Label>
                  <Input id="product-typeProduit" type="select" value={formValues.typeProduit} onChange={handleChange('typeProduit')}>
                    {typeOptions.map(option => (
                      <option key={option} value={option}>
                        {translate(`crmApp.TypeProduit.${option}`)}
                      </option>
                    ))}
                  </Input>
                  {renderError('typeProduit')}
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="product-nomProduit">
                    <Translate contentKey="crmApp.produitDemande.nomProduit" /> *
                  </Label>
                  <Input id="product-nomProduit" value={formValues.nomProduit} onChange={handleChange('nomProduit')} />
                  {renderError('nomProduit')}
                </FormGroup>
              </Col>

              <Col md="12">
                <FormGroup>
                  <Label for="product-description">
                    <Translate contentKey="crmApp.produitDemande.description" />
                  </Label>
                  <Input
                    id="product-description"
                    type="textarea"
                    rows={3}
                    value={formValues.description}
                    onChange={handleChange('description')}
                  />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-quantite">
                    <Translate contentKey="crmApp.produitDemande.quantite" />
                  </Label>
                  <Input id="product-quantite" type="number" value={formValues.quantite} onChange={handleChange('quantite')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-unite">
                    <Translate contentKey="crmApp.produitDemande.unite" />
                  </Label>
                  <Input id="product-unite" value={formValues.unite} onChange={handleChange('unite')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-prix">
                    <Translate contentKey="crmApp.produitDemande.prix" />
                  </Label>
                  <Input id="product-prix" type="number" value={formValues.prix} onChange={handleChange('prix')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-poidsKg">
                    <Translate contentKey="crmApp.produitDemande.poidsKg" />
                  </Label>
                  <Input id="product-poidsKg" type="number" value={formValues.poidsKg} onChange={handleChange('poidsKg')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-volumeTotalCbm">
                    <Translate contentKey="crmApp.produitDemande.volumeTotalCbm" />
                  </Label>
                  <Input
                    id="product-volumeTotalCbm"
                    type="number"
                    value={formValues.volumeTotalCbm}
                    onChange={handleChange('volumeTotalCbm')}
                  />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-dimensions">
                    <Translate contentKey="crmApp.produitDemande.dimensions" />
                  </Label>
                  <Input id="product-dimensions" value={formValues.dimensions} onChange={handleChange('dimensions')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-hsCode">
                    <Translate contentKey="crmApp.produitDemande.hsCode" />
                  </Label>
                  <Input id="product-hsCode" value={formValues.hsCode} onChange={handleChange('hsCode')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-prixCible">
                    <Translate contentKey="crmApp.produitDemande.prixCible" />
                  </Label>
                  <Input id="product-prixCible" type="number" value={formValues.prixCible} onChange={handleChange('prixCible')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-fraisExpedition">
                    <Translate contentKey="crmApp.produitDemande.fraisExpedition" />
                  </Label>
                  <Input
                    id="product-fraisExpedition"
                    type="number"
                    value={formValues.fraisExpedition}
                    onChange={handleChange('fraisExpedition')}
                  />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-origine">
                    <Translate contentKey="crmApp.produitDemande.origine" />
                  </Label>
                  <Input id="product-origine" value={formValues.origine} onChange={handleChange('origine')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-fournisseur">
                    <Translate contentKey="crmApp.produitDemande.fournisseur" />
                  </Label>
                  <Input id="product-fournisseur" value={formValues.fournisseur} onChange={handleChange('fournisseur')} />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="product-adresseChargement">
                    <Translate contentKey="crmApp.produitDemande.adresseChargement" />
                  </Label>
                  <Input
                    id="product-adresseChargement"
                    type="textarea"
                    rows={2}
                    value={formValues.adresseChargement}
                    onChange={handleChange('adresseChargement')}
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="product-adresseDechargement">
                    <Translate contentKey="crmApp.produitDemande.adresseDechargement" />
                  </Label>
                  <Input
                    id="product-adresseDechargement"
                    type="textarea"
                    rows={2}
                    value={formValues.adresseDechargement}
                    onChange={handleChange('adresseDechargement')}
                  />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-ficheTechniqueUrl">
                    <Translate contentKey="crmApp.produitDemande.ficheTechniqueUrl" />
                  </Label>
                  <Input id="product-ficheTechniqueUrl" value={formValues.ficheTechniqueUrl} onChange={handleChange('ficheTechniqueUrl')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-photosUrl">
                    <Translate contentKey="crmApp.produitDemande.photosUrl" />
                  </Label>
                  <Input id="product-photosUrl" value={formValues.photosUrl} onChange={handleChange('photosUrl')} />
                </FormGroup>
              </Col>

              <Col md="4">
                <FormGroup>
                  <Label for="product-piecesJointesUrl">
                    <Translate contentKey="crmApp.produitDemande.piecesJointesUrl" />
                  </Label>
                  <Input id="product-piecesJointesUrl" value={formValues.piecesJointesUrl} onChange={handleChange('piecesJointesUrl')} />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductCreatePage;
