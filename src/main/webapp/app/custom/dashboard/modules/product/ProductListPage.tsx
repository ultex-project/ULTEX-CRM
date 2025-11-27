// src/main/webapp/app/entities/produit-demande/ProductListPage.tsx

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
import { Translate, translate, JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IProduitDemande } from 'app/shared/model/produit-demande.model';
import { TypeProduit } from 'app/shared/model/enumerations/type-produit.model';
import { deleteEntity, getEntities, reset } from 'app/entities/produit-demande/produit-demande.reducer';
import { buildQueryStringFromAdvancedFilters } from 'app/custom/dashboard/filters/advanced-filter-query';
import { AdvancedFilterPayload, FieldOption } from '../advanced-filter.types';
import AdvancedFilterBuilder from '../contact/AdvancedFilterBuilder';
import StatusBadge, { StatusBadgeVariant } from 'app/custom/dashboard/components/status-badge/StatusBadge';
import ClientAvatar from '../client/components/ClientAvatar';

import './ProductListPage.scss';

type ProductTypeKey = keyof typeof TypeProduit;
type TypeFilterOption = 'ALL' | ProductTypeKey;

const PRODUCT_TYPE_META: Record<ProductTypeKey, { labelKey: string; variant: StatusBadgeVariant }> = {
  VEHICULE: { labelKey: 'crmApp.TypeProduit.VEHICULE', variant: 'active' },
  MACHINE: { labelKey: 'crmApp.TypeProduit.MACHINE', variant: 'pipeline' },
  PRODUIT_FINAL: { labelKey: 'crmApp.TypeProduit.PRODUIT_FINAL', variant: 'completed' },
  MATIERE_PREMIERE: { labelKey: 'crmApp.TypeProduit.MATIERE_PREMIERE', variant: 'pending' },
  AUTRE: { labelKey: 'crmApp.TypeProduit.AUTRE', variant: 'failed' },
};

const QUICK_FILTERS: TypeFilterOption[] = ['ALL', 'VEHICULE', 'MACHINE', 'PRODUIT_FINAL', 'MATIERE_PREMIERE', 'AUTRE'];

const SORT_LABELS: Record<string, string> = {
  nomProduit: 'crmApp.produitDemande.nomProduit',
  typeProduit: 'crmApp.produitDemande.typeProduit',
  prix: 'crmApp.produitDemande.prix',
  quantite: 'crmApp.produitDemande.quantite',
};

const isProductTypeKey = (value: unknown): value is ProductTypeKey => {
  if (typeof value !== 'string') {
    return false;
  }
  return (Object.keys(TypeProduit) as Array<ProductTypeKey>).includes(value as ProductTypeKey);
};

const resolveProductType = (product: IProduitDemande): ProductTypeKey | null => {
  const raw = product.typeProduit as unknown;
  if (!raw) return null;

  const candidate = typeof raw === 'string' ? raw : typeof raw === 'number' ? raw.toString() : '';

  if (!isProductTypeKey(candidate)) return null;
  return candidate;
};

const getProductLabel = (product?: IProduitDemande | null) => {
  if (!product) {
    return translate('crmApp.produitDemande.dashboard.modal.unknown');
  }

  if (product.nomProduit) {
    return product.nomProduit;
  }

  if (product.hsCode) {
    return product.hsCode;
  }

  if (product.id) {
    return `#${product.id}`;
  }

  return translate('crmApp.produitDemande.dashboard.modal.unknown');
};

const ProductListPage = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();
  const currentLocale = useAppSelector(state => state.locale?.currentLocale);
  const products = useAppSelector(state => state.produitDemande.entities);
  const loading = useAppSelector(state => state.produitDemande.loading);
  const totalItems = useAppSelector(state => state.produitDemande.totalItems);
  const deleting = useAppSelector(state => state.produitDemande.updating);

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>('ALL');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasUnsupportedConditions, setHasUnsupportedConditions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduitDemande | null>(null);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ProductListPage] Fetching with query:', currentQuery || '(none)');
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

  const openDeleteModal = (product: IProduitDemande) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(productToDelete.id)).unwrap();
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
      // keep modal open for manual retry or cancel
    }
  };

  const handleAdvancedSearch = (payload: AdvancedFilterPayload) => {
    const { query, hasOrCondition } = buildQueryStringFromAdvancedFilters(payload);

    setHasUnsupportedConditions(hasOrCondition);

    const nextPage = 0;
    setPaginationState(prev => ({ ...prev, activePage: nextPage + 1 }));

    // eslint-disable-next-line no-console
    console.log('[ProductListPage] Applying advanced filter query:', query || '(none)');

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
    console.log('[ProductListPage] Resetting advanced filters');
    setCurrentQuery('');
  };

  const filterFields = useMemo<FieldOption[]>(() => {
    const locale = currentLocale;
    void locale;

    const typeOptions = Object.keys(TypeProduit).map(key => ({
      value: key,
      label: translate(`crmApp.TypeProduit.${key}`),
    }));

    return [
      {
        value: 'typeProduit',
        label: translate('crmApp.produitDemande.typeProduit'),
        type: 'select',
        options: typeOptions,
      },
      { value: 'nomProduit', label: translate('crmApp.produitDemande.nomProduit'), type: 'text' },
      { value: 'description', label: translate('crmApp.produitDemande.description'), type: 'text' },
      { value: 'quantite', label: translate('crmApp.produitDemande.quantite'), type: 'text' },
      { value: 'unite', label: translate('crmApp.produitDemande.unite'), type: 'text' },
      { value: 'prix', label: translate('crmApp.produitDemande.prix'), type: 'text' },
      { value: 'poidsKg', label: translate('crmApp.produitDemande.poidsKg'), type: 'text' },
      { value: 'volumeTotalCbm', label: translate('crmApp.produitDemande.volumeTotalCbm'), type: 'text' },
      { value: 'dimensions', label: translate('crmApp.produitDemande.dimensions'), type: 'text' },
      { value: 'hsCode', label: translate('crmApp.produitDemande.hsCode'), type: 'text' },
      { value: 'prixCible', label: translate('crmApp.produitDemande.prixCible'), type: 'text' },
      { value: 'fraisExpedition', label: translate('crmApp.produitDemande.fraisExpedition'), type: 'text' },
      { value: 'origine', label: translate('crmApp.produitDemande.origine'), type: 'text' },
      { value: 'fournisseur', label: translate('crmApp.produitDemande.fournisseur'), type: 'text' },
      { value: 'adresseChargement', label: translate('crmApp.produitDemande.adresseChargement'), type: 'text' },
      { value: 'adresseDechargement', label: translate('crmApp.produitDemande.adresseDechargement'), type: 'text' },
      { value: 'ficheTechniqueUrl', label: translate('crmApp.produitDemande.ficheTechniqueUrl'), type: 'text' },
      { value: 'photosUrl', label: translate('crmApp.produitDemande.photosUrl'), type: 'text' },
      { value: 'piecesJointesUrl', label: translate('crmApp.produitDemande.piecesJointesUrl'), type: 'text' },
      { value: 'demandeId', label: translate('crmApp.produitDemande.demande'), type: 'text' },
    ];
  }, [currentLocale]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return products.filter(product => {
      const fields = [
        product.nomProduit,
        product.description,
        product.hsCode,
        product.origine,
        product.fournisseur,
        product.demande?.reference,
      ]
        .filter(Boolean)
        .map(value => value!.toString().toLowerCase());

      return fields.some(field => field.includes(normalized));
    });
  }, [products, searchTerm]);

  const filteredTypeCounts = useMemo(() => {
    const totals: Record<ProductTypeKey, number> = {
      VEHICULE: 0,
      MACHINE: 0,
      PRODUIT_FINAL: 0,
      MATIERE_PREMIERE: 0,
      AUTRE: 0,
    };

    filteredProducts.forEach(product => {
      const typeKey = resolveProductType(product);
      if (typeKey) {
        totals[typeKey] += 1;
      }
    });

    return totals;
  }, [filteredProducts]);

  const typeFilteredProducts = useMemo(() => {
    if (typeFilter === 'ALL') {
      return filteredProducts;
    }

    return filteredProducts.filter(product => resolveProductType(product) === typeFilter);
  }, [filteredProducts, typeFilter]);

  const metrics = useMemo(() => {
    const totals: Record<ProductTypeKey, number> = {
      VEHICULE: 0,
      MACHINE: 0,
      PRODUIT_FINAL: 0,
      MATIERE_PREMIERE: 0,
      AUTRE: 0,
    };

    let pricedCount = 0;
    let totalPrice = 0;
    let totalQuantity = 0;
    let totalWeight = 0;
    let totalVolume = 0;

    products.forEach(product => {
      const typeKey = resolveProductType(product);
      if (typeKey) {
        totals[typeKey] += 1;
      }

      if (product.prix !== undefined && product.prix !== null) {
        pricedCount += 1;
        totalPrice += Number(product.prix);
      }

      if (product.quantite !== undefined && product.quantite !== null) {
        totalQuantity += Number(product.quantite);
      }

      if (product.poidsKg !== undefined && product.poidsKg !== null) {
        totalWeight += Number(product.poidsKg);
      }

      if (product.volumeTotalCbm !== undefined && product.volumeTotalCbm !== null) {
        totalVolume += Number(product.volumeTotalCbm);
      }
    });

    const total = products.length;
    const dominantTypeTotal = Math.max(...Object.values(totals));
    const dominantTypeShare = total ? Math.round((dominantTypeTotal / total) * 100) : 0;
    const pricedShare = total ? Math.round((pricedCount / total) * 100) : 0;
    const averagePrice = pricedCount ? totalPrice / pricedCount : 0;

    return { totals, pricedCount, averagePrice, totalQuantity, totalWeight, totalVolume, dominantTypeShare, pricedShare };
  }, [products]);

  const totalProductCount = totalItems && totalItems > 0 ? totalItems : products.length;

  const handlePagination = (current: number) => {
    setPaginationState(prev => ({ ...prev, activePage: current }));
  };

  const renderTypeBadge = (type?: ProductTypeKey | null) => {
    if (!type) {
      return <StatusBadge status="pending" label={translate('crmApp.produitDemande.dashboard.type.unassigned')} />;
    }

    const meta = PRODUCT_TYPE_META[type];
    return <StatusBadge status={meta.variant} label={translate(meta.labelKey)} />;
  };

  const sortProperty = paginationState.sort;
  const sortDirection = paginationState.order;
  const sortLabel = translate(SORT_LABELS[sortProperty] ?? sortProperty);
  const sortDirectionLabel = translate(`crmApp.produitDemande.dashboard.direction.${sortDirection}`);

  return (
    <div className="product-page">
      <Card className="product-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <StatusBadge
                status="active"
                label={translate('crmApp.produitDemande.dashboard.status.badge')}
                className="product-hero__badge mb-3"
              />
              <h2 className="product-hero__title mb-2">
                <Translate contentKey="crmApp.produitDemande.dashboard.hero.title" />
              </h2>
              <p className="text-muted mb-3">
                <Translate contentKey="crmApp.produitDemande.dashboard.hero.subtitle" />
              </p>
              <div className="d-flex flex-wrap gap-4">
                <div className="product-hero__stat">
                  <span className="product-hero__stat-label">
                    <Translate contentKey="crmApp.produitDemande.dashboard.hero.stats.total" />
                  </span>
                  <span className="product-hero__stat-value">{totalProductCount}</span>
                </div>
                <div className="product-hero__stat">
                  <span className="product-hero__stat-label">
                    <Translate contentKey="crmApp.produitDemande.dashboard.hero.stats.priced" />
                  </span>
                  <span className="product-hero__stat-value text-primary">{metrics.pricedCount}</span>
                </div>
                <div className="product-hero__stat">
                  <span className="product-hero__stat-label">
                    <Translate contentKey="crmApp.produitDemande.dashboard.hero.stats.quantity" />
                  </span>
                  <span className="product-hero__stat-value text-success">{Math.round(metrics.totalQuantity)}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button outline color="secondary" className="product-hero__secondary">
                <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                <Translate contentKey="crmApp.produitDemande.dashboard.buttons.saveSegment" />
              </Button>
              <Button color="primary" tag={Link} to="/dashboard/products/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                <Translate contentKey="crmApp.produitDemande.dashboard.buttons.newProduct" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Row className="g-3 product-metric-row mb-4">
        <Col md="6" lg="3">
          <Card className="product-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="product-metric__label">
                  <Translate contentKey="crmApp.produitDemande.dashboard.metrics.typeShare" />
                </span>
                <FontAwesomeIcon icon={faChartLine} className="text-success" />
              </div>
              <h3 className="product-metric__value">{metrics.dominantTypeShare}%</h3>
              <Progress value={metrics.dominantTypeShare} color="success" className="product-metric__progress" />
              <small className="text-muted">
                <Translate
                  contentKey="crmApp.produitDemande.dashboard.metrics.typeShareHint"
                  interpolate={{ value: metrics.dominantTypeShare }}
                />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="product-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="product-metric__label">
                  <Translate contentKey="crmApp.produitDemande.dashboard.metrics.priced" />
                </span>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
              </div>
              <h3 className="product-metric__value">{metrics.pricedCount}</h3>
              <Progress value={metrics.pricedShare} color="primary" className="product-metric__progress" />
              <small className="text-muted">
                <Translate contentKey="crmApp.produitDemande.dashboard.metrics.pricedHint" interpolate={{ value: metrics.pricedShare }} />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="product-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="product-metric__label">
                  <Translate contentKey="crmApp.produitDemande.dashboard.metrics.averagePrice" />
                </span>
                <FontAwesomeIcon icon={faGlobe} className="text-info" />
              </div>
              <h3 className="product-metric__value">{metrics.averagePrice ? metrics.averagePrice.toFixed(2) : 0}</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.produitDemande.dashboard.metrics.averagePriceHint" />
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col md="6" lg="3">
          <Card className="product-metric h-100 border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="product-metric__label">
                  <Translate contentKey="crmApp.produitDemande.dashboard.metrics.weight" />
                </span>
                <FontAwesomeIcon icon={faTrash} className="text-danger" />
              </div>
              <h3 className="product-metric__value">{metrics.totalWeight ? metrics.totalWeight.toFixed(2) : 0} kg</h3>
              <small className="text-muted">
                <Translate contentKey="crmApp.produitDemande.dashboard.metrics.weightHint" />
              </small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card className="product-toolbar shadow-sm border-0 mb-4">
        <CardBody>
          <Row className="g-3 align-items-center">
            <Col lg="5">
              <InputGroup className="product-toolbar__search">
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder={translate('crmApp.produitDemande.dashboard.searchPlaceholder')}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="7" className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-3">
              <ButtonGroup className="product-toolbar__chips flex-wrap">
                {QUICK_FILTERS.map(option => {
                  const isActive = typeFilter === option;

                  if (option === 'ALL') {
                    return (
                      <Button
                        key={option}
                        color={isActive ? 'primary' : 'light'}
                        className={`product-toolbar__chip ${isActive ? 'active' : ''}`}
                        onClick={() => setTypeFilter(option)}
                      >
                        <Translate
                          contentKey="crmApp.produitDemande.dashboard.filters.all"
                          interpolate={{ count: filteredProducts.length }}
                        />
                      </Button>
                    );
                  }

                  const count = filteredTypeCounts[option] ?? 0;
                  const typeLabelKey = PRODUCT_TYPE_META[option].labelKey;
                  return (
                    <Button
                      key={option}
                      color={isActive ? 'primary' : 'light'}
                      className={`product-toolbar__chip ${isActive ? 'active' : ''}`}
                      onClick={() => setTypeFilter(option)}
                    >
                      <Translate
                        contentKey={`crmApp.produitDemande.dashboard.filters.${option.toLowerCase()}`}
                        interpolate={{ count, label: translate(typeLabelKey) }}
                      />
                    </Button>
                  );
                })}
              </ButtonGroup>
              <div className="d-flex flex-wrap gap-2">
                <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(prev => !prev)}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  <Translate contentKey="crmApp.produitDemande.dashboard.filters.label" />
                </Button>
              </div>
            </Col>
          </Row>
          <Collapse isOpen={showAdvancedFilters} className="product-advanced mt-4">
            {hasUnsupportedConditions ? (
              <Alert color="warning" fade={false} className="mb-3">
                <Translate contentKey="crmApp.produitDemande.dashboard.filters.unsupported" />
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

      <Card className="product-table-card shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">
              <Translate contentKey="crmApp.produitDemande.dashboard.table.title" />
            </h5>
            <span className="text-muted small">
              <Translate
                contentKey="crmApp.produitDemande.dashboard.table.summary"
                interpolate={{ current: typeFilteredProducts.length, total: filteredProducts.length }}
              />
            </span>
          </div>
          <span className="text-muted small">
            <Translate
              contentKey="crmApp.produitDemande.dashboard.table.sortedBy"
              interpolate={{ field: sortLabel, direction: sortDirectionLabel }}
            />
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('nomProduit')} className="sortable">
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.product" /> {renderSortIcon('nomProduit')}
                  </th>
                  <th role="button" onClick={() => handleSort('typeProduit')} className="sortable">
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.type" /> {renderSortIcon('typeProduit')}
                  </th>
                  <th role="button" onClick={() => handleSort('prix')} className="sortable">
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.price" /> {renderSortIcon('prix')}
                  </th>
                  <th role="button" onClick={() => handleSort('quantite')} className="sortable">
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.quantity" /> {renderSortIcon('quantite')}
                  </th>
                  <th>
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.origin" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.supplier" />
                  </th>
                  <th className="text-end pe-4">
                    <Translate contentKey="crmApp.produitDemande.dashboard.columns.actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && typeFilteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      <Translate contentKey="crmApp.produitDemande.dashboard.table.loading" />
                    </td>
                  </tr>
                ) : typeFilteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                      <Translate contentKey="crmApp.produitDemande.dashboard.table.empty" />
                    </td>
                  </tr>
                ) : (
                  typeFilteredProducts.map((product, index) => {
                    const rowId = product.id ? product.id.toString() : `row-${index}`;
                    const typeKey = resolveProductType(product);
                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ClientAvatar name={product.nomProduit ?? ''} photoUrl={product.photosUrl ?? undefined} size={42} />
                            <div>
                              <div className="fw-semibold text-capitalize">
                                {product.nomProduit ?? translate('crmApp.produitDemande.dashboard.table.unnamed')}
                              </div>
                              <div className="text-muted small">
                                {product.description ?? translate('crmApp.produitDemande.dashboard.table.noDescription')}
                              </div>
                              <div className="text-muted small">
                                {product.hsCode ?? translate('crmApp.produitDemande.dashboard.table.noHsCode')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{renderTypeBadge(typeKey)}</td>
                        <td>{product.prix !== undefined && product.prix !== null ? product.prix : '--'}</td>
                        <td>
                          {product.quantite !== undefined && product.quantite !== null ? product.quantite : '--'} {product.unite ?? ''}
                        </td>
                        <td>{product.origine ?? '--'}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold">{product.fournisseur ?? '--'}</span>
                            {product.demande?.reference ? <small className="text-muted">{product.demande.reference}</small> : null}
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          {product.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/products/${product.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  <Translate contentKey="crmApp.produitDemande.dashboard.actions.view" />
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/products/${product.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  <Translate contentKey="crmApp.produitDemande.dashboard.actions.edit" />
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(product)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  <Translate contentKey="crmApp.produitDemande.dashboard.actions.delete" />
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">
                              <Translate contentKey="crmApp.produitDemande.dashboard.table.pendingSync" />
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
              onSelect={(current: number) => setPaginationState(prev => ({ ...prev, activePage: current }))}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems ?? 0}
            />
          </div>
        </CardFooter>
      </Card>

      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>
          <Translate contentKey="crmApp.produitDemande.dashboard.modal.title" />
        </ModalHeader>
        <ModalBody>
          <Translate contentKey="crmApp.produitDemande.dashboard.modal.messagePrefix" /> <strong>{getProductLabel(productToDelete)}</strong>
          ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal} disabled={deleting}>
            <Translate contentKey="crmApp.produitDemande.dashboard.modal.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="crmApp.produitDemande.dashboard.modal.confirm" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProductListPage;
