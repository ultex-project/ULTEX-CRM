import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { TypeProduit } from 'app/shared/model/enumerations/type-produit.model';

import './ProductCreatePage.scss';

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const formatNumber = (value?: number | null) => {
  if (value === undefined || value === null) {
    return null;
  }
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
};

const useSuccessMessage = (location: ReturnType<typeof useLocation>) => {
  const successMessage = useMemo(() => {
    const state = location.state as { successMessage?: string } | null;
    return state?.successMessage;
  }, [location.state]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const state = location.state as Record<string, unknown> | null;
    if (state && 'successMessage' in state) {
      const { successMessage: _removed, ...rest } = state;
      window.history.replaceState(rest, document.title, location.pathname + location.search);
    }
  }, [successMessage, location.pathname, location.search, location.state]);

  return successMessage;
};

const ProductViewPage = () => {
  const { id } = useParams<'id'>();
  const location = useLocation();

  const [product, setProduct] = useState<IProduitDemande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const successMessage = useSuccessMessage(location);

  useEffect(() => {
    if (!id) {
      setError(translate('crmApp.produitDemande.home.notFound'));
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<IProduitDemande>(`api/produit-demandes/${id}`);
        setProduct(response.data ?? null);
        if (!response.data) {
          setError(translate('crmApp.produitDemande.home.notFound'));
        }
      } catch (err) {
        setError(translate('crmApp.produitDemande.home.notFound'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const typeLabel = product?.typeProduit ? translate(`crmApp.TypeProduit.${product.typeProduit}`) : null;

  return (
    <div className="product-create-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-1">
            <Translate contentKey="crmApp.produitDemande.detail.title" />
          </h2>
          <p className="text-muted mb-0">
            <Translate contentKey="crmApp.produitDemande.home.title" />
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button color="secondary" outline tag={Link} to="/dashboard/products">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            <Translate contentKey="entity.action.back" />
          </Button>
          {product?.id ? (
            <Button color="primary" tag={Link} to={`/dashboard/products/${product.id}/edit`}>
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              <Translate contentKey="entity.action.edit" />
            </Button>
          ) : null}
        </div>
      </div>

      {successMessage ? (
        <Alert color="success" className="mb-4">
          {successMessage}
        </Alert>
      ) : null}

      {error ? (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Card className="shadow-sm border-0">
          <CardBody className="text-center py-5">
            <Spinner color="primary" />
          </CardBody>
        </Card>
      ) : product ? (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <CardBody>
              <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center">
                <div className="flex-grow-1">
                  <h3 className="mb-1">{renderValue(product.nomProduit)}</h3>
                  <div className="text-muted mb-2">{renderValue(product.description)}</div>
                  {typeLabel ? <span className="badge rounded-pill bg-light text-primary border border-primary">{typeLabel}</span> : null}
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {product.quantite !== undefined && product.quantite !== null ? (
                    <span className="badge bg-light text-dark border fw-normal">
                      <span className="text-muted me-1">
                        <Translate contentKey="crmApp.produitDemande.quantite" />:
                      </span>
                      <span className="fw-semibold">
                        {formatNumber(product.quantite)}
                        {product.unite ? ` ${product.unite}` : ''}
                      </span>
                    </span>
                  ) : null}
                  {product.prix !== undefined && product.prix !== null ? (
                    <span className="badge bg-light text-dark border fw-normal">
                      <span className="text-muted me-1">
                        <Translate contentKey="crmApp.produitDemande.prix" />:
                      </span>
                      <span className="fw-semibold">{formatNumber(product.prix)}</span>
                    </span>
                  ) : null}
                  {product.prixCible !== undefined && product.prixCible !== null ? (
                    <span className="badge bg-light text-dark border fw-normal">
                      <span className="text-muted me-1">
                        <Translate contentKey="crmApp.produitDemande.prixCible" />:
                      </span>
                      <span className="fw-semibold">{formatNumber(product.prixCible)}</span>
                    </span>
                  ) : null}
                  {product.fraisExpedition !== undefined && product.fraisExpedition !== null ? (
                    <span className="badge bg-light text-dark border fw-normal">
                      <span className="text-muted me-1">
                        <Translate contentKey="crmApp.produitDemande.fraisExpedition" />:
                      </span>
                      <span className="fw-semibold">{formatNumber(product.fraisExpedition)}</span>
                    </span>
                  ) : null}
                </div>
              </div>
            </CardBody>
          </Card>

          <Row className="g-4">
            <Col lg="8">
              <Card className="shadow-sm border-0 mb-4">
                <CardHeader className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <Translate contentKey="crmApp.produitDemande.dashboard.sections.details" />
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row className="gy-4">
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.quantite" />
                        </span>
                        <span className="fw-semibold">
                          {product.quantite !== undefined && product.quantite !== null ? (
                            <>
                              {formatNumber(product.quantite)}
                              {product.unite ? ` ${product.unite}` : ''}
                            </>
                          ) : (
                            renderValue('--')
                          )}
                        </span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.poidsKg" />
                        </span>
                        <span className="fw-semibold">{renderValue(formatNumber(product.poidsKg))}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.volumeTotalCbm" />
                        </span>
                        <span className="fw-semibold">{renderValue(formatNumber(product.volumeTotalCbm))}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.dimensions" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.dimensions)}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.hsCode" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.hsCode)}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.origine" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.origine)}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.fournisseur" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.fournisseur)}</span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card className="shadow-sm border-0">
                <CardHeader className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <Translate contentKey="crmApp.produitDemande.dashboard.sections.logistics" />
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row className="gy-4">
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.adresseChargement" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.adresseChargement)}</span>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="d-flex flex-column">
                        <span className="text-uppercase text-muted small">
                          <Translate contentKey="crmApp.produitDemande.adresseDechargement" />
                        </span>
                        <span className="fw-semibold">{renderValue(product.adresseDechargement)}</span>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card className="shadow-sm border-0">
                <CardHeader className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <Translate contentKey="crmApp.produitDemande.dashboard.sections.attachments" />
                  </h5>
                </CardHeader>
                <ListGroup flush>
                  <ListGroupItem className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted small">
                        <Translate contentKey="crmApp.produitDemande.ficheTechniqueUrl" />
                      </div>
                      <div className="fw-semibold text-break">{renderValue(product.ficheTechniqueUrl)}</div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted small">
                        <Translate contentKey="crmApp.produitDemande.photosUrl" />
                      </div>
                      <div className="fw-semibold text-break">{renderValue(product.photosUrl)}</div>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-uppercase text-muted small">
                        <Translate contentKey="crmApp.produitDemande.piecesJointesUrl" />
                      </div>
                      <div className="fw-semibold text-break">{renderValue(product.piecesJointesUrl)}</div>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Card className="shadow-sm border-0">
          <CardBody className="text-muted">
            <Translate contentKey="crmApp.produitDemande.home.notFound" />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ProductViewPage;
