import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { getEntities as getDevises } from 'app/entities/devise/devise.reducer';
import { getEntities as getIncoterms } from 'app/entities/incoterm/incoterm.reducer';
import { getEntities as getSousServices } from 'app/entities/sous-service/sous-service.reducer';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { createEntity, getEntity, reset, updateEntity } from './demande-client.reducer';

export const DemandeClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const devises = useAppSelector(state => state.devise.entities);
  const incoterms = useAppSelector(state => state.incoterm.entities);
  const sousServices = useAppSelector(state => state.sousService.entities);
  const demandeClientEntity = useAppSelector(state => state.demandeClient.entity);
  const loading = useAppSelector(state => state.demandeClient.loading);
  const updating = useAppSelector(state => state.demandeClient.updating);
  const updateSuccess = useAppSelector(state => state.demandeClient.updateSuccess);
  const servicePrincipalValues = Object.keys(ServicePrincipal);

  const handleClose = () => {
    navigate(`/demande-client${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getClients({}));
    dispatch(getDevises({}));
    dispatch(getIncoterms({}));
    dispatch(getSousServices({}));
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
      devise: devises.find(it => it.id.toString() === values.devise?.toString()),
      incoterm: incoterms.find(it => it.id.toString() === values.incoterm?.toString()),
      sousServices: mapIdList(values.sousServices),
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
          servicePrincipal: 'IMPORT',
          ...demandeClientEntity,
          dateDemande: convertDateTimeFromServer(demandeClientEntity.dateDemande),
          client: demandeClientEntity?.client?.id,
          devise: demandeClientEntity?.devise?.id,
          incoterm: demandeClientEntity?.incoterm?.id,
          sousServices: demandeClientEntity?.sousServices?.map(e => e.id.toString()),
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
                type="select"
              >
                {servicePrincipalValues.map(servicePrincipal => (
                  <option value={servicePrincipal} key={servicePrincipal}>
                    {translate(`crmApp.ServicePrincipal.${servicePrincipal}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.demandeClient.provenance')}
                id="demande-client-provenance"
                name="provenance"
                data-cy="provenance"
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
              <ValidatedField
                id="demande-client-devise"
                name="devise"
                data-cy="devise"
                label={translate('crmApp.demandeClient.devise')}
                type="select"
              >
                <option value="" key="0" />
                {devises
                  ? devises.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="demande-client-incoterm"
                name="incoterm"
                data-cy="incoterm"
                label={translate('crmApp.demandeClient.incoterm')}
                type="select"
              >
                <option value="" key="0" />
                {incoterms
                  ? incoterms.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('crmApp.demandeClient.sousServices')}
                id="demande-client-sousServices"
                data-cy="sousServices"
                type="select"
                multiple
                name="sousServices"
              >
                <option value="" key="0" />
                {sousServices
                  ? sousServices.map(otherEntity => (
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
