import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuilding, faEdit, faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import Select, { MultiValue } from 'react-select';

import { IClient } from 'app/shared/model/client.model';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
import { IKycClient } from 'app/shared/model/kyc-client.model';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { IOpportunity } from 'app/shared/model/opportunity.model';
import { OpportunityStage } from 'app/shared/model/enumerations/opportunity-stage.model';
import { IHistoriqueCRM } from 'app/shared/model/historique-crm.model';
import ClientAvatar from 'app/custom/dashboard/modules/client/components/ClientAvatar';
import ClientDocumentsPanel from 'app/custom/dashboard/modules/client/components/ClientDocumentsPanel';
import ClientContactsPanel from 'app/custom/dashboard/modules/client/components/ClientContactsPanel';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';

const outlineBadgeClass = (tone: 'success' | 'secondary' | 'danger' | 'info' | 'warning' | 'primary') =>
  `badge rounded-pill fw-semibold px-3 py-1 bg-white border border-${tone} text-${tone}`;

const isClientStatus = (value: unknown): value is ClientStatus =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(ClientStatus, value);

const formatDate = (value?: dayjs.Dayjs | string | null, format = 'DD MMM YYYY') => (value ? dayjs(value).format(format) : '--');

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const renderServicePrincipalBadge = (servicePrincipal?: IDemandeClient['servicePrincipal']) => {
  if (!servicePrincipal) {
    return null;
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

const renderClientStatusBadge = (status?: string | null) => {
  if (!status || !isClientStatus(status)) {
    return <span className={outlineBadgeClass('secondary')}>{translate('crmApp.client.dashboard.status.unassigned')}</span>;
  }

  const palette: Record<ClientStatus, { tone: 'success' | 'secondary' | 'danger'; label: string }> = {
    ACTIVE: { tone: 'success', label: translate('crmApp.client.dashboard.status.active') },
    INACTIVE: { tone: 'secondary', label: translate('crmApp.client.dashboard.status.inactive') },
    ARCHIVED: { tone: 'danger', label: translate('crmApp.client.dashboard.status.archived') },
  } as const;

  const meta = palette[status] ?? { tone: 'secondary', label: status };
  return <span className={outlineBadgeClass(meta.tone)}>{meta.label}</span>;
};

const renderOpportunityStageBadge = (stage?: OpportunityStage | string | null) => {
  if (!stage) {
    return <span className={outlineBadgeClass('secondary')}>{renderValue('--')}</span>;
  }

  // Explicitly ensure stage is something that can be stringified
  const normalized = typeof stage === 'string' ? stage : (stage as unknown as { toString: () => string }).toString();

  const palette: Record<string, { tone: 'primary' | 'info' | 'success' | 'danger' | 'warning'; label: string }> = {
    LEAD: { tone: 'primary', label: translate('crmApp.OpportunityStage.LEAD') },
    NEGOTIATION: { tone: 'warning', label: translate('crmApp.OpportunityStage.NEGOTIATION') },
    WON: { tone: 'success', label: translate('crmApp.OpportunityStage.WON') },
    LOST: { tone: 'danger', label: translate('crmApp.OpportunityStage.LOST') },
  };

  const meta = palette[normalized] ?? { tone: 'info', label: normalized };
  return <span className={outlineBadgeClass(meta.tone)}>{meta.label}</span>;
};

const createCollectionFetcher = <T,>(endpoint: string) =>
  axios
    .get<T[]>(endpoint, {
      params: {
        size: 1000,
        cacheBuster: Date.now(),
      },
    })
    .then(response => response.data ?? [])
    .catch(() => []);

type ClientDashboardData = {
  client: IClient | null;
  contacts: IContactAssocie[];
  kyc: IKycClient | null;
  requests: IDemandeClient[];
  requestProducts: IProduitDemande[];
  opportunities: IOpportunity[];
  history: IHistoriqueCRM[];
  societesLiees: ISocieteLiee[];
};

const createEmptyClientData = (): ClientDashboardData => ({
  client: null,
  contacts: [],
  kyc: null,
  requests: [],
  requestProducts: [],
  opportunities: [],
  history: [],
  societesLiees: [],
});

const useClientDashboardData = (clientId: number | null) => {
  const [data, setData] = useState<ClientDashboardData>(() => createEmptyClientData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (!clientId) {
      setData(createEmptyClientData());
      setError(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [clientResponse, contactsData, kycData, demandesData, produitsData, opportunitiesData, historyData, societesData] =
          await Promise.all([
            axios.get<IClient>(`api/clients/${clientId}`),
            createCollectionFetcher<IContactAssocie>('api/contact-associes'),
            createCollectionFetcher<IKycClient>('api/kyc-clients'),
            createCollectionFetcher<IDemandeClient>('api/demande-clients'),
            createCollectionFetcher<IProduitDemande>('api/produit-demandes'),
            createCollectionFetcher<IOpportunity>('api/opportunities'),
            createCollectionFetcher<IHistoriqueCRM>('api/historique-crms'),
            createCollectionFetcher<ISocieteLiee>('api/societe-liees'),
          ]);

        if (!mounted) {
          return;
        }

        const clientValue = clientResponse.data ?? null;
        const contactsForClient = contactsData.filter(item => item.client?.id === clientId);
        const kycForClient = kycData.find(item => item.client?.id === clientId) ?? null;
        const requestsForClient = demandesData.filter(item => item.client?.id === clientId);
        const requestIds = new Set(
          requestsForClient.map(request => request.id).filter((value): value is number => value !== undefined && value !== null),
        );
        const requestProductsForClient = produitsData.filter(item => {
          const demandeId = item.demande?.id;
          return demandeId !== undefined && demandeId !== null && requestIds.has(demandeId);
        });
        const opportunitiesForClient = opportunitiesData.filter(item => item.client?.id === clientId);
        const historyForClient = historyData.filter(item => item.client?.id === clientId);
        const societesForClient = societesData.filter(item => item.client?.id === clientId);

        setData({
          client: clientValue,
          contacts: contactsForClient,
          kyc: kycForClient,
          requests: requestsForClient,
          requestProducts: requestProductsForClient,
          opportunities: opportunitiesForClient,
          history: historyForClient,
          societesLiees: societesForClient,
        });
      } catch (requestError) {
        if (mounted) {
          setError(translate('crmApp.client.view.error'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [clientId, refreshIndex]);

  const refresh = () => setRefreshIndex(prev => prev + 1);

  return { ...data, loading, error, refresh };
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

const buildProductsByRequest = (products: IProduitDemande[]) => {
  const map = new Map<number, IProduitDemande[]>();
  products.forEach(product => {
    const requestId = product.demande?.id;
    if (requestId === undefined || requestId === null) {
      return;
    }
    const existing = map.get(requestId);
    if (existing) {
      existing.push(product);
    } else {
      map.set(requestId, [product]);
    }
  });
  return map;
};

const ClientHeaderCard: React.FC<{ client: IClient | null }> = ({ client }) => {
  const headerDates = useMemo(() => {
    if (!client) {
      return null;
    }
    return (
      <div className="d-flex flex-wrap gap-3 text-muted small">
        <span>
          <Translate
            contentKey="crmApp.client.view.header.created"
            interpolate={{ date: formatDate(client.createdAt, 'DD MMM YYYY HH:mm') }}
          />
        </span>
        <span>
          <Translate
            contentKey="crmApp.client.view.header.updated"
            interpolate={{ date: formatDate(client.updatedAt, 'DD MMM YYYY HH:mm') }}
          />
        </span>
      </div>
    );
  }, [client]);

  return (
    <Card className="shadow-sm border-0 mb-4">
      <CardBody>
        <div className="d-flex flex-column flex-lg-row gap-4 align-items-lg-center">
          <div className="d-flex align-items-center gap-3">
            <ClientAvatar name={client?.nomComplet} photoUrl={client?.photoUrl} />
            <div>
              <h2 className="mb-1">{client?.nomComplet ?? '--'}</h2>
              <div className="d-flex flex-wrap gap-2 align-items-center text-muted">
                {client?.fonction ? <span>{client.fonction}</span> : null}
                {client?.nationalite ? <span>• {client.nationalite}</span> : null}
                {client?.pays?.nom ? (
                  <span>
                    • {client.pays.nom}
                    {client.pays.code ? ` (${client.pays.code})` : ''}
                  </span>
                ) : null}
              </div>
              {headerDates}
            </div>
          </div>
          <div className="ms-lg-auto">{renderClientStatusBadge(client?.status ?? null)}</div>
        </div>
      </CardBody>
    </Card>
  );
};

const GeneralInfoCard: React.FC<{ client: IClient | null }> = ({ client }) => (
  <Card className="shadow-sm border-0 mb-4">
    <CardHeader className="bg-white border-bottom">
      <h5 className="mb-0">
        <Translate contentKey="crmApp.client.view.sections.general" />
      </h5>
    </CardHeader>
    <CardBody>
      <Row className="gy-4">
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.telephonePrincipal" />
            </span>
            <span className="fw-semibold">{renderValue(client?.telephonePrincipal)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.code" />
            </span>
            <span className="fw-semibold">{renderValue(client?.code)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">WhatsApp</span>
            <span className="fw-semibold">{renderValue(client?.whatsapp)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.email" />
            </span>
            <span className="fw-semibold">{renderValue(client?.email)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.languePreferee" />
            </span>
            <span className="fw-semibold">{renderValue(client?.languePreferee)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.pays" />
            </span>
            <span className="fw-semibold">{renderValue(client?.pays?.nom)}</span>
            {client?.pays?.code || client?.pays?.indicatif ? (
              <span className="text-muted small">{[client?.pays?.code, client?.pays?.indicatif].filter(Boolean).join(' • ')}</span>
            ) : null}
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.adressePersonnelle" />
            </span>
            <span className="fw-semibold">{renderValue(client?.adressePersonnelle)}</span>
          </div>
        </Col>
        <Col md="4">
          <div className="d-flex flex-column">
            <span className="text-uppercase text-muted small">
              <Translate contentKey="crmApp.client.company" />
            </span>
            <span className="fw-semibold">{renderValue(client?.company?.name)}</span>
            {client?.company?.country ? <span className="text-muted small">{client.company.country}</span> : null}
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

const KycCard: React.FC<{ kyc: IKycClient | null }> = ({ kyc }) => (
  <Card className="shadow-sm border-0 mb-4">
    <CardHeader className="bg-white border-bottom">
      <h5 className="mb-0">
        <Translate contentKey="crmApp.client.view.sections.kyc" />
      </h5>
    </CardHeader>
    <CardBody>
      {kyc ? (
        <Row className="gy-3">
          <Col md="6">
            <div className="d-flex flex-column">
              <span className="text-uppercase text-muted small">
                <Translate contentKey="crmApp.client.view.kyc.completude" />
              </span>
              <div className="d-flex align-items-center gap-3">
                <div className="flex-grow-1">
                  <Progress value={kyc.completudeKyc ?? 0} color="success" />
                </div>
                <span className="fw-semibold">{kyc.completudeKyc ?? 0}%</span>
              </div>
            </div>
          </Col>
          <Col md="6">
            <div className="d-flex flex-column">
              <span className="text-uppercase text-muted small">
                <Translate contentKey="crmApp.client.view.kyc.score" />
              </span>
              <span className="fw-semibold">{renderValue(kyc.scoreStaff)}</span>
            </div>
          </Col>
          <Col md="6">
            <div className="d-flex flex-column">
              <span className="text-uppercase text-muted small">
                <Translate contentKey="crmApp.client.view.kyc.behaviors" />
              </span>
              <span className="fw-semibold">{renderValue(kyc.comportements)}</span>
            </div>
          </Col>
          <Col md="6">
            <div className="d-flex flex-column">
              <span className="text-uppercase text-muted small">
                <Translate contentKey="crmApp.client.view.kyc.responsable" />
              </span>
              <span className="fw-semibold">{renderValue(kyc.responsable)}</span>
            </div>
          </Col>
          <Col md="12">
            <div className="d-flex flex-column">
              <span className="text-uppercase text-muted small">
                <Translate contentKey="crmApp.client.view.kyc.notes" />
              </span>
              <span>{renderValue(kyc.remarques)}</span>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="text-muted">
          <Translate contentKey="crmApp.client.view.empty" />
        </div>
      )}
    </CardBody>
  </Card>
);

type RequestsCardProps = {
  clientId: number | null;
  requests: IDemandeClient[];
  produitsParDemande: Map<number, IProduitDemande[]>;
};

const RequestsCard: React.FC<RequestsCardProps> = ({ clientId, requests, produitsParDemande }) => {
  const [items, setItems] = useState<IDemandeClient[]>(requests);
  const [productMap, setProductMap] = useState<Map<number, IProduitDemande[]>>(produitsParDemande);
  const [viewTarget, setViewTarget] = useState<IDemandeClient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDemandeClient | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setItems(requests);
  }, [requests]);

  useEffect(() => {
    setProductMap(produitsParDemande);
  }, [produitsParDemande]);

  const resolveProducts = (demandeId?: number | null) => {
    if (!demandeId) {
      return [] as IProduitDemande[];
    }
    return productMap.get(demandeId) ?? [];
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`/api/demande-clients/${deleteTarget.id}`);
      setItems(prev => prev.filter(item => item.id !== deleteTarget.id));
      setProductMap(prev => {
        const next = new Map(prev);
        next.delete(deleteTarget.id);
        return next;
      });
      toast.success(translate('crmApp.demandeClient.dashboard.messages.deleteSuccess'));
    } catch (error) {
      toast.error(translate('crmApp.demandeClient.dashboard.messages.deleteError'));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const renderProductsList = (demandeId?: number | null) => {
    const produits = resolveProducts(demandeId);
    if (produits.length === 0) {
      return null;
    }
    return (
      <ListGroup flush className="mt-3">
        {produits.map(produit => (
          <ListGroupItem key={produit.id ?? produit.nomProduit} className="px-0 border-0">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
              <div className="fw-semibold">{renderValue(produit.nomProduit)}</div>
              <div className="text-muted small">
                {renderValue(produit.quantite)} {renderValue(produit.unite)} · {renderValue(produit.typeProduit)}
              </div>
            </div>
            {produit.description ? <div className="text-muted small mt-1">{produit.description}</div> : null}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  };

  const renderSousServiceList = (sousServices?: IDemandeClient['sousServices']) => {
    const chips = renderSousServiceChips(sousServices);
    if (!chips) {
      return <span className="text-muted">--</span>;
    }
    return <div className="d-flex flex-wrap gap-2">{chips}</div>;
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center gap-2">
        <h5 className="mb-0">
          <Translate contentKey="crmApp.client.view.sections.requests" />
        </h5>
        {clientId ? (
          <Button color="primary" size="sm" tag={Link} to={`/dashboard/clients/${clientId}/demands/new`} className="shadow-sm">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            <Translate contentKey="crmApp.admin.dashboard.createDemandeClient" />
          </Button>
        ) : null}
      </CardHeader>
      <CardBody>
        {items.length === 0 ? (
          <div className="text-muted">
            <Translate contentKey="crmApp.client.view.empty" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {items.map(request => {
              const servicePrincipalBadge = renderServicePrincipalBadge(request.servicePrincipal);
              return (
                <Card key={request.id ?? request.reference} className="border-0 shadow-sm">
                  <CardBody>
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <h6 className="mb-1">{renderValue(request.reference)}</h6>
                        <div className="text-muted small">
                          {formatDate(request.dateDemande)} · {renderValue(request.provenance)}
                        </div>
                        {(servicePrincipalBadge || request.sousServices?.length) && (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {servicePrincipalBadge}
                            {renderSousServiceChips(request.sousServices)}
                          </div>
                        )}
                      </div>
                      <div className="text-md-end text-muted small">
                        <div>{renderValue(formatDeviseDisplay(request.devise))}</div>
                        <div>{renderValue(formatIncotermDisplay(request.incoterm))}</div>
                      </div>
                    </div>

                    {renderProductsList(request.id)}

                    <div className="d-flex flex-wrap gap-2 justify-content-md-end mt-3">
                      <Button color="light" size="sm" onClick={() => setViewTarget(request)}>
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        <Translate contentKey="crmApp.demandeClient.dashboard.actions.view" />
                      </Button>
                      {clientId && request.id ? (
                        <Button
                          color="light"
                          size="sm"
                          tag={Link}
                          to={`/dashboard/clients/${clientId}/demands/new?demandeId=${request.id}`}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          <Translate contentKey="entity.action.edit" />
                        </Button>
                      ) : null}
                      {request.id ? (
                        <Button color="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(request)}>
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          <Translate contentKey="entity.action.delete" />
                        </Button>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </CardBody>

      <Modal isOpen={Boolean(viewTarget)} toggle={() => setViewTarget(null)} centered size="lg">
        <ModalHeader toggle={() => setViewTarget(null)}>
          <Translate contentKey="crmApp.demandeClient.dashboard.viewTitle" />
        </ModalHeader>
        <ModalBody>
          {viewTarget ? (
            <>
              <Row className="gy-3">
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.reference" />
                    </span>
                    <span className="fw-semibold">{renderValue(viewTarget.reference)}</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.dateDemande" />
                    </span>
                    <span className="fw-semibold">{formatDate(viewTarget.dateDemande)}</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column gap-1">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.servicePrincipal" />
                    </span>
                    {renderServicePrincipalBadge(viewTarget.servicePrincipal) ?? <span className="text-muted">--</span>}
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.typeDemande" />
                    </span>
                    <span className="fw-semibold">
                      {viewTarget.typeDemande ? translate(`crmApp.TypeDemande.${viewTarget.typeDemande}`) : '--'}
                    </span>
                  </div>
                </Col>
                <Col md="12">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.sousServices" />
                    </span>
                    {renderSousServiceList(viewTarget.sousServices)}
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.provenance" />
                    </span>
                    <span className="fw-semibold">{renderValue(viewTarget.provenance)}</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.incoterm" />
                    </span>
                    <span className="fw-semibold">{renderValue(formatIncotermDisplay(viewTarget.incoterm))}</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.devise" />
                    </span>
                    <span className="fw-semibold">{renderValue(formatDeviseDisplay(viewTarget.devise))}</span>
                  </div>
                </Col>
                <Col md="12">
                  <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small">
                      <Translate contentKey="crmApp.demandeClient.remarqueGenerale" />
                    </span>
                    <span>{renderValue(viewTarget.remarqueGenerale)}</span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <h6 className="mb-3">
                <Translate contentKey="crmApp.demandeClient.dashboard.products.title" />
              </h6>
              {resolveProducts(viewTarget.id).length === 0 ? (
                <p className="text-muted small mb-0">
                  <Translate contentKey="crmApp.demandeClient.dashboard.products.empty" />
                </p>
              ) : (
                <ListGroup flush>
                  {resolveProducts(viewTarget.id).map(produit => (
                    <ListGroupItem key={produit.id ?? produit.nomProduit} className="border-0 px-0">
                      <div className="fw-semibold">{renderValue(produit.nomProduit)}</div>
                      <div className="text-muted small">
                        {renderValue(produit.quantite)} {renderValue(produit.unite)} · {renderValue(produit.typeProduit)}
                      </div>
                      {produit.description ? <div className="text-muted small mt-1">{produit.description}</div> : null}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewTarget(null)}>
            <Translate contentKey="entity.action.close" />
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={Boolean(deleteTarget)} toggle={() => (deleting ? undefined : setDeleteTarget(null))} centered>
        <ModalHeader toggle={() => (deleting ? undefined : setDeleteTarget(null))}>
          <Translate contentKey="entity.delete.title" />
        </ModalHeader>
        <ModalBody>
          <Translate
            contentKey="crmApp.demandeClient.dashboard.deleteQuestion"
            interpolate={{ reference: deleteTarget?.reference ?? `#${deleteTarget?.id ?? ''}` }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faTrash} className="me-2" />}
            <Translate contentKey="entity.action.delete" />
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

const OpportunitiesCard: React.FC<{ opportunities: IOpportunity[] }> = ({ opportunities }) => (
  <Card className="shadow-sm border-0 mb-4">
    <CardHeader className="bg-white border-bottom">
      <h5 className="mb-0">
        <Translate contentKey="crmApp.client.view.sections.opportunities" />
      </h5>
    </CardHeader>
    <CardBody>
      {opportunities.length === 0 ? (
        <div className="text-muted">
          <Translate contentKey="crmApp.client.view.empty" />
        </div>
      ) : (
        <ListGroup flush>
          {opportunities.map(opportunity => (
            <ListGroupItem key={opportunity.id} className="py-3">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                <div>
                  <h6 className="mb-1">{renderValue(opportunity.title)}</h6>
                  <div className="text-muted small">
                    {renderValue(opportunity.assignedTo?.fullName)} · {formatDate(opportunity.closeDate)}
                  </div>
                </div>
                <div className="text-md-end">
                  <div className="fw-semibold">
                    {renderValue(
                      opportunity.amount !== undefined && opportunity.amount !== null ? opportunity.amount.toLocaleString() : null,
                    )}
                  </div>
                  <div>{renderOpportunityStageBadge(opportunity.stage)}</div>
                </div>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </CardBody>
  </Card>
);

const HistoryCard: React.FC<{ history: IHistoriqueCRM[] }> = ({ history }) => (
  <Card className="shadow-sm border-0">
    <CardHeader className="bg-white border-bottom">
      <h5 className="mb-0">
        <Translate contentKey="crmApp.client.view.sections.history" />
      </h5>
    </CardHeader>
    <CardBody className="p-0">
      {history.length === 0 ? (
        <div className="text-muted p-4">
          <Translate contentKey="crmApp.client.view.empty" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="text-muted small">
              <tr>
                <th className="ps-4">
                  <Translate contentKey="crmApp.historiqueCRM.dateInteraction" />
                </th>
                <th>
                  <Translate contentKey="crmApp.historiqueCRM.canal" />
                </th>
                <th>
                  <Translate contentKey="crmApp.historiqueCRM.resume" />
                </th>
                <th className="pe-4 text-end">
                  <Translate contentKey="crmApp.historiqueCRM.etat" />
                </th>
              </tr>
            </thead>
            <tbody>
              {history
                .slice()
                .sort((a, b) => dayjs(b.dateInteraction).valueOf() - dayjs(a.dateInteraction).valueOf())
                .map(item => (
                  <tr key={item.id}>
                    <td className="ps-4">{formatDate(item.dateInteraction, 'DD MMM YYYY HH:mm')}</td>
                    <td>{renderValue(item.canal)}</td>
                    <td>{renderValue(item.resume)}</td>
                    <td className="pe-4 text-end">{renderValue(item.etat)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </CardBody>
  </Card>
);

type SocietesLieesCardProps = {
  societes: ISocieteLiee[];
  loading: boolean;
  clientId: number | null;
  onLinkExisting: () => void;
};

const SocietesLieesCard: React.FC<SocietesLieesCardProps> = ({ societes, loading, clientId, onLinkExisting }) => {
  const hasItems = societes.length > 0;
  const createHref = clientId ? `/dashboard/societe-liee/new?clientId=${clientId}` : '/dashboard/societe-liee/new';

  return (
    <Card className="shadow-sm border-0 mb-4">
      <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <Translate contentKey="crmApp.societeLiee.dashboard.title" />
          </h5>
          <small className="text-muted">
            <Translate contentKey="crmApp.societeLiee.dashboard.subtitle" />
          </small>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button color="secondary" size="sm" outline onClick={onLinkExisting} disabled={!clientId}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Lier une société existante
          </Button>
          <Button color="primary" size="sm" tag={Link} to={createHref} className="shadow-sm">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            <Translate contentKey="crmApp.societeLiee.dashboard.add" />
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : !hasItems ? (
          <div className="text-center text-muted py-4">
            <FontAwesomeIcon icon={faBuilding} size="2x" className="mb-3 text-secondary" />
            <p className="mb-3">
              <Translate contentKey="crmApp.societeLiee.dashboard.empty" />
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="text-muted small">
                <tr>
                  <th className="ps-4">
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.raisonSociale" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.formeJuridique" />
                  </th>
                  <th>ICE</th>
                  <th>RC</th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.secteurActivite" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {societes.map(item => (
                  <tr key={item.id ?? item.raisonSociale} className="align-middle">
                    <td className="ps-4">
                      {item.id ? (
                        <Link to={`/dashboard/societe-liee/${item.id}/view`} className="fw-semibold text-decoration-none">
                          {renderValue(item.raisonSociale)}
                        </Link>
                      ) : (
                        <span className="fw-semibold">{renderValue(item.raisonSociale)}</span>
                      )}
                    </td>
                    <td>{renderValue(item.formeJuridique)}</td>
                    <td>{renderValue(item.ice)}</td>
                    <td>{renderValue(item.rc)}</td>
                    <td>{renderValue(item.secteurActivite)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const ClientViewPage = () => {
  const { id } = useParams<'id'>();
  const location = useLocation();
  const clientId = id ? Number(id) : null;

  const { client, contacts, kyc, requests, requestProducts, opportunities, history, societesLiees, loading, error, refresh } =
    useClientDashboardData(clientId);

  const successMessage = useSuccessMessage(location);

  const produitsParDemande = useMemo(() => buildProductsByRequest(requestProducts), [requestProducts]);

  type SocieteOption = { value: number; label: string; data: ISocieteLiee };

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkOptions, setLinkOptions] = useState<SocieteOption[]>([]);
  const [linkSelection, setLinkSelection] = useState<SocieteOption[]>([]);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkSaving, setLinkSaving] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const mapToOption = (societe: ISocieteLiee): SocieteOption | null => {
    if (!societe.id) {
      return null;
    }
    const parts = [societe.raisonSociale ?? translate('crmApp.societeLiee.dashboard.table.unnamed')];
    if (societe.ice) parts.push(`ICE ${societe.ice}`);
    if (societe.rc) parts.push(`RC ${societe.rc}`);
    if (societe.secteurActivite) parts.push(societe.secteurActivite);
    return {
      value: societe.id,
      label: parts.join(' • '),
      data: societe,
    };
  };

  const hydrateSelection = (options: SocieteOption[]) => {
    const ids = new Set(societesLiees.map(item => item.id).filter((v): v is number => v !== undefined && v !== null));
    const selected = options.filter(option => ids.has(option.value));
    setLinkSelection(selected);
  };

  const fetchSocieteOptions = async () => {
    setLinkLoading(true);
    setLinkError(null);
    try {
      const response = await axios.get<ISocieteLiee[]>('/api/societe-liees', {
        params: {
          size: 1000,
          sort: 'raisonSociale,asc',
          cacheBuster: Date.now(),
        },
      });
      const options = (response.data ?? []).map(mapToOption).filter((item): item is SocieteOption => item !== null);
      setLinkOptions(options);
      hydrateSelection(options);
    } catch (err) {
      setLinkError(translate('crmApp.client.form.genericError'));
    } finally {
      setLinkLoading(false);
    }
  };

  const openLinkModal = () => {
    if (!clientId) {
      return;
    }
    setLinkModalOpen(true);
    fetchSocieteOptions();
  };

  const closeLinkModal = () => {
    if (linkSaving) {
      return;
    }
    setLinkModalOpen(false);
    setLinkError(null);
  };

  const handleLinkSave = async () => {
    if (!client?.id) {
      return;
    }
    setLinkSaving(true);
    setLinkError(null);

    const selectedIds = linkSelection.map(option => option.value);
    const currentIds = societesLiees.map(item => item.id).filter((v): v is number => v !== undefined && v !== null);

    const toAttach = selectedIds.filter(selectedId => !currentIds.includes(selectedId));
    const toDetach = currentIds.filter(existingId => !selectedIds.includes(existingId));

    if (toAttach.length === 0 && toDetach.length === 0) {
      setLinkSaving(false);
      setLinkModalOpen(false);
      return;
    }

    try {
      await Promise.all([
        ...toAttach.map(societeId => axios.patch(`/api/societe-liees/${societeId}`, { id: societeId, client: { id: client.id } })),
        ...toDetach.map(societeId => axios.patch(`/api/societe-liees/${societeId}`, { id: societeId, client: null })),
      ]);
      toast.success(translate('crmApp.societeLiee.dashboard.messages.updateSuccess'));
      refresh();
      setLinkModalOpen(false);
    } catch (err) {
      setLinkError(translate('crmApp.client.form.genericError'));
    } finally {
      setLinkSaving(false);
    }
  };

  return (
    <div className="client-view-page py-4">
      {successMessage ? (
        <Alert color="success" className="border-0 shadow-sm mb-4">
          {successMessage}
        </Alert>
      ) : null}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Button color="link" tag={Link} to="/dashboard/clients" className="px-0 text-decoration-none">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          <Translate contentKey="crmApp.client.view.back" />
        </Button>
        {client?.id ? (
          <Button color="primary" tag={Link} to={`/dashboard/clients/${client.id}/edit`} className="shadow-sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            <Translate contentKey="crmApp.client.view.edit" />
          </Button>
        ) : null}
      </div>

      <ClientHeaderCard client={client} />

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
      ) : (
        <>
          <GeneralInfoCard client={client} />
          {client?.id ? (
            <>
              <SocietesLieesCard societes={societesLiees} loading={loading} clientId={client.id} onLinkExisting={openLinkModal} />
              <ClientContactsPanel clientId={client.id} />
              <ClientDocumentsPanel clientId={client.id} />
            </>
          ) : null}
          <KycCard kyc={kyc} />
          <RequestsCard clientId={client?.id ?? null} requests={requests} produitsParDemande={produitsParDemande} />
          <OpportunitiesCard opportunities={opportunities} />
          <HistoryCard history={history} />
        </>
      )}

      <Modal isOpen={linkModalOpen} toggle={closeLinkModal} centered size="lg">
        <ModalHeader toggle={closeLinkModal}>Lier une société existante</ModalHeader>
        <ModalBody>
          <p className="text-muted">Sélectionnez une ou plusieurs sociétés existantes pour les associer à ce client.</p>
          {linkError ? (
            <Alert color="danger" className="mb-3">
              {linkError}
            </Alert>
          ) : null}
          <Select
            isMulti
            classNamePrefix="react-select"
            options={linkOptions}
            value={linkSelection}
            onChange={(value: MultiValue<{ value: number; label: string; data: ISocieteLiee }>) =>
              setLinkSelection(value as SocieteOption[])
            }
            isLoading={linkLoading}
            placeholder="Rechercher par raison sociale, ICE, RC..."
            noOptionsMessage={() => (linkLoading ? translate('entity.action.loading') : 'Aucune société trouvée')}
            styles={{
              menu: provided => ({ ...provided, zIndex: 1060 }),
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeLinkModal} disabled={linkSaving}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="primary" onClick={handleLinkSave} disabled={linkSaving || linkLoading}>
            {linkSaving ? <Spinner size="sm" className="me-2" /> : null}
            Enregistrer le lien
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClientViewPage;
