import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getDocuments, deleteEntity as deleteDoc } from 'app/entities/document-client/document-client.reducer';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileAlt, faTrash, faPen, faPlus, faEye, faFolderOpen, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IDocumentClient } from 'app/shared/model/document-client.model';
import { toast } from 'react-toastify';

import DocumentUploadModal from './DocumentUploadModal';

interface ClientDocumentsPanelProps {
  clientId: number;
}

const TYPE_ICONS: Record<string, IconDefinition> = {
  CIN: faFileAlt,
  PASSEPORT: faFileAlt,
  RC: faFileAlt,
  ICE: faFileAlt,
  PERMIS: faFileAlt,
  AUTRE: faFileAlt,
};

const DOCUMENT_TYPES = ['CIN', 'PASSEPORT', 'RC', 'ICE', 'PERMIS', 'AUTRE'] as const;

const TYPE_COLORS: Record<string, string> = {
  CIN: 'primary',
  PASSEPORT: 'warning',
  RC: 'info',
  ICE: 'warning',
  PERMIS: 'danger',
  AUTRE: 'secondary',
};

const getBadgeClass = (type?: string) => {
  const color = (type && TYPE_COLORS[type]) || 'secondary';
  return `badge rounded-pill bg-${color}`;
};

const ClientDocumentsPanel: React.FC<ClientDocumentsPanelProps> = ({ clientId }) => {
  const dispatch = useAppDispatch();
  const documents = useAppSelector(state => state.documentClient.entities);
  const loading = useAppSelector(state => state.documentClient.loading);
  const deleting = useAppSelector(state => state.documentClient.updating);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<IDocumentClient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDocumentClient | null>(null);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    dispatch(getDocuments({ page: 0, size: 50, sort: 'id,desc' }));
    return () => {
      setEditingDocument(null);
      setModalOpen(false);
      setDeleteTarget(null);
    };
  }, [dispatch, clientId]);

  const handleRefresh = () => {
    dispatch(getDocuments({ page: 0, size: 50, sort: 'id,desc' }));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDocument(null);
  };

  const handleOpenCreate = () => {
    setEditingDocument(null);
    setModalOpen(true);
  };

  const handleEdit = (doc: IDocumentClient) => {
    setEditingDocument(doc);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }
    try {
      await dispatch(deleteDoc(deleteTarget.id)).unwrap();
      toast.success(translate('crmApp.documentClient.dashboard.messages.deleteSuccess'));
      setDeleteTarget(null);
      handleRefresh();
    } catch (error) {
      toast.error(translate('crmApp.documentClient.dashboard.messages.deleteError'));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const base = documents.filter(doc => doc.client?.id === clientId);
    const byType = filterType ? base.filter(doc => (doc.typeDocument ?? '') === filterType) : base;
    const bySearch = normalizedSearch ? byType.filter(doc => (doc.numeroDocument ?? '').toLowerCase().includes(normalizedSearch)) : byType;
    const sorted = [...bySearch].sort((a, b) => {
      const left = a.id ?? 0;
      const right = b.id ?? 0;
      return sortOrder === 'asc' ? left - right : right - left;
    });
    return sorted;
  }, [documents, clientId, filterType, searchTerm, sortOrder]);

  const groupedDocuments = useMemo(() => {
    const groups = filteredDocuments.reduce<Record<string, IDocumentClient[]>>((accumulator, doc) => {
      const key = doc.typeDocument ?? 'AUTRE';
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(doc);
      return accumulator;
    }, {});
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredDocuments]);

  const renderDocumentType = (document: IDocumentClient) => {
    const type = document.typeDocument ?? 'AUTRE';
    const icon = TYPE_ICONS[type] ?? faFileAlt;
    return (
      <span className={`${getBadgeClass(type)} d-inline-flex align-items-center gap-2`} style={{ fontWeight: 600 }}>
        <FontAwesomeIcon icon={icon} />
        {translate(`crmApp.documentClient.dashboard.types.${type}`)}
      </span>
    );
  };

  const resolveFileName = (url?: string | null) => {
    if (!url) {
      return '--';
    }
    const decoded = decodeURIComponent(url);
    return decoded.split('/').pop() ?? decoded;
  };

  return (
    <Card className="shadow-sm border-0 mt-4">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <Translate contentKey="crmApp.documentClient.dashboard.title" />
          </h5>
          <small className="text-muted">
            <Translate contentKey="crmApp.documentClient.dashboard.subtitle" />
          </small>
        </div>
        <Button color="primary" size="sm" onClick={handleOpenCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          <Translate contentKey="crmApp.documentClient.dashboard.add" />
        </Button>
      </CardHeader>
      <CardBody>
        <Row className="gy-2 gx-3 mb-3 align-items-end">
          <Col md="4">
            <Input
              type="select"
              value={filterType}
              onChange={event => setFilterType(event.target.value)}
              className={filterType ? 'border-primary text-primary' : ''}
            >
              <option value="">{translate('crmApp.documentClient.dashboard.filters.all')}</option>
              {DOCUMENT_TYPES.map(option => (
                <option key={option} value={option}>
                  {translate(`crmApp.documentClient.dashboard.types.${option}`)}
                </option>
              ))}
            </Input>
          </Col>
          <Col md="4">
            <Input
              type="text"
              placeholder={translate('crmApp.documentClient.dashboard.filters.searchPlaceholder')}
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </Col>
          <Col md="4" className="text-md-end">
            <Button outline color="secondary" onClick={toggleSortOrder} className="me-2">
              <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} className="me-2" />
              <Translate contentKey="crmApp.documentClient.dashboard.filters.sort" />
            </Button>
            {filterType || searchTerm ? (
              <Button
                color="link"
                className="text-decoration-none"
                onClick={() => {
                  setFilterType('');
                  setSearchTerm('');
                }}
              >
                <Translate contentKey="crmApp.documentClient.dashboard.filters.reset" />
              </Button>
            ) : null}
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center text-muted py-4">
            <FontAwesomeIcon icon={faFolderOpen} size="2x" className="mb-3 text-secondary" />
            <p className="mb-2">
              <Translate contentKey="crmApp.documentClient.dashboard.empty" />
            </p>
            <Button color="primary" onClick={handleOpenCreate} size="sm">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <Translate contentKey="crmApp.documentClient.dashboard.add" />
            </Button>
          </div>
        ) : (
          groupedDocuments.map(([type, docs]) => (
            <div key={type} className="mb-4">
              <h6 className="text-uppercase text-muted mb-3">{translate(`crmApp.documentClient.dashboard.types.${type}`)}</h6>
              <div className="table-responsive">
                <Table hover bordered className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>
                        <Translate contentKey="crmApp.documentClient.typeDocument" />
                      </th>
                      <th>
                        <Translate contentKey="crmApp.documentClient.numeroDocument" />
                      </th>
                      <th style={{ width: 220 }}>
                        <Translate contentKey="crmApp.documentClient.dashboard.file" />
                      </th>
                      <th style={{ width: 180 }} className="text-center">
                        <Translate contentKey="crmApp.documentClient.dashboard.actions" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map(doc => (
                      <tr key={doc.id}>
                        <td>{renderDocumentType(doc)}</td>
                        <td>
                          <div className="fw-semibold">{doc.numeroDocument ?? '--'}</div>
                          {doc.id ? <div className="text-muted small">#{doc.id}</div> : null}
                        </td>
                        <td>
                          {doc.fichierUrl ? (
                            <Button
                              color="link"
                              className="p-0"
                              tag="a"
                              href={doc.fichierUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={translate('crmApp.documentClient.dashboard.actionsTooltip.view')}
                            >
                              <FontAwesomeIcon icon={doc.fichierUrl.toLowerCase().endsWith('.pdf') ? faFilePdf : faEye} className="me-2" />
                              {resolveFileName(doc.fichierUrl)}
                            </Button>
                          ) : (
                            <span className="text-muted">
                              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                              {translate('crmApp.documentClient.dashboard.emptyFile')}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              color="light"
                              size="sm"
                              onClick={() => handleEdit(doc)}
                              title={translate('crmApp.documentClient.dashboard.actionsTooltip.edit')}
                            >
                              <FontAwesomeIcon icon={faPen} className="me-1" />
                              <Translate contentKey="entity.action.edit" />
                            </Button>
                            <Button
                              color="light"
                              size="sm"
                              className="text-danger"
                              onClick={() => setDeleteTarget(doc)}
                              title={translate('crmApp.documentClient.dashboard.actionsTooltip.delete')}
                            >
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
            </div>
          ))
        )}
      </CardBody>

      <DocumentUploadModal
        clientId={clientId}
        isOpen={modalOpen}
        toggle={handleCloseModal}
        document={editingDocument ?? undefined}
        onSaved={handleRefresh}
      />

      <Modal isOpen={deleteTarget !== null} toggle={() => setDeleteTarget(null)} centered>
        <ModalHeader toggle={() => setDeleteTarget(null)}>
          <Translate contentKey="entity.delete.title" />
        </ModalHeader>
        <ModalBody>
          <Translate
            contentKey="crmApp.documentClient.dashboard.deleteQuestion"
            interpolate={{
              id: deleteTarget?.id,
              type: deleteTarget?.typeDocument ? translate(`crmApp.documentClient.dashboard.types.${deleteTarget.typeDocument}`) : '',
            }}
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

export default ClientDocumentsPanel;
