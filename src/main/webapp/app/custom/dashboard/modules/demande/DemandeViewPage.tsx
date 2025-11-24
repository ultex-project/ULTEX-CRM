import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';
import ClientAvatar from 'app/custom/dashboard/modules/client/components/ClientAvatar';

const outlineBadgeClass = (tone: 'primary' | 'success' | 'secondary') =>
  `badge rounded-pill fw-semibold px-3 py-1 bg-white border border-${tone} text-${tone}`;

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const formatDate = (value?: dayjs.Dayjs | string | null, format = 'DD MMM YYYY') => (value ? dayjs(value).format(format) : '--');

const renderServicePrincipalBadge = (servicePrincipal?: IDemandeClient['servicePrincipal']) => {
  if (!servicePrincipal) {
    return <span className={outlineBadgeClass('secondary')}>{renderValue('--')}</span>;
  }
  const tone = servicePrincipal === ServicePrincipal.IMPORT ? 'primary' : 'success';
  return <span className={outlineBadgeClass(tone)}>{translate(`crmApp.ServicePrincipal.${servicePrincipal}`)}</span>;
};

const renderSousServiceChips = (sousServices?: IDemandeClient['sousServices']) => {
  if (!sousServices || sousServices.length === 0) {
    return null;
  }
  return sousServices
    .filter(item => item.id !== undefined && item.id !== null)
    .map(item => (
      <span key={item.id} className="badge rounded-pill bg-light text-primary border border-primary">
        {item.libelle ?? item.code ?? item.id}
      </span>
    ));
};

const formatDeviseDisplay = (devise?: IDemandeClient['devise']) => {
  if (!devise) {
    return null;
  }
  const code = devise.code ?? '';
  const symbol = devise.symbole ?? '';
  const fullName = devise.nomComplet ?? '';
  if (code && symbol) {
    return `${code} (${symbol})`;
  }
  if (code) {
    return code;
  }
  return fullName || null;
};

const formatIncotermDisplay = (incoterm?: IDemandeClient['incoterm']) => {
  if (!incoterm) {
    return null;
  }
  const code = incoterm.code ?? '';
  const description = incoterm.description ?? '';
  if (code && description) {
    return `${code} • ${description}`;
  }
  return code || description || null;
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

const DemandeViewPage = () => {
  const { id } = useParams<'id'>();
  const location = useLocation();
  const demandeId = id ? Number(id) : null;

  const [demande, setDemande] = useState<IDemandeClient | null>(null);
  const [products, setProducts] = useState<IProduitDemande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const successMessage = useSuccessMessage(location);

  useEffect(() => {
    if (!demandeId) {
      setError(translate('crmApp.demandeClient.home.notFound'));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [demandeResponse, productsResponse] = await Promise.all([
          axios.get<IDemandeClient>(`api/demande-clients/${demandeId}`),
          axios.get<IProduitDemande[]>('api/produit-demandes', {
            params: { 'demandeId.equals': demandeId, size: 1000, cacheBuster: Date.now() },
          }),
        ]);

        const demandeValue = demandeResponse.data ?? null;
        setDemande(demandeValue);
        setProducts(productsResponse.data ?? []);

        if (!demandeValue) {
          setError(translate('crmApp.demandeClient.home.notFound'));
        }
      } catch (err) {
        setError(translate('crmApp.demandeClient.home.notFound'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [demandeId]);

  const sousServiceChips = renderSousServiceChips(demande?.sousServices);
  const typeDemandeLabel = demande?.typeDemande ? translate(`crmApp.TypeDemande.${demande.typeDemande as TypeDemande}`) : null;

  return (
    <div className="client-view-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Button color="link" tag={Link} to="/dashboard/demandes" className="px-0 text-decoration-none">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          <Translate contentKey="entity.action.back" />
        </Button>
        {demande?.id ? (
          <Button color="primary" tag={Link} to={`/dashboard/demandes/${demande.id}/edit`} className="shadow-sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            <Translate contentKey="entity.action.edit" />
          </Button>
        ) : null}
      </div>

      {successMessage ? (
        <Alert color="success" className="border-0 shadow-sm mb-4">
          {successMessage}
        </Alert>
      ) : null}

      {error ? (
        <Alert color="danger" className="border-0 shadow-sm mb-4">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Card className="shadow-sm border-0">
          <CardBody className="text-center py-5">
            <Spinner color="primary" />
          </CardBody>
        </Card>
      ) : demande ? (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <CardBody>
              <div className="d-flex flex-column flex-lg-row gap-4 align-items-lg-center">
                <div className="d-flex align-items-center gap-3">
                  <ClientAvatar name={demande.client?.nomComplet} photoUrl={demande.client?.photoUrl ?? undefined} />
                  <div>
                    <h2 className="mb-1">{renderValue(demande.reference)}</h2>
                    <div className="text-muted small">
                      {formatDate(demande.dateDemande, 'DD MMM YYYY HH:mm')} · {renderValue(demande.provenance)}
                    </div>
                    {demande.client?.id ? (
                      <Link to={`/dashboard/clients/${demande.client.id}`} className="text-muted small text-decoration-none">
                        {renderValue(demande.client.nomComplet)}
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div className="ms-lg-auto d-flex flex-column align-items-lg-end gap-2">
                  {renderServicePrincipalBadge(demande.servicePrincipal)}
                  {typeDemandeLabel ? <span className="text-muted small">{typeDemandeLabel}</span> : null}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.demandeClient.detail.title" />
              </h5>
            </CardHeader>
            <CardBody>
              <Row className="gy-4">
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.reference" />
                    </span>
                    <span className="fw-semibold">{renderValue(demande.reference)}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.dateDemande" />
                    </span>
                    <span className="fw-semibold">{renderValue(formatDate(demande.dateDemande))}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column gap-1">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.servicePrincipal" />
                    </span>
                    {renderServicePrincipalBadge(demande.servicePrincipal)}
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.typeDemande" />
                    </span>
                    <span className="fw-semibold">{renderValue(typeDemandeLabel)}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.provenance" />
                    </span>
                    <span className="fw-semibold">{renderValue(demande.provenance)}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.incoterm" />
                    </span>
                    <span className="fw-semibold">{renderValue(formatIncotermDisplay(demande.incoterm))}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.devise" />
                    </span>
                    <span className="fw-semibold">{renderValue(formatDeviseDisplay(demande.devise))}</span>
                  </div>
                </Col>
                <Col md="4">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.client" />
                    </span>
                    {demande.client?.id ? (
                      <Link to={`/dashboard/clients/${demande.client.id}`} className="fw-semibold text-decoration-none">
                        {renderValue(demande.client.nomComplet)}
                      </Link>
                    ) : (
                      <span className="fw-semibold">{renderValue(demande.client?.nomComplet)}</span>
                    )}
                    <span className="text-muted small">{renderValue(demande.client?.email)}</span>
                  </div>
                </Col>
                <Col md="12">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.sousServices" />
                    </span>
                    {sousServiceChips ? (
                      <div className="d-flex flex-wrap gap-2">{sousServiceChips}</div>
                    ) : (
                      <span className="text-muted">--</span>
                    )}
                  </div>
                </Col>
                <Col md="12">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.remarqueGenerale" />
                    </span>
                    <span>{renderValue(demande.remarqueGenerale)}</span>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.demandeClient.dashboard.products.title" />
              </h5>
            </CardHeader>
            <CardBody>
              {products.length === 0 ? (
                <div className="text-muted">
                  <Translate contentKey="crmApp.demandeClient.dashboard.products.empty" />
                </div>
              ) : (
                <ListGroup flush>
                  {products.map(product => (
                    <ListGroupItem key={product.id ?? product.nomProduit} className="border-0 px-0 py-3">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                        <div>
                          <div className="fw-semibold">{renderValue(product.nomProduit)}</div>
                          {product.description ? <div className="text-muted small mt-1">{product.description}</div> : null}
                        </div>
                        <div className="text-muted small text-md-end">
                          <div>
                            {renderValue(product.quantite)} {renderValue(product.unite)}
                          </div>
                          <div>{product.typeProduit ? translate(`crmApp.TypeProduit.${product.typeProduit}`) : '--'}</div>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default DemandeViewPage;
