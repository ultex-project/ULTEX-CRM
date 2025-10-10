import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './produit-demande.reducer';

export const ProduitDemande = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const produitDemandeList = useAppSelector(state => state.produitDemande.entities);
  const loading = useAppSelector(state => state.produitDemande.loading);
  const totalItems = useAppSelector(state => state.produitDemande.totalItems);

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
      <h2 id="produit-demande-heading" data-cy="ProduitDemandeHeading">
        <Translate contentKey="crmApp.produitDemande.home.title">Produit Demandes</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="crmApp.produitDemande.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/produit-demande/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="crmApp.produitDemande.home.createLabel">Create new Produit Demande</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {produitDemandeList && produitDemandeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="crmApp.produitDemande.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('typeProduit')}>
                  <Translate contentKey="crmApp.produitDemande.typeProduit">Type Produit</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('typeProduit')} />
                </th>
                <th className="hand" onClick={sort('typeDemande')}>
                  <Translate contentKey="crmApp.produitDemande.typeDemande">Type Demande</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('typeDemande')} />
                </th>
                <th className="hand" onClick={sort('nomProduit')}>
                  <Translate contentKey="crmApp.produitDemande.nomProduit">Nom Produit</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nomProduit')} />
                </th>
                <th className="hand" onClick={sort('description')}>
                  <Translate contentKey="crmApp.produitDemande.description">Description</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('description')} />
                </th>
                <th className="hand" onClick={sort('quantite')}>
                  <Translate contentKey="crmApp.produitDemande.quantite">Quantite</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('quantite')} />
                </th>
                <th className="hand" onClick={sort('unite')}>
                  <Translate contentKey="crmApp.produitDemande.unite">Unite</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('unite')} />
                </th>
                <th className="hand" onClick={sort('prix')}>
                  <Translate contentKey="crmApp.produitDemande.prix">Prix</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('prix')} />
                </th>
                <th className="hand" onClick={sort('fraisExpedition')}>
                  <Translate contentKey="crmApp.produitDemande.fraisExpedition">Frais Expedition</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fraisExpedition')} />
                </th>
                <th className="hand" onClick={sort('poidsKg')}>
                  <Translate contentKey="crmApp.produitDemande.poidsKg">Poids Kg</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('poidsKg')} />
                </th>
                <th className="hand" onClick={sort('volumeTotalCbm')}>
                  <Translate contentKey="crmApp.produitDemande.volumeTotalCbm">Volume Total Cbm</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('volumeTotalCbm')} />
                </th>
                <th className="hand" onClick={sort('dimensions')}>
                  <Translate contentKey="crmApp.produitDemande.dimensions">Dimensions</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('dimensions')} />
                </th>
                <th className="hand" onClick={sort('nombreCartons')}>
                  <Translate contentKey="crmApp.produitDemande.nombreCartons">Nombre Cartons</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('nombreCartons')} />
                </th>
                <th className="hand" onClick={sort('piecesParCarton')}>
                  <Translate contentKey="crmApp.produitDemande.piecesParCarton">Pieces Par Carton</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('piecesParCarton')} />
                </th>
                <th className="hand" onClick={sort('hsCode')}>
                  <Translate contentKey="crmApp.produitDemande.hsCode">Hs Code</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('hsCode')} />
                </th>
                <th className="hand" onClick={sort('prixCible')}>
                  <Translate contentKey="crmApp.produitDemande.prixCible">Prix Cible</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('prixCible')} />
                </th>
                <th className="hand" onClick={sort('ficheTechniqueUrl')}>
                  <Translate contentKey="crmApp.produitDemande.ficheTechniqueUrl">Fiche Technique Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('ficheTechniqueUrl')} />
                </th>
                <th className="hand" onClick={sort('photosUrl')}>
                  <Translate contentKey="crmApp.produitDemande.photosUrl">Photos Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('photosUrl')} />
                </th>
                <th className="hand" onClick={sort('piecesJointesUrl')}>
                  <Translate contentKey="crmApp.produitDemande.piecesJointesUrl">Pieces Jointes Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('piecesJointesUrl')} />
                </th>
                <th>
                  <Translate contentKey="crmApp.produitDemande.demande">Demande</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {produitDemandeList.map((produitDemande, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/produit-demande/${produitDemande.id}`} color="link" size="sm">
                      {produitDemande.id}
                    </Button>
                  </td>
                  <td>{produitDemande.typeProduit}</td>
                  <td>{produitDemande.typeDemande}</td>
                  <td>{produitDemande.nomProduit}</td>
                  <td>{produitDemande.description}</td>
                  <td>{produitDemande.quantite}</td>
                  <td>{produitDemande.unite}</td>
                  <td>{produitDemande.prix}</td>
                  <td>{produitDemande.fraisExpedition}</td>
                  <td>{produitDemande.poidsKg}</td>
                  <td>{produitDemande.volumeTotalCbm}</td>
                  <td>{produitDemande.dimensions}</td>
                  <td>{produitDemande.nombreCartons}</td>
                  <td>{produitDemande.piecesParCarton}</td>
                  <td>{produitDemande.hsCode}</td>
                  <td>{produitDemande.prixCible}</td>
                  <td>{produitDemande.ficheTechniqueUrl}</td>
                  <td>{produitDemande.photosUrl}</td>
                  <td>{produitDemande.piecesJointesUrl}</td>
                  <td>
                    {produitDemande.demande ? (
                      <Link to={`/demande-client/${produitDemande.demande.id}`}>{produitDemande.demande.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/produit-demande/${produitDemande.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/produit-demande/${produitDemande.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/produit-demande/${produitDemande.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="crmApp.produitDemande.home.notFound">No Produit Demandes found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={produitDemandeList && produitDemandeList.length > 0 ? '' : 'd-none'}>
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

export default ProduitDemande;
