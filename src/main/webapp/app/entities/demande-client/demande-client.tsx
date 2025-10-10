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

import { getEntities } from './demande-client.reducer';

export const DemandeClient = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const demandeClientList = useAppSelector(state => state.demandeClient.entities);
  const loading = useAppSelector(state => state.demandeClient.loading);

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
      <h2 id="demande-client-heading" data-cy="DemandeClientHeading">
        <Translate contentKey="crmApp.demandeClient.home.title">Demande Clients</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.demandeClient.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/demande-client/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.demandeClient.home.createLabel">Create new Demande Client</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {demandeClientList && demandeClientList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.demandeClient.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('reference')}>
                  <Translate contentKey="crmApp.demandeClient.reference">Reference</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reference')} />
                </th>
                <th className="hand" onClick={sort('dateDemande')}>
                  <Translate contentKey="crmApp.demandeClient.dateDemande">Date Demande</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dateDemande')} />
                </th>
                <th className="hand" onClick={sort('servicePrincipal')}>
                  <Translate contentKey="crmApp.demandeClient.servicePrincipal">Service Principal</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('servicePrincipal')} />
                </th>
                <th className="hand" onClick={sort('sousServices')}>
                  <Translate contentKey="crmApp.demandeClient.sousServices">Sous Services</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sousServices')} />
                </th>
                <th className="hand" onClick={sort('provenance')}>
                  <Translate contentKey="crmApp.demandeClient.provenance">Provenance</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('provenance')} />
                </th>
                <th className="hand" onClick={sort('incoterm')}>
                  <Translate contentKey="crmApp.demandeClient.incoterm">Incoterm</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('incoterm')} />
                </th>
                <th className="hand" onClick={sort('devise')}>
                  <Translate contentKey="crmApp.demandeClient.devise">Devise</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('devise')} />
                </th>
                <th className="hand" onClick={sort('nombreProduits')}>
                  <Translate contentKey="crmApp.demandeClient.nombreProduits">Nombre Produits</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nombreProduits')} />
                </th>
                <th className="hand" onClick={sort('remarqueGenerale')}>
                  <Translate contentKey="crmApp.demandeClient.remarqueGenerale">Remarque Generale</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarqueGenerale')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.demandeClient.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {demandeClientList.map((demandeClient, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/demande-client/${demandeClient.id}`} color="link" size="sm">
                      {demandeClient.id}
                    </Button>
                  </td>
                  <td>{demandeClient.reference}</td>
                  <td>
                    {demandeClient.dateDemande ? (
                      <TextFormat type="date" value={demandeClient.dateDemande} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>{demandeClient.servicePrincipal}</td>
                  <td>{demandeClient.sousServices}</td>
                  <td>{demandeClient.provenance}</td>
                  <td>{demandeClient.incoterm}</td>
                  <td>{demandeClient.devise}</td>
                  <td>{demandeClient.nombreProduits}</td>
                  <td>{demandeClient.remarqueGenerale}</td>
                  <td>{demandeClient.client ? <Link to={`/client/${demandeClient.client.id}`}>{demandeClient.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/demande-client/${demandeClient.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/demande-client/${demandeClient.id}/edit`}
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
                        onClick={() => (window.location.href = `/demande-client/${demandeClient.id}/delete`)}
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
              <Translate contentKey="crmApp.demandeClient.home.notFound">No Demande Clients found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DemandeClient;
