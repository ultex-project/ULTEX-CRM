import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './contact-associe.reducer';

export const ContactAssocie = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const contactAssocieList = useAppSelector(state => state.contactAssocie.entities);
  const loading = useAppSelector(state => state.contactAssocie.loading);

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
      <h2 id="contact-associe-heading" data-cy="ContactAssocieHeading">
        <Translate contentKey="crmApp.contactAssocie.home.title">Contact Associes</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.contactAssocie.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/contact-associe/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.contactAssocie.home.createLabel">Create new Contact Associe</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {contactAssocieList && contactAssocieList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.contactAssocie.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('nom')}>
                  <Translate contentKey="crmApp.contactAssocie.nom">Nom</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('nom')} />
                </th>
                <th className="hand" onClick={sort('prenom')}>
                  <Translate contentKey="crmApp.contactAssocie.prenom">Prenom</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('prenom')} />
                </th>
                <th className="hand" onClick={sort('relation')}>
                  <Translate contentKey="crmApp.contactAssocie.relation">Relation</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('relation')} />
                </th>
                <th className="hand" onClick={sort('telephone')}>
                  <Translate contentKey="crmApp.contactAssocie.telephone">Telephone</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('telephone')} />
                </th>
                <th className="hand" onClick={sort('whatsapp')}>
                  <Translate contentKey="crmApp.contactAssocie.whatsapp">Whatsapp</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('whatsapp')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="crmApp.contactAssocie.email">Email</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th className="hand" onClick={sort('autorisation')}>
                  <Translate contentKey="crmApp.contactAssocie.autorisation">Autorisation</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('autorisation')} />
                </th>
                <th className="hand" onClick={sort('remarques')}>
                  <Translate contentKey="crmApp.contactAssocie.remarques">Remarques</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarques')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.contactAssocie.client">Client</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {contactAssocieList.map((contactAssocie, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/contact-associe/${contactAssocie.id}`} color="link" size="sm">
                      {contactAssocie.id}
                    </Button>
                  </td>
                  <td>{contactAssocie.nom}</td>
                  <td>{contactAssocie.prenom}</td>
                  <td>{contactAssocie.relation}</td>
                  <td>{contactAssocie.telephone}</td>
                  <td>{contactAssocie.whatsapp}</td>
                  <td>{contactAssocie.email}</td>
                  <td>{contactAssocie.autorisation}</td>
                  <td>{contactAssocie.remarques}</td>
                  <td>{contactAssocie.client ? <Link to={`/client/${contactAssocie.client.id}`}>{contactAssocie.client.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/contact-associe/${contactAssocie.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/contact-associe/${contactAssocie.id}/edit`}
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
                        onClick={() => (window.location.href = `/contact-associe/${contactAssocie.id}/delete`)}
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
              <Translate contentKey="crmApp.contactAssocie.home.notFound">No Contact Associes found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ContactAssocie;
