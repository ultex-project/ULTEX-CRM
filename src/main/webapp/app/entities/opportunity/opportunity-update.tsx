import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getInternalUsers } from 'app/entities/internal-user/internal-user.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { OpportunityStage } from 'app/shared/model/enumerations/opportunity-stage.model';
import { createEntity, getEntity, reset, updateEntity } from './opportunity.reducer';

export const OpportunityUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const internalUsers = useAppSelector(state => state.internalUser.entities);
  const clients = useAppSelector(state => state.client.entities);
  const opportunityEntity = useAppSelector(state => state.opportunity.entity);
  const loading = useAppSelector(state => state.opportunity.loading);
  const updating = useAppSelector(state => state.opportunity.updating);
  const updateSuccess = useAppSelector(state => state.opportunity.updateSuccess);
  const opportunityStageValues = Object.keys(OpportunityStage);

  const handleClose = () => {
    navigate(`/opportunity${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getInternalUsers({}));
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
    if (values.amount !== undefined && typeof values.amount !== 'number') {
      values.amount = Number(values.amount);
    }
    values.closeDate = convertDateTimeToServer(values.closeDate);
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...opportunityEntity,
      ...values,
      assignedTo: internalUsers.find(it => it.id.toString() === values.assignedTo?.toString()),
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
          closeDate: displayDefaultDateTime(),
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          stage: 'LEAD',
          ...opportunityEntity,
          closeDate: convertDateTimeFromServer(opportunityEntity.closeDate),
          createdAt: convertDateTimeFromServer(opportunityEntity.createdAt),
          updatedAt: convertDateTimeFromServer(opportunityEntity.updatedAt),
          assignedTo: opportunityEntity?.assignedTo?.id,
          client: opportunityEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.opportunity.home.createOrEditLabel" data-cy="OpportunityCreateUpdateHeading">
            <Translate contentKey="crmApp.opportunity.home.createOrEditLabel">Create or edit a Opportunity</Translate>
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
                  id="opportunity-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.opportunity.title')}
                id="opportunity-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.opportunity.description')}
                id="opportunity-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.opportunity.amount')}
                id="opportunity-amount"
                name="amount"
                data-cy="amount"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('crmApp.opportunity.stage')}
                id="opportunity-stage"
                name="stage"
                data-cy="stage"
                type="select"
              >
                {opportunityStageValues.map(opportunityStage => (
                  <option value={opportunityStage} key={opportunityStage}>
                    {translate(`crmApp.OpportunityStage.${opportunityStage}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.opportunity.closeDate')}
                id="opportunity-closeDate"
                name="closeDate"
                data-cy="closeDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('crmApp.opportunity.createdAt')}
                id="opportunity-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('crmApp.opportunity.updatedAt')}
                id="opportunity-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="opportunity-assignedTo"
                name="assignedTo"
                data-cy="assignedTo"
                label={translate('crmApp.opportunity.assignedTo')}
                type="select"
                required
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
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <ValidatedField
                id="opportunity-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.opportunity.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/opportunity" replace color="info">
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

export default OpportunityUpdate;
