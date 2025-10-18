import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getEtatInteractions } from 'app/entities/etat-interaction/etat-interaction.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';
import { StatutRappel } from 'app/shared/model/enumerations/statut-rappel.model';
import { createEntity, getEntity, reset, updateEntity } from './rappel-agent.reducer';

export const RappelAgentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const etatInteractions = useAppSelector(state => state.etatInteraction.entities);
  const clients = useAppSelector(state => state.client.entities);
  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const rappelAgentEntity = useAppSelector(state => state.rappelAgent.entity);
  const loading = useAppSelector(state => state.rappelAgent.loading);
  const updating = useAppSelector(state => state.rappelAgent.updating);
  const updateSuccess = useAppSelector(state => state.rappelAgent.updateSuccess);
  const statutRappelValues = Object.keys(StatutRappel);

  const handleClose = () => {
    navigate(`/rappel-agent${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getEtatInteractions({}));
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
    values.rappelDate = convertDateTimeToServer(values.rappelDate);
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...rappelAgentEntity,
      ...values,
      etat: etatInteractions.find(it => it.id.toString() === values.etat?.toString()),
      client: clients.find(it => it.id.toString() === values.client?.toString()),
      agent: internalUsers.find(it => it.id.toString() === values.agent?.toString()),
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
          rappelDate: displayDefaultDateTime(),
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          statutRappel: 'PENDING',
          ...rappelAgentEntity,
          rappelDate: convertDateTimeFromServer(rappelAgentEntity.rappelDate),
          createdAt: convertDateTimeFromServer(rappelAgentEntity.createdAt),
          updatedAt: convertDateTimeFromServer(rappelAgentEntity.updatedAt),
          etat: rappelAgentEntity?.etat?.id,
          client: rappelAgentEntity?.client?.id,
          agent: rappelAgentEntity?.agent?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.rappelAgent.home.createOrEditLabel" data-cy="RappelAgentCreateUpdateHeading">
            <Translate contentKey="crmApp.rappelAgent.home.createOrEditLabel">Create or edit a RappelAgent</Translate>
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
                  id="rappel-agent-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.rappelAgent.rappelDate')}
                id="rappel-agent-rappelDate"
                name="rappelDate"
                data-cy="rappelDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.rappelAgent.rappelMessage')}
                id="rappel-agent-rappelMessage"
                name="rappelMessage"
                data-cy="rappelMessage"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.rappelAgent.statutRappel')}
                id="rappel-agent-statutRappel"
                name="statutRappel"
                data-cy="statutRappel"
                type="select"
              >
                {statutRappelValues.map(statutRappel => (
                  <option value={statutRappel} key={statutRappel}>
                    {translate(`crmApp.StatutRappel.${statutRappel}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.rappelAgent.createdAt')}
                id="rappel-agent-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('crmApp.rappelAgent.updatedAt')}
                id="rappel-agent-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="rappel-agent-etat" name="etat" data-cy="etat" label={translate('crmApp.rappelAgent.etat')} type="select">
                <option value="" key="0" />
                {etatInteractions
                  ? etatInteractions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="rappel-agent-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.rappelAgent.client')}
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
                id="rappel-agent-agent"
                name="agent"
                data-cy="agent"
                label={translate('crmApp.rappelAgent.agent')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/rappel-agent" replace color="info">
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

export default RappelAgentUpdate;
