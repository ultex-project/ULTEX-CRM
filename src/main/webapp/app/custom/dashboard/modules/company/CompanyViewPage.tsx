import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Alert, Badge, Button, Card, CardBody, CardHeader, Col, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBuilding, faEdit } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, reset } from 'app/entities/company/company.reducer';
import { ICompany } from 'app/shared/model/company.model';

const renderValue = (value: React.ReactNode) =>
  value !== undefined && value !== null && value !== '' ? value : <span className="text-muted">--</span>;

const formatDate = (value?: dayjs.Dayjs | string | null, format = 'DD MMM YYYY HH:mm') => (value ? dayjs(value).format(format) : '--');

const CompanyViewPage = () => {
  const { id } = useParams<'id'>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [clientsCount] = useState(0);
  const [demandsCount] = useState(0);

  const company = useAppSelector(state => state.company.entity);
  const loading = useAppSelector(state => state.company.loading);
  const errorMessage = useAppSelector(state => state.company.errorMessage);

  useEffect(() => {
    dispatch(reset());
    if (id) {
      dispatch(getEntity(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, id]);

  const isNotFound = !loading && (!company || company.id === undefined || company.id === null);

  if (isNotFound) {
    return (
      <div className="client-view-page py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <Button color="link" tag={Link} to="/dashboard/company/list" className="px-0 text-decoration-none">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Retour à la liste
          </Button>
        </div>
        <Alert color="danger" className="text-center">
          L&apos;entreprise n&apos;a pas été trouvée.
        </Alert>
      </div>
    );
  }

  return (
    <div className="client-view-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <Button color="link" tag={Link} to="/dashboard/company/list" className="px-0 text-decoration-none">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour à la liste
        </Button>
        {company?.id ? (
          <Button color="primary" tag={Link} to={`/dashboard/company/${company.id}/edit`} className="shadow-sm">
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
            <h4 className="mb-1">{renderValue(company?.name)}</h4>
            <p className="mb-0 text-muted">Profil de l&apos;entreprise</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {company?.industry ? (
              <Badge color="light" className="text-primary border border-primary">
                {company.industry}
              </Badge>
            ) : null}
            {company?.country ? (
              <Badge color="light" className="text-secondary border border-secondary">
                {company.country}
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
                  <div className="text-muted small">Nom</div>
                  <div className="fw-semibold">{renderValue(company?.name)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Secteur</div>
                  <div className="fw-semibold">{renderValue(company?.industry)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Site web</div>
                  <div className="fw-semibold">{renderValue(company?.website)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Créée le</div>
                  <div className="fw-semibold">{renderValue(formatDate(company?.createdAt))}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Mise à jour le</div>
                  <div className="fw-semibold">{renderValue(formatDate(company?.updatedAt))}</div>
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
                <h6 className="mb-0">Localisation</h6>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="gy-3 gx-4">
                <Col md="12">
                  <div className="text-muted small">Adresse</div>
                  <div className="fw-semibold">{renderValue(company?.address)}</div>
                </Col>
                <Col md="4">
                  <div className="text-muted small">Ville</div>
                  <div className="fw-semibold">{renderValue(company?.city)}</div>
                </Col>
                <Col md="4">
                  <div className="text-muted small">Pays</div>
                  <div className="fw-semibold">{renderValue(company?.country)}</div>
                </Col>
                <Col md="4">
                  <div className="text-muted small">Téléphone</div>
                  <div className="fw-semibold">{renderValue(company?.phone)}</div>
                </Col>
                <Col md="6">
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">{renderValue(company?.email)}</div>
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
                  <div className="text-muted">Nombre total de clients liés à cette entreprise.</div>
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

export default CompanyViewPage;
