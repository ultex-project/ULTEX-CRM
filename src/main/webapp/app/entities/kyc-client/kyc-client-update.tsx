import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './kyc-client.reducer';

export const KycClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const kycClientEntity = useAppSelector(state => state.kycClient.entity);
  const loading = useAppSelector(state => state.kycClient.loading);
  const updating = useAppSelector(state => state.kycClient.updating);
  const updateSuccess = useAppSelector(state => state.kycClient.updateSuccess);

  const handleClose = () => {
    navigate('/kyc-client');
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
    if (values.scoreStaff !== undefined && typeof values.scoreStaff !== 'number') {
      values.scoreStaff = Number(values.scoreStaff);
    }
    if (values.completudeKyc !== undefined && typeof values.completudeKyc !== 'number') {
      values.completudeKyc = Number(values.completudeKyc);
    }

    const entity = {
      ...kycClientEntity,
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
          ...kycClientEntity,
          client: kycClientEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.kycClient.home.createOrEditLabel" data-cy="KycClientCreateUpdateHeading">
            <Translate contentKey="crmApp.kycClient.home.createOrEditLabel">Create or edit a KycClient</Translate>
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
                  id="kyc-client-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.kycClient.scoreStaff')}
                id="kyc-client-scoreStaff"
                name="scoreStaff"
                data-cy="scoreStaff"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.kycClient.comportements')}
                id="kyc-client-comportements"
                name="comportements"
                data-cy="comportements"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.kycClient.remarques')}
                id="kyc-client-remarques"
                name="remarques"
                data-cy="remarques"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.kycClient.completudeKyc')}
                id="kyc-client-completudeKyc"
                name="completudeKyc"
                data-cy="completudeKyc"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.kycClient.responsable')}
                id="kyc-client-responsable"
                name="responsable"
                data-cy="responsable"
                type="text"
              />
              <ValidatedField
                id="kyc-client-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.kycClient.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/kyc-client" replace color="info">
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

export default KycClientUpdate;
