import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './contact-associe.reducer';

export const ContactAssocieDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const contactAssocieEntity = useAppSelector(state => state.contactAssocie.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="contactAssocieDetailsHeading">
          <Translate contentKey="crmApp.contactAssocie.detail.title">ContactAssocie</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.id}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="crmApp.contactAssocie.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.nom}</dd>
          <dt>
            <span id="prenom">
              <Translate contentKey="crmApp.contactAssocie.prenom">Prenom</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.prenom}</dd>
          <dt>
            <span id="relation">
              <Translate contentKey="crmApp.contactAssocie.relation">Relation</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.relation}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="crmApp.contactAssocie.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.telephone}</dd>
          <dt>
            <span id="whatsapp">
              <Translate contentKey="crmApp.contactAssocie.whatsapp">Whatsapp</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.whatsapp}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.contactAssocie.email">Email</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.email}</dd>
          <dt>
            <span id="autorisation">
              <Translate contentKey="crmApp.contactAssocie.autorisation">Autorisation</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.autorisation}</dd>
          <dt>
            <span id="remarques">
              <Translate contentKey="crmApp.contactAssocie.remarques">Remarques</Translate>
            </span>
          </dt>
          <dd>{contactAssocieEntity.remarques}</dd>
          <dt>
            <Translate contentKey="crmApp.contactAssocie.client">Client</Translate>
          </dt>
          <dd>{contactAssocieEntity.client ? contactAssocieEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/contact-associe" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/contact-associe/${contactAssocieEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ContactAssocieDetail;
