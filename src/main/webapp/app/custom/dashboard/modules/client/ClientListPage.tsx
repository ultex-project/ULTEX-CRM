// src/main/webapp/app/entities/client/ClientListPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Col,
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
  Progress,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faEllipsisV,
  faEye,
  faEdit,
  faTrash,
  faSortUp,
  faSortDown,
  faSort,
  faLayerGroup,
  faChartLine,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IClient } from 'app/shared/model/client.model';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';
import { deleteEntity, getEntities, reset } from 'app/entities/client/client.reducer';
import { buildQueryStringFromAdvancedFilters } from 'app/custom/dashboard/filters/advanced-filter-query';
import { AdvancedFilterPayload, FieldOption } from '../advanced-filter.types';
import AdvancedFilterBuilder from '../contact/AdvancedFilterBuilder';
import StatusBadge, { StatusBadgeVariant } from 'app/custom/dashboard/components/status-badge/StatusBadge';
import ClientAvatar from './components/ClientAvatar';

import './ClientListPage.scss';

type ClientStatusKey = keyof typeof ClientStatus;
type StatusFilterOption = 'ALL' | ClientStatusKey;

const CLIENT_STATUS_META: Record<ClientStatusKey, { labelKey: string; variant: StatusBadgeVariant }> = {
  ACTIVE: { labelKey: 'crmApp.client.dashboard.status.active', variant: 'active' },
  INACTIVE: { labelKey: 'crmApp.client.dashboard.status.inactive', variant: 'pending' },
  ARCHIVED: { labelKey: 'crmApp.client.dashboard.status.archived', variant: 'failed' },
};

const QUICK_FILTERS: StatusFilterOption[] = ['ALL', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

const SORT_LABELS: Record<string, string> = {
  nomComplet: 'crmApp.client.nomComplet',
  company: 'crmApp.client.company',
  status: 'crmApp.client.dashboard.columns.status',
  createdAt: 'crmApp.client.createdAt',
};

const isClientStatusKey = (value: unknown): value is ClientStatusKey =>
  typeof value === 'string' && Object.values(ClientStatus).includes(value as ClientStatus);

const resolveClientStatus = (client: IClient): ClientStatusKey | null => {
  const raw = client.status as unknown;
  if (!raw) return null;

  const candidate = typeof raw === 'string' ? raw : typeof raw === 'number' ? raw.toString() : '';

  if (!isClientStatusKey(candidate)) return null;
  return candidate;
};

const getClientLabel = (client?: IClient | null) => {
  if (!client) {
    return translate('crmApp.client.dashboard.modal.unknown');
  }

  if (client.nomComplet) {
    return client.nomComplet;
  }

  if (client.email) {
    return client.email;
  }

  if (client.id) {
    return `#${client.id}`;
  }

  return translate('crmApp.client.dashboard.modal.unknown');
};

const ClientListPage = () => {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(state => state.locale?.currentLocale);
  const clients = useAppSelector(state => state.client.entities);
  const loading = useAppSelector(state => state.client.loading);
  const totalItems = useAppSelector(state => state.client.totalItems);
  const deleting = useAppSelector(state => state.client.updating);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasUnsupportedConditions, setHasUnsupportedConditions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<IClient | null>(null);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ClientListPage] Fetching with query:', currentQuery || '(none)');
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

  const openDeleteModal = (client: IClient) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleDelete = async () => {
    if (!clientToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(clientToDelete.id)).unwrap();
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

    // eslint-disable-next-line no-console
    console.log('[ClientListPage] Applying advanced filter query:', query || '(none)');

    if (query === currentQuery) {
      dispatch(getEntities({ page: nextPage, size, sort, query }));
    } else {
      setCurrentQuery(query);
    }
  };

  const handleAdvancedReset = () => {
    setHasUnsupportedConditions(false);
    setPage(0);
    // eslint-disable-next-line no-console
    console.log('[ClientListPage] Resetting advanced filters');
    setCurrentQuery('');
  };

  const filterFields = useMemo<FieldOption[]>(() => {
    const locale = currentLocale;
    void locale;
    return [
      {
        value: 'status',
        label: translate('crmApp.client.dashboard.filters.fields.status'),
        type: 'select',
        options: [
          { value: 'ACTIVE', label: translate('crmApp.client.dashboard.status.active') },
          { value: 'INACTIVE', label: translate('crmApp.client.dashboard.status.inactive') },
          { value: 'ARCHIVED', label: translate('crmApp.client.dashboard.status.archived') },
        ],
      },
      { value: 'nomComplet', label: translate('crmApp.client.nomComplet'), type: 'text' },
      { value: 'email', label: translate('crmApp.client.email'), type: 'text' },
      { value: 'telephonePrincipal', label: translate('crmApp.client.telephonePrincipal'), type: 'text' },
      { value: 'nationalite', label: translate('crmApp.client.nationalite'), type: 'text' },
      {
        value: 'languePreferee',
        label: translate('crmApp.client.languePreferee'),
        type: 'select',
        options: [
          { value: 'FR', label: translate('crmApp.client.dashboard.languages.fr') },
          { value: 'EN', label: translate('crmApp.client.dashboard.languages.en') },
          { value: 'AR', label: translate('crmApp.client.dashboard.languages.ar') },
        ],
      },
      { value: 'companyId', label: translate('crmApp.client.company'), type: 'text' },
      { value: 'createdAt', label: translate('crmApp.client.createdAt'), type: 'date' },
    ];
  }, [currentLocale]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return clients;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return clients.filter(client => {
      const fields = [
        client.nomComplet,
        client.email,
        client.telephonePrincipal,
        client.nationalite,
        client.languePreferee,
        client.company?.name,
      ]
        .filter(Boolean)
        .map(value => value!.toString().toLowerCase());

      return fields.some(field => field.includes(normalized));
    });
  }, [clients, searchTerm]);

  const filteredStatusCounts = useMemo(() => {
    const totals: Record<ClientStatusKey, number> = { ACTIVE: 0, INACTIVE: 0, ARCHIVED: 0 };

    filteredClients.forEach(client => {
      const statusKey = resolveClientStatus(client);
      if (statusKey) {
        totals[statusKey] += 1;
      }
    });

    return totals;
  }, [filteredClients]);

  const statusFilteredClients = useMemo(() => {
    if (statusFilter === 'ALL') {
      return filteredClients;
    }

    return filteredClients.filter(client => resolveClientStatus(client) === statusFilter);
  }, [filteredClients, statusFilter]);

  const metrics = useMemo(() => {
    const totals: Record<ClientStatusKey, number> = { ACTIVE: 0, INACTIVE: 0, ARCHIVED: 0 };
    const lastWeek = dayjs().subtract(7, 'day');
    const lastMonth = dayjs().subtract(30, 'day');

    let newThisWeek = 0;
    let recentlyUpdated = 0;

    clients.forEach(client => {
      const statusKey = resolveClientStatus(client);
      if (statusKey) {
        totals[statusKey] += 1;
      }

      if (client.createdAt && dayjs(client.createdAt).isAfter(lastWeek)) {
        newThisWeek += 1;
      }

      if (client.updatedAt && dayjs(client.updatedAt).isAfter(lastMonth)) {
        recentlyUpdated += 1;
      }
    });

    const total = clients.length;
    const activeShare = total ? Math.round(((totals.ACTIVE ?? 0) / total) * 100) : 0;
    const inactiveShare = total ? Math.round(((totals.INACTIVE ?? 0) / total) * 100) : 0;

    return { totals, newThisWeek, recentlyUpdated, activeShare, inactiveShare };
  }, [clients]);

  const totalClientCount = totalItems && totalItems > 0 ? totalItems : clients.length;
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

  const renderStatusBadge = (status?: ClientStatusKey | null) => {
    if (!status) {
      return <StatusBadge status="pending" label={translate('crmApp.client.dashboard.status.unassigned')} />;
    }

    const meta = CLIENT_STATUS_META[status];
    return <StatusBadge status={meta.variant} label={translate(meta.labelKey)} />;
  };

  const sortProperty = sort.split(',')[0];
  const sortDirection = sort.endsWith('asc') ? 'asc' : 'desc';
  const sortLabel = translate(SORT_LABELS[sortProperty] ?? sortProperty);
  const sortDirectionLabel = translate(`crmApp.client.dashboard.direction.${sortDirection}`);

  return (
    <div className="client-page">
      <Card className="client-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <StatusBadge status="active" label={translate('crmApp.client.dashboard.status.badge')} className="client-hero__badge mb-3" />
              <h2 className="client-hero__title mb-2">
                <Translate contentKey="crmApp.client.dashboard.hero.title" />
              </h2>
              <p className="text-muted mb-3">
                <Translate contentKey="crmApp.client.dashboard.hero.subtitle" />
              </p>
              <div className="d-flex flex-wrap gap-4">
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.client.dashboard.hero.stats.total" />
                  </span>
                  <span className="client-hero__stat-value">{totalClientCount}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.client.dashboard.hero.stats.active" />
                  </span>
                  <span className="client-hero__stat-value text-primary">{metrics.totals.ACTIVE ?? 0}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.client.dashboard.hero.stats.updated" />
                  </span>
                  <span className="client-hero__stat-value text-success">{metrics.recentlyUpdated}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button outline color="secondary" className="client-hero__secondary">
                <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                <Translate contentKey="crmApp.client.dashboard.buttons.saveSegment" />
              </Button>
              <Button color="primary" tag={Link} to="/dashboard/clients/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                <Translate contentKey="crmApp.client.dashboard.buttons.newClient" />
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
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.client.dashboard.metrics.activeShare" />
                </span>
                <FontAwesomeIcon icon={faChartLine} className="text-success" />
              </div>
              <h3 className="client-metric__value">{metrics.activeShare}%</h3>
              <Progress value={metrics.activeShare} color="success" className="client-metric__progress" />
              <small className="text-muted">
                <Translate contentKey="crmApp.client.dashboard.metrics.activeShareHint" interpolate={{ value: metrics.activeShare }} />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.client.dashboard.metrics.inactive" />
                </span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
              </div>
              <h3 className="client-metric__value">{metrics.totals.INACTIVE ?? 0}</h3>
              <Progress value={metrics.inactiveShare} color="primary" className="client-metric__progress" />
              <small className="text-muted">
                <Translate contentKey="crmApp.client.dashboard.metrics.inactiveHint" interpolate={{ value: metrics.inactiveShare }} />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.client.dashboard.metrics.newThisWeek" />
                </span>
                <FontAwesomeIcon icon={faGlobe} className="text-info" />
              </div>
              <h3 className="client-metric__value">{metrics.newThisWeek}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.client.dashboard.metrics.newThisWeekHint" />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.client.dashboard.metrics.archived" />
                </span>
                <FontAwesomeIcon icon={faTrash} className="text-danger" />
              </div>
              <h3 className="client-metric__value">{metrics.totals.ARCHIVED ?? 0}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.client.dashboard.metrics.archivedHint" />
              </small>
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
                  placeholder={translate('crmApp.client.dashboard.searchPlaceholder')}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="7" className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-3">
              <ButtonGroup className="client-toolbar__chips flex-wrap">
                {QUICK_FILTERS.map(option => {
                  const isActive = statusFilter === option;

                  if (option === 'ALL') {
                    return (
                      <Button
                        key={option}
                        color={isActive ? 'primary' : 'light'}
                        className={`client-toolbar__chip ${isActive ? 'active' : ''}`}
                        onClick={() => setStatusFilter(option)}
                      >
                        <Translate contentKey="crmApp.client.dashboard.filters.all" interpolate={{ count: filteredClients.length }} />
                      </Button>
                    );
                  }

                  const count = filteredStatusCounts[option] ?? 0;
                  const statusLabelKey = CLIENT_STATUS_META[option].labelKey;
                  return (
                    <Button
                      key={option}
                      color={isActive ? 'primary' : 'light'}
                      className={`client-toolbar__chip ${isActive ? 'active' : ''}`}
                      onClick={() => setStatusFilter(option)}
                    >
                      <Translate
                        contentKey={`crmApp.client.dashboard.filters.${option.toLowerCase()}`}
                        interpolate={{ count, label: translate(statusLabelKey) }}
                      />
                    </Button>
                  );
                })}
              </ButtonGroup>
              <div className="d-flex flex-wrap gap-2">
                <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(prev => !prev)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  <Translate contentKey="crmApp.client.dashboard.filters.label" />
                </Button>
              </div>
            </Col>
          </Row>
          <Collapse isOpen={showAdvancedFilters} className="client-advanced mt-4">
            {hasUnsupportedConditions ? (
              <Alert color="warning" fade={false} className="mb-3">
                <Translate contentKey="crmApp.client.dashboard.filters.unsupported" />
              </Alert>
            ) : null}
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
            <h5 className="mb-1">
              <Translate contentKey="crmApp.client.dashboard.table.title" />
            </h5>
            <span className="text-muted small">
              <Translate
                contentKey="crmApp.client.dashboard.table.summary"
                interpolate={{ current: statusFilteredClients.length, total: filteredClients.length }}
              />
            </span>
          </div>
          <span className="text-muted small">
            <Translate
              contentKey="crmApp.client.dashboard.table.sortedBy"
              interpolate={{ field: sortLabel, direction: sortDirectionLabel }}
            />
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('nomComplet')} className="sortable">
                    <Translate contentKey="crmApp.client.dashboard.columns.client" /> {renderSortIcon('nomComplet')}
                  </th>
                  <th role="button" onClick={() => handleSort('company')} className="sortable">
                    <Translate contentKey="crmApp.client.dashboard.columns.company" /> {renderSortIcon('company')}
                  </th>
                  <th role="button" onClick={() => handleSort('status')} className="sortable">
                    <Translate contentKey="crmApp.client.dashboard.columns.status" /> {renderSortIcon('status')}
                  </th>
                  <th>
                    <Translate contentKey="crmApp.client.dashboard.columns.nationality" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.client.dashboard.columns.language" />
                  </th>
                  <th role="button" onClick={() => handleSort('createdAt')} className="sortable">
                    <Translate contentKey="crmApp.client.dashboard.columns.created" /> {renderSortIcon('createdAt')}
                  </th>
                  <th className="text-end pe-4">
                    <Translate contentKey="crmApp.client.dashboard.columns.actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && statusFilteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      <Translate contentKey="crmApp.client.dashboard.table.loading" />
                    </td>
                  </tr>
                ) : statusFilteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                      <Translate contentKey="crmApp.client.dashboard.table.empty" />
                    </td>
                  </tr>
                ) : (
                  statusFilteredClients.map((client, index) => {
                    const rowId = client.id ? client.id.toString() : `row-${index}`;
                    const statusKey = resolveClientStatus(client);
                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ClientAvatar name={client.nomComplet ?? ''} photoUrl={client.photoUrl ?? undefined} size={42} />
                            <div>
                              <div className="fw-semibold text-capitalize">
                                {client.nomComplet ?? translate('crmApp.client.dashboard.table.unnamed')}
                              </div>
                              <div className="text-muted small">{client.email ?? translate('crmApp.client.dashboard.table.noEmail')}</div>
                              <div className="text-muted small">
                                {client.telephonePrincipal ?? translate('crmApp.client.dashboard.table.noPhone')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{client.company?.name ?? '--'}</span>
                            {client.company?.country ? <small className="text-muted">{client.company.country}</small> : null}
                          </div>
                        </td>
                        <td>{renderStatusBadge(statusKey)}</td>
                        <td>{client.nationalite ?? '--'}</td>
                        <td>{client.languePreferee ?? '--'}</td>
                        <td>{client.createdAt ? dayjs(client.createdAt).format('DD MMM YYYY') : '--'}</td>
                        <td className="text-end pe-4">
                          {client.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/clients/${client.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.view" />
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/clients/${client.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.edit" />
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(client)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.delete" />
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">
                              <Translate contentKey="crmApp.client.dashboard.table.pendingSync" />
                            </span>
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
              <Translate contentKey="crmApp.client.dashboard.pagination.page" interpolate={{ page: page + 1, total: totalPages }} />
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
        <ModalHeader toggle={closeDeleteModal}>
          <Translate contentKey="crmApp.client.dashboard.modal.title" />
        </ModalHeader>
        <ModalBody>
          <Translate contentKey="crmApp.client.dashboard.modal.messagePrefix" /> <strong>{getClientLabel(clientToDelete)}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            <Translate contentKey="crmApp.client.dashboard.modal.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="crmApp.client.dashboard.modal.confirm" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClientListPage;
