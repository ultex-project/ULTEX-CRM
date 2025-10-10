import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './historique-crm.reducer';

export const HistoriqueCRMUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const historiqueCRMEntity = useAppSelector(state => state.historiqueCRM.entity);
  const loading = useAppSelector(state => state.historiqueCRM.loading);
  const updating = useAppSelector(state => state.historiqueCRM.updating);
  const updateSuccess = useAppSelector(state => state.historiqueCRM.updateSuccess);

  const handleClose = () => {
    navigate('/historique-crm');
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
    values.dateInteraction = convertDateTimeToServer(values.dateInteraction);

    const entity = {
      ...historiqueCRMEntity,
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
      ? {
          dateInteraction: displayDefaultDateTime(),
        }
      : {
          ...historiqueCRMEntity,
          dateInteraction: convertDateTimeFromServer(historiqueCRMEntity.dateInteraction),
          client: historiqueCRMEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.historiqueCRM.home.createOrEditLabel" data-cy="HistoriqueCRMCreateUpdateHeading">
            <Translate contentKey="crmApp.historiqueCRM.home.createOrEditLabel">Create or edit a HistoriqueCRM</Translate>
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
                  id="historique-crm-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.historiqueCRM.dateInteraction')}
                id="historique-crm-dateInteraction"
                name="dateInteraction"
                data-cy="dateInteraction"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.historiqueCRM.canal')}
                id="historique-crm-canal"
                name="canal"
                data-cy="canal"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.historiqueCRM.agent')}
                id="historique-crm-agent"
                name="agent"
                data-cy="agent"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.historiqueCRM.resume')}
                id="historique-crm-resume"
                name="resume"
                data-cy="resume"
                type="textarea"
              />
              <ValidatedField
                label={translate('crmApp.historiqueCRM.etat')}
                id="historique-crm-etat"
                name="etat"
                data-cy="etat"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.historiqueCRM.observation')}
                id="historique-crm-observation"
                name="observation"
                data-cy="observation"
                type="text"
              />
              <ValidatedField
                id="historique-crm-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.historiqueCRM.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/historique-crm" replace color="info">
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

export default HistoriqueCRMUpdate;
