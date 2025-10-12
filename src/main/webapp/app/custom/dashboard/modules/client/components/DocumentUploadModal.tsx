import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAppDispatch } from 'app/config/store';
import { createEntity, updateEntity } from 'app/entities/document-client/document-client.reducer';
import { IDocumentClient } from 'app/shared/model/document-client.model';
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSave, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';

const DOCUMENT_TYPES = ['CIN', 'PASSEPORT', 'RC', 'ICE', 'PERMIS', 'AUTRE'] as const;

const FILE_ACCEPT = '.png,.jpg,.jpeg,.pdf';

interface DocumentUploadModalProps {
  clientId: number;
  isOpen: boolean;
  toggle: () => void;
  document?: IDocumentClient;
  onSaved: () => void;
}

interface FormState {
  typeDocument: string;
  numeroDocument: string;
  fichierUrl: string;
  fichierNom: string;
}

const defaultFormState: FormState = {
  typeDocument: '',
  numeroDocument: '',
  fichierUrl: '',
  fichierNom: '',
};

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ clientId, isOpen, toggle, document, onSaved }) => {
  const dispatch = useAppDispatch();
  const isEditMode = useMemo(() => Boolean(document?.id), [document?.id]);
  const [formValues, setFormValues] = useState<FormState>(defaultFormState);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const originalFileUrl = document?.fichierUrl ?? '';
  const originalFileName = useMemo(
    () => (document?.fichierUrl ? (document.fichierUrl.split('/').pop() ?? '') : ''),
    [document?.fichierUrl],
  );

  useEffect(() => {
    if (document && isOpen) {
      setFormValues({
        typeDocument: document.typeDocument ?? '',
        numeroDocument: document.numeroDocument ?? '',
        fichierUrl: document.fichierUrl ?? '',
        fichierNom: originalFileName,
      });
      setFile(null);
      setError(null);
      setUploading(false);
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (!isOpen) {
      setFormValues(defaultFormState);
      setFile(null);
      setError(null);
      setUploading(false);
      setSaving(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [document, isOpen, originalFileName]);

  const handleFieldChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFormValues(prev => ({ ...prev, fichierNom: selected.name }));
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFormValues(prev => ({
      ...prev,
      fichierNom: isEditMode ? originalFileName : '',
      fichierUrl: isEditMode ? originalFileUrl : '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (fileToUpload: File): Promise<string> => {
    const formData = new FormData();
    formData.append('clientId', String(clientId));
    formData.append('file', fileToUpload);

    const response = await axios.post<{ url: string }>('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!response.data?.url) {
      throw new Error('UPLOAD_FAILED');
    }

    return response.data.url;
  };

  const validate = () => {
    if (!formValues.typeDocument) {
      const message = translate('crmApp.documentClient.dashboard.validation.typeDocument');
      setError(message);
      toast.error(message);
      return false;
    }
    if (!isEditMode && !file) {
      const message = translate('crmApp.documentClient.dashboard.validation.fileRequired');
      setError(message);
      toast.error(message);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    let fichierUrl = formValues.fichierUrl;

    try {
      if (file) {
        setUploading(true);
        fichierUrl = await uploadFile(file);
        setUploading(false);
      }

      setSaving(true);

      const payload: IDocumentClient = {
        id: document?.id,
        typeDocument: formValues.typeDocument,
        numeroDocument: formValues.numeroDocument || undefined,
        fichierUrl,
        client: { id: clientId },
      };

      if (isEditMode) {
        await dispatch(updateEntity(payload)).unwrap();
        toast.success(translate('crmApp.documentClient.dashboard.messages.updateSuccess'));
      } else {
        await dispatch(createEntity(payload)).unwrap();
        toast.success(translate('crmApp.documentClient.dashboard.messages.createSuccess'));
      }

      setSaving(false);
      setError(null);
      setFormValues(defaultFormState);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSaved();
      toggle();
    } catch (err) {
      setUploading(false);
      setSaving(false);
      const message = translate('crmApp.documentClient.dashboard.messages.saveError');
      setError(message);
      toast.error(message);
    }
  };

  const modalTitle = isEditMode
    ? translate('crmApp.documentClient.dashboard.modal.editTitle')
    : translate('crmApp.documentClient.dashboard.modal.createTitle');

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade>
      <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error ? (
            <Alert color="danger" className="mb-3">
              {error}
            </Alert>
          ) : null}
          <FormGroup>
            <Label for="document-type">
              <Translate contentKey="crmApp.documentClient.typeDocument" /> *
            </Label>
            <Input
              id="document-type"
              type="select"
              value={formValues.typeDocument}
              onChange={handleFieldChange('typeDocument')}
              disabled={saving || uploading}
            >
              <option value="">{translate('crmApp.documentClient.dashboard.modal.selectPlaceholder')}</option>
              {DOCUMENT_TYPES.map(option => (
                <option key={option} value={option}>
                  {translate(`crmApp.documentClient.dashboard.types.${option}`)}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="document-numero">
              <Translate contentKey="crmApp.documentClient.numeroDocument" />
            </Label>
            <Input
              id="document-numero"
              value={formValues.numeroDocument}
              onChange={handleFieldChange('numeroDocument')}
              placeholder={translate('crmApp.documentClient.dashboard.modal.numeroPlaceholder')}
              disabled={saving || uploading}
            />
          </FormGroup>

          <FormGroup>
            <Label for="document-file">
              <Translate contentKey="crmApp.documentClient.dashboard.modal.fileLabel" />
              {!isEditMode ? ' *' : ''}
            </Label>
            {formValues.fichierUrl && !file ? (
              <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                <FontAwesomeIcon icon={faEye} className="me-1" />
                <a href={formValues.fichierUrl} target="_blank" rel="noopener noreferrer">
                  {formValues.fichierNom || translate('crmApp.documentClient.dashboard.modal.noFile')}
                </a>
                <Button color="link" size="sm" className="p-0" onClick={() => fileInputRef.current?.click()} disabled={saving || uploading}>
                  <FontAwesomeIcon icon={faUpload} className="me-1" />
                  <Translate contentKey="crmApp.documentClient.dashboard.modal.replaceFile" />
                </Button>
              </div>
            ) : null}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Input
                id="document-file"
                type="file"
                accept={FILE_ACCEPT}
                onChange={handleFileChange}
                disabled={saving || uploading}
                innerRef={fileInputRef}
              />
              {uploading ? (
                <div className="d-flex align-items-center gap-2 text-primary small">
                  <Spinner size="sm" />
                  <span>{translate('crmApp.documentClient.dashboard.modal.uploading')}</span>
                </div>
              ) : null}
              {file || formValues.fichierUrl ? (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FontAwesomeIcon icon={faUpload} className="me-1" />
                  <span>{file?.name || formValues.fichierNom || translate('crmApp.documentClient.dashboard.modal.noFile')}</span>
                  {file ? (
                    <Button color="link" size="sm" className="text-danger p-0" onClick={handleClearFile} disabled={saving || uploading}>
                      <FontAwesomeIcon icon={faTrash} className="me-1" />
                      <Translate contentKey="crmApp.documentClient.dashboard.modal.removeFile" />
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" type="button" onClick={toggle} disabled={saving || uploading}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="primary" type="submit" disabled={saving || uploading}>
            {saving || uploading ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
            <Translate contentKey="entity.action.save" />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal;
