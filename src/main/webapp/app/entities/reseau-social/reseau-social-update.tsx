import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { PlateformeSociale } from 'app/shared/model/enumerations/plateforme-sociale.model';
import { createEntity, getEntity, reset, updateEntity } from './reseau-social.reducer';

export const ReseauSocialUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const reseauSocialEntity = useAppSelector(state => state.reseauSocial.entity);
  const loading = useAppSelector(state => state.reseauSocial.loading);
  const updating = useAppSelector(state => state.reseauSocial.updating);
  const updateSuccess = useAppSelector(state => state.reseauSocial.updateSuccess);
  const plateformeSocialeValues = Object.keys(PlateformeSociale);

  const handleClose = () => {
    navigate(`/reseau-social${location.search}`);
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
      ...reseauSocialEntity,
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
          plateforme: 'FACEBOOK',
          ...reseauSocialEntity,
          client: reseauSocialEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.reseauSocial.home.createOrEditLabel" data-cy="ReseauSocialCreateUpdateHeading">
            <Translate contentKey="crmApp.reseauSocial.home.createOrEditLabel">Create or edit a ReseauSocial</Translate>
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
                  id="reseau-social-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.reseauSocial.plateforme')}
                id="reseau-social-plateforme"
                name="plateforme"
                data-cy="plateforme"
                type="select"
              >
                {plateformeSocialeValues.map(plateformeSociale => (
                  <option value={plateformeSociale} key={plateformeSociale}>
                    {translate(`crmApp.PlateformeSociale.${plateformeSociale}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.reseauSocial.urlProfil')}
                id="reseau-social-urlProfil"
                name="urlProfil"
                data-cy="urlProfil"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.reseauSocial.username')}
                id="reseau-social-username"
                name="username"
                data-cy="username"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.reseauSocial.type')}
                id="reseau-social-type"
                name="type"
                data-cy="type"
                type="text"
              />
              <ValidatedField
                id="reseau-social-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.reseauSocial.client')}
                type="select"
                required
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
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reseau-social" replace color="info">
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

export default ReseauSocialUpdate;
