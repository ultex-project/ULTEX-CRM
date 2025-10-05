import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';
import { createEntity, getEntity, reset, updateEntity } from './client.reducer';

export const ClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const companies = useAppSelector(state => state.company.entities);
  const clientEntity = useAppSelector(state => state.client.entity);
  const loading = useAppSelector(state => state.client.loading);
  const updating = useAppSelector(state => state.client.updating);
  const updateSuccess = useAppSelector(state => state.client.updateSuccess);
  const clientStatusValues = Object.keys(ClientStatus);

  const handleClose = () => {
    navigate(`/client${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCompanies({}));
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
    if (values.clientId !== undefined && typeof values.clientId !== 'number') {
      values.clientId = Number(values.clientId);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...clientEntity,
      ...values,
      company: companies.find(it => it.id.toString() === values.company?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          status: 'ACTIVE',
          ...clientEntity,
          createdAt: convertDateTimeFromServer(clientEntity.createdAt),
          updatedAt: convertDateTimeFromServer(clientEntity.updatedAt),
          company: clientEntity?.company?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.client.home.createOrEditLabel" data-cy="ClientCreateUpdateHeading">
            <Translate contentKey="crmApp.client.home.createOrEditLabel">Create or edit a Client</Translate>
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
                  id="client-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.client.clientId')}
                id="client-clientId"
                name="clientId"
                data-cy="clientId"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.firstName')}
                id="client-firstName"
                name="firstName"
                data-cy="firstName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.client.lastName')}
                id="client-lastName"
                name="lastName"
                data-cy="lastName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.client.email')}
                id="client-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField label={translate('crmApp.client.phone1')} id="client-phone1" name="phone1" data-cy="phone1" type="text" />
              <ValidatedField label={translate('crmApp.client.phone2')} id="client-phone2" name="phone2" data-cy="phone2" type="text" />
              <ValidatedField label={translate('crmApp.client.cin')} id="client-cin" name="cin" data-cy="cin" type="text" />
              <ValidatedField label={translate('crmApp.client.address')} id="client-address" name="address" data-cy="address" type="text" />
              <ValidatedField label={translate('crmApp.client.city')} id="client-city" name="city" data-cy="city" type="text" />
              <ValidatedField label={translate('crmApp.client.country')} id="client-country" name="country" data-cy="country" type="text" />
              <ValidatedField
                label={translate('crmApp.client.deliveryAddress')}
                id="client-deliveryAddress"
                name="deliveryAddress"
                data-cy="deliveryAddress"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.referredBy')}
                id="client-referredBy"
                name="referredBy"
                data-cy="referredBy"
                type="text"
              />
              <ValidatedField label={translate('crmApp.client.status')} id="client-status" name="status" data-cy="status" type="select">
                {clientStatusValues.map(clientStatus => (
                  <option value={clientStatus} key={clientStatus}>
                    {translate(`crmApp.ClientStatus.${clientStatus}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.client.createdAt')}
                id="client-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('crmApp.client.updatedAt')}
                id="client-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="client-company" name="company" data-cy="company" label={translate('crmApp.client.company')} type="select">
                <option value="" key="0" />
                {companies
                  ? companies.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/client" replace color="info">
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

export default ClientUpdate;
