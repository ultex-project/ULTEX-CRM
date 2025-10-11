import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getPays } from 'app/entities/pays/pays.reducer';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { createEntity, getEntity, reset, updateEntity } from './client.reducer';

export const ClientUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const pays = useAppSelector(state => state.pays.entities);
  const companies = useAppSelector(state => state.company.entities);
  const clientEntity = useAppSelector(state => state.client.entity);
  const loading = useAppSelector(state => state.client.loading);
  const updating = useAppSelector(state => state.client.updating);
  const updateSuccess = useAppSelector(state => state.client.updateSuccess);

  const handleClose = () => {
    navigate(`/client${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getPays({}));
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
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...clientEntity,
      ...values,
      pays: pays.find(it => it.id.toString() === values.pays?.toString()),
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
          ...clientEntity,
          createdAt: convertDateTimeFromServer(clientEntity.createdAt),
          updatedAt: convertDateTimeFromServer(clientEntity.updatedAt),
          pays: clientEntity?.pays?.id,
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
                label={translate('crmApp.client.code')}
                id="client-code"
                name="code"
                data-cy="code"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  pattern: { value: /[A-Z0-9]{4,}/, message: translate('entity.validation.pattern', { pattern: '[A-Z0-9]{4,}' }) },
                }}
              />
              <ValidatedField
                label={translate('crmApp.client.nomComplet')}
                id="client-nomComplet"
                name="nomComplet"
                data-cy="nomComplet"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.client.photoUrl')}
                id="client-photoUrl"
                name="photoUrl"
                data-cy="photoUrl"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.dateNaissance')}
                id="client-dateNaissance"
                name="dateNaissance"
                data-cy="dateNaissance"
                type="date"
              />
              <ValidatedField
                label={translate('crmApp.client.lieuNaissance')}
                id="client-lieuNaissance"
                name="lieuNaissance"
                data-cy="lieuNaissance"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.nationalite')}
                id="client-nationalite"
                name="nationalite"
                data-cy="nationalite"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField label={translate('crmApp.client.genre')} id="client-genre" name="genre" data-cy="genre" type="text" />
              <ValidatedField
                label={translate('crmApp.client.fonction')}
                id="client-fonction"
                name="fonction"
                data-cy="fonction"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.languePreferee')}
                id="client-languePreferee"
                name="languePreferee"
                data-cy="languePreferee"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.telephonePrincipal')}
                id="client-telephonePrincipal"
                name="telephonePrincipal"
                data-cy="telephonePrincipal"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  pattern: { value: /^\+[0-9]{8,15}$/, message: translate('entity.validation.pattern', { pattern: '^\\+[0-9]{8,15}$' }) },
                }}
              />
              <ValidatedField
                label={translate('crmApp.client.whatsapp')}
                id="client-whatsapp"
                name="whatsapp"
                data-cy="whatsapp"
                type="text"
              />
              <ValidatedField label={translate('crmApp.client.email')} id="client-email" name="email" data-cy="email" type="text" />
              <ValidatedField
                label={translate('crmApp.client.adressePersonnelle')}
                id="client-adressePersonnelle"
                name="adressePersonnelle"
                data-cy="adressePersonnelle"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.adressesLivraison')}
                id="client-adressesLivraison"
                name="adressesLivraison"
                data-cy="adressesLivraison"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.client.reseauxSociaux')}
                id="client-reseauxSociaux"
                name="reseauxSociaux"
                data-cy="reseauxSociaux"
                type="text"
              />
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
              <ValidatedField id="client-pays" name="pays" data-cy="pays" label={translate('crmApp.client.pays')} type="select">
                <option value="" key="0" />
                {pays
                  ? pays.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
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
