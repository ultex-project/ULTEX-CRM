import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './client.reducer';

export const Client = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const clientList = useAppSelector(state => state.client.entities);
  const loading = useAppSelector(state => state.client.loading);
  const totalItems = useAppSelector(state => state.client.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="client-heading" data-cy="ClientHeading">
        <Translate contentKey="crmApp.client.home.title">Clients</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.client.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/client/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.client.home.createLabel">Create new Client</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {clientList && clientList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.client.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('code')}>
                  <Translate contentKey="crmApp.client.code">Code</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('code')} />
                </th>
                <th className="hand" onClick={sort('nomComplet')}>
                  <Translate contentKey="crmApp.client.nomComplet">Nom Complet</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nomComplet')} />
                </th>
                <th className="hand" onClick={sort('photoUrl')}>
                  <Translate contentKey="crmApp.client.photoUrl">Photo Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('photoUrl')} />
                </th>
                <th className="hand" onClick={sort('dateNaissance')}>
                  <Translate contentKey="crmApp.client.dateNaissance">Date Naissance</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateNaissance')} />
                </th>
                <th className="hand" onClick={sort('lieuNaissance')}>
                  <Translate contentKey="crmApp.client.lieuNaissance">Lieu Naissance</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lieuNaissance')} />
                </th>
                <th className="hand" onClick={sort('nationalite')}>
                  <Translate contentKey="crmApp.client.nationalite">Nationalite</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nationalite')} />
                </th>
                <th className="hand" onClick={sort('genre')}>
                  <Translate contentKey="crmApp.client.genre">Genre</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('genre')} />
                </th>
                <th className="hand" onClick={sort('fonction')}>
                  <Translate contentKey="crmApp.client.fonction">Fonction</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fonction')} />
                </th>
                <th className="hand" onClick={sort('languePreferee')}>
                  <Translate contentKey="crmApp.client.languePreferee">Langue Preferee</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('languePreferee')} />
                </th>
                <th className="hand" onClick={sort('telephonePrincipal')}>
                  <Translate contentKey="crmApp.client.telephonePrincipal">Telephone Principal</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('telephonePrincipal')} />
                </th>
                <th className="hand" onClick={sort('whatsapp')}>
                  <Translate contentKey="crmApp.client.whatsapp">Whatsapp</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('whatsapp')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="crmApp.client.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th className="hand" onClick={sort('adressePersonnelle')}>
                  <Translate contentKey="crmApp.client.adressePersonnelle">Adresse Personnelle</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('adressePersonnelle')} />
                </th>
                <th className="hand" onClick={sort('adressesLivraison')}>
                  <Translate contentKey="crmApp.client.adressesLivraison">Adresses Livraison</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('adressesLivraison')} />
                </th>
                <th className="hand" onClick={sort('reseauxSociaux')}>
                  <Translate contentKey="crmApp.client.reseauxSociaux">Reseaux Sociaux</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reseauxSociaux')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="crmApp.client.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="crmApp.client.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.client.pays">Pays</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="crmApp.client.company">Company</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {clientList.map((client, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/client/${client.id}`} color="link" size="sm">
                      {client.id}
                    </Button>
                  </td>
                  <td>{client.code}</td>
                  <td>{client.nomComplet}</td>
                  <td>{client.photoUrl}</td>
                  <td>
                    {client.dateNaissance ? <TextFormat type="date" value={client.dateNaissance} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{client.lieuNaissance}</td>
                  <td>{client.nationalite}</td>
                  <td>{client.genre}</td>
                  <td>{client.fonction}</td>
                  <td>{client.languePreferee}</td>
                  <td>{client.telephonePrincipal}</td>
                  <td>{client.whatsapp}</td>
                  <td>{client.email}</td>
                  <td>{client.adressePersonnelle}</td>
                  <td>{client.adressesLivraison}</td>
                  <td>{client.reseauxSociaux}</td>
                  <td>{client.createdAt ? <TextFormat type="date" value={client.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{client.updatedAt ? <TextFormat type="date" value={client.updatedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{client.pays ? <Link to={`/pays/${client.pays.id}`}>{client.pays.id}</Link> : ''}</td>
                  <td>{client.company ? <Link to={`/company/${client.company.id}`}>{client.company.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/client/${client.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/client/${client.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/client/${client.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="crmApp.client.home.notFound">No Clients found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={clientList && clientList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Client;
