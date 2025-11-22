import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './historique-crm.reducer';

export const HistoriqueCRM = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const historiqueCRMList = useAppSelector(state => state.historiqueCRM.entities);
  const loading = useAppSelector(state => state.historiqueCRM.loading);
  const totalItems = useAppSelector(state => state.historiqueCRM.totalItems);

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
      <h2 id="historique-crm-heading" data-cy="HistoriqueCRMHeading">
        <Translate contentKey="crmApp.historiqueCRM.home.title">Historique CRMS</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.historiqueCRM.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/historique-crm/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.historiqueCRM.home.createLabel">Create new Historique CRM</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {historiqueCRMList && historiqueCRMList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.historiqueCRM.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('dateInteraction')}>
                  <Translate contentKey="crmApp.historiqueCRM.dateInteraction">Date Interaction</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateInteraction')} />
                </th>
                <th className="hand" onClick={sort('canal')}>
                  <Translate contentKey="crmApp.historiqueCRM.canal">Canal</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('canal')} />
                </th>
                <th className="hand" onClick={sort('agent')}>
                  <Translate contentKey="crmApp.historiqueCRM.agent">Agent</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('agent')} />
                </th>
                <th className="hand" onClick={sort('resume')}>
                  <Translate contentKey="crmApp.historiqueCRM.resume">Resume</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('resume')} />
                </th>
                <th className="hand" onClick={sort('etat')}>
                  <Translate contentKey="crmApp.historiqueCRM.etat">Etat</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('etat')} />
                </th>
                <th className="hand" onClick={sort('observation')}>
                  <Translate contentKey="crmApp.historiqueCRM.observation">Observation</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('observation')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.historiqueCRM.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {historiqueCRMList.map((historiqueCRM, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/historique-crm/${historiqueCRM.id}`} color="link" size="sm">
                      {historiqueCRM.id}
                    </Button>
                  </td>
                  <td>
                    {historiqueCRM.dateInteraction ? (
                      <TextFormat type="date" value={historiqueCRM.dateInteraction} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{historiqueCRM.canal}</td>
                  <td>{historiqueCRM.agent}</td>
                  <td>{historiqueCRM.resume}</td>
                  <td>{historiqueCRM.etat}</td>
                  <td>{historiqueCRM.observation}</td>
                  <td>{historiqueCRM.client ? <Link to={`/client/${historiqueCRM.client.id}`}>{historiqueCRM.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/historique-crm/${historiqueCRM.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/historique-crm/${historiqueCRM.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/historique-crm/${historiqueCRM.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="crmApp.historiqueCRM.home.notFound">No Historique CRMS found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={historiqueCRMList && historiqueCRMList.length > 0 ? '' : 'd-none'}>
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

export default HistoriqueCRM;
