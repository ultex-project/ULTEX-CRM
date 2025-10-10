import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './document-client.reducer';

export const DocumentClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const documentClientEntity = useAppSelector(state => state.documentClient.entity);
  const loading = useAppSelector(state => state.documentClient.loading);
  const updating = useAppSelector(state => state.documentClient.updating);
  const updateSuccess = useAppSelector(state => state.documentClient.updateSuccess);

  const handleClose = () => {
    navigate(`/document-client${location.search}`);
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
      ...documentClientEntity,
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
          ...documentClientEntity,
          client: documentClientEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.documentClient.home.createOrEditLabel" data-cy="DocumentClientCreateUpdateHeading">
            <Translate contentKey="crmApp.documentClient.home.createOrEditLabel">Create or edit a DocumentClient</Translate>
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
                  id="document-client-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.documentClient.typeDocument')}
                id="document-client-typeDocument"
                name="typeDocument"
                data-cy="typeDocument"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.documentClient.numeroDocument')}
                id="document-client-numeroDocument"
                name="numeroDocument"
                data-cy="numeroDocument"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.documentClient.fichierUrl')}
                id="document-client-fichierUrl"
                name="fichierUrl"
                data-cy="fichierUrl"
                type="text"
              />
              <ValidatedField
                id="document-client-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.documentClient.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/document-client" replace color="info">
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

export default DocumentClientUpdate;
