import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getContacts, deleteEntity as deleteContact } from 'app/entities/contact-associe/contact-associe.reducer';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
import { Badge, Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faPlus, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';

import ContactAssocieModal from './ContactAssocieModal';

interface ClientContactsPanelProps {
  clientId: number;
}

const AUTHORIZATION_COLORS: Record<string, string> = {
  Info: 'primary',
  Mandataire: 'warning',
  Signataire: 'success',
};

const ClientContactsPanel: React.FC<ClientContactsPanelProps> = ({ clientId }) => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(state => state.contactAssocie.entities);
  const loading = useAppSelector(state => state.contactAssocie.loading);
  const deleting = useAppSelector(state => state.contactAssocie.updating);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<IContactAssocie | null>(null);
  const [viewContact, setViewContact] = useState<IContactAssocie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IContactAssocie | null>(null);

  useEffect(() => {
    dispatch(getContacts({ query: `clientId.equals=${clientId}`, sort: 'id,desc' }));
    return () => {
      setModalOpen(false);
      setEditingContact(null);
      setViewContact(null);
      setDeleteTarget(null);
    };
  }, [dispatch, clientId]);

  const handleRefresh = () => {
    dispatch(getContacts({ query: `clientId.equals=${clientId}`, sort: 'id,desc' }));
  };

  const handleOpenCreate = () => {
    setEditingContact(null);
    setModalOpen(true);
  };

  const handleEdit = (contactToEdit: IContactAssocie) => {
    setEditingContact(contactToEdit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingContact(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    try {
      await dispatch(deleteContact(deleteTarget.id)).unwrap();
      toast.success(translate('crmApp.contactAssocie.dashboard.messages.deleteSuccess'));
      setDeleteTarget(null);
      handleRefresh();
    } catch (error) {
      toast.error(translate('crmApp.contactAssocie.dashboard.messages.deleteError'));
    }
  };

  const displayedContacts = useMemo(() => contacts.filter(contact => contact.client?.id === clientId), [contacts, clientId]);

  const renderAuthorization = (value?: string | null) => {
    if (!value) {
      return <span className="text-muted">--</span>;
    }
    const color = AUTHORIZATION_COLORS[value] ?? 'secondary';
    return (
      <Badge color={color} className="text-uppercase">
        {translate(`crmApp.contactAssocie.dashboard.authorizations.${value}`, value)}
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm border-0 mt-4">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <Translate contentKey="crmApp.contactAssocie.dashboard.title" />
          </h5>
          <small className="text-muted">
            <Translate contentKey="crmApp.contactAssocie.dashboard.subtitle" />
          </small>
        </div>
        <Button color="primary" size="sm" onClick={handleOpenCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          <Translate contentKey="crmApp.contactAssocie.dashboard.add" />
        </Button>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : displayedContacts.length === 0 ? (
          <div className="text-center text-muted py-4">
            <FontAwesomeIcon icon={faUsers} size="2x" className="mb-3 text-secondary" />
            <p className="mb-3">
              <Translate contentKey="crmApp.contactAssocie.dashboard.empty" />
            </p>
            <Button color="primary" onClick={handleOpenCreate}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <Translate contentKey="crmApp.contactAssocie.dashboard.add" />
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.dashboard.columns.name" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.relation" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.telephone" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.email" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.autorisation" />
                  </th>
                  <th className="text-center" style={{ width: 220 }}>
                    <Translate contentKey="crmApp.contactAssocie.dashboard.actions.label" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedContacts.map(contact => (
                  <tr key={contact.id}>
                    <td>
                      <div className="fw-semibold">{[contact.nom, contact.prenom].filter(Boolean).join(' ') || '--'}</div>
                      {contact.id ? <div className="text-muted small">#{contact.id}</div> : null}
                    </td>
                    <td>{contact.relation ? contact.relation : <span className="text-muted">--</span>}</td>
                    <td>
                      {contact.telephone ? <div>{contact.telephone}</div> : <span className="text-muted">--</span>}
                      {contact.whatsapp ? <div className="text-muted small">WhatsApp: {contact.whatsapp}</div> : null}
                    </td>
                    <td>
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="text-decoration-none">
                          {contact.email}
                        </a>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                    <td>{renderAuthorization(contact.autorisation)}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button color="light" size="sm" onClick={() => setViewContact(contact)}>
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          <Translate contentKey="crmApp.contactAssocie.dashboard.actions.view" />
                        </Button>
                        <Button color="light" size="sm" onClick={() => handleEdit(contact)}>
                          <FontAwesomeIcon icon={faPen} className="me-1" />
                          <Translate contentKey="entity.action.edit" />
                        </Button>
                        <Button color="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(contact)}>
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          <Translate contentKey="entity.action.delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardBody>

      <ContactAssocieModal
        clientId={clientId}
        isOpen={modalOpen}
        toggle={handleCloseModal}
        contact={editingContact ?? undefined}
        onSaved={handleRefresh}
      />

      <Modal isOpen={Boolean(viewContact)} toggle={() => setViewContact(null)} centered>
        <ModalHeader toggle={() => setViewContact(null)}>
          <Translate contentKey="crmApp.contactAssocie.dashboard.viewTitle" />
        </ModalHeader>
        <ModalBody>
          {viewContact ? (
            <dl className="row mb-0">
              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.nom" />
              </dt>
              <dd className="col-sm-8">{viewContact.nom || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.prenom" />
              </dt>
              <dd className="col-sm-8">{viewContact.prenom || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.relation" />
              </dt>
              <dd className="col-sm-8">{viewContact.relation || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.telephone" />
              </dt>
              <dd className="col-sm-8">{viewContact.telephone || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.whatsapp" />
              </dt>
              <dd className="col-sm-8">{viewContact.whatsapp || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.email" />
              </dt>
              <dd className="col-sm-8">{viewContact.email || '--'}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.autorisation" />
              </dt>
              <dd className="col-sm-8">{renderAuthorization(viewContact.autorisation)}</dd>

              <dt className="col-sm-4">
                <Translate contentKey="crmApp.contactAssocie.remarques" />
              </dt>
              <dd className="col-sm-8">{viewContact.remarques || '--'}</dd>
            </dl>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewContact(null)}>
            <Translate contentKey="entity.action.close" />
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={Boolean(deleteTarget)} toggle={() => setDeleteTarget(null)} centered>
        <ModalHeader toggle={() => setDeleteTarget(null)}>
          <Translate contentKey="entity.delete.title" />
        </ModalHeader>
        <ModalBody>
          <Translate
            contentKey="crmApp.contactAssocie.dashboard.deleteQuestion"
            interpolate={{ id: deleteTarget?.id, name: `${deleteTarget?.nom ?? ''} ${deleteTarget?.prenom ?? ''}`.trim() }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteTarget(null)}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faTrash} className="me-2" />}
            <Translate contentKey="entity.action.delete" />
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default ClientContactsPanel;
