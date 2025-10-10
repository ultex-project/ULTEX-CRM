import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './kyc-client.reducer';

export const KycClient = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const kycClientList = useAppSelector(state => state.kycClient.entities);
  const loading = useAppSelector(state => state.kycClient.loading);

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
      <h2 id="kyc-client-heading" data-cy="KycClientHeading">
        <Translate contentKey="crmApp.kycClient.home.title">Kyc Clients</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.kycClient.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/kyc-client/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.kycClient.home.createLabel">Create new Kyc Client</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {kycClientList && kycClientList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.kycClient.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('scoreStaff')}>
                  <Translate contentKey="crmApp.kycClient.scoreStaff">Score Staff</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('scoreStaff')} />
                </th>
                <th className="hand" onClick={sort('comportements')}>
                  <Translate contentKey="crmApp.kycClient.comportements">Comportements</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('comportements')} />
                </th>
                <th className="hand" onClick={sort('remarques')}>
                  <Translate contentKey="crmApp.kycClient.remarques">Remarques</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarques')} />
                </th>
                <th className="hand" onClick={sort('completudeKyc')}>
                  <Translate contentKey="crmApp.kycClient.completudeKyc">Completude Kyc</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('completudeKyc')} />
                </th>
                <th className="hand" onClick={sort('responsable')}>
                  <Translate contentKey="crmApp.kycClient.responsable">Responsable</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('responsable')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.kycClient.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kycClientList.map((kycClient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/kyc-client/${kycClient.id}`} color="link" size="sm">
                      {kycClient.id}
                    </Button>
                  </td>
                  <td>{kycClient.scoreStaff}</td>
                  <td>{kycClient.comportements}</td>
                  <td>{kycClient.remarques}</td>
                  <td>{kycClient.completudeKyc}</td>
                  <td>{kycClient.responsable}</td>
                  <td>{kycClient.client ? <Link to={`/client/${kycClient.client.id}`}>{kycClient.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/kyc-client/${kycClient.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/kyc-client/${kycClient.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/kyc-client/${kycClient.id}/delete`)}
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
              <Translate contentKey="crmApp.kycClient.home.notFound">No Kyc Clients found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default KycClient;
