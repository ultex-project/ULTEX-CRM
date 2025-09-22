import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';
import { ProspectStatus } from 'app/shared/model/enumerations/prospect-status.model';
import { createEntity, getEntity, reset, updateEntity } from './prospect.reducer';

export const ProspectUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const prospectEntity = useAppSelector(state => state.prospect.entity);
  const loading = useAppSelector(state => state.prospect.loading);
  const updating = useAppSelector(state => state.prospect.updating);
  const updateSuccess = useAppSelector(state => state.prospect.updateSuccess);
  const prospectStatusValues = Object.keys(ProspectStatus);

  const handleClose = () => {
    navigate(`/prospect${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getClients({}));
    dispatch(getInternalUsers({}));
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
      ...prospectEntity,
      ...values,
      convertedTo: clients.find(it => it.id.toString() === values.convertedTo?.toString()),
      convertedBy: internalUsers.find(it => it.id.toString() === values.convertedBy?.toString()),
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
          status: 'NEW',
          ...prospectEntity,
          convertedTo: prospectEntity?.convertedTo?.id,
          convertedBy: prospectEntity?.convertedBy?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.prospect.home.createOrEditLabel" data-cy="ProspectCreateUpdateHeading">
            <Translate contentKey="crmApp.prospect.home.createOrEditLabel">Create or edit a Prospect</Translate>
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
                  id="prospect-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.prospect.firstName')}
                id="prospect-firstName"
                name="firstName"
                data-cy="firstName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.prospect.lastName')}
                id="prospect-lastName"
                name="lastName"
                data-cy="lastName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.prospect.email')}
                id="prospect-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField label={translate('crmApp.prospect.phone')} id="prospect-phone" name="phone" data-cy="phone" type="text" />
              <ValidatedField label={translate('crmApp.prospect.source')} id="prospect-source" name="source" data-cy="source" type="text" />
              <ValidatedField label={translate('crmApp.prospect.status')} id="prospect-status" name="status" data-cy="status" type="select">
                {prospectStatusValues.map(prospectStatus => (
                  <option value={prospectStatus} key={prospectStatus}>
                    {translate(`crmApp.ProspectStatus.${prospectStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="prospect-convertedTo"
                name="convertedTo"
                data-cy="convertedTo"
                label={translate('crmApp.prospect.convertedTo')}
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
              <ValidatedField
                id="prospect-convertedBy"
                name="convertedBy"
                data-cy="convertedBy"
                label={translate('crmApp.prospect.convertedBy')}
                type="select"
              >
                <option value="" key="0" />
                {internalUsers
                  ? internalUsers.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/prospect" replace color="info">
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

export default ProspectUpdate;
