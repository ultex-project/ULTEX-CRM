import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './contact.reducer';

export const ContactDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const contactEntity = useAppSelector(state => state.contact.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="contactDetailsHeading">
          <Translate contentKey="crmApp.contact.detail.title">Contact</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{contactEntity.id}</dd>
          <dt>
            <span id="firstName">
              <Translate contentKey="crmApp.contact.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{contactEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="crmApp.contact.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{contactEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.contact.email">Email</Translate>
            </span>
          </dt>
          <dd>{contactEntity.email}</dd>
          <dt>
            <span id="phone">
              <Translate contentKey="crmApp.contact.phone">Phone</Translate>
            </span>
          </dt>
          <dd>{contactEntity.phone}</dd>
          <dt>
            <span id="cin">
              <Translate contentKey="crmApp.contact.cin">Cin</Translate>
            </span>
          </dt>
          <dd>{contactEntity.cin}</dd>
          <dt>
            <span id="position">
              <Translate contentKey="crmApp.contact.position">Position</Translate>
            </span>
          </dt>
          <dd>{contactEntity.position}</dd>
          <dt>
            <span id="quality">
              <Translate contentKey="crmApp.contact.quality">Quality</Translate>
            </span>
          </dt>
          <dd>{contactEntity.quality}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.contact.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{contactEntity.createdAt ? <TextFormat value={contactEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.contact.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{contactEntity.updatedAt ? <TextFormat value={contactEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="crmApp.contact.company">Company</Translate>
          </dt>
          <dd>{contactEntity.company ? contactEntity.company.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.contact.client">Client</Translate>
          </dt>
          <dd>{contactEntity.client ? contactEntity.client.id : ''}</dd>
          <dt>
            <Translate contentKey="crmApp.contact.prospect">Prospect</Translate>
          </dt>
          <dd>{contactEntity.prospect ? contactEntity.prospect.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/contact" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/contact/${contactEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ContactDetail;
