import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './societe-liee.reducer';

export const SocieteLiee = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const societeLieeList = useAppSelector(state => state.societeLiee.entities);
  const loading = useAppSelector(state => state.societeLiee.loading);

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
      <h2 id="societe-liee-heading" data-cy="SocieteLieeHeading">
        <Translate contentKey="crmApp.societeLiee.home.title">Societe Liees</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.societeLiee.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/societe-liee/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.societeLiee.home.createLabel">Create new Societe Liee</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {societeLieeList && societeLieeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.societeLiee.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('raisonSociale')}>
                  <Translate contentKey="crmApp.societeLiee.raisonSociale">Raison Sociale</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('raisonSociale')} />
                </th>
                <th className="hand" onClick={sort('formeJuridique')}>
                  <Translate contentKey="crmApp.societeLiee.formeJuridique">Forme Juridique</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('formeJuridique')} />
                </th>
                <th className="hand" onClick={sort('ice')}>
                  <Translate contentKey="crmApp.societeLiee.ice">Ice</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('ice')} />
                </th>
                <th className="hand" onClick={sort('rc')}>
                  <Translate contentKey="crmApp.societeLiee.rc">Rc</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('rc')} />
                </th>
                <th className="hand" onClick={sort('nif')}>
                  <Translate contentKey="crmApp.societeLiee.nif">Nif</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('nif')} />
                </th>
                <th className="hand" onClick={sort('secteurActivite')}>
                  <Translate contentKey="crmApp.societeLiee.secteurActivite">Secteur Activite</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('secteurActivite')} />
                </th>
                <th className="hand" onClick={sort('tailleEntreprise')}>
                  <Translate contentKey="crmApp.societeLiee.tailleEntreprise">Taille Entreprise</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('tailleEntreprise')} />
                </th>
                <th className="hand" onClick={sort('adresseSiege')}>
                  <Translate contentKey="crmApp.societeLiee.adresseSiege">Adresse Siege</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('adresseSiege')} />
                </th>
                <th className="hand" onClick={sort('representantLegal')}>
                  <Translate contentKey="crmApp.societeLiee.representantLegal">Representant Legal</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('representantLegal')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.societeLiee.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {societeLieeList.map((societeLiee, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/societe-liee/${societeLiee.id}`} color="link" size="sm">
                      {societeLiee.id}
                    </Button>
                  </td>
                  <td>{societeLiee.raisonSociale}</td>
                  <td>{societeLiee.formeJuridique}</td>
                  <td>{societeLiee.ice}</td>
                  <td>{societeLiee.rc}</td>
                  <td>{societeLiee.nif}</td>
                  <td>{societeLiee.secteurActivite}</td>
                  <td>{societeLiee.tailleEntreprise}</td>
                  <td>{societeLiee.adresseSiege}</td>
                  <td>{societeLiee.representantLegal}</td>
                  <td>{societeLiee.client ? <Link to={`/client/${societeLiee.client.id}`}>{societeLiee.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/societe-liee/${societeLiee.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`/societe-liee/${societeLiee.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() => (window.location.href = `/societe-liee/${societeLiee.id}/delete`)}
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
              <Translate contentKey="crmApp.societeLiee.home.notFound">No Societe Liees found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SocieteLiee;
