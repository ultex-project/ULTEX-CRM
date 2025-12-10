import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import axios from 'axios';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
import { deleteEntity } from 'app/entities/contact-associe/contact-associe.reducer';
import { useAppDispatch } from 'app/config/store';

import './ContactAssocieViewPage.scss';

const ContactAssocieViewPage = () => {
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [contact, setContact] = useState<IContactAssocie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) {
        navigate('/dashboard/contact-associe', { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<IContactAssocie>(`/api/contact-associes/${id}`);
        setContact(response.data ?? null);
      } catch (err) {
        setError(translate('crmApp.contactAssocie.dashboard.loadError'));
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!contact?.id) {
      return;
    }

    try {
      setDeleting(true);
      await dispatch(deleteEntity(contact.id)).unwrap();
      setDeleting(false);
      setDeleteModalOpen(false);
      navigate('/dashboard/contact-associe', { replace: true });
    } catch (err) {
      setDeleting(false);
    }
  };

  const renderValue = (value?: string | null) => (value && value.trim() !== '' ? value : '--');

  return (
    <div className="contact-associe-view-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <Button color="link" tag={Link} to="/dashboard/contact-associe" className="text-decoration-none px-0">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            <Translate contentKey="crmApp.contactAssocie.dashboard.back" />
          </Button>
          <h2 className="mb-0">
            <Translate contentKey="crmApp.contactAssocie.detail.title" />
          </h2>
          <p className="text-muted mb-0">
            <Translate contentKey="crmApp.contactAssocie.dashboard.subtitle" />
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {contact?.id ? (
            <>
              <Button color="secondary" tag={Link} to={`/dashboard/contact-associe/${contact.id}/edit`}>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                <Translate contentKey="entity.action.edit" />
              </Button>
              <Button color="danger" onClick={() => setDeleteModalOpen(true)}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                <Translate contentKey="entity.action.delete" />
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : !contact ? (
            <div className="text-muted">
              <Translate contentKey="crmApp.contactAssocie.home.notFound" />
            </div>
          ) : (
            <Row className="gy-4">
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.nom" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.nom)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.prenom" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.prenom)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.relation" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.relation)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.telephone" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.telephone)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">WhatsApp</span>
                  <span className="fw-semibold">{renderValue(contact.whatsapp)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.email" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.email)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.autorisation" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.autorisation)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.contactAssocie.remarques" />
                  </span>
                  <span className="fw-semibold">{renderValue(contact.remarques)}</span>
                </div>
              </Col>
              <Col md="6">
                <div className="d-flex flex-column">
                  <span className="text-uppercase text-muted small">
                    <Translate contentKey="crmApp.client.company" />
                  </span>
                  <span className="fw-semibold">
                    {contact.client?.id ? (
                      <Link to={`/dashboard/clients/${contact.client.id}/view`}>
                        {contact.client.nomComplet ?? contact.client.code ?? `#${contact.client.id}`}
                      </Link>
                    ) : (
                      '--'
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setDeleteModalOpen(false)}>
          <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
        </ModalHeader>
        <ModalBody id="contact-associe-delete-question">
          <Translate contentKey="crmApp.contactAssocie.delete.question" interpolate={{ id: contact?.id }}>
            Are you sure you want to delete this ContactAssocie?
          </Translate>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="entity.action.delete">Delete</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ContactAssocieViewPage;
