import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, reset } from 'app/entities/societe-liee/societe-liee.reducer';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const SocieteLieeViewPage = () => {
  const { id } = useParams<'id'>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [clientsCount] = useState(0);
  const [demandsCount] = useState(0);

  const societeLiee = useAppSelector(state => state.societeLiee.entity as ISocieteLiee);
  const loading = useAppSelector(state => state.societeLiee.loading);
  const errorMessage = useAppSelector(state => state.societeLiee.errorMessage);

  useEffect(() => {
    dispatch(reset());
    if (id) {
      dispatch(getEntity(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  const isNotFound = !loading && (!societeLiee || societeLiee.id === undefined || societeLiee.id === null);

  if (isNotFound) {
    return (
      <div className="client-view-page py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <Button color="link" tag={Link} to="/dashboard/societe-liee/list" className="px-0 text-decoration-none">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Retour à la liste
          </Button>
        </div>
        <Alert color="danger" className="text-center">
          La société liée n&apos;a pas été trouvée.
        </Alert>
      </div>
    );
  }

  return (
    <div className="client-view-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Button color="link" tag={Link} to="/dashboard/societe-liee/list" className="px-0 text-decoration-none">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Button>
        {societeLiee?.id ? (
          <Button color="primary" tag={Link} to={`/dashboard/societe-liee/${societeLiee.id}/edit`} className="shadow-sm">
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Modifier
          </Button>
        ) : null}
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <CardBody className="d-flex flex-column flex-md-row align-items-md-center gap-3">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: 64, height: 64 }}
          >
            <FontAwesomeIcon icon={faBuilding} size="lg" />
          </div>
          <div className="flex-grow-1">
            <h4 className="mb-1">{renderValue(societeLiee?.raisonSociale)}</h4>
            <p className="mb-0 text-muted">Profil de la société liée</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {societeLiee?.secteurActivite ? (
              <Badge color="light" className="text-primary border border-primary">
                {societeLiee.secteurActivite}
              </Badge>
            ) : null}
            {societeLiee?.tailleEntreprise ? (
              <Badge color="light" className="text-secondary border border-secondary">
                {societeLiee.tailleEntreprise}
              </Badge>
            ) : null}
          </div>
        </CardBody>
      </Card>

      {errorMessage ? (
        <Alert color="danger" className="border-0 shadow-sm mb-4">
          {errorMessage}
        </Alert>
      ) : null}

      {loading ? (
        <Card className="shadow-sm border-0">
          <CardBody className="text-center py-5">
            <Spinner color="primary" />
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-0">
              <div className="d-flex align-items-center gap-2">
                <span role="img" aria-label="building">
                  🏢
                </span>
                <h6 className="mb-0">Informations générales</h6>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="gy-3 gx-4">
                <Col md="6">
                  <div className="text-muted small">Raison sociale</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.raisonSociale)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Forme juridique</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.formeJuridique)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Secteur d&apos;activité</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.secteurActivite)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Taille de l&apos;entreprise</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.tailleEntreprise)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Représentant légal</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.representantLegal)}</div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-0">
              <div className="d-flex align-items-center gap-2">
                <span role="img" aria-label="id">
                  🪪
                </span>
                <h6 className="mb-0">Identifiants</h6>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="gy-3 gx-4">
                <Col md="4">
                  <div className="text-muted small">ICE</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.ice)}</div>
                </Col>
                <Col md="4">
                  <div className="text-muted small">RC</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.rc)}</div>
                </Col>
                <Col md="4">
                  <div className="text-muted small">NIF</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.nif)}</div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-0">
              <div className="d-flex align-items-center gap-2">
                <span role="img" aria-label="globe">
                  🌍
                </span>
                <h6 className="mb-0">Coordonnées</h6>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="gy-3 gx-4">
                <Col md="12">
                  <div className="text-muted small">Adresse du siège</div>
                  <div className="fw-semibold">{renderValue(societeLiee?.adresseSiege)}</div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white border-0">
              <div className="d-flex align-items-center gap-2">
                <span role="img" aria-label="chart">
                  📊
                </span>
                <h6 className="mb-0">Statistiques</h6>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="gy-4 gx-4">
                <Col md="6">
                  <div className="text-muted small">Clients associés</div>
                  <div className="fw-semibold fs-5">{clientsCount}</div>
                  <div className="text-muted">Nombre total de clients liés à cette société.</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Demandes</div>
                  <div className="fw-semibold fs-5">{demandsCount}</div>
                  <div className="text-muted">Nombre total de demandes liées.</div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocieteLieeViewPage;
