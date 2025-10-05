import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './societe-liee.reducer';

export const SocieteLieeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const societeLieeEntity = useAppSelector(state => state.societeLiee.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="societeLieeDetailsHeading">
          <Translate contentKey="crmApp.societeLiee.detail.title">SocieteLiee</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.id}</dd>
          <dt>
            <span id="raisonSociale">
              <Translate contentKey="crmApp.societeLiee.raisonSociale">Raison Sociale</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.raisonSociale}</dd>
          <dt>
            <span id="formeJuridique">
              <Translate contentKey="crmApp.societeLiee.formeJuridique">Forme Juridique</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.formeJuridique}</dd>
          <dt>
            <span id="ice">
              <Translate contentKey="crmApp.societeLiee.ice">Ice</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.ice}</dd>
          <dt>
            <span id="rc">
              <Translate contentKey="crmApp.societeLiee.rc">Rc</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.rc}</dd>
          <dt>
            <span id="nif">
              <Translate contentKey="crmApp.societeLiee.nif">Nif</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.nif}</dd>
          <dt>
            <span id="secteurActivite">
              <Translate contentKey="crmApp.societeLiee.secteurActivite">Secteur Activite</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.secteurActivite}</dd>
          <dt>
            <span id="tailleEntreprise">
              <Translate contentKey="crmApp.societeLiee.tailleEntreprise">Taille Entreprise</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.tailleEntreprise}</dd>
          <dt>
            <span id="adresseSiege">
              <Translate contentKey="crmApp.societeLiee.adresseSiege">Adresse Siege</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.adresseSiege}</dd>
          <dt>
            <span id="representantLegal">
              <Translate contentKey="crmApp.societeLiee.representantLegal">Representant Legal</Translate>
            </span>
          </dt>
          <dd>{societeLieeEntity.representantLegal}</dd>
          <dt>
            <Translate contentKey="crmApp.societeLiee.client">Client</Translate>
          </dt>
          <dd>{societeLieeEntity.client ? societeLieeEntity.client.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/societe-liee" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/societe-liee/${societeLieeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SocieteLieeDetail;
