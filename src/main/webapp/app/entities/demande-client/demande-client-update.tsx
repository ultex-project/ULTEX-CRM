import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './demande-client.reducer';

export const DemandeClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const demandeClientEntity = useAppSelector(state => state.demandeClient.entity);
  const loading = useAppSelector(state => state.demandeClient.loading);
  const updating = useAppSelector(state => state.demandeClient.updating);
  const updateSuccess = useAppSelector(state => state.demandeClient.updateSuccess);

  const handleClose = () => {
    navigate('/demande-client');
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
    values.dateDemande = convertDateTimeToServer(values.dateDemande);
    if (values.nombreProduits !== undefined && typeof values.nombreProduits !== 'number') {
      values.nombreProduits = Number(values.nombreProduits);
    }

    const entity = {
      ...demandeClientEntity,
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
          dateDemande: displayDefaultDateTime(),
        }
      : {
          ...demandeClientEntity,
          dateDemande: convertDateTimeFromServer(demandeClientEntity.dateDemande),
          client: demandeClientEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.demandeClient.home.createOrEditLabel" data-cy="DemandeClientCreateUpdateHeading">
            <Translate contentKey="crmApp.demandeClient.home.createOrEditLabel">Create or edit a DemandeClient</Translate>
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
                  id="demande-client-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.demandeClient.reference')}
                id="demande-client-reference"
                name="reference"
                data-cy="reference"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.dateDemande')}
                id="demande-client-dateDemande"
                name="dateDemande"
                data-cy="dateDemande"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.servicePrincipal')}
                id="demande-client-servicePrincipal"
                name="servicePrincipal"
                data-cy="servicePrincipal"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.sousServices')}
                id="demande-client-sousServices"
                name="sousServices"
                data-cy="sousServices"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.provenance')}
                id="demande-client-provenance"
                name="provenance"
                data-cy="provenance"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.incoterm')}
                id="demande-client-incoterm"
                name="incoterm"
                data-cy="incoterm"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.devise')}
                id="demande-client-devise"
                name="devise"
                data-cy="devise"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.nombreProduits')}
                id="demande-client-nombreProduits"
                name="nombreProduits"
                data-cy="nombreProduits"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.demandeClient.remarqueGenerale')}
                id="demande-client-remarqueGenerale"
                name="remarqueGenerale"
                data-cy="remarqueGenerale"
                type="text"
              />
              <ValidatedField
                id="demande-client-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.demandeClient.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/demande-client" replace color="info">
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

export default DemandeClientUpdate;
