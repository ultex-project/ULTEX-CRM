import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './societe-liee.reducer';

export const SocieteLieeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const societeLieeEntity = useAppSelector(state => state.societeLiee.entity);
  const loading = useAppSelector(state => state.societeLiee.loading);
  const updating = useAppSelector(state => state.societeLiee.updating);
  const updateSuccess = useAppSelector(state => state.societeLiee.updateSuccess);

  const handleClose = () => {
    navigate('/societe-liee');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getClients({}));
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

    const entity = {
      ...societeLieeEntity,
      ...values,
      client: clients.find(it => it.id.toString() === values.client?.toString()),
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
          ...societeLieeEntity,
          client: societeLieeEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.societeLiee.home.createOrEditLabel" data-cy="SocieteLieeCreateUpdateHeading">
            <Translate contentKey="crmApp.societeLiee.home.createOrEditLabel">Create or edit a SocieteLiee</Translate>
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
                  id="societe-liee-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.societeLiee.raisonSociale')}
                id="societe-liee-raisonSociale"
                name="raisonSociale"
                data-cy="raisonSociale"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.societeLiee.formeJuridique')}
                id="societe-liee-formeJuridique"
                name="formeJuridique"
                data-cy="formeJuridique"
                type="text"
              />
              <ValidatedField label={translate('crmApp.societeLiee.ice')} id="societe-liee-ice" name="ice" data-cy="ice" type="text" />
              <ValidatedField label={translate('crmApp.societeLiee.rc')} id="societe-liee-rc" name="rc" data-cy="rc" type="text" />
              <ValidatedField label={translate('crmApp.societeLiee.nif')} id="societe-liee-nif" name="nif" data-cy="nif" type="text" />
              <ValidatedField
                label={translate('crmApp.societeLiee.secteurActivite')}
                id="societe-liee-secteurActivite"
                name="secteurActivite"
                data-cy="secteurActivite"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.societeLiee.tailleEntreprise')}
                id="societe-liee-tailleEntreprise"
                name="tailleEntreprise"
                data-cy="tailleEntreprise"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.societeLiee.adresseSiege')}
                id="societe-liee-adresseSiege"
                name="adresseSiege"
                data-cy="adresseSiege"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.societeLiee.representantLegal')}
                id="societe-liee-representantLegal"
                name="representantLegal"
                data-cy="representantLegal"
                type="text"
              />
              <ValidatedField
                id="societe-liee-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.societeLiee.client')}
                type="select"
              >
                <option value="" key="0" />
                {clients
                  ? clients.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/societe-liee" replace color="info">
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

export default SocieteLieeUpdate;
