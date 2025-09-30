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

import { getEntities } from './prospect.reducer';

export const Prospect = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const prospectList = useAppSelector(state => state.prospect.entities);
  const loading = useAppSelector(state => state.prospect.loading);
  const totalItems = useAppSelector(state => state.prospect.totalItems);

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
      <h2 id="prospect-heading" data-cy="ProspectHeading">
        <Translate contentKey="crmApp.prospect.home.title">Prospects</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.prospect.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/prospect/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.prospect.home.createLabel">Create new Prospect</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {prospectList && prospectList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.prospect.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('firstName')}>
                  <Translate contentKey="crmApp.prospect.firstName">First Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('firstName')} />
                </th>
                <th className="hand" onClick={sort('lastName')}>
                  <Translate contentKey="crmApp.prospect.lastName">Last Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('lastName')} />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="crmApp.prospect.email">Email</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('email')} />
                </th>
                <th className="hand" onClick={sort('phone1')}>
                  <Translate contentKey="crmApp.prospect.phone1">Phone 1</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('phone1')} />
                </th>
                <th className="hand" onClick={sort('phone2')}>
                  <Translate contentKey="crmApp.prospect.phone2">Phone 2</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('phone2')} />
                </th>
                <th className="hand" onClick={sort('source')}>
                  <Translate contentKey="crmApp.prospect.source">Source</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('source')} />
                </th>
                <th className="hand" onClick={sort('cin')}>
                  <Translate contentKey="crmApp.prospect.cin">Cin</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('cin')} />
                </th>
                <th className="hand" onClick={sort('address')}>
                  <Translate contentKey="crmApp.prospect.address">Address</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('address')} />
                </th>
                <th className="hand" onClick={sort('city')}>
                  <Translate contentKey="crmApp.prospect.city">City</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('city')} />
                </th>
                <th className="hand" onClick={sort('country')}>
                  <Translate contentKey="crmApp.prospect.country">Country</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('country')} />
                </th>
                <th className="hand" onClick={sort('deliveryAddress')}>
                  <Translate contentKey="crmApp.prospect.deliveryAddress">Delivery Address</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('deliveryAddress')} />
                </th>
                <th className="hand" onClick={sort('referredBy')}>
                  <Translate contentKey="crmApp.prospect.referredBy">Referred By</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('referredBy')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="crmApp.prospect.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('convertedDate')}>
                  <Translate contentKey="crmApp.prospect.convertedDate">Converted Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('convertedDate')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="crmApp.prospect.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="crmApp.prospect.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.prospect.convertedTo">Converted To</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="crmApp.prospect.convertedBy">Converted By</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="crmApp.prospect.company">Company</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {prospectList.map((prospect, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/prospect/${prospect.id}`} color="link" size="sm">
                      {prospect.id}
                    </Button>
                  </td>
                  <td>{prospect.firstName}</td>
                  <td>{prospect.lastName}</td>
                  <td>{prospect.email}</td>
                  <td>{prospect.phone1}</td>
                  <td>{prospect.phone2}</td>
                  <td>{prospect.source}</td>
                  <td>{prospect.cin}</td>
                  <td>{prospect.address}</td>
                  <td>{prospect.city}</td>
                  <td>{prospect.country}</td>
                  <td>{prospect.deliveryAddress}</td>
                  <td>{prospect.referredBy}</td>
                  <td>
                    <Translate contentKey={`crmApp.ProspectStatus.${prospect.status}`} />
                  </td>
                  <td>
                    {prospect.convertedDate ? <TextFormat type="date" value={prospect.convertedDate} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{prospect.createdAt ? <TextFormat type="date" value={prospect.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{prospect.updatedAt ? <TextFormat type="date" value={prospect.updatedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{prospect.convertedTo ? <Link to={`/client/${prospect.convertedTo.id}`}>{prospect.convertedTo.id}</Link> : ''}</td>
                  <td>
                    {prospect.convertedBy ? <Link to={`/internal-user/${prospect.convertedBy.id}`}>{prospect.convertedBy.id}</Link> : ''}
                  </td>
                  <td>{prospect.company ? <Link to={`/company/${prospect.company.id}`}>{prospect.company.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/prospect/${prospect.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/prospect/${prospect.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/prospect/${prospect.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="crmApp.prospect.home.notFound">No Prospects found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={prospectList && prospectList.length > 0 ? '' : 'd-none'}>
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

export default Prospect;
