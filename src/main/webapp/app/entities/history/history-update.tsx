import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './history.reducer';

export const HistoryUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const historyEntity = useAppSelector(state => state.history.entity);
  const loading = useAppSelector(state => state.history.loading);
  const updating = useAppSelector(state => state.history.updating);
  const updateSuccess = useAppSelector(state => state.history.updateSuccess);

  const handleClose = () => {
    navigate('/history');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
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
    if (values.entityId !== undefined && typeof values.entityId !== 'number') {
      values.entityId = Number(values.entityId);
    }
    values.performedDate = convertDateTimeToServer(values.performedDate);

    const entity = {
      ...historyEntity,
      ...values,
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
          performedDate: displayDefaultDateTime(),
        }
      : {
          ...historyEntity,
          performedDate: convertDateTimeFromServer(historyEntity.performedDate),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.history.home.createOrEditLabel" data-cy="HistoryCreateUpdateHeading">
            <Translate contentKey="crmApp.history.home.createOrEditLabel">Create or edit a History</Translate>
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
                  id="history-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.history.entityName')}
                id="history-entityName"
                name="entityName"
                data-cy="entityName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.history.entityId')}
                id="history-entityId"
                name="entityId"
                data-cy="entityId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('crmApp.history.action')}
                id="history-action"
                name="action"
                data-cy="action"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.history.fieldChanged')}
                id="history-fieldChanged"
                name="fieldChanged"
                data-cy="fieldChanged"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.history.oldValue')}
                id="history-oldValue"
                name="oldValue"
                data-cy="oldValue"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.history.newValue')}
                id="history-newValue"
                name="newValue"
                data-cy="newValue"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.history.performedBy')}
                id="history-performedBy"
                name="performedBy"
                data-cy="performedBy"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.history.performedDate')}
                id="history-performedDate"
                name="performedDate"
                data-cy="performedDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.history.details')}
                id="history-details"
                name="details"
                data-cy="details"
                type="textarea"
              />
              <ValidatedField
                label={translate('crmApp.history.ipAddress')}
                id="history-ipAddress"
                name="ipAddress"
                data-cy="ipAddress"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.history.userAgent')}
                id="history-userAgent"
                name="userAgent"
                data-cy="userAgent"
                type="text"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/history" replace color="info">
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

export default HistoryUpdate;
