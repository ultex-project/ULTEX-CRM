import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './cycle-activation.reducer';

export const CycleActivationUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const cycleActivationEntity = useAppSelector(state => state.cycleActivation.entity);
  const loading = useAppSelector(state => state.cycleActivation.loading);
  const updating = useAppSelector(state => state.cycleActivation.updating);
  const updateSuccess = useAppSelector(state => state.cycleActivation.updateSuccess);

  const handleClose = () => {
    navigate(`/cycle-activation${location.search}`);
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
    if (values.numeroCycle !== undefined && typeof values.numeroCycle !== 'number') {
      values.numeroCycle = Number(values.numeroCycle);
    }
    values.dateDebut = convertDateTimeToServer(values.dateDebut);
    values.dateFin = convertDateTimeToServer(values.dateFin);

    const entity = {
      ...cycleActivationEntity,
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
          dateDebut: displayDefaultDateTime(),
          dateFin: displayDefaultDateTime(),
        }
      : {
          ...cycleActivationEntity,
          dateDebut: convertDateTimeFromServer(cycleActivationEntity.dateDebut),
          dateFin: convertDateTimeFromServer(cycleActivationEntity.dateFin),
          client: cycleActivationEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.cycleActivation.home.createOrEditLabel" data-cy="CycleActivationCreateUpdateHeading">
            <Translate contentKey="crmApp.cycleActivation.home.createOrEditLabel">Create or edit a CycleActivation</Translate>
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
                  id="cycle-activation-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.cycleActivation.numeroCycle')}
                id="cycle-activation-numeroCycle"
                name="numeroCycle"
                data-cy="numeroCycle"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('crmApp.cycleActivation.dateDebut')}
                id="cycle-activation-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.cycleActivation.dateFin')}
                id="cycle-activation-dateFin"
                name="dateFin"
                data-cy="dateFin"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('crmApp.cycleActivation.statutCycle')}
                id="cycle-activation-statutCycle"
                name="statutCycle"
                data-cy="statutCycle"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.cycleActivation.commentaire')}
                id="cycle-activation-commentaire"
                name="commentaire"
                data-cy="commentaire"
                type="textarea"
              />
              <ValidatedField
                id="cycle-activation-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.cycleActivation.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/cycle-activation" replace color="info">
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

export default CycleActivationUpdate;
