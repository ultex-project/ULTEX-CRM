import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { Alert, Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Progress, Row, Spinner, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faFileArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { IClient } from 'app/shared/model/client.model';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';
import { IDocumentClient } from 'app/shared/model/document-client.model';
import { IKycClient } from 'app/shared/model/kyc-client.model';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { IOpportunity } from 'app/shared/model/opportunity.model';
import { OpportunityStage } from 'app/shared/model/enumerations/opportunity-stage.model';
import { IHistoriqueCRM } from 'app/shared/model/historique-crm.model';

const outlineBadgeClass = (tone: 'success' | 'secondary' | 'danger' | 'info' | 'warning' | 'primary') =>
  `badge rounded-pill fw-semibold px-3 py-1 bg-white border border-${tone} text-${tone}`;

const isClientStatus = (value: unknown): value is ClientStatus =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(ClientStatus, value);

const formatDate = (value?: dayjs.Dayjs | string | null, format = 'DD MMM YYYY') => (value ? dayjs(value).format(format) : '--');

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

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

const ClientViewPage = () => {
  const { id } = useParams<'id'>();
  const location = useLocation();
  const clientId = id ? Number(id) : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [client, setClient] = useState<IClient | null>(null);
  const [contacts, setContacts] = useState<IContactAssocie[]>([]);
  const [linkedCompanies, setLinkedCompanies] = useState<ISocieteLiee[]>([]);
  const [documents, setDocuments] = useState<IDocumentClient[]>([]);
  const [kyc, setKyc] = useState<IKycClient | null>(null);
  const [requests, setRequests] = useState<IDemandeClient[]>([]);
  const [requestProducts, setRequestProducts] = useState<IProduitDemande[]>([]);
  const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
  const [history, setHistory] = useState<IHistoriqueCRM[]>([]);

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

  useEffect(() => {
    if (!clientId) {
      setClient(null);
      setContacts([]);
      setLinkedCompanies([]);
      setDocuments([]);
      setKyc(null);
      setRequests([]);
      setRequestProducts([]);
      setOpportunities([]);
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          clientResponse,
          contactsData,
          companiesData,
          documentsData,
          kycData,
          demandesData,
          produitsData,
          opportunitiesData,
          historyData,
        ] = await Promise.all([
          axios.get<IClient>(`api/clients/${clientId}`),
          createCollectionFetcher<IContactAssocie>('api/contact-associes'),
          createCollectionFetcher<ISocieteLiee>('api/societe-liees'),
          createCollectionFetcher<IDocumentClient>('api/document-clients'),
          createCollectionFetcher<IKycClient>('api/kyc-clients'),
          createCollectionFetcher<IDemandeClient>('api/demande-clients'),
          createCollectionFetcher<IProduitDemande>('api/produit-demandes'),
          createCollectionFetcher<IOpportunity>('api/opportunities'),
          createCollectionFetcher<IHistoriqueCRM>('api/historique-crms'),
        ]);

        setClient(clientResponse.data ?? null);
        setContacts(contactsData.filter(item => item.client?.id === clientId));
        setLinkedCompanies(companiesData.filter(item => item.client?.id === clientId));
        setDocuments(documentsData.filter(item => item.client?.id === clientId));
        setKyc(kycData.find(item => item.client?.id === clientId) ?? null);
        const clientRequests = demandesData.filter(item => item.client?.id === clientId);
        setRequests(clientRequests);
        setRequestProducts(
          produitsData.filter(item => {
            const demandeId = item.demande?.id;
            return demandeId !== undefined && clientRequests.some(req => req.id === demandeId);
          }),
        );
        setOpportunities(opportunitiesData.filter(item => item.client?.id === clientId));
        setHistory(historyData.filter(item => item.client?.id === clientId));
      } catch (requestError) {
        setError(translate('crmApp.client.view.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const produitsParDemande = useMemo(() => {
    const map = new Map<number, IProduitDemande[]>();
    requestProducts.forEach(produit => {
      const demandeId = produit.demande?.id;
      if (demandeId === undefined || demandeId === null) {
        return;
      }
      const existing = map.get(demandeId);
      if (existing) {
        existing.push(produit);
      } else {
        map.set(demandeId, [produit]);
      }
    });
    return map;
  }, [requestProducts]);

  const renderAvatar = () => {
    if (client?.photoUrl) {
      return (
        <img
          src={client.photoUrl}
          alt={client.nomComplet ?? ''}
          className="rounded-circle border"
          style={{ width: 72, height: 72, objectFit: 'cover' }}
        />
      );
    }

    const initials = (client?.nomComplet ?? '')
      .split(' ')
      .filter(Boolean)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);

    return (
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle border bg-light text-primary fw-bold"
        style={{ width: 72, height: 72 }}
      >
        {initials || '?'}
      </div>
    );
  };

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
          <Button color="primary" tag={Link} to={`/client/${client.id}/edit`} className="shadow-sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            <Translate contentKey="crmApp.client.view.edit" />
          </Button>
        ) : null}
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row gap-4 align-items-lg-center">
            <div className="d-flex align-items-center gap-3">
              {renderAvatar()}
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

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.client.view.sections.contacts" />
              </h5>
            </CardHeader>
            <CardBody>
              {contacts.length === 0 ? (
                <div className="text-muted">
                  <Translate contentKey="crmApp.client.view.empty" />
                </div>
              ) : (
                <ListGroup flush>
                  {contacts.map(contact => (
                    <ListGroupItem key={contact.id} className="py-3">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h6 className="mb-1">
                            {contact.prenom} {contact.nom}
                          </h6>
                          <div className="text-muted small">
                            {contact.relation ? `${contact.relation}` : translate('crmApp.client.view.empty')}
                          </div>
                        </div>
                        <div className="text-md-end">
                          <div>{renderValue(contact.telephone)}</div>
                          <div className="text-muted">{renderValue(contact.email)}</div>
                          <div className="text-muted">{renderValue(contact.whatsapp)}</div>
                        </div>
                      </div>
                      {contact.remarques ? <div className="text-muted small mt-2">{contact.remarques}</div> : null}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.client.view.sections.companies" />
              </h5>
            </CardHeader>
            <CardBody>
              {linkedCompanies.length === 0 ? (
                <div className="text-muted">
                  <Translate contentKey="crmApp.client.view.empty" />
                </div>
              ) : (
                <ListGroup flush>
                  {linkedCompanies.map(company => (
                    <ListGroupItem key={company.id} className="py-3">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h6 className="mb-1">{company.raisonSociale}</h6>
                          <div className="text-muted small">
                            {renderValue(company.formeJuridique)} · {renderValue(company.secteurActivite)}
                          </div>
                        </div>
                        <div className="text-md-end text-muted small">
                          <div>{renderValue(company.ice)}</div>
                          <div>{renderValue(company.rc)}</div>
                          <div>{renderValue(company.nif)}</div>
                        </div>
                      </div>
                      {company.adresseSiege ? <div className="text-muted small mt-2">{company.adresseSiege}</div> : null}
                      {company.representantLegal ? (
                        <div className="text-muted small">
                          <Translate
                            contentKey="crmApp.client.view.company.representant"
                            interpolate={{ value: company.representantLegal }}
                          />
                        </div>
                      ) : null}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-bottom">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.client.view.sections.documents" />
              </h5>
            </CardHeader>
            <CardBody className="p-0">
              {documents.length === 0 ? (
                <div className="text-muted p-4">
                  <Translate contentKey="crmApp.client.view.empty" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="text-muted small">
                      <tr>
                        <th className="ps-4">
                          <Translate contentKey="crmApp.documentClient.typeDocument" />
                        </th>
                        <th>
                          <Translate contentKey="crmApp.documentClient.numeroDocument" />
                        </th>
                        <th className="pe-4 text-end">
                          <Translate contentKey="crmApp.client.view.documents.actions" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map(document => (
                        <tr key={document.id}>
                          <td className="ps-4">{renderValue(document.typeDocument)}</td>
                          <td>{renderValue(document.numeroDocument)}</td>
                          <td className="pe-4 text-end">
                            {document.fichierUrl ? (
                              <Button
                                color="link"
                                size="sm"
                                className="text-decoration-none"
                                href={document.fichierUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon icon={faFileArrowDown} className="me-2" />
                                <Translate contentKey="crmApp.client.view.documents.download" />
                              </Button>
                            ) : (
                              <span className="text-muted">
                                <Translate contentKey="crmApp.client.view.empty" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>

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

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center gap-2">
              <h5 className="mb-0">
                <Translate contentKey="crmApp.client.view.sections.requests" />
              </h5>
              {client?.id ? (
                <Button color="primary" size="sm" tag={Link} to={`/dashboard/clients/${client.id}/demands/new`} className="shadow-sm">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  <Translate contentKey="crmApp.demandeClient.create.newButton" />
                </Button>
              ) : null}
            </CardHeader>
            <CardBody>
              {requests.length === 0 ? (
                <div className="text-muted">
                  <Translate contentKey="crmApp.client.view.empty" />
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {requests.map(request => {
                    const produits = request.id ? (produitsParDemande.get(request.id) ?? []) : [];
                    return (
                      <Card key={request.id} className="border-0 shadow-sm">
                        <CardBody>
                          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                            <div>
                              <h6 className="mb-1">{request.reference}</h6>
                              <div className="text-muted small">
                                {formatDate(request.dateDemande)} · {renderValue(request.servicePrincipal)}
                              </div>
                            </div>
                            <div className="text-md-end text-muted small">
                              <div>
                                <Translate contentKey="crmApp.demandeClient.nombreProduits" />: {renderValue(request.nombreProduits)}
                              </div>
                              <div>{renderValue(formatDeviseDisplay(request.devise))}</div>
                              <div>{renderValue(formatIncotermDisplay(request.incoterm))}</div>
                            </div>
                          </div>
                          {produits.length > 0 ? (
                            <ListGroup flush className="mt-3">
                              {produits.map(produit => (
                                <ListGroupItem key={produit.id} className="px-0 border-0">
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
                          ) : null}
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

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
        </>
      )}
    </div>
  );
};

export default ClientViewPage;
