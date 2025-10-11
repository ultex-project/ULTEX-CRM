import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getDemandeClients } from 'app/entities/demande-client/demande-client.reducer';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';
import { createEntity, getEntity, reset, updateEntity } from './produit-demande.reducer';

export const ProduitDemandeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const demandeClients = useAppSelector(state => state.demandeClient.entities);
  const produitDemandeEntity = useAppSelector(state => state.produitDemande.entity);
  const loading = useAppSelector(state => state.produitDemande.loading);
  const updating = useAppSelector(state => state.produitDemande.updating);
  const updateSuccess = useAppSelector(state => state.produitDemande.updateSuccess);
  const typeDemandeValues = Object.keys(TypeDemande);

  const handleClose = () => {
    navigate(`/produit-demande${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getDemandeClients({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.quantite !== undefined && typeof values.quantite !== 'number') {
      values.quantite = Number(values.quantite);
    }
    if (values.prix !== undefined && typeof values.prix !== 'number') {
      values.prix = Number(values.prix);
    }
    if (values.fraisExpedition !== undefined && typeof values.fraisExpedition !== 'number') {
      values.fraisExpedition = Number(values.fraisExpedition);
    }
    if (values.poidsKg !== undefined && typeof values.poidsKg !== 'number') {
      values.poidsKg = Number(values.poidsKg);
    }
    if (values.volumeTotalCbm !== undefined && typeof values.volumeTotalCbm !== 'number') {
      values.volumeTotalCbm = Number(values.volumeTotalCbm);
    }
    if (values.nombreCartons !== undefined && typeof values.nombreCartons !== 'number') {
      values.nombreCartons = Number(values.nombreCartons);
    }
    if (values.piecesParCarton !== undefined && typeof values.piecesParCarton !== 'number') {
      values.piecesParCarton = Number(values.piecesParCarton);
    }
    if (values.prixCible !== undefined && typeof values.prixCible !== 'number') {
      values.prixCible = Number(values.prixCible);
    }

    const entity = {
      ...produitDemandeEntity,
      ...values,
      demande: demandeClients.find(it => it.id.toString() === values.demande?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          typeDemande: 'PROFORMA',
          ...produitDemandeEntity,
          demande: produitDemandeEntity?.demande?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.produitDemande.home.createOrEditLabel" data-cy="ProduitDemandeCreateUpdateHeading">
            <Translate contentKey="crmApp.produitDemande.home.createOrEditLabel">Create or edit a ProduitDemande</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="produit-demande-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.produitDemande.typeProduit')}
                id="produit-demande-typeProduit"
                name="typeProduit"
                data-cy="typeProduit"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.typeDemande')}
                id="produit-demande-typeDemande"
                name="typeDemande"
                data-cy="typeDemande"
                type="select"
              >
                {typeDemandeValues.map(typeDemande => (
                  <option value={typeDemande} key={typeDemande}>
                    {translate(`crmApp.TypeDemande.${typeDemande}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.produitDemande.nomProduit')}
                id="produit-demande-nomProduit"
                name="nomProduit"
                data-cy="nomProduit"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.description')}
                id="produit-demande-description"
                name="description"
                data-cy="description"
                type="textarea"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.quantite')}
                id="produit-demande-quantite"
                name="quantite"
                data-cy="quantite"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.unite')}
                id="produit-demande-unite"
                name="unite"
                data-cy="unite"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.prix')}
                id="produit-demande-prix"
                name="prix"
                data-cy="prix"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.fraisExpedition')}
                id="produit-demande-fraisExpedition"
                name="fraisExpedition"
                data-cy="fraisExpedition"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.poidsKg')}
                id="produit-demande-poidsKg"
                name="poidsKg"
                data-cy="poidsKg"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.volumeTotalCbm')}
                id="produit-demande-volumeTotalCbm"
                name="volumeTotalCbm"
                data-cy="volumeTotalCbm"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.dimensions')}
                id="produit-demande-dimensions"
                name="dimensions"
                data-cy="dimensions"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.nombreCartons')}
                id="produit-demande-nombreCartons"
                name="nombreCartons"
                data-cy="nombreCartons"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.piecesParCarton')}
                id="produit-demande-piecesParCarton"
                name="piecesParCarton"
                data-cy="piecesParCarton"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.hsCode')}
                id="produit-demande-hsCode"
                name="hsCode"
                data-cy="hsCode"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.prixCible')}
                id="produit-demande-prixCible"
                name="prixCible"
                data-cy="prixCible"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.origine')}
                id="produit-demande-origine"
                name="origine"
                data-cy="origine"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.contactFournisseur')}
                id="produit-demande-contactFournisseur"
                name="contactFournisseur"
                data-cy="contactFournisseur"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.adresseChargement')}
                id="produit-demande-adresseChargement"
                name="adresseChargement"
                data-cy="adresseChargement"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.adresseDechargement')}
                id="produit-demande-adresseDechargement"
                name="adresseDechargement"
                data-cy="adresseDechargement"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.ficheTechniqueUrl')}
                id="produit-demande-ficheTechniqueUrl"
                name="ficheTechniqueUrl"
                data-cy="ficheTechniqueUrl"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.photosUrl')}
                id="produit-demande-photosUrl"
                name="photosUrl"
                data-cy="photosUrl"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.produitDemande.piecesJointesUrl')}
                id="produit-demande-piecesJointesUrl"
                name="piecesJointesUrl"
                data-cy="piecesJointesUrl"
                type="text"
              />
              <ValidatedField
                id="produit-demande-demande"
                name="demande"
                data-cy="demande"
                label={translate('crmApp.produitDemande.demande')}
                type="select"
              >
                <option value="" key="0" />
                {demandeClients
                  ? demandeClients.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/produit-demande" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProduitDemandeUpdate;
