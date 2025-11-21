// src/main/webapp/app/custom/dashboard/modules/company/CompanyListPage.tsx

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
import { ICompany } from 'app/shared/model/company.model';
import { deleteEntity, getEntities, reset } from 'app/entities/company/company.reducer';
import { buildQueryStringFromAdvancedFilters } from 'app/custom/dashboard/filters/advanced-filter-query';
import { AdvancedFilterPayload, FieldOption } from '../advanced-filter.types';
import AdvancedFilterBuilder from '../contact/AdvancedFilterBuilder';
import StatusBadge from 'app/custom/dashboard/components/status-badge/StatusBadge';
import ClientAvatar from '../client/components/ClientAvatar';

import '../client/ClientListPage.scss';

const SORT_LABELS: Record<string, string> = {
  name: 'crmApp.company.name',
  industry: 'crmApp.company.industry',
  country: 'crmApp.company.country',
  createdAt: 'crmApp.company.createdAt',
};

const getCompanyLabel = (company?: ICompany | null) => {
  if (!company) {
    return translate('crmApp.company.dashboard.modal.unknown');
  }

  if (company.name) {
    return company.name;
  }

  if (company.email) {
    return company.email;
  }

  if (company.id) {
    return `#${company.id}`;
  }

  return translate('crmApp.company.dashboard.modal.unknown');
};

const CompanyListPage = () => {
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(state => state.locale?.currentLocale);
  const companies = useAppSelector(state => state.company.entities);
  const loading = useAppSelector(state => state.company.loading);
  const totalItems = useAppSelector(state => state.company.totalItems);
  const deleting = useAppSelector(state => state.company.updating);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasUnsupportedConditions, setHasUnsupportedConditions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<ICompany | null>(null);
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[CompanyListPage] Fetching with query:', currentQuery || '(none)');
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

  const openDeleteModal = (company: ICompany) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCompanyToDelete(null);
  };

  const handleDelete = async () => {
    if (!companyToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(companyToDelete.id)).unwrap();
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
    console.log('[CompanyListPage] Applying advanced filter query:', query || '(none)');

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
    console.log('[CompanyListPage] Resetting advanced filters');
    setCurrentQuery('');
  };

  const filterFields = useMemo<FieldOption[]>(() => {
    const locale = currentLocale;
    void locale;
    return [
      { value: 'name', label: translate('crmApp.company.name'), type: 'text' },
      { value: 'industry', label: translate('crmApp.company.industry'), type: 'text' },
      { value: 'country', label: translate('crmApp.company.country'), type: 'text' },
      { value: 'address', label: translate('crmApp.company.address'), type: 'text' },
      { value: 'phone', label: translate('crmApp.company.phone'), type: 'text' },
      { value: 'email', label: translate('crmApp.company.email'), type: 'text' },
      { value: 'createdAt', label: translate('crmApp.company.createdAt'), type: 'date' },
      { value: 'updatedAt', label: translate('crmApp.company.updatedAt'), type: 'date' },
    ];
  }, [currentLocale]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) {
      return companies;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return companies.filter(company => {
      const fields = [company.name, company.email, company.industry, company.country]
        .filter(Boolean)
        .map(value => value!.toString().toLowerCase());

      return fields.some(field => field.includes(normalized));
    });
  }, [companies, searchTerm]);

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    companies.forEach(company => {
      const key = company.industry?.trim();
      if (key) {
        counts[key] = (counts[key] ?? 0) + 1;
      }
    });
    return counts;
  }, [companies]);

  const quickFilters = useMemo(() => {
    const sortedIndustries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]);
    const topIndustries = sortedIndustries.slice(0, 3).map(([industry]) => industry);
    return ['ALL', ...topIndustries];
  }, [industryCounts]);

  const industryFilteredCompanies = useMemo(() => {
    if (industryFilter === 'ALL') {
      return filteredCompanies;
    }

    return filteredCompanies.filter(company => company.industry?.toLowerCase() === industryFilter.toLowerCase());
  }, [filteredCompanies, industryFilter]);

  const metrics = useMemo(() => {
    const lastWeek = dayjs().subtract(7, 'day');
    let newThisWeek = 0;
    const countrySet = new Set<string>();
    const industryMap: Record<string, number> = {};

    companies.forEach(company => {
      if (company.createdAt && dayjs(company.createdAt).isAfter(lastWeek)) {
        newThisWeek += 1;
      }

      if (company.country) {
        countrySet.add(company.country);
      }

      const industryKey = company.industry?.trim();
      if (industryKey) {
        industryMap[industryKey] = (industryMap[industryKey] ?? 0) + 1;
      }
    });

    const topIndustryEntry = Object.entries(industryMap).sort((a, b) => b[1] - a[1])[0];
    const topIndustry = topIndustryEntry ? topIndustryEntry[0] : translate('crmApp.company.dashboard.metrics.noIndustry');

    return {
      total: companies.length,
      newThisWeek,
      uniqueCountries: countrySet.size,
      topIndustry,
    };
  }, [companies]);

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
  const sortDirectionLabel = translate(`crmApp.company.dashboard.direction.${sortDirection}`);

  return (
    <div className="client-page">
      <Card className="client-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <StatusBadge status="active" label={translate('crmApp.company.dashboard.status.badge')} className="client-hero__badge mb-3" />
              <h2 className="client-hero__title mb-2">
                <Translate contentKey="crmApp.company.dashboard.hero.title" />
              </h2>
              <p className="text-muted mb-3">
                <Translate contentKey="crmApp.company.dashboard.hero.subtitle" />
              </p>
              <div className="d-flex flex-wrap gap-4">
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.company.dashboard.hero.stats.total" />
                  </span>
                  <span className="client-hero__stat-value">{metrics.total}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.company.dashboard.hero.stats.newThisWeek" />
                  </span>
                  <span className="client-hero__stat-value text-primary">{metrics.newThisWeek}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">
                    <Translate contentKey="crmApp.company.dashboard.hero.stats.countries" />
                  </span>
                  <span className="client-hero__stat-value text-success">{metrics.uniqueCountries}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button outline color="secondary" className="client-hero__secondary">
                <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                <Translate contentKey="crmApp.company.dashboard.buttons.saveSegment" />
              </Button>
              <Button color="primary" tag={Link} to="/dashboard/company/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                <Translate contentKey="crmApp.company.dashboard.buttons.newCompany" />
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
                  <Translate contentKey="crmApp.company.dashboard.metrics.total" />
                </span>
                <FontAwesomeIcon icon={faChartLine} className="text-success" />
              </div>
              <h3 className="client-metric__value">{metrics.total}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.company.dashboard.metrics.totalHint" interpolate={{ value: metrics.total }} />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.company.dashboard.metrics.newThisWeek" />
                </span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
              </div>
              <h3 className="client-metric__value">{metrics.newThisWeek}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.company.dashboard.metrics.newThisWeekHint" />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.company.dashboard.metrics.countries" />
                </span>
                <FontAwesomeIcon icon={faGlobe} className="text-info" />
              </div>
              <h3 className="client-metric__value">{metrics.uniqueCountries}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.company.dashboard.metrics.countriesHint" />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="client-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="client-metric__label">
                  <Translate contentKey="crmApp.company.dashboard.metrics.topIndustry" />
                </span>
                <FontAwesomeIcon icon={faTrash} className="text-danger" />
              </div>
              <h3 className="client-metric__value">{metrics.topIndustry || '--'}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.company.dashboard.metrics.topIndustryHint" />
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
                  placeholder={translate('crmApp.company.dashboard.searchPlaceholder')}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="7" className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-3">
              <ButtonGroup className="client-toolbar__chips flex-wrap">
                {quickFilters.map(option => {
                  const isActive = industryFilter === option;

                  if (option === 'ALL') {
                    return (
                      <Button
                        key={option}
                        color={isActive ? 'primary' : 'light'}
                        className={`client-toolbar__chip ${isActive ? 'active' : ''}`}
                        onClick={() => setIndustryFilter(option)}
                      >
                        <Translate contentKey="crmApp.company.dashboard.filters.all" interpolate={{ count: filteredCompanies.length }} />
                      </Button>
                    );
                  }

                  const count = industryCounts[option] ?? 0;
                  return (
                    <Button
                      key={option}
                      color={isActive ? 'primary' : 'light'}
                      className={`client-toolbar__chip ${isActive ? 'active' : ''}`}
                      onClick={() => setIndustryFilter(option)}
                    >
                      {option} ({count})
                    </Button>
                  );
                })}
              </ButtonGroup>
              <div className="d-flex flex-wrap gap-2">
                <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(prev => !prev)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  <Translate contentKey="crmApp.company.dashboard.filters.label" />
                </Button>
              </div>
            </Col>
          </Row>
          <Collapse isOpen={showAdvancedFilters} className="client-advanced mt-4">
            {hasUnsupportedConditions ? (
              <Alert color="warning" fade={false} className="mb-3">
                <Translate contentKey="crmApp.company.dashboard.filters.unsupported" />
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
              <Translate contentKey="crmApp.company.dashboard.table.title" />
            </h5>
            <span className="text-muted small">
              <Translate
                contentKey="crmApp.company.dashboard.table.summary"
                interpolate={{ current: industryFilteredCompanies.length, total: filteredCompanies.length }}
              />
            </span>
          </div>
          <span className="text-muted small">
            <Translate
              contentKey="crmApp.company.dashboard.table.sortedBy"
              interpolate={{ field: sortLabel, direction: sortDirectionLabel }}
            />
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('name')} className="sortable">
                    <Translate contentKey="crmApp.company.dashboard.columns.name" /> {renderSortIcon('name')}
                  </th>
                  <th role="button" onClick={() => handleSort('industry')} className="sortable">
                    <Translate contentKey="crmApp.company.dashboard.columns.industry" /> {renderSortIcon('industry')}
                  </th>
                  <th role="button" onClick={() => handleSort('country')} className="sortable">
                    <Translate contentKey="crmApp.company.dashboard.columns.country" /> {renderSortIcon('country')}
                  </th>
                  <th>
                    <Translate contentKey="crmApp.company.dashboard.columns.phone" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.company.dashboard.columns.email" />
                  </th>
                  <th role="button" onClick={() => handleSort('createdAt')} className="sortable">
                    <Translate contentKey="crmApp.company.dashboard.columns.created" /> {renderSortIcon('createdAt')}
                  </th>
                  <th className="text-end pe-4">
                    <Translate contentKey="crmApp.company.dashboard.columns.actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && industryFilteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      <Translate contentKey="crmApp.company.dashboard.table.loading" />
                    </td>
                  </tr>
                ) : industryFilteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                      <Translate contentKey="crmApp.company.dashboard.table.empty" />
                    </td>
                  </tr>
                ) : (
                  industryFilteredCompanies.map((company, index) => {
                    const rowId = company.id ? company.id.toString() : `row-${index}`;
                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ClientAvatar name={company.name ?? ''} photoUrl={undefined} size={42} />
                            <div>
                              <div className="fw-semibold text-capitalize">
                                {company.name ?? translate('crmApp.company.dashboard.table.unnamed')}
                              </div>
                              <div className="text-muted small">{company.email ?? translate('crmApp.company.dashboard.table.noEmail')}</div>
                              <div className="text-muted small">{company.phone ?? translate('crmApp.company.dashboard.table.noPhone')}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{company.industry ?? '--'}</span>
                            {company.address ? <small className="text-muted">{company.address}</small> : null}
                          </div>
                        </td>
                        <td>{company.country ?? '--'}</td>
                        <td>{company.phone ?? '--'}</td>
                        <td>{company.email ?? '--'}</td>
                        <td>{company.createdAt ? dayjs(company.createdAt).format('DD MMM YYYY') : '--'}</td>
                        <td className="text-end pe-4">
                          {company.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/companies/${company.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  <Translate contentKey="crmApp.company.dashboard.actions.view" />
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/companies/${company.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  <Translate contentKey="crmApp.company.dashboard.actions.edit" />
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(company)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  <Translate contentKey="crmApp.company.dashboard.actions.delete" />
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">
                              <Translate contentKey="crmApp.company.dashboard.table.pendingSync" />
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
              <Translate contentKey="crmApp.company.dashboard.pagination.page" interpolate={{ page: page + 1, total: totalPages }} />
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
          <Translate contentKey="crmApp.company.dashboard.modal.title" />
        </ModalHeader>
        <ModalBody>
          <Translate contentKey="crmApp.company.dashboard.modal.messagePrefix" /> <strong>{getCompanyLabel(companyToDelete)}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            <Translate contentKey="crmApp.company.dashboard.modal.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="crmApp.company.dashboard.modal.confirm" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CompanyListPage;
