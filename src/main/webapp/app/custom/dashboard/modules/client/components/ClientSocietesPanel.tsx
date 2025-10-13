import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity as deleteSociete, getEntities as getSocietes } from 'app/entities/societe-liee/societe-liee.reducer';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';
import { Button, Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEye, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';

import SocieteLieeModal from './SocieteLieeModal';

interface ClientSocietesPanelProps {
  clientId: number;
}

type ModalConfig = {
  mode: 'create' | 'edit' | 'view';
  societe: ISocieteLiee | null;
};

const ClientSocietesPanel: React.FC<ClientSocietesPanelProps> = ({ clientId }) => {
  const dispatch = useAppDispatch();
  const societes = useAppSelector(state => state.societeLiee.entities);
  const loading = useAppSelector(state => state.societeLiee.loading);
  const updating = useAppSelector(state => state.societeLiee.updating);

  const [modalConfig, setModalConfig] = useState<ModalConfig>({ mode: 'create', societe: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ISocieteLiee | null>(null);

  useEffect(() => {
    dispatch(getSocietes({ query: `clientId.equals=${clientId}`, sort: 'id,desc' }));
    return () => {
      setIsModalOpen(false);
      setModalConfig({ mode: 'create', societe: null });
      setDeleteTarget(null);
    };
  }, [dispatch, clientId]);

  const handleRefresh = () => {
    dispatch(getSocietes({ query: `clientId.equals=${clientId}`, sort: 'id,desc' }));
  };

  const handleOpenCreate = () => {
    setModalConfig({ mode: 'create', societe: null });
    setIsModalOpen(true);
  };

  const handleOpenView = (societe: ISocieteLiee) => {
    setModalConfig({ mode: 'view', societe });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (societe: ISocieteLiee) => {
    setModalConfig({ mode: 'edit', societe });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig({ mode: 'create', societe: null });
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    try {
      await dispatch(deleteSociete(deleteTarget.id)).unwrap();
      toast.success(translate('crmApp.societeLiee.dashboard.messages.deleteSuccess'));
      setDeleteTarget(null);
      handleRefresh();
    } catch (error) {
      toast.error(translate('crmApp.societeLiee.dashboard.messages.deleteError'));
    }
  };

  const displayedSocietes = useMemo(() => societes.filter(societe => societe.client?.id === clientId), [societes, clientId]);

  return (
    <Card className="shadow-sm border-0 mt-4">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <Translate contentKey="crmApp.societeLiee.dashboard.title" />
          </h5>
          <small className="text-muted">
            <Translate contentKey="crmApp.societeLiee.dashboard.subtitle" />
          </small>
        </div>
        <Button color="primary" size="sm" onClick={handleOpenCreate}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          <Translate contentKey="crmApp.societeLiee.dashboard.add" />
        </Button>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : displayedSocietes.length === 0 ? (
          <div className="text-center text-muted py-4">
            <FontAwesomeIcon icon={faBuilding} size="2x" className="mb-3 text-secondary" />
            <p className="mb-3">
              <Translate contentKey="crmApp.societeLiee.dashboard.empty" />
            </p>
            <Button color="primary" onClick={handleOpenCreate}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              <Translate contentKey="crmApp.societeLiee.dashboard.add" />
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.raisonSociale" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.formeJuridique" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.ice" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.rc" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.societeLiee.dashboard.columns.representantLegal" />
                  </th>
                  <th className="text-center" style={{ width: 220 }}>
                    <Translate contentKey="crmApp.societeLiee.dashboard.actions.label" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedSocietes.map(societe => (
                  <tr key={societe.id}>
                    <td>
                      <div className="fw-semibold">{societe.raisonSociale ?? '--'}</div>
                      {societe.tailleEntreprise ? (
                        <div className="text-muted small">
                          <Translate contentKey="crmApp.societeLiee.tailleEntreprise" />: {societe.tailleEntreprise}
                        </div>
                      ) : null}
                    </td>
                    <td>{societe.formeJuridique || <span className="text-muted">--</span>}</td>
                    <td>{societe.ice || <span className="text-muted">--</span>}</td>
                    <td>{societe.rc || <span className="text-muted">--</span>}</td>
                    <td>
                      {societe.representantLegal ? (
                        <div>
                          {societe.representantLegal}
                          {societe.secteurActivite ? <div className="text-muted small">{societe.secteurActivite}</div> : null}
                        </div>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button color="light" size="sm" onClick={() => handleOpenView(societe)}>
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          <Translate contentKey="crmApp.societeLiee.dashboard.actions.view" />
                        </Button>
                        <Button color="light" size="sm" onClick={() => handleOpenEdit(societe)}>
                          <FontAwesomeIcon icon={faPen} className="me-1" />
                          <Translate contentKey="entity.action.edit" />
                        </Button>
                        <Button color="light" size="sm" className="text-danger" onClick={() => setDeleteTarget(societe)}>
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

      <SocieteLieeModal
        clientId={clientId}
        isOpen={isModalOpen}
        mode={modalConfig.mode}
        societe={modalConfig.societe ?? undefined}
        toggle={handleCloseModal}
        onSaved={handleRefresh}
      />

      <Modal isOpen={Boolean(deleteTarget)} toggle={() => setDeleteTarget(null)} centered>
        <ModalHeader toggle={() => setDeleteTarget(null)}>
          <Translate contentKey="entity.delete.title" />
        </ModalHeader>
        <ModalBody>
          <Translate
            contentKey="crmApp.societeLiee.dashboard.deleteQuestion"
            interpolate={{ id: deleteTarget?.id, name: deleteTarget?.raisonSociale ?? '' }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteTarget(null)}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={updating}>
            {updating ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faTrash} className="me-2" />}
            <Translate contentKey="entity.action.delete" />
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default ClientSocietesPanel;
