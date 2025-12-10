import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEllipsisV, faEye, faPlus, faSort, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { JhiItemCount, JhiPagination, Translate, getPaginationState, translate } from 'react-jhipster';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity, getEntities, reset } from 'app/entities/contact-associe/contact-associe.reducer';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';

import './ContactAssocieListPage.scss';

const ContactAssocieListPage = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const contactAssocies = useAppSelector(state => state.contactAssocie.entities);
  const loading = useAppSelector(state => state.contactAssocie.loading);
  const totalItems = useAppSelector(state => state.contactAssocie.totalItems);
  const deleting = useAppSelector(state => state.contactAssocie.updating);

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContactAssocie | null>(null);

  useEffect(() => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  }, [dispatch, paginationState.activePage, paginationState.itemsPerPage, paginationState.order, paginationState.sort]);

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

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

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
  ]);

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

  const handlePagination = (current: number) => {
    setPaginationState(prev => ({ ...prev, activePage: current }));
  };

  const toggleDropdown = (id: string) => {
    setDropdownOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openDeleteModal = (contact: IContactAssocie) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedContact(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedContact?.id) {
      return;
    }

    try {
      await dispatch(deleteEntity(selectedContact.id)).unwrap();
      closeDeleteModal();
      dispatch(
        getEntities({
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
          sort: `${paginationState.sort},${paginationState.order}`,
        }),
      );
    } catch (error) {
      // keep modal open
    }
  };

  const renderValue = (value?: string | null) => (value && value.trim() !== '' ? value : '--');

  return (
    <div className="contact-associe-page">
      <Card className="shadow-sm border-0 mb-4">
        <CardBody className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <h2 className="mb-1">
              <Translate contentKey="crmApp.contactAssocie.home.title" />
            </h2>
            <p className="text-muted mb-0">
              <Translate contentKey="crmApp.contactAssocie.dashboard.subtitle" />
            </p>
          </div>
          <Button color="primary" tag={Link} to="/dashboard/contact-associe/new" className="mt-3 mt-md-0 shadow-sm">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            <Translate contentKey="crmApp.contactAssocie.home.createLabel" />
          </Button>
        </CardBody>
      </Card>

      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h5 className="mb-0">
            <Translate contentKey="crmApp.contactAssocie.home.title" />
          </h5>
          <span className="text-muted small">
            <Translate
              contentKey="crmApp.client.dashboard.table.sortedBy"
              interpolate={{ field: paginationState.sort, direction: paginationState.order }}
            />
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th role="button" onClick={() => handleSort('nom')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.nom" /> {renderSortIcon('nom')}
                  </th>
                  <th role="button" onClick={() => handleSort('prenom')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.prenom" /> {renderSortIcon('prenom')}
                  </th>
                  <th role="button" onClick={() => handleSort('relation')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.relation" /> {renderSortIcon('relation')}
                  </th>
                  <th role="button" onClick={() => handleSort('telephone')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.telephone" /> {renderSortIcon('telephone')}
                  </th>
                  <th role="button" onClick={() => handleSort('whatsapp')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.whatsapp" /> {renderSortIcon('whatsapp')}
                  </th>
                  <th role="button" onClick={() => handleSort('email')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.email" /> {renderSortIcon('email')}
                  </th>
                  <th role="button" onClick={() => handleSort('autorisation')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.autorisation" /> {renderSortIcon('autorisation')}
                  </th>
                  <th role="button" onClick={() => handleSort('remarques')} className="sortable">
                    <Translate contentKey="crmApp.contactAssocie.remarques" /> {renderSortIcon('remarques')}
                  </th>
                  <th className="text-end pe-4">
                    <Translate contentKey="crmApp.client.dashboard.columns.actions" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && contactAssocies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      <Spinner size="sm" color="primary" className="me-2" />
                      <Translate contentKey="crmApp.client.dashboard.table.loading" />
                    </td>
                  </tr>
                ) : contactAssocies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5 text-muted">
                      <Translate contentKey="crmApp.contactAssocie.home.notFound" />
                    </td>
                  </tr>
                ) : (
                  contactAssocies.map(contact => {
                    const rowId = contact.id ? contact.id.toString() : `row-${contact.nom ?? ''}-${contact.prenom ?? ''}`;
                    return (
                      <tr key={rowId}>
                        <td className="fw-semibold text-capitalize">{renderValue(contact.nom)}</td>
                        <td className="text-capitalize">{renderValue(contact.prenom)}</td>
                        <td>{renderValue(contact.relation)}</td>
                        <td>{renderValue(contact.telephone)}</td>
                        <td>{renderValue(contact.whatsapp)}</td>
                        <td>{renderValue(contact.email)}</td>
                        <td>{renderValue(contact.autorisation)}</td>
                        <td>{renderValue(contact.remarques)}</td>
                        <td className="text-end pe-4">
                          {contact.id ? (
                            <Dropdown isOpen={!!dropdownOpen[rowId]} toggle={() => toggleDropdown(rowId)}>
                              <DropdownToggle color="link" className="p-0 text-muted">
                                <FontAwesomeIcon icon={faEllipsisV} />
                              </DropdownToggle>
                              <DropdownMenu end className="rounded-3 shadow">
                                <DropdownItem tag={Link} to={`/dashboard/contact-associe/${contact.id}/view`}>
                                  <FontAwesomeIcon icon={faEye} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.view" />
                                </DropdownItem>
                                <DropdownItem tag={Link} to={`/dashboard/contact-associe/${contact.id}/edit`}>
                                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.edit" />
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem className="text-danger" onClick={() => openDeleteModal(contact)}>
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  <Translate contentKey="crmApp.client.dashboard.actions.delete" />
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          ) : (
                            <span className="text-muted small">--</span>
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
              <span className="text-muted small me-2">Per page</span>
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

      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>
          <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
        </ModalHeader>
        <ModalBody id="contact-associe-delete-question">
          <Translate contentKey="crmApp.contactAssocie.delete.question" interpolate={{ id: selectedContact?.id }}>
            Are you sure you want to delete this ContactAssocie?
          </Translate>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeDeleteModal}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ContactAssocieListPage;
