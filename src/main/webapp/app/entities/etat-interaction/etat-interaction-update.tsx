import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getHistoriqueCRMS } from 'app/entities/historique-crm/historique-crm.reducer';
import { getEntities as getCycleActivations } from 'app/entities/cycle-activation/cycle-activation.reducer';
import { EtatCRM } from 'app/shared/model/enumerations/etat-crm.model';
import { createEntity, getEntity, reset, updateEntity } from './etat-interaction.reducer';

export const EtatInteractionUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const historiqueCRMS = useAppSelector(state => state.historiqueCRM.entities);
  const cycleActivations = useAppSelector(state => state.cycleActivation.entities);
  const etatInteractionEntity = useAppSelector(state => state.etatInteraction.entity);
  const loading = useAppSelector(state => state.etatInteraction.loading);
  const updating = useAppSelector(state => state.etatInteraction.updating);
  const updateSuccess = useAppSelector(state => state.etatInteraction.updateSuccess);
  const etatCRMValues = Object.keys(EtatCRM);

  const handleClose = () => {
    navigate(`/etat-interaction${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getHistoriqueCRMS({}));
    dispatch(getCycleActivations({}));
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
    values.dateEtat = convertDateTimeToServer(values.dateEtat);

    const entity = {
      ...etatInteractionEntity,
      ...values,
      historique: historiqueCRMS.find(it => it.id.toString() === values.historique?.toString()),
      cycle: cycleActivations.find(it => it.id.toString() === values.cycle?.toString()),
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
          dateEtat: displayDefaultDateTime(),
        }
      : {
          etat: 'TRAITE',
          ...etatInteractionEntity,
          dateEtat: convertDateTimeFromServer(etatInteractionEntity.dateEtat),
          historique: etatInteractionEntity?.historique?.id,
          cycle: etatInteractionEntity?.cycle?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.etatInteraction.home.createOrEditLabel" data-cy="EtatInteractionCreateUpdateHeading">
            <Translate contentKey="crmApp.etatInteraction.home.createOrEditLabel">Create or edit a EtatInteraction</Translate>
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
                  id="etat-interaction-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.etatInteraction.etat')}
                id="etat-interaction-etat"
                name="etat"
                data-cy="etat"
                type="select"
              >
                {etatCRMValues.map(etatCRM => (
                  <option value={etatCRM} key={etatCRM}>
                    {translate(`crmApp.EtatCRM.${etatCRM}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.etatInteraction.dateEtat')}
                id="etat-interaction-dateEtat"
                name="dateEtat"
                data-cy="dateEtat"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.etatInteraction.agent')}
                id="etat-interaction-agent"
                name="agent"
                data-cy="agent"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.etatInteraction.observation')}
                id="etat-interaction-observation"
                name="observation"
                data-cy="observation"
                type="textarea"
              />
              <ValidatedField
                id="etat-interaction-historique"
                name="historique"
                data-cy="historique"
                label={translate('crmApp.etatInteraction.historique')}
                type="select"
              >
                <option value="" key="0" />
                {historiqueCRMS
                  ? historiqueCRMS.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="etat-interaction-cycle"
                name="cycle"
                data-cy="cycle"
                label={translate('crmApp.etatInteraction.cycle')}
                type="select"
                required
              >
                <option value="" key="0" />
                {cycleActivations
                  ? cycleActivations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/etat-interaction" replace color="info">
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

export default EtatInteractionUpdate;
