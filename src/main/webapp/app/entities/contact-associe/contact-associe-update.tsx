import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity, getEntity, reset, updateEntity } from './contact-associe.reducer';

export const ContactAssocieUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const clients = useAppSelector(state => state.client.entities);
  const contactAssocieEntity = useAppSelector(state => state.contactAssocie.entity);
  const loading = useAppSelector(state => state.contactAssocie.loading);
  const updating = useAppSelector(state => state.contactAssocie.updating);
  const updateSuccess = useAppSelector(state => state.contactAssocie.updateSuccess);

  const handleClose = () => {
    navigate('/contact-associe');
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

    const entity = {
      ...contactAssocieEntity,
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
          ...contactAssocieEntity,
          client: contactAssocieEntity?.client?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="crmApp.contactAssocie.home.createOrEditLabel" data-cy="ContactAssocieCreateUpdateHeading">
            <Translate contentKey="crmApp.contactAssocie.home.createOrEditLabel">Create or edit a ContactAssocie</Translate>
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
                  id="contact-associe-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('crmApp.contactAssocie.nom')}
                id="contact-associe-nom"
                name="nom"
                data-cy="nom"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.prenom')}
                id="contact-associe-prenom"
                name="prenom"
                data-cy="prenom"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.relation')}
                id="contact-associe-relation"
                name="relation"
                data-cy="relation"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.telephone')}
                id="contact-associe-telephone"
                name="telephone"
                data-cy="telephone"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.whatsapp')}
                id="contact-associe-whatsapp"
                name="whatsapp"
                data-cy="whatsapp"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.email')}
                id="contact-associe-email"
                name="email"
                data-cy="email"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.autorisation')}
                id="contact-associe-autorisation"
                name="autorisation"
                data-cy="autorisation"
                type="text"
              />
              <ValidatedField
                label={translate('crmApp.contactAssocie.remarques')}
                id="contact-associe-remarques"
                name="remarques"
                data-cy="remarques"
                type="text"
              />
              <ValidatedField
                id="contact-associe-client"
                name="client"
                data-cy="client"
                label={translate('crmApp.contactAssocie.client')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/contact-associe" replace color="info">
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

export default ContactAssocieUpdate;
