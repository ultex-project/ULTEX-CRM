// src/main/webapp/app/custom/dashboard/modules/societe-liee/SocieteLieeListPage.tsx

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
import { faEdit, faEllipsisV, faEye, faPlus, faSearch, faSort, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';
import { deleteEntity, getEntities, reset } from 'app/entities/societe-liee/societe-liee.reducer';
import ClientAvatar from '../client/components/ClientAvatar';

import '../client/ClientListPage.scss';

const getSocieteLabel = (societe?: ISocieteLiee | null) => {
  if (!societe) {
    return translate('crmApp.societeLiee.dashboard.modal.unknown');
  }

  if (societe.raisonSociale) {
    return societe.raisonSociale;
  }

  if (societe.id) {
    return `#${societe.id}`;
  }

  return translate('crmApp.societeLiee.dashboard.modal.unknown');
};

const SocieteLieeListPage = () => {
  const dispatch = useAppDispatch();
  const societeLiees = useAppSelector(state => state.societeLiee.entities);
  const loading = useAppSelector(state => state.societeLiee.loading);
  const totalItems = useAppSelector(state => state.societeLiee.totalItems);
  const deleting = useAppSelector(state => state.societeLiee.updating);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [sort, setSort] = useState('id,asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [societeToDelete, setSocieteToDelete] = useState<ISocieteLiee | null>(null);

  useEffect(() => {
    dispatch(getEntities({ page, size, sort }));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, page, size, sort]);

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

  const filteredSocietes = useMemo(() => {
    if (!searchTerm.trim()) {
      return societeLiees;
    }

    const normalized = searchTerm.trim().toLowerCase();
    return societeLiees.filter(societe => {
      const fields = [
        societe.raisonSociale,
        societe.formeJuridique,
        societe.secteurActivite,
        societe.tailleEntreprise,
        societe.representantLegal,
        societe.adresseSiege,
      ]
        .filter(Boolean)
        .map(value => value!.toString().toLowerCase());

      return fields.some(field => field.includes(normalized));
    });
  }, [societeLiees, searchTerm]);

  const metrics = useMemo(() => {
    const secteurs = new Set<string>();
    let avecIce = 0;
    let avecRepresentant = 0;

    societeLiees.forEach(item => {
      if (item.secteurActivite) {
        secteurs.add(item.secteurActivite);
      }
      if (item.ice) {
        avecIce += 1;
      }
      if (item.representantLegal) {
        avecRepresentant += 1;
      }
    });

    return {
      total: societeLiees.length,
      secteurs: secteurs.size,
      avecIce,
      avecRepresentant,
    };
  }, [societeLiees]);

  const toggleDropdown = (id: string) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openDeleteModal = (societe: ISocieteLiee) => {
    setSocieteToDelete(societe);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSocieteToDelete(null);
  };

  const handleDelete = async () => {
    if (!societeToDelete?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(societeToDelete.id)).unwrap();
      closeDeleteModal();
      dispatch(getEntities({ page, size, sort }));
    } catch {
      // keep modal open for manual retry or cancel
    }
  };

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

  return (
    <div className="client-page">
      <Card className="client-hero border-0 shadow-sm mb-4">
        <CardBody>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
            <div>
              <h2 className="client-hero__title mb-2">Sociétés liées</h2>
              <p className="text-muted mb-3">Gérez les sociétés liées enregistrées dans le CRM.</p>
              <div className="d-flex flex-wrap gap-4">
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Total</span>
                  <span className="client-hero__stat-value">{metrics.total}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Secteurs distincts</span>
                  <span className="client-hero__stat-value text-primary">{metrics.secteurs}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Avec ICE</span>
                  <span className="client-hero__stat-value text-success">{metrics.avecIce}</span>
                </div>
                <div className="client-hero__stat">
                  <span className="client-hero__stat-label">Représentant identifié</span>
                  <span className="client-hero__stat-value text-info">{metrics.avecRepresentant}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 align-self-md-start align-self-lg-center">
              <Button color="primary" tag={Link} to="/dashboard/societe-liee/new" className="shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Nouvelle société liée
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

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
                  placeholder="Rechercher une société liée"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="client-table-card shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">Liste des sociétés liées</h5>
            <span className="text-muted small">{filteredSocietes.length} éléments</span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('raisonSociale')} className="sortable">
                    Raison sociale {renderSortIcon('raisonSociale')}
                  </th>
                  <th role="button" onClick={() => handleSort('secteurActivite')} className="sortable">
                    Secteur d&apos;activité {renderSortIcon('secteurActivite')}
                  </th>
                  <th>Taille</th>
                  <th>Représentant</th>
                  <th>ICE</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && filteredSocietes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      Chargement des sociétés liées...
                    </td>
                  </tr>
                ) : filteredSocietes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faSearch} className="me-2" />
                      Aucune société liée trouvée
                    </td>
                  </tr>
                ) : (
                  filteredSocietes.map((societe, index) => {
                    const rowId = societe.id ? societe.id.toString() : `row-${index}`;
                    return (
                      <tr key={rowId}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <ClientAvatar name={societe.raisonSociale ?? ''} photoUrl={undefined} size={42} />
                            <div>
                              <div className="fw-semibold text-capitalize">{societe.raisonSociale ?? 'Sans nom'}</div>
                              <div className="text-muted small">{societe.formeJuridique ?? 'Forme juridique non renseignée'}</div>
                              <div className="text-muted small">{societe.adresseSiege ?? 'Adresse non renseignée'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-semibold">{societe.secteurActivite ?? '--'}</div>
                        </td>
                        <td>{societe.tailleEntreprise ?? '--'}</td>
                        <td>{societe.representantLegal ?? '--'}</td>
                        <td>{societe.ice ?? '--'}</td>
                        <td className="text-end pe-4">
                          {societe.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/societe-liee/${societe.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  Voir
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/societe-liee/${societe.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  Modifier
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(societe)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  Supprimer
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">Synchro en cours...</span>
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
              Page {page + 1} / {totalPages}
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
        <ModalHeader toggle={closeDeleteModal}>Supprimer la société liée</ModalHeader>
        <ModalBody>
          Confirmez-vous la suppression de <strong>{getSocieteLabel(societeToDelete)}</strong> ?
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

export default SocieteLieeListPage;
