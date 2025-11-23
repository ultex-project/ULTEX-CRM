import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faEllipsisV,
  faEye,
  faFilter,
  faLayerGroup,
  faPlus,
  faSearch,
  faSort,
  faSortDown,
  faSortUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';
import { deleteEntity, getEntities, reset } from 'app/entities/demande-client/demande-client.reducer';
import { buildQueryStringFromAdvancedFilters } from 'app/custom/dashboard/filters/advanced-filter-query';
import { AdvancedFilterPayload, FieldOption } from '../advanced-filter.types';
import AdvancedFilterBuilder from '../contact/AdvancedFilterBuilder';
import StatusBadge from 'app/custom/dashboard/components/status-badge/StatusBadge';
import ClientAvatar from '../client/components/ClientAvatar';

import '../client/ClientListPage.scss';

type ServicePrincipalKey = keyof typeof ServicePrincipal;

const SERVICE_PRINCIPAL_FILTERS: Array<'ALL' | ServicePrincipalKey> = ['ALL', 'IMPORT', 'EXPORT'];

const SORT_LABELS: Record<string, string> = {
  reference: 'crmApp.demandeClient.reference',
  clientId: 'crmApp.demandeClient.client',
  servicePrincipal: 'crmApp.demandeClient.servicePrincipal',
  typeDemande: 'crmApp.demandeClient.typeDemande',
  dateDemande: 'crmApp.demandeClient.dateDemande',
};

const getDemandeLabel = (demande?: IDemandeClient | null) => {
  if (!demande) {
    return translate('crmApp.demandeClient.dashboard.modal.unknown');
  }

  if (demande.reference) {
    return demande.reference;
  }

  if (demande.client?.nomComplet) {
    return demande.client.nomComplet;
  }

  if (demande.id) {
    return `#${demande.id}`;
  }

  return translate('crmApp.demandeClient.dashboard.modal.unknown');
};

const DemandeListPage = () => {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(state => state.locale?.currentLocale);
  const demandes = useAppSelector(state => state.demandeClient.entities);
  const loading = useAppSelector(state => state.demandeClient.loading);
  const totalItems = useAppSelector(state => state.demandeClient.totalItems);
  const deleting = useAppSelector(state => state.demandeClient.updating);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'ALL' | ServicePrincipalKey>('ALL');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasUnsupportedConditions, setHasUnsupportedConditions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState<IDemandeClient | null>(null);

  useEffect(() => {
    dispatch(getEntities({ page, size, sort, query: currentQuery }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, page, size, sort, currentQuery]);

  const handleSort = (key: string) => {
    const isAscending = sort.startsWith(key) && sort.endsWith('asc');
    setSort(`${key},${isAscending ? 'desc' : 'asc'}`);
    setPage(0);
  };

  const renderSortIcon = (key: string) => {
    if (sort.startsWith(key)) {
      return <FontAwesomeIcon icon={sort.endsWith('asc') ? faSortUp : faSortDown} size="sm" className="ms-1 text-muted" />;
    }
    return <FontAwesomeIcon icon={faSort} size="sm" className="ms-1 text-muted" />;
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openDeleteModal = (demande: IDemandeClient) => {
    setDemandeToDelete(demande);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDemandeToDelete(null);
  };

  const handleDelete = async () => {
    if (!demandeToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(demandeToDelete.id)).unwrap();
      closeDeleteModal();
      dispatch(getEntities({ page, size, sort, query: currentQuery }));
    } catch (error) {
      // keep modal open for manual retry or cancel
    }
  };

  const handleAdvancedSearch = (payload: AdvancedFilterPayload) => {
    const { query, hasOrCondition } = buildQueryStringFromAdvancedFilters(payload);

    setHasUnsupportedConditions(hasOrCondition);

    const nextPage = 0;
    setPage(nextPage);

    if (query === currentQuery) {
      dispatch(getEntities({ page: nextPage, size, sort, query }));
    } else {
      setCurrentQuery(query);
    }
  };

  const handleAdvancedReset = () => {
    setHasUnsupportedConditions(false);
    setPage(0);
    setCurrentQuery('');
  };

  const filterFields = useMemo<FieldOption[]>(() => {
    const locale = currentLocale;
    void locale;
    return [
      {
        value: 'servicePrincipal',
        label: translate('crmApp.demandeClient.servicePrincipal'),
        type: 'select',
        options: [
          { value: 'IMPORT', label: translate('crmApp.ServicePrincipal.IMPORT') },
          { value: 'EXPORT', label: translate('crmApp.ServicePrincipal.EXPORT') },
        ],
      },
      {
        value: 'typeDemande',
        label: translate('crmApp.demandeClient.typeDemande'),
        type: 'select',
        options: Object.keys(TypeDemande).map(key => ({ value: key, label: key })),
      },
      { value: 'reference', label: translate('crmApp.demandeClient.reference'), type: 'text' },
      { value: 'provenance', label: translate('crmApp.demandeClient.provenance'), type: 'text' },
      { value: 'clientId', label: translate('crmApp.demandeClient.client'), type: 'text' },
      { value: 'deviseId', label: translate('crmApp.demandeClient.devise'), type: 'text' },
      { value: 'incotermId', label: translate('crmApp.demandeClient.incoterm'), type: 'text' },
      { value: 'dateDemande', label: translate('crmApp.demandeClient.dateDemande'), type: 'date' },
    ];
  }, [currentLocale]);

  const filteredDemandes = useMemo(() => {
    if (!searchTerm.trim()) {
      return demandes;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return demandes.filter(demande => {
      const fields = [
        demande.reference,
        demande.provenance,
        demande.typeDemande,
        demande.servicePrincipal,
        demande.client?.nomComplet,
        demande.devise?.code,
        demande.incoterm?.code,
      ]
        .filter(Boolean)
        .map(value => value!.toString().toLowerCase());

      return fields.some(field => field.includes(normalized));
    });
  }, [demandes, searchTerm]);

  const serviceFilteredDemandes = useMemo(() => {
    if (serviceFilter === 'ALL') {
      return filteredDemandes;
    }
    return filteredDemandes.filter(demande => demande.servicePrincipal === serviceFilter);
  }, [filteredDemandes, serviceFilter]);

  const metrics = useMemo(() => {
    const lastWeek = dayjs().subtract(7, 'day');
    let imports = 0;
    let exports = 0;
    let newThisWeek = 0;
    let withIncoterm = 0;

    demandes.forEach(demande => {
      if (demande.servicePrincipal === 'IMPORT') {
        imports += 1;
      }
      if (demande.servicePrincipal === 'EXPORT') {
        exports += 1;
      }
      if (demande.dateDemande && dayjs(demande.dateDemande).isAfter(lastWeek)) {
        newThisWeek += 1;
      }
      if (demande.incoterm) {
        withIncoterm += 1;
      }
    });

    return {
      total: demandes.length,
      imports,
      exports,
      newThisWeek,
      withIncoterm,
    };
  }, [demandes]);

  const totalDemandesCount = totalItems && totalItems > 0 ? totalItems : demandes.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / size) : 0;

  const goToPage = (index: number) => {
    if (index >= 0 && (totalPages === 0 || index < totalPages) && index !== page) {
      setPage(index);
    }
  };

  const goToPrevious = () => {
    setPage(prev => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    if (totalPages && page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  };

  const sortProperty = sort.split(',')[0];
  const sortDirection = sort.endsWith('asc') ? 'asc' : 'desc';
  const sortLabel = translate(SORT_LABELS[sortProperty] ?? sortProperty);
  const sortDirectionLabel = sortDirection === 'asc' ? 'asc' : 'desc';

  return (
    <div className="client-page">
      <Card className="client-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <StatusBadge
                status="active"
                label={translate('crmApp.demandeClient.dashboard.status.badge')}
                className="client-hero__badge mb-3"
              />
              <h2 className="client-hero__title mb-2">Demandes clients</h2>
              <p className="text-muted mb-3">Soyez à jour sur l&apos;ensemble des demandes clients.</p>
              <div className="d-flex flex-wrap gap-4">
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Total</span>
                  <span className="client-hero__stat-value">{totalDemandesCount}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Imports</span>
                  <span className="client-hero__stat-value text-primary">{metrics.imports}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Exports</span>
                  <span className="client-hero__stat-value text-success">{metrics.exports}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Nouvelles (7j)</span>
                  <span className="client-hero__stat-value text-info">{metrics.newThisWeek}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button color="primary" tag={Link} to="/dashboard/demande/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Nouvelle demande
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Row className="g-3 client-metric-row mb-4">
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">Demandes import</span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
              </div>
              <h3 className="client-metric__value">{metrics.imports}</h3>
              <small className="text-muted">Total des demandes avec service principal IMPORT.</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">Demandes export</span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-success" />
              </div>
              <h3 className="client-metric__value">{metrics.exports}</h3>
              <small className="text-muted">Total des demandes avec service principal EXPORT.</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">Nouvelles cette semaine</span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-info" />
              </div>
              <h3 className="client-metric__value">{metrics.newThisWeek}</h3>
              <small className="text-muted">Basé sur la date de demande.</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">Avec incoterm</span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-warning" />
              </div>
              <h3 className="client-metric__value">{metrics.withIncoterm}</h3>
              <small className="text-muted">Demandes associées à un incoterm.</small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card className="client-toolbar shadow-sm border-0 mb-4">
        <CardBody>
          <Row className="g-3 align-items-center">
            <Col lg="5">
              <InputGroup className="client-toolbar__search">
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Rechercher une demande"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="7" className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-3">
              <div className="d-flex flex-wrap gap-2">
                {SERVICE_PRINCIPAL_FILTERS.map(option => {
                  const isActive = serviceFilter === option;

                  return (
                    <Button
                      key={option}
                      color={isActive ? 'primary' : 'light'}
                      className={`client-toolbar__chip ${isActive ? 'active' : ''}`}
                      onClick={() => setServiceFilter(option)}
                    >
                      {option === 'ALL' ? 'Tous les services' : translate(`crmApp.ServicePrincipal.${option}`)}
                    </Button>
                  );
                })}
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(prev => !prev)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  <Translate contentKey="crmApp.demandeClient.dashboard.filters.label" />
                </Button>
              </div>
            </Col>
          </Row>
          <Alert color="warning" fade={false} className="mb-3 mt-3" isOpen={hasUnsupportedConditions}>
            <Translate contentKey="crmApp.demandeClient.dashboard.filters.unsupported" />
          </Alert>
          <Collapse isOpen={showAdvancedFilters} className="client-advanced mt-2">
            <AdvancedFilterBuilder
              fields={filterFields}
              isSearching={loading}
              onSearch={handleAdvancedSearch}
              onReset={handleAdvancedReset}
            />
          </Collapse>
        </CardBody>
      </Card>

      <Card className="client-table-card shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">Tableau des demandes</h5>
            <span className="text-muted small">
              {serviceFilteredDemandes.length} / {filteredDemandes.length} affichées
            </span>
          </div>
          <span className="text-muted small">
            <Translate
              contentKey="crmApp.demandeClient.dashboard.table.sortedBy"
              interpolate={{ field: sortLabel, direction: sortDirectionLabel }}
            />
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('reference')} className="sortable">
                    Référence {renderSortIcon('reference')}
                  </th>
                  <th role="button" onClick={() => handleSort('clientId')} className="sortable">
                    Client {renderSortIcon('clientId')}
                  </th>
                  <th role="button" onClick={() => handleSort('servicePrincipal')} className="sortable">
                    Service {renderSortIcon('servicePrincipal')}
                  </th>
                  <th role="button" onClick={() => handleSort('typeDemande')} className="sortable">
                    Type {renderSortIcon('typeDemande')}
                  </th>
                  <th>Devise</th>
                  <th>Incoterm</th>
                  <th role="button" onClick={() => handleSort('dateDemande')} className="sortable">
                    Date demande {renderSortIcon('dateDemande')}
                  </th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && serviceFilteredDemandes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      Chargement des demandes...
                    </td>
                  </tr>
                ) : serviceFilteredDemandes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                      Aucune demande trouvée
                    </td>
                  </tr>
                ) : (
                  serviceFilteredDemandes.map((demande, index) => {
                    const rowId = demande.id ? demande.id.toString() : `row-${index}`;
                    return (
                      <tr key={rowId}>
                        <td className="fw-semibold">{demande.reference ?? '--'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ClientAvatar name={demande.client?.nomComplet ?? ''} photoUrl={undefined} size={42} />
                            <div>
                              <div className="fw-semibold text-capitalize">{demande.client?.nomComplet ?? 'Client inconnu'}</div>
                              <div className="text-muted small">{demande.client?.email ?? 'Email non renseigné'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <StatusBadge
                            status="active"
                            label={demande.servicePrincipal ? translate(`crmApp.ServicePrincipal.${demande.servicePrincipal}`) : '--'}
                          />
                        </td>
                        <td>{demande.typeDemande ? translate(`crmApp.TypeDemande.${demande.typeDemande}`) : '--'}</td>
                        <td>{demande.devise?.code ?? '--'}</td>
                        <td>{demande.incoterm?.code ?? '--'}</td>
                        <td>{demande.dateDemande ? dayjs(demande.dateDemande).format('DD MMM YYYY') : '--'}</td>
                        <td className="text-end pe-4">
                          {demande.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/demande/${demande.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  Voir
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/demande/${demande.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  Modifier
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(demande)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  Supprimer
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">Synchronisation...</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
        {totalPages > 1 && (
          <CardFooter className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="text-muted small">
              <Translate contentKey="crmApp.demandeClient.dashboard.pagination.page" interpolate={{ page: page + 1, total: totalPages }} />
            </span>
            <Pagination className="m-0">
              <PaginationItem disabled={page === 0}>
                <PaginationLink previous onClick={goToPrevious} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={`page-${index}`} active={index === page}>
                  <PaginationLink onClick={() => goToPage(index)}>{index + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={page >= totalPages - 1}>
                <PaginationLink next onClick={goToNext} />
              </PaginationItem>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>Supprimer la demande</ModalHeader>
        <ModalBody>
          Confirmez-vous la suppression de <strong>{getDemandeLabel(demandeToDelete)}</strong> ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            Annuler
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            Supprimer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DemandeListPage;
