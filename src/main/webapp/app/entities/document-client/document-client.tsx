import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './document-client.reducer';

export const DocumentClient = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const documentClientList = useAppSelector(state => state.documentClient.entities);
  const loading = useAppSelector(state => state.documentClient.loading);

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
      <h2 id="document-client-heading" data-cy="DocumentClientHeading">
        <Translate contentKey="crmApp.documentClient.home.title">Document Clients</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.documentClient.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/document-client/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.documentClient.home.createLabel">Create new Document Client</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {documentClientList && documentClientList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.documentClient.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('typeDocument')}>
                  <Translate contentKey="crmApp.documentClient.typeDocument">Type Document</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('typeDocument')} />
                </th>
                <th className="hand" onClick={sort('numeroDocument')}>
                  <Translate contentKey="crmApp.documentClient.numeroDocument">Numero Document</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('numeroDocument')} />
                </th>
                <th className="hand" onClick={sort('fichierUrl')}>
                  <Translate contentKey="crmApp.documentClient.fichierUrl">Fichier Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fichierUrl')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.documentClient.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {documentClientList.map((documentClient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/document-client/${documentClient.id}`} color="link" size="sm">
                      {documentClient.id}
                    </Button>
                  </td>
                  <td>{documentClient.typeDocument}</td>
                  <td>{documentClient.numeroDocument}</td>
                  <td>{documentClient.fichierUrl}</td>
                  <td>{documentClient.client ? <Link to={`/client/${documentClient.client.id}`}>{documentClient.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/document-client/${documentClient.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/document-client/${documentClient.id}/edit`}
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
                        onClick={() => (window.location.href = `/document-client/${documentClient.id}/delete`)}
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
              <Translate contentKey="crmApp.documentClient.home.notFound">No Document Clients found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DocumentClient;
