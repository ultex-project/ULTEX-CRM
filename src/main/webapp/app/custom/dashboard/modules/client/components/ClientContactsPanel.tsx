import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLink, faUsers } from '@fortawesome/free-solid-svg-icons';
import { JhiItemCount, JhiPagination, Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import Select, { SingleValue } from 'react-select';

interface ClientContactsPanelProps {
  clientId: number;
}

type ContactOption = { value: number; label: string };

const AUTHORIZATION_COLORS: Record<string, string> = {
  Info: 'primary',
  Mandataire: 'warning',
  Signataire: 'success',
};

const ClientContactsPanel: React.FC<ClientContactsPanelProps> = ({ clientId }) => {
  const locale = useAppSelector(state => state.locale?.currentLocale);
  void locale;

  const [linkedContacts, setLinkedContacts] = useState<IContactAssocie[]>([]);
  const [availableContacts, setAvailableContacts] = useState<IContactAssocie[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSaving, setLinkSaving] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationState, setPaginationState] = useState({ activePage: 1, itemsPerPage: 10 });

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const [linkedResponse, availableResponse] = await Promise.all([
        axios.get<IContactAssocie[]>('api/contact-associes', {
          params: {
            'clientId.equals': clientId,
            size: 1000,
            cacheBuster: Date.now(),
          },
        }),
        axios.get<IContactAssocie[]>('api/contact-associes', {
          params: {
            'clientId.specified': false,
            size: 1000,
            cacheBuster: Date.now(),
          },
        }),
      ]);
      const linkedData = (linkedResponse.data ?? []).filter(contact => contact.client?.id === clientId);
      const availableData = (availableResponse.data ?? []).filter(contact => !contact.client?.id);
      setLinkedContacts(linkedData);
      setAvailableContacts(availableData);
    } catch (error) {
      toast.error(translate('crmApp.contactAssocie.dashboard.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    return () => {
      setLinkModalOpen(false);
      setSelectedContact(null);
      setLinkError(null);
    };
  }, [clientId]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const nextValue = searchTerm.trim().toLowerCase();
      setDebouncedSearch(nextValue);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const filteredContacts = useMemo(() => {
    if (!debouncedSearch) {
      return linkedContacts;
    }
    return linkedContacts.filter(contact => {
      const haystacks = [contact.nom, contact.prenom, contact.telephone, contact.email].map(value => (value ?? '').toLowerCase());
      return haystacks.some(value => value.includes(debouncedSearch));
    });
  }, [debouncedSearch, linkedContacts]);

  useEffect(() => {
    setPaginationState(prev => (prev.activePage === 1 ? prev : { ...prev, activePage: 1 }));
  }, [debouncedSearch, linkedContacts.length]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((filteredContacts.length || 0) / paginationState.itemsPerPage));
    if (paginationState.activePage > totalPages) {
      setPaginationState(prev => ({ ...prev, activePage: totalPages }));
    }
  }, [filteredContacts.length, paginationState.activePage, paginationState.itemsPerPage]);

  const handleOpenLinkModal = () => {
    setLinkError(null);
    setSelectedContact(null);
    setLinkModalOpen(true);
  };

  const handleLink = async () => {
    if (!selectedContact?.value) {
      setLinkError(translate('entity.validation.required'));
      return;
    }
    const contact = availableContacts.find(item => item.id === selectedContact.value);
    if (!contact) {
      setLinkError(translate('crmApp.contactAssocie.dashboard.loadError'));
      return;
    }
    try {
      setLinkSaving(true);
      await axios.put(`/api/contact-associes/${selectedContact.value}`, { ...contact, client: { id: clientId } });
      toast.success(translate('crmApp.contactAssocie.dashboard.messages.updateSuccess'));
      setLinkModalOpen(false);
      await fetchContacts();
    } catch (error) {
      setLinkError(translate('crmApp.contactAssocie.dashboard.messages.saveError'));
    } finally {
      setLinkSaving(false);
    }
  };

  const handleUnlink = async (contact: IContactAssocie) => {
    if (!contact.id) {
      return;
    }
    try {
      setUnlinkingId(contact.id);
      await axios.patch(`/api/contact-associes/${contact.id}`, { id: contact.id, client: null });
      toast.success(translate('crmApp.contactAssocie.dashboard.messages.updateSuccess'));
      setLinkedContacts(prev => prev.filter(item => item.id !== contact.id));
      setAvailableContacts(prev => {
        const exists = prev.some(item => item.id === contact.id);
        if (exists) {
          return prev.map(item => (item.id === contact.id ? { ...item, client: null } : item));
        }
        return [...prev, { ...contact, client: null }];
      });
    } catch (error) {
      toast.error(translate('crmApp.contactAssocie.dashboard.messages.saveError'));
    } finally {
      setUnlinkingId(null);
    }
  };

  const options = useMemo<ContactOption[]>(
    () =>
      availableContacts.map(contact => ({
        value: contact.id ?? 0,
        label: [contact.nom, contact.prenom].filter(Boolean).join(' ') || `#${contact.id}`,
      })),
    [availableContacts],
  );

  const renderAuthorization = (value?: string | null) => {
    if (!value) {
      return <span className="text-muted">--</span>;
    }
    const color = AUTHORIZATION_COLORS[value] ?? 'secondary';
    return (
      <Badge color={color} className="text-uppercase">
        {value}
      </Badge>
    );
  };

  const paginatedContacts = useMemo(() => {
    const startIndex = (paginationState.activePage - 1) * paginationState.itemsPerPage;
    const endIndex = startIndex + paginationState.itemsPerPage;
    return filteredContacts.slice(startIndex, endIndex);
  }, [filteredContacts, paginationState.activePage, paginationState.itemsPerPage]);

  const totalItems = filteredContacts.length;

  const handlePagination = (current: number) => setPaginationState(prev => ({ ...prev, activePage: current }));

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
        <Button color="primary" size="sm" onClick={handleOpenLinkModal}>
          <FontAwesomeIcon icon={faLink} className="me-2" />
          <Translate contentKey="crmApp.contactAssocie.dashboard.linkExisting" />
        </Button>
      </CardHeader>
      <CardBody>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <Input
            type="search"
            bsSize="sm"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="Rechercher un contact (nom, prénom, téléphone, email)"
            style={{ maxWidth: 320 }}
          />
          <div className="text-muted small">Contacts : {totalItems}</div>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center text-muted py-4">
            <FontAwesomeIcon icon={faUsers} size="2x" className="mb-3 text-secondary" />
            <p className="mb-3">
              <Translate contentKey="crmApp.contactAssocie.dashboard.empty" />
            </p>
            <Button color="primary" onClick={handleOpenLinkModal}>
              <FontAwesomeIcon icon={faLink} className="me-2" />
              <Translate contentKey="crmApp.contactAssocie.dashboard.linkExisting" />
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover bordered className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.nom" />
                  </th>
                  <th>
                    <Translate contentKey="crmApp.contactAssocie.prenom" />
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
                  <th className="text-center" style={{ width: 200 }}>
                    <Translate contentKey="crmApp.contactAssocie.dashboard.actions.label" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map(contact => (
                  <tr key={contact.id}>
                    <td className="fw-semibold">{contact.nom ? contact.nom : <span className="text-muted">--</span>}</td>
                    <td>{contact.prenom ? contact.prenom : <span className="text-muted">--</span>}</td>
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
                        <Button color="light" size="sm" tag="a" href={`/dashboard/contact-associe/${contact.id}/view`}>
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          <Translate contentKey="crmApp.contactAssocie.dashboard.actions.view" />
                        </Button>
                        <Button
                          color="light"
                          size="sm"
                          className="text-danger"
                          onClick={() => handleUnlink(contact)}
                          disabled={unlinkingId === contact.id}
                        >
                          {unlinkingId === contact.id ? <Spinner size="sm" className="me-1" /> : null}
                          <Translate contentKey="crmApp.contactAssocie.dashboard.actions.unlink" />
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
      {!loading && filteredContacts.length > 0 ? (
        <CardFooter className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <JhiItemCount page={paginationState.activePage} total={totalItems ?? 0} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center">
              <span className="text-muted small me-2">Par page</span>
              <Input
                type="select"
                bsSize="sm"
                value={paginationState.itemsPerPage}
                onChange={event =>
                  setPaginationState(prev => ({
                    ...prev,
                    itemsPerPage: Number(event.target.value),
                    activePage: 1,
                  }))
                }
                style={{ width: '96px' }}
              >
                {[10, 20, 50].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Input>
            </div>
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems ?? 0}
            />
          </div>
        </CardFooter>
      ) : null}

      <Modal isOpen={linkModalOpen} toggle={() => setLinkModalOpen(false)} centered>
        <ModalHeader toggle={() => setLinkModalOpen(false)}>
          <Translate contentKey="crmApp.contactAssocie.dashboard.linkExisting" />
        </ModalHeader>
        <ModalBody>
          <p className="text-muted mb-3">
            <Translate contentKey="crmApp.contactAssocie.dashboard.subtitle" />
          </p>
          {linkError ? (
            <Alert color="danger" className="mb-3">
              {linkError}
            </Alert>
          ) : null}
          <Select
            classNamePrefix="react-select"
            options={options}
            value={selectedContact}
            onChange={(option: SingleValue<ContactOption>) => setSelectedContact(option ?? null)}
            isLoading={loading}
            placeholder={translate('crmApp.contactAssocie.dashboard.linkExisting')}
            noOptionsMessage={() => (loading ? translate('entity.action.loading') : translate('crmApp.contactAssocie.home.notFound'))}
            styles={{
              menu: provided => ({ ...provided, zIndex: 1060 }),
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setLinkModalOpen(false)} disabled={linkSaving}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="primary" onClick={handleLink} disabled={linkSaving}>
            {linkSaving ? <Spinner size="sm" className="me-2" /> : null}
            <Translate contentKey="entity.action.save" />
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default ClientContactsPanel;
