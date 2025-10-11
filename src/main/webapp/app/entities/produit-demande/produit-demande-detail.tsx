import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './produit-demande.reducer';

export const ProduitDemandeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const produitDemandeEntity = useAppSelector(state => state.produitDemande.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="produitDemandeDetailsHeading">
          <Translate contentKey="crmApp.produitDemande.detail.title">ProduitDemande</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.id}</dd>
          <dt>
            <span id="typeProduit">
              <Translate contentKey="crmApp.produitDemande.typeProduit">Type Produit</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.typeProduit}</dd>
          <dt>
            <span id="typeDemande">
              <Translate contentKey="crmApp.produitDemande.typeDemande">Type Demande</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.typeDemande}</dd>
          <dt>
            <span id="nomProduit">
              <Translate contentKey="crmApp.produitDemande.nomProduit">Nom Produit</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.nomProduit}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="crmApp.produitDemande.description">Description</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.description}</dd>
          <dt>
            <span id="quantite">
              <Translate contentKey="crmApp.produitDemande.quantite">Quantite</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.quantite}</dd>
          <dt>
            <span id="unite">
              <Translate contentKey="crmApp.produitDemande.unite">Unite</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.unite}</dd>
          <dt>
            <span id="prix">
              <Translate contentKey="crmApp.produitDemande.prix">Prix</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.prix}</dd>
          <dt>
            <span id="fraisExpedition">
              <Translate contentKey="crmApp.produitDemande.fraisExpedition">Frais Expedition</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.fraisExpedition}</dd>
          <dt>
            <span id="poidsKg">
              <Translate contentKey="crmApp.produitDemande.poidsKg">Poids Kg</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.poidsKg}</dd>
          <dt>
            <span id="volumeTotalCbm">
              <Translate contentKey="crmApp.produitDemande.volumeTotalCbm">Volume Total Cbm</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.volumeTotalCbm}</dd>
          <dt>
            <span id="dimensions">
              <Translate contentKey="crmApp.produitDemande.dimensions">Dimensions</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.dimensions}</dd>
          <dt>
            <span id="nombreCartons">
              <Translate contentKey="crmApp.produitDemande.nombreCartons">Nombre Cartons</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.nombreCartons}</dd>
          <dt>
            <span id="piecesParCarton">
              <Translate contentKey="crmApp.produitDemande.piecesParCarton">Pieces Par Carton</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.piecesParCarton}</dd>
          <dt>
            <span id="hsCode">
              <Translate contentKey="crmApp.produitDemande.hsCode">Hs Code</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.hsCode}</dd>
          <dt>
            <span id="prixCible">
              <Translate contentKey="crmApp.produitDemande.prixCible">Prix Cible</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.prixCible}</dd>
          <dt>
            <span id="origine">
              <Translate contentKey="crmApp.produitDemande.origine">Origine</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.origine}</dd>
          <dt>
            <span id="contactFournisseur">
              <Translate contentKey="crmApp.produitDemande.contactFournisseur">Contact Fournisseur</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.contactFournisseur}</dd>
          <dt>
            <span id="adresseChargement">
              <Translate contentKey="crmApp.produitDemande.adresseChargement">Adresse Chargement</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.adresseChargement}</dd>
          <dt>
            <span id="adresseDechargement">
              <Translate contentKey="crmApp.produitDemande.adresseDechargement">Adresse Dechargement</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.adresseDechargement}</dd>
          <dt>
            <span id="ficheTechniqueUrl">
              <Translate contentKey="crmApp.produitDemande.ficheTechniqueUrl">Fiche Technique Url</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.ficheTechniqueUrl}</dd>
          <dt>
            <span id="photosUrl">
              <Translate contentKey="crmApp.produitDemande.photosUrl">Photos Url</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.photosUrl}</dd>
          <dt>
            <span id="piecesJointesUrl">
              <Translate contentKey="crmApp.produitDemande.piecesJointesUrl">Pieces Jointes Url</Translate>
            </span>
          </dt>
          <dd>{produitDemandeEntity.piecesJointesUrl}</dd>
          <dt>
            <Translate contentKey="crmApp.produitDemande.demande">Demande</Translate>
          </dt>
          <dd>{produitDemandeEntity.demande ? produitDemandeEntity.demande.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/produit-demande" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/produit-demande/${produitDemandeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProduitDemandeDetail;
