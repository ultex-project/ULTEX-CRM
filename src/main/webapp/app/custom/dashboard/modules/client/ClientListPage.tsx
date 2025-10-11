// src/main/webapp/app/entities/client/ClientListPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapse,
  Col,
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
import { useAppDispatch, useAppSelector } from 'app/config/store';
import dayjs from 'dayjs';
import './ClientListPage.scss';
import { IClient } from 'app/shared/model/client.model';

import AdvancedFilterBuilder, { AdvancedFilterPayload } from 'app/custom/dashboard/filters/AdvancedFilterBuilder';
import { deleteEntity, getEntities, reset } from 'app/entities/client/client.reducer';

const ClientListPage = () => {
  const dispatch = useAppDispatch();
  const clients: IClient[] = useAppSelector(state => state.client.entities);
  const loading = useAppSelector(state => state.client.loading);
  const totalItems = useAppSelector(state => state.client.totalItems);
  const deleting = useAppSelector(state => state.client.updating);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<IClient | null>(null);

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

  const openDeleteModal = (client: IClient) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleDelete = async () => {
    if (!clientToDelete?.id) return;
    try {
      await dispatch(deleteEntity(clientToDelete.id)).unwrap();
      closeDeleteModal();
      dispatch(getEntities({ page, size, sort, query: currentQuery }));
    } catch {
      /* handled */
    }
  };

  // 🔹 SEARCH BAR FILTER
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const term = searchTerm.trim().toLowerCase();
    return clients.filter(c =>
      [c.nomComplet, c.email, c.telephonePrincipal, c.nationalite, c.languePreferee]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(term)),
    );
  }, [clients, searchTerm]);

  // 🔹 METRICS
  const metrics = useMemo(() => {
    const total = clients.length;
    const newThisWeek = clients.filter(c => c.createdAt && dayjs(c.createdAt).isAfter(dayjs().subtract(7, 'day'))).length;
    const updated = clients.filter(c => c.updatedAt && dayjs(c.updatedAt).isAfter(dayjs().subtract(30, 'day'))).length;
    return { total, newThisWeek, updated };
  }, [clients]);

  // 🔹 ADVANCED FILTER LOGIC
  const handleAdvancedSearch = (payload: AdvancedFilterPayload) => {
    const params: string[] = [];

    // Simple: loop through rules to build ?field.equals=value queries
    const traverse = (group: any) => {
      group.rules.forEach((rule: any) => {
        if (rule.field && rule.value) {
          params.push(`${rule.field}.contains=${encodeURIComponent(rule.value)}`);
        }
      });
    };
    traverse(payload.rootGroup);

    const query = params.join('&');
    setCurrentQuery(query);
  };

  const handleAdvancedReset = () => {
    setCurrentQuery('');
  };

  const totalPages = totalItems > 0 ? Math.ceil(totalItems / size) : 0;

  const goToPage = (index: number) => {
    if (index >= 0 && index !== page) setPage(index);
  };

  return (
    <div className="client-page">
      {/* 🧱 HEADER / METRICS */}
      <Card className="client-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <h2 className="client-hero__title mb-2">Espace Clients</h2>
              <p className="text-muted mb-3">Gérez, recherchez et suivez vos clients directement depuis le tableau de bord.</p>
              <div className="d-flex flex-wrap gap-4">
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Clients totaux</span>
                  <span className="client-hero__stat-value">{metrics.total}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Nouveaux cette semaine</span>
                  <span className="client-hero__stat-value text-success">{metrics.newThisWeek}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Mis à jour récemment</span>
                  <span className="client-hero__stat-value text-info">{metrics.updated}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button color="primary" tag={Link} to="/dashboard/clients/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Nouveau client
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 🔍 SEARCH + FILTER */}
      <Card className="client-toolbar shadow-sm border-0 mb-4">
        <CardBody>
          <Row className="g-3 align-items-center">
            <Col lg="6">
              <InputGroup className="client-toolbar__search">
                <InputGroupText>
                  <FontAwesomeIcon icon={faSearch} className="text-muted" />
                </InputGroupText>
                <Input
                  type="text"
                  placeholder="Rechercher un client (nom, email, téléphone...)"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg="6" className="d-flex justify-content-lg-end">
              <Button outline color={showAdvancedFilters ? 'primary' : 'secondary'} onClick={() => setShowAdvancedFilters(p => !p)}>
                <FontAwesomeIcon icon={faFilter} className="me-2" /> Filtres avancés
              </Button>
            </Col>
          </Row>
          <Collapse isOpen={showAdvancedFilters} className="mt-4">
            <Alert color="info" fade={false} className="mb-3">
              Combinez plusieurs conditions pour cibler précisément vos clients.
            </Alert>
            <AdvancedFilterBuilder
              title="Filtres Clients"
              fields={[
                { value: 'nomComplet', label: 'Nom complet', type: 'text' },
                { value: 'email', label: 'Email', type: 'text' },
                { value: 'telephonePrincipal', label: 'Téléphone', type: 'text' },
                { value: 'nationalite', label: 'Nationalité', type: 'text' },
                {
                  value: 'languePreferee',
                  label: 'Langue préférée',
                  type: 'select',
                  options: [
                    { value: 'FR', label: 'Français' },
                    { value: 'EN', label: 'Anglais' },
                    { value: 'AR', label: 'Arabe' },
                  ],
                },
                { value: 'createdAt', label: 'Date de création', type: 'date' },
              ]}
              isSearching={loading}
              onSearch={handleAdvancedSearch}
              onReset={handleAdvancedReset}
            />
          </Collapse>
        </CardBody>
      </Card>

      {/* 📋 TABLE */}
      <Card className="client-table-card shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">Liste des clients</h5>
            <span className="text-muted small">{filteredClients.length} clients trouvés</span>
          </div>
          <span className="text-muted small">
            Trié par {sort.split(',')[0]} ({sort.endsWith('asc') ? 'asc' : 'desc'})
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('nomComplet')} className="sortable">
                    Nom complet {renderSortIcon('nomComplet')}
                  </th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Nationalité</th>
                  <th>Langue</th>
                  <th role="button" onClick={() => handleSort('createdAt')} className="sortable">
                    Créé le {renderSortIcon('createdAt')}
                  </th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" /> Chargement...
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      Aucun client ne correspond aux filtres actuels.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client, index) => (
                    <tr key={client.id ?? index}>
                      <td className="fw-semibold">{client.nomComplet ?? '—'}</td>
                      <td>{client.email ?? '—'}</td>
                      <td>{client.telephonePrincipal ?? '—'}</td>
                      <td>{client.nationalite ?? '—'}</td>
                      <td>{client.languePreferee ?? '—'}</td>
                      <td>{client.createdAt ? dayjs(client.createdAt).format('DD/MM/YYYY') : '—'}</td>
                      <td className="text-end pe-4">
                        <ButtonGroup size="sm">
                          <Button tag={Link} to={`/dashboard/clients/${client.id}/view`} color="link" className="text-primary">
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button tag={Link} to={`/dashboard/clients/${client.id}/edit`} color="link" className="text-warning">
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button color="link" className="text-danger" onClick={() => openDeleteModal(client)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
        {totalPages > 1 && (
          <CardFooter className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="text-muted small">
              Page {page + 1} sur {totalPages}
            </span>
            <Pagination className="m-0">
              <PaginationItem disabled={page === 0}>
                <PaginationLink previous onClick={() => goToPage(page - 1)} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx} active={idx === page}>
                  <PaginationLink onClick={() => goToPage(idx)}>{idx + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={page >= totalPages - 1}>
                <PaginationLink next onClick={() => goToPage(page + 1)} />
              </PaginationItem>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* 🗑️ DELETE MODAL */}
      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal} centered>
        <ModalHeader toggle={closeDeleteModal}>Confirmation</ModalHeader>
        <ModalBody>Voulez-vous vraiment supprimer ce client&nbsp;?</ModalBody>
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

export default ClientListPage;
