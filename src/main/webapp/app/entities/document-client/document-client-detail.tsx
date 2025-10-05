import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './document-client.reducer';

export const DocumentClientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const documentClientEntity = useAppSelector(state => state.documentClient.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="documentClientDetailsHeading">
          <Translate contentKey="crmApp.documentClient.detail.title">DocumentClient</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{documentClientEntity.id}</dd>
          <dt>
            <span id="typeDocument">
              <Translate contentKey="crmApp.documentClient.typeDocument">Type Document</Translate>
            </span>
          </dt>
          <dd>{documentClientEntity.typeDocument}</dd>
          <dt>
            <span id="numeroDocument">
              <Translate contentKey="crmApp.documentClient.numeroDocument">Numero Document</Translate>
            </span>
          </dt>
          <dd>{documentClientEntity.numeroDocument}</dd>
          <dt>
            <span id="fichierUrl">
              <Translate contentKey="crmApp.documentClient.fichierUrl">Fichier Url</Translate>
            </span>
          </dt>
          <dd>{documentClientEntity.fichierUrl}</dd>
          <dt>
            <Translate contentKey="crmApp.documentClient.client">Client</Translate>
          </dt>
          <dd>{documentClientEntity.client ? documentClientEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/document-client" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/document-client/${documentClientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DocumentClientDetail;
