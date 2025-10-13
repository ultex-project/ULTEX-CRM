import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'app/config/store';
import { createEntity, updateEntity } from 'app/entities/societe-liee/societe-liee.reducer';
import { ISocieteLiee } from 'app/shared/model/societe-liee.model';
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';

type SocieteLieeModalMode = 'create' | 'edit' | 'view';

interface SocieteLieeModalProps {
  clientId: number;
  isOpen: boolean;
  mode: SocieteLieeModalMode;
  societe?: ISocieteLiee;
  toggle: () => void;
  onSaved: () => void;
}

type FormState = {
  raisonSociale: string;
  formeJuridique: string;
  ice: string;
  rc: string;
  nif: string;
  secteurActivite: string;
  tailleEntreprise: string;
  adresseSiege: string;
  representantLegal: string;
};

const defaultState: FormState = {
  raisonSociale: '',
  formeJuridique: '',
  ice: '',
  rc: '',
  nif: '',
  secteurActivite: '',
  tailleEntreprise: '',
  adresseSiege: '',
  representantLegal: '',
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const SocieteLieeModal: React.FC<SocieteLieeModalProps> = ({ clientId, isOpen, mode, societe, toggle, onSaved }) => {
  const dispatch = useAppDispatch();
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';
  const isReadOnly = mode === 'view';

  const [formValues, setFormValues] = useState<FormState>(defaultState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        raisonSociale: societe?.raisonSociale ?? '',
        formeJuridique: societe?.formeJuridique ?? '',
        ice: societe?.ice ?? '',
        rc: societe?.rc ?? '',
        nif: societe?.nif ?? '',
        secteurActivite: societe?.secteurActivite ?? '',
        tailleEntreprise: societe?.tailleEntreprise ?? '',
        adresseSiege: societe?.adresseSiege ?? '',
        representantLegal: societe?.representantLegal ?? '',
      });
      setFormErrors({});
      setSubmitError(null);
      setSaving(false);
    } else {
      setFormValues(defaultState);
      setFormErrors({});
      setSubmitError(null);
      setSaving(false);
    }
  }, [isOpen, societe]);

  const modalTitle = useMemo(() => {
    if (isEditMode) {
      return translate('crmApp.societeLiee.dashboard.modal.editTitle');
    }
    if (isCreateMode) {
      return translate('crmApp.societeLiee.dashboard.modal.createTitle');
    }
    return translate('crmApp.societeLiee.dashboard.modal.viewTitle');
  }, [isCreateMode, isEditMode]);

  const handleFieldChange = (field: keyof FormState) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormValues(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };
  };

  const validate = () => {
    const errors: FormErrors = {};
    if (!formValues.raisonSociale.trim()) {
      errors.raisonSociale = translate('crmApp.societeLiee.dashboard.validation.raisonSociale');
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isReadOnly) {
      toggle();
      return;
    }

    setSubmitError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error(translate('crmApp.societeLiee.dashboard.validation.generic'));
      return;
    }

    const payload: ISocieteLiee = {
      id: societe?.id,
      raisonSociale: formValues.raisonSociale.trim(),
      formeJuridique: formValues.formeJuridique.trim() || undefined,
      ice: formValues.ice.trim() || undefined,
      rc: formValues.rc.trim() || undefined,
      nif: formValues.nif.trim() || undefined,
      secteurActivite: formValues.secteurActivite.trim() || undefined,
      tailleEntreprise: formValues.tailleEntreprise.trim() || undefined,
      adresseSiege: formValues.adresseSiege.trim() || undefined,
      representantLegal: formValues.representantLegal.trim() || undefined,
      client: { id: clientId },
    };

    try {
      setSaving(true);
      if (isEditMode) {
        await dispatch(updateEntity(payload)).unwrap();
        toast.success(translate('crmApp.societeLiee.dashboard.messages.updateSuccess'));
      } else {
        await dispatch(createEntity(payload)).unwrap();
        toast.success(translate('crmApp.societeLiee.dashboard.messages.createSuccess'));
      }
      setSaving(false);
      onSaved();
      toggle();
    } catch (error) {
      setSaving(false);
      const message = translate('crmApp.societeLiee.dashboard.messages.saveError');
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade>
      <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
      <Form onSubmit={isReadOnly ? undefined : handleSubmit} noValidate>
        <ModalBody>
          {isReadOnly ? (
            <Alert color="info" className="mb-3">
              <Translate contentKey="crmApp.societeLiee.dashboard.modal.viewInfo" />
            </Alert>
          ) : null}

          {submitError ? (
            <Alert color="danger" className="mb-3">
              {submitError}
            </Alert>
          ) : null}

          <FormGroup>
            <Label for="societe-raison-sociale">
              <Translate contentKey="crmApp.societeLiee.raisonSociale" /> *
            </Label>
            <Input
              id="societe-raison-sociale"
              value={formValues.raisonSociale}
              onChange={handleFieldChange('raisonSociale')}
              disabled={saving || isReadOnly}
              invalid={Boolean(formErrors.raisonSociale)}
            />
            {formErrors.raisonSociale ? <FormFeedback>{formErrors.raisonSociale}</FormFeedback> : null}
          </FormGroup>

          <FormGroup>
            <Label for="societe-forme-juridique">
              <Translate contentKey="crmApp.societeLiee.formeJuridique" />
            </Label>
            <Input
              id="societe-forme-juridique"
              value={formValues.formeJuridique}
              onChange={handleFieldChange('formeJuridique')}
              disabled={saving || isReadOnly}
            />
          </FormGroup>

          <FormGroup>
            <Label for="societe-ice">
              <Translate contentKey="crmApp.societeLiee.ice" />
            </Label>
            <Input id="societe-ice" value={formValues.ice} onChange={handleFieldChange('ice')} disabled={saving || isReadOnly} />
          </FormGroup>

          <FormGroup>
            <Label for="societe-rc">
              <Translate contentKey="crmApp.societeLiee.rc" />
            </Label>
            <Input id="societe-rc" value={formValues.rc} onChange={handleFieldChange('rc')} disabled={saving || isReadOnly} />
          </FormGroup>

          <FormGroup>
            <Label for="societe-nif">
              <Translate contentKey="crmApp.societeLiee.nif" />
            </Label>
            <Input id="societe-nif" value={formValues.nif} onChange={handleFieldChange('nif')} disabled={saving || isReadOnly} />
          </FormGroup>

          <FormGroup>
            <Label for="societe-secteur-activite">
              <Translate contentKey="crmApp.societeLiee.secteurActivite" />
            </Label>
            <Input
              id="societe-secteur-activite"
              value={formValues.secteurActivite}
              onChange={handleFieldChange('secteurActivite')}
              disabled={saving || isReadOnly}
            />
          </FormGroup>

          <FormGroup>
            <Label for="societe-taille-entreprise">
              <Translate contentKey="crmApp.societeLiee.tailleEntreprise" />
            </Label>
            <Input
              id="societe-taille-entreprise"
              value={formValues.tailleEntreprise}
              onChange={handleFieldChange('tailleEntreprise')}
              disabled={saving || isReadOnly}
            />
          </FormGroup>

          <FormGroup>
            <Label for="societe-adresse-siege">
              <Translate contentKey="crmApp.societeLiee.adresseSiege" />
            </Label>
            <Input
              id="societe-adresse-siege"
              type="textarea"
              rows={3}
              value={formValues.adresseSiege}
              onChange={handleFieldChange('adresseSiege')}
              disabled={saving || isReadOnly}
            />
          </FormGroup>

          <FormGroup>
            <Label for="societe-representant-legal">
              <Translate contentKey="crmApp.societeLiee.representantLegal" />
            </Label>
            <Input
              id="societe-representant-legal"
              value={formValues.representantLegal}
              onChange={handleFieldChange('representantLegal')}
              disabled={saving || isReadOnly}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={saving}>
            <Translate contentKey={isReadOnly ? 'entity.action.close' : 'entity.action.cancel'} />
          </Button>
          {isReadOnly ? null : (
            <Button color="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
              <Translate contentKey="entity.action.save" />
            </Button>
          )}
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default SocieteLieeModal;
