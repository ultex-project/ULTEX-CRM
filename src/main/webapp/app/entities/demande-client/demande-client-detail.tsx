import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './demande-client.reducer';

export const DemandeClientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const demandeClientEntity = useAppSelector(state => state.demandeClient.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="demandeClientDetailsHeading">
          <Translate contentKey="crmApp.demandeClient.detail.title">DemandeClient</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.id}</dd>
          <dt>
            <span id="reference">
              <Translate contentKey="crmApp.demandeClient.reference">Reference</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.reference}</dd>
          <dt>
            <span id="dateDemande">
              <Translate contentKey="crmApp.demandeClient.dateDemande">Date Demande</Translate>
            </span>
          </dt>
          <dd>
            {demandeClientEntity.dateDemande ? (
              <TextFormat value={demandeClientEntity.dateDemande} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="servicePrincipal">
              <Translate contentKey="crmApp.demandeClient.servicePrincipal">Service Principal</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.servicePrincipal}</dd>
          <dt>
            <span id="sousServices">
              <Translate contentKey="crmApp.demandeClient.sousServices">Sous Services</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.sousServices}</dd>
          <dt>
            <span id="provenance">
              <Translate contentKey="crmApp.demandeClient.provenance">Provenance</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.provenance}</dd>
          <dt>
            <span id="incoterm">
              <Translate contentKey="crmApp.demandeClient.incoterm">Incoterm</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.incoterm}</dd>
          <dt>
            <span id="devise">
              <Translate contentKey="crmApp.demandeClient.devise">Devise</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.devise}</dd>
          <dt>
            <span id="nombreProduits">
              <Translate contentKey="crmApp.demandeClient.nombreProduits">Nombre Produits</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.nombreProduits}</dd>
          <dt>
            <span id="remarqueGenerale">
              <Translate contentKey="crmApp.demandeClient.remarqueGenerale">Remarque Generale</Translate>
            </span>
          </dt>
          <dd>{demandeClientEntity.remarqueGenerale}</dd>
          <dt>
            <Translate contentKey="crmApp.demandeClient.client">Client</Translate>
          </dt>
          <dd>{demandeClientEntity.client ? demandeClientEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/demande-client" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/demande-client/${demandeClientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DemandeClientDetail;
