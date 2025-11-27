// src/main/webapp/app/entities/prospect/ClientListPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import dayjs from 'dayjs';
import './ProspectListPage.scss';
import { IProspect } from 'app/shared/model/prospect.model';
import { ProspectStatus } from 'app/shared/model/enumerations/prospect-status.model';
import { deleteEntity, getEntities, reset } from 'app/entities/prospect/prospect.reducer';
import AdvancedFilterBuilder from './AdvancedFilterBuilder';
import { AdvancedFilterPayload, GroupNode, RuleNode, isGroupNode } from '../advanced-filter.types';
import { buildQueryStringFromAdvancedFilters } from 'app/custom/dashboard/filters/advanced-filter-query';
import StatusBadge, { StatusBadgeVariant } from 'app/custom/dashboard/components/status-badge/StatusBadge';

type ProspectStatusKey = keyof typeof ProspectStatus;
type StatusFilterOption = 'ALL' | ProspectStatusKey;

const STATUS_META: Record<ProspectStatusKey, { label: string; color: string; background: string }> = {
  NEW: { label: 'New', color: '#2563eb', background: 'rgba(37, 99, 235, 0.12)' },
  CONTACTED: { label: 'Contacted', color: '#0f766e', background: 'rgba(15, 118, 110, 0.12)' },
  QUALIFIED: { label: 'Qualified', color: '#15803d', background: 'rgba(21, 128, 61, 0.12)' },
  LOST: { label: 'Lost', color: '#b91c1c', background: 'rgba(185, 28, 28, 0.12)' },
};

const QUICK_FILTERS: StatusFilterOption[] = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

const isProspectStatusKey = (value: unknown): value is ProspectStatusKey => typeof value === 'string' && value in STATUS_META;

const STATUS_BADGE_VARIANT: Record<ProspectStatusKey, StatusBadgeVariant> = {
  NEW: 'pipeline',
  CONTACTED: 'active',
  QUALIFIED: 'completed',
  LOST: 'failed',
};

const renderAvatar = (firstName: string, lastName: string) => {
  if (!firstName || !lastName) return <div className="avatar-placeholder">?</div>;
  return (
    <div className="avatar-circle">
      {firstName[0]}
      {lastName[0]}
    </div>
  );
};

const getProspectLabel = (prospect?: IProspect | null) => {
  if (!prospect) {
    return 'this record';
  }
  const fullName = `${prospect.firstName ?? ''} ${prospect.lastName ?? ''}`.trim();
  if (fullName) {
    return fullName;
  }
  if (prospect.email) {
    return prospect.email;
  }
  if (prospect.id) {
    return `#${prospect.id}`;
  }
  return 'this record';
};

const ProspectListPage = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();
  const prospects: IProspect[] = useAppSelector(state => state.prospect.entities);
  const loading = useAppSelector(state => state.prospect.loading);
  const totalItems = useAppSelector(state => state.prospect.totalItems);
  const deleting = useAppSelector(state => state.prospect.updating);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasUnsupportedConditions, setHasUnsupportedConditions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState<IProspect | null>(null);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ProspectListPage] Fetching with query:', currentQuery || '(none)');
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
        query: currentQuery,
      }),
    );
  }, [dispatch, paginationState.activePage, paginationState.itemsPerPage, paginationState.order, paginationState.sort, currentQuery]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const size = params.get('size');
    const sort = params.get(SORT);
    if (!page && !sort && !size) {
      return;
    }

    setPaginationState(prev => {
      const sortSplit = sort ? sort.split(',') : [prev.sort, prev.order];
      const nextState = {
        ...prev,
        activePage: page ? +page : prev.activePage,
        itemsPerPage: size ? Number(size) : prev.itemsPerPage,
        sort: sortSplit[0],
        order: sortSplit[1],
      };

      if (
        nextState.activePage !== prev.activePage ||
        nextState.itemsPerPage !== prev.itemsPerPage ||
        nextState.sort !== prev.sort ||
        nextState.order !== prev.order
      ) {
        return nextState;
      }
      return prev;
    });
  }, [pageLocation.search]);

  const handleSort = (key: string) => {
    const order = paginationState.sort === key && paginationState.order === ASC ? DESC : ASC;
    setPaginationState(prev => ({ ...prev, order, sort: key }));
  };

  const renderSortIcon = (key: string) => {
    if (paginationState.sort === key) {
      return <FontAwesomeIcon icon={paginationState.order === ASC ? faSortUp : faSortDown} size="sm" className="ms-1 text-muted" />;
    }
    return <FontAwesomeIcon icon={faSort} size="sm" className="ms-1 text-muted" />;
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openDeleteModal = (prospect: IProspect) => {
    setProspectToDelete(prospect);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProspectToDelete(null);
  };

  const handleDelete = async () => {
    if (!prospectToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(prospectToDelete.id)).unwrap();
      closeDeleteModal();
      dispatch(
        getEntities({
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
          query: currentQuery,
        }),
      );
    } catch (error) {
      // Keep modal open so the user can retry or cancel manually
    }
  };

  const handleAdvancedSearch = (payload: AdvancedFilterPayload) => {
    const { query, hasOrCondition } = buildQueryStringFromAdvancedFilters(payload);

    setHasUnsupportedConditions(hasOrCondition);

    const nextPage = 0;
    setPaginationState(prev => ({ ...prev, activePage: nextPage + 1 }));

    // eslint-disable-next-line no-console
    console.log('[ProspectListPage] Applying advanced filter query:', query || '(none)');

    if (query === currentQuery) {
      dispatch(
        getEntities({
          page: nextPage,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
          query,
        }),
      );
    } else {
      setCurrentQuery(query);
    }
  };

  const handleAdvancedReset = () => {
    setHasUnsupportedConditions(false);
    setPaginationState(prev => ({ ...prev, activePage: 1 }));
    // eslint-disable-next-line no-console
    console.log('[ProspectListPage] Resetting advanced filters');
    setCurrentQuery('');
  };

  const filteredProspects = useMemo(() => {
    if (!searchTerm.trim()) {
      return prospects;
    }
    const normalized = searchTerm.trim().toLowerCase();
    return prospects.filter(prospect => {
      const fullName = [prospect.firstName, prospect.lastName].filter(Boolean).join(' ').toLowerCase();
      const email = (prospect.email ?? '').toLowerCase();
      const phone = (prospect.phone1 ?? '').toLowerCase();
      const company = (prospect.company?.name ?? '').toLowerCase();
      return fullName.includes(normalized) || email.includes(normalized) || phone.includes(normalized) || company.includes(normalized);
    });
  }, [prospects, searchTerm]);

  const filteredStatusCounts = useMemo(() => {
    const totals: Record<ProspectStatusKey, number> = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, LOST: 0 };
    filteredProspects.forEach(prospect => {
      const statusKey = prospect.status;
      if (isProspectStatusKey(statusKey)) {
        totals[statusKey] += 1;
      }
    });
    return totals;
  }, [filteredProspects]);

  const statusFilteredProspects = useMemo(() => {
    if (statusFilter === 'ALL') {
      return filteredProspects;
    }
    return filteredProspects.filter(prospect => prospect.status === statusFilter);
  }, [filteredProspects, statusFilter]);

  const metrics = useMemo(() => {
    const totals: Record<ProspectStatusKey, number> = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, LOST: 0 };
    const lastWeek = dayjs().subtract(7, 'day');
    let newThisWeek = 0;

    prospects.forEach(prospect => {
      const statusKey = prospect.status;
      if (isProspectStatusKey(statusKey)) {
        totals[statusKey] += 1;
      }
      if (prospect.createdAt && dayjs(prospect.createdAt).isAfter(lastWeek)) {
        newThisWeek += 1;
      }
    });

    const total = prospects.length;
    const lost = totals.LOST ?? 0;
    const active = Math.max(total - lost, 0);
    const conversionRate = total ? Math.round(((totals.QUALIFIED ?? 0) / total) * 100) : 0;
    const activeShare = total ? Math.round((active / total) * 100) : 0;

    return { totals, newThisWeek, active, lost, conversionRate, activeShare };
  }, [prospects]);

  const totalProspectCount = totalItems && totalItems > 0 ? totalItems : prospects.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / paginationState.itemsPerPage) : 0;

  const handlePagination = (current: number) => {
    setPaginationState(prev => ({ ...prev, activePage: current }));
  };

  const renderStatusBadge = (status?: ProspectStatusKey | null) => {
    if (!status) {
      return <StatusBadge status="pending" label="Unassigned" />;
    }

    const meta = STATUS_META[status];
    const variant = STATUS_BADGE_VARIANT[status] ?? 'pending';
    return <StatusBadge status={variant} label={meta.label} />;
  };

  useEffect(() => {
    const endURL = `?page=${paginationState.activePage}&size=${paginationState.itemsPerPage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  }, [
    paginationState.activePage,
    paginationState.itemsPerPage,
    paginationState.order,
    paginationState.sort,
    navigate,
    pageLocation.pathname,
    pageLocation.search,
  ]);

  return (
    <div className="prospect-page">
      <Card className="prospect-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <StatusBadge status="pipeline" label="Pipeline" className="prospect-hero__badge mb-3" />
              <h2 className="prospect-hero__title mb-2">Prospect workspace</h2>
              <p className="text-muted mb-3">
                Monitor the quality of your funnel, keep conversations warm, and convert leads without leaving the dashboard.
              </p>
              <div className="d-flex flex-wrap gap-4">
                <div className="prospect-hero__stat">
                  <span className="prospect-hero__stat-label">Prospects tracked</span>
                  <span className="prospect-hero__stat-value">{totalProspectCount}</span>
                </div>
                <div className="prospect-hero__stat">
                  <span className="prospect-hero__stat-label">Active pipeline</span>
                  <span className="prospect-hero__stat-value text-primary">{metrics.active}</span>
                </div>
                <div className="prospect-hero__stat">
                  <span className="prospect-hero__stat-label">New this week</span>
                  <span className="prospect-hero__stat-value text-success">{metrics.newThisWeek}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button outline color="secondary" className="prospect-hero__secondary">
                <FontAwesomeIcon icon={faLayerGroup} className="me-2" /> Save segment
              </Button>
              <Button color="primary" tag={Link} to="/dashboard/contact/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> New prospect
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Row className="g-3 prospect-metric-row mb-4">
        <Col md="6" lg="3">
          <Card className="prospect-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="prospect-metric__label">Conversion rate</span>
                <FontAwesomeIcon icon={faChartLine} className="text-success" />
              </div>
              <h3 className="prospect-metric__value">{metrics.conversionRate}%</h3>
              <Progress value={metrics.conversionRate} color="success" className="prospect-metric__progress" />
              <small className="text-muted">Qualified prospects / total on this page</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="prospect-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="prospect-metric__label">Active prospects</span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
              </div>
              <h3 className="prospect-metric__value">{metrics.active}</h3>
              <Progress value={metrics.activeShare} color="primary" className="prospect-metric__progress" />
              <small className="text-muted">{metrics.activeShare}% of prospects are in play</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="prospect-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="prospect-metric__label">New this week</span>
                <FontAwesomeIcon icon={faGlobe} className="text-info" />
              </div>
              <h3 className="prospect-metric__value">{metrics.newThisWeek}</h3>
              <small className="text-muted">Created in the last 7 days</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="prospect-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="prospect-metric__label">Lost prospects</span>
                <FontAwesomeIcon icon={faTrash} className="text-danger" />
              </div>
              <h3 className="prospect-metric__value">{metrics.lost}</h3>
              <small className="text-muted">Keep an eye on hand-offs</small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card className="prospect-toolbar shadow-sm border-0 mb-4">
        <CardBody>
          <Row className="g-3 align-items-center">
            <Col lg="5">
              <InputGroup className="prospect-toolbar__search">
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Search name, email, company..."
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="7" className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-3">
              <ButtonGroup className="prospect-toolbar__chips flex-wrap">
                {QUICK_FILTERS.map(option => {
                  const isActive = statusFilter === option;

                  if (option === 'ALL') {
                    const count = filteredProspects.length;
                    return (
                      <Button
                        key={option}
                        color={isActive ? 'primary' : 'light'}
                        className={`prospect-toolbar__chip ${isActive ? 'active' : ''}`}
                        onClick={() => setStatusFilter(option)}
                      >
                        {`All (${count})`}
                      </Button>
                    );
                  }

                  const count = filteredStatusCounts[option] ?? 0;
                  const statusMeta = STATUS_META[option];
                  return (
                    <Button
                      key={option}
                      color={isActive ? 'primary' : 'light'}
                      className={`prospect-toolbar__chip ${isActive ? 'active' : ''}`}
                      onClick={() => setStatusFilter(option)}
                    >
                      {`${statusMeta.label} (${count})`}
                    </Button>
                  );
                })}
              </ButtonGroup>
              <div className="d-flex flex-wrap gap-2">
                <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(prev => !prev)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" /> Advanced filters
                </Button>
              </div>
            </Col>
          </Row>
          <Collapse isOpen={showAdvancedFilters} className="prospect-advanced mt-4">
            {hasUnsupportedConditions ? (
              <Alert color="warning" fade={false} className="mb-3">
                <strong>Heads up:</strong> mixed OR conditions are not fully supported by the current API. Filters are applied as AND
                clauses.
              </Alert>
            ) : null}
            <AdvancedFilterBuilder isSearching={loading} onSearch={handleAdvancedSearch} onReset={handleAdvancedReset} />
          </Collapse>
        </CardBody>
      </Card>

      <Card className="prospect-table-card shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">Prospect pipeline</h5>
            <span className="text-muted small">
              Showing {statusFilteredProspects.length} of {filteredProspects.length} filtered prospects
            </span>
          </div>
          <span className="text-muted small">
            Sorted by {paginationState.sort} ({paginationState.order})
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('firstName')} className="sortable">
                    Prospect {renderSortIcon('firstName')}
                  </th>
                  <th role="button" onClick={() => handleSort('company')} className="sortable">
                    Company {renderSortIcon('company')}
                  </th>
                  <th role="button" onClick={() => handleSort('status')} className="sortable">
                    Status {renderSortIcon('status')}
                  </th>
                  <th>Owner</th>
                  <th role="button" onClick={() => handleSort('createdAt')} className="sortable">
                    Created {renderSortIcon('createdAt')}
                  </th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && statusFilteredProspects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" /> Loading prospects...
                    </td>
                  </tr>
                ) : statusFilteredProspects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faLayerGroup} className="me-2" /> No prospects match the current filters.
                    </td>
                  </tr>
                ) : (
                  statusFilteredProspects.map((prospect, index) => {
                    const rowId = prospect.id ? prospect.id.toString() : `row-${index}`;
                    const fullName = [prospect.firstName, prospect.lastName].filter(Boolean).join(' ').trim() || 'Unnamed prospect';
                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {renderAvatar(prospect.firstName ?? '', prospect.lastName ?? '')}
                            <div>
                              <div className="fw-semibold text-capitalize">{fullName}</div>
                              <div className="text-muted small">{prospect.email ?? 'No email on file'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{prospect.company?.name ?? '--'}</span>
                            {prospect.city ? <small className="text-muted">{prospect.city}</small> : null}
                          </div>
                        </td>
                        <td>{renderStatusBadge(isProspectStatusKey(prospect.status) ? prospect.status : undefined)}</td>
                        <td>{prospect.convertedBy?.fullName ?? <span className="text-muted">Unassigned</span>}</td>
                        <td>{prospect.createdAt ? dayjs(prospect.createdAt).format('DD MMM YYYY') : '--'}</td>
                        <td className="text-end pe-4">
                          {prospect.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/prospect/${prospect.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" /> View
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/prospect/${prospect.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(prospect)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">Pending sync</span>
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
        <CardFooter className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <JhiItemCount page={paginationState.activePage} total={totalItems ?? 0} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <span className="text-muted small me-2">Par page</span>
              <Input
                type="select"
                bsSize="sm"
                value={paginationState.itemsPerPage}
                onChange={event =>
                  setPaginationState(prev => ({
                    ...prev,
                    itemsPerPage: Number(event.target.value),
                    activePage: 1,
                  }))
                }
                style={{ width: '96px' }}
              >
                {[10, 20, 50, 100].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Input>
            </div>
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems ?? 0}
            />
          </div>
        </CardFooter>
      </Card>
      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>Confirm delete operation</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the prospect <strong>{getProspectLabel(prospectToDelete)}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProspectListPage;
