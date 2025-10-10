import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './client.reducer';

export const ClientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const clientEntity = useAppSelector(state => state.client.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="clientDetailsHeading">
          <Translate contentKey="crmApp.client.detail.title">Client</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{clientEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="crmApp.client.code">Code</Translate>
            </span>
          </dt>
          <dd>{clientEntity.code}</dd>
          <dt>
            <span id="nomComplet">
              <Translate contentKey="crmApp.client.nomComplet">Nom Complet</Translate>
            </span>
          </dt>
          <dd>{clientEntity.nomComplet}</dd>
          <dt>
            <span id="photoUrl">
              <Translate contentKey="crmApp.client.photoUrl">Photo Url</Translate>
            </span>
          </dt>
          <dd>{clientEntity.photoUrl}</dd>
          <dt>
            <span id="dateNaissance">
              <Translate contentKey="crmApp.client.dateNaissance">Date Naissance</Translate>
            </span>
          </dt>
          <dd>
            {clientEntity.dateNaissance ? (
              <TextFormat value={clientEntity.dateNaissance} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="lieuNaissance">
              <Translate contentKey="crmApp.client.lieuNaissance">Lieu Naissance</Translate>
            </span>
          </dt>
          <dd>{clientEntity.lieuNaissance}</dd>
          <dt>
            <span id="nationalite">
              <Translate contentKey="crmApp.client.nationalite">Nationalite</Translate>
            </span>
          </dt>
          <dd>{clientEntity.nationalite}</dd>
          <dt>
            <span id="genre">
              <Translate contentKey="crmApp.client.genre">Genre</Translate>
            </span>
          </dt>
          <dd>{clientEntity.genre}</dd>
          <dt>
            <span id="fonction">
              <Translate contentKey="crmApp.client.fonction">Fonction</Translate>
            </span>
          </dt>
          <dd>{clientEntity.fonction}</dd>
          <dt>
            <span id="languePreferee">
              <Translate contentKey="crmApp.client.languePreferee">Langue Preferee</Translate>
            </span>
          </dt>
          <dd>{clientEntity.languePreferee}</dd>
          <dt>
            <span id="telephonePrincipal">
              <Translate contentKey="crmApp.client.telephonePrincipal">Telephone Principal</Translate>
            </span>
          </dt>
          <dd>{clientEntity.telephonePrincipal}</dd>
          <dt>
            <span id="whatsapp">
              <Translate contentKey="crmApp.client.whatsapp">Whatsapp</Translate>
            </span>
          </dt>
          <dd>{clientEntity.whatsapp}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="crmApp.client.email">Email</Translate>
            </span>
          </dt>
          <dd>{clientEntity.email}</dd>
          <dt>
            <span id="adressePersonnelle">
              <Translate contentKey="crmApp.client.adressePersonnelle">Adresse Personnelle</Translate>
            </span>
          </dt>
          <dd>{clientEntity.adressePersonnelle}</dd>
          <dt>
            <span id="adressesLivraison">
              <Translate contentKey="crmApp.client.adressesLivraison">Adresses Livraison</Translate>
            </span>
          </dt>
          <dd>{clientEntity.adressesLivraison}</dd>
          <dt>
            <span id="reseauxSociaux">
              <Translate contentKey="crmApp.client.reseauxSociaux">Reseaux Sociaux</Translate>
            </span>
          </dt>
          <dd>{clientEntity.reseauxSociaux}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="crmApp.client.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{clientEntity.createdAt ? <TextFormat value={clientEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="crmApp.client.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{clientEntity.updatedAt ? <TextFormat value={clientEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="crmApp.client.company">Company</Translate>
          </dt>
          <dd>{clientEntity.company ? clientEntity.company.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/client" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/client/${clientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ClientDetail;
