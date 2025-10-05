import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { TextFormat, Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './history.reducer';

export const History = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const historyList = useAppSelector(state => state.history.entities);
  const loading = useAppSelector(state => state.history.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = sortState.sort;
    const order = sortState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="history-heading" data-cy="HistoryHeading">
        <Translate contentKey="crmApp.history.home.title">Histories</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.history.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/history/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.history.home.createLabel">Create new History</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {historyList && historyList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.history.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('entityName')}>
                  <Translate contentKey="crmApp.history.entityName">Entity Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('entityName')} />
                </th>
                <th className="hand" onClick={sort('entityId')}>
                  <Translate contentKey="crmApp.history.entityId">Entity Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('entityId')} />
                </th>
                <th className="hand" onClick={sort('action')}>
                  <Translate contentKey="crmApp.history.action">Action</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('action')} />
                </th>
                <th className="hand" onClick={sort('fieldChanged')}>
                  <Translate contentKey="crmApp.history.fieldChanged">Field Changed</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fieldChanged')} />
                </th>
                <th className="hand" onClick={sort('oldValue')}>
                  <Translate contentKey="crmApp.history.oldValue">Old Value</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('oldValue')} />
                </th>
                <th className="hand" onClick={sort('newValue')}>
                  <Translate contentKey="crmApp.history.newValue">New Value</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('newValue')} />
                </th>
                <th className="hand" onClick={sort('performedBy')}>
                  <Translate contentKey="crmApp.history.performedBy">Performed By</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('performedBy')} />
                </th>
                <th className="hand" onClick={sort('performedDate')}>
                  <Translate contentKey="crmApp.history.performedDate">Performed Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('performedDate')} />
                </th>
                <th className="hand" onClick={sort('details')}>
                  <Translate contentKey="crmApp.history.details">Details</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('details')} />
                </th>
                <th className="hand" onClick={sort('ipAddress')}>
                  <Translate contentKey="crmApp.history.ipAddress">Ip Address</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('ipAddress')} />
                </th>
                <th className="hand" onClick={sort('userAgent')}>
                  <Translate contentKey="crmApp.history.userAgent">User Agent</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('userAgent')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {historyList.map((history, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/history/${history.id}`} color="link" size="sm">
                      {history.id}
                    </Button>
                  </td>
                  <td>{history.entityName}</td>
                  <td>{history.entityId}</td>
                  <td>{history.action}</td>
                  <td>{history.fieldChanged}</td>
                  <td>{history.oldValue}</td>
                  <td>{history.newValue}</td>
                  <td>{history.performedBy}</td>
                  <td>
                    {history.performedDate ? <TextFormat type="date" value={history.performedDate} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{history.details}</td>
                  <td>{history.ipAddress}</td>
                  <td>{history.userAgent}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/history/${history.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/history/${history.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/history/${history.id}/delete`)}
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
              <Translate contentKey="crmApp.history.home.notFound">No Histories found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default History;
