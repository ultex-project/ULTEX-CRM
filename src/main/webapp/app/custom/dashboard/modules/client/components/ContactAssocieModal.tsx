import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from 'app/config/store';
import { createEntity, updateEntity } from 'app/entities/contact-associe/contact-associe.reducer';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';
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

interface ContactAssocieModalProps {
  clientId: number;
  isOpen: boolean;
  toggle: () => void;
  contact?: IContactAssocie;
  onSaved: () => void;
}

type FormState = {
  nom: string;
  prenom: string;
  relation: string;
  telephone: string;
  whatsapp: string;
  email: string;
  autorisation: string;
  remarques: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const defaultState: FormState = {
  nom: '',
  prenom: '',
  relation: '',
  telephone: '',
  whatsapp: '',
  email: '',
  autorisation: '',
  remarques: '',
};

const AUTHORIZATIONS = ['Info', 'Mandataire', 'Signataire'] as const;

const ContactAssocieModal: React.FC<ContactAssocieModalProps> = ({ clientId, isOpen, toggle, contact, onSaved }) => {
  const dispatch = useAppDispatch();
  const isEditMode = useMemo(() => Boolean(contact?.id), [contact?.id]);

  const [formValues, setFormValues] = useState<FormState>(defaultState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        nom: contact?.nom ?? '',
        prenom: contact?.prenom ?? '',
        relation: contact?.relation ?? '',
        telephone: contact?.telephone ?? '',
        whatsapp: contact?.whatsapp ?? '',
        email: contact?.email ?? '',
        autorisation: contact?.autorisation ?? '',
        remarques: contact?.remarques ?? '',
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
  }, [isOpen, contact]);

  const handleFieldChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const validate = () => {
    const errors: FormErrors = {};
    if (!formValues.nom.trim()) {
      errors.nom = translate('crmApp.contactAssocie.dashboard.validation.nom');
    }
    if (!formValues.prenom.trim()) {
      errors.prenom = translate('crmApp.contactAssocie.dashboard.validation.prenom');
    }
    if (!formValues.email.trim()) {
      errors.email = translate('crmApp.contactAssocie.dashboard.validation.email');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formValues.email.trim())) {
        errors.email = translate('crmApp.contactAssocie.dashboard.validation.emailInvalid');
      }
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error(translate('crmApp.contactAssocie.dashboard.validation.generic'));
      return;
    }

    const payload: IContactAssocie = {
      id: contact?.id,
      nom: formValues.nom.trim(),
      prenom: formValues.prenom.trim(),
      relation: formValues.relation.trim() || undefined,
      telephone: formValues.telephone.trim() || undefined,
      whatsapp: formValues.whatsapp.trim() || undefined,
      email: formValues.email.trim(),
      autorisation: formValues.autorisation || undefined,
      remarques: formValues.remarques.trim() || undefined,
      client: { id: clientId },
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await dispatch(updateEntity(payload)).unwrap();
        toast.success(translate('crmApp.contactAssocie.dashboard.messages.updateSuccess'));
      } else {
        await dispatch(createEntity(payload)).unwrap();
        toast.success(translate('crmApp.contactAssocie.dashboard.messages.createSuccess'));
      }

      setSaving(false);
      setFormErrors({});
      onSaved();
      toggle();
    } catch (error) {
      setSaving(false);
      const message = translate('crmApp.contactAssocie.dashboard.messages.saveError');
      setSubmitError(message);
      toast.error(message);
    }
  };

  const modalTitle = isEditMode
    ? translate('crmApp.contactAssocie.dashboard.modal.editTitle')
    : translate('crmApp.contactAssocie.dashboard.modal.createTitle');

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered fade>
      <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
      <Form onSubmit={handleSubmit} noValidate>
        <ModalBody>
          {submitError ? (
            <Alert color="danger" className="mb-3">
              {submitError}
            </Alert>
          ) : null}

          <FormGroup>
            <Label for="contact-nom">
              <Translate contentKey="crmApp.contactAssocie.nom" /> *
            </Label>
            <Input
              id="contact-nom"
              value={formValues.nom}
              onChange={handleFieldChange('nom')}
              disabled={saving}
              invalid={Boolean(formErrors.nom)}
            />
            {formErrors.nom ? <FormFeedback>{formErrors.nom}</FormFeedback> : null}
          </FormGroup>

          <FormGroup>
            <Label for="contact-prenom">
              <Translate contentKey="crmApp.contactAssocie.prenom" /> *
            </Label>
            <Input
              id="contact-prenom"
              value={formValues.prenom}
              onChange={handleFieldChange('prenom')}
              disabled={saving}
              invalid={Boolean(formErrors.prenom)}
            />
            {formErrors.prenom ? <FormFeedback>{formErrors.prenom}</FormFeedback> : null}
          </FormGroup>

          <FormGroup>
            <Label for="contact-relation">
              <Translate contentKey="crmApp.contactAssocie.relation" />
            </Label>
            <Input id="contact-relation" value={formValues.relation} onChange={handleFieldChange('relation')} disabled={saving} />
          </FormGroup>

          <FormGroup>
            <Label for="contact-telephone">
              <Translate contentKey="crmApp.contactAssocie.telephone" />
            </Label>
            <Input id="contact-telephone" value={formValues.telephone} onChange={handleFieldChange('telephone')} disabled={saving} />
          </FormGroup>

          <FormGroup>
            <Label for="contact-whatsapp">
              <Translate contentKey="crmApp.contactAssocie.whatsapp" />
            </Label>
            <Input id="contact-whatsapp" value={formValues.whatsapp} onChange={handleFieldChange('whatsapp')} disabled={saving} />
          </FormGroup>

          <FormGroup>
            <Label for="contact-email">
              <Translate contentKey="crmApp.contactAssocie.email" /> *
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={formValues.email}
              onChange={handleFieldChange('email')}
              disabled={saving}
              invalid={Boolean(formErrors.email)}
            />
            {formErrors.email ? <FormFeedback>{formErrors.email}</FormFeedback> : null}
          </FormGroup>

          <FormGroup>
            <Label for="contact-autorisation">
              <Translate contentKey="crmApp.contactAssocie.autorisation" />
            </Label>
            <Input
              id="contact-autorisation"
              type="select"
              value={formValues.autorisation}
              onChange={handleFieldChange('autorisation')}
              disabled={saving}
            >
              <option value="">{translate('crmApp.contactAssocie.dashboard.modal.authorizationPlaceholder')}</option>
              {AUTHORIZATIONS.map(option => (
                <option key={option} value={option}>
                  {translate(`crmApp.contactAssocie.dashboard.authorizations.${option}`)}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="contact-remarques">
              <Translate contentKey="crmApp.contactAssocie.remarques" />
            </Label>
            <Input
              id="contact-remarques"
              type="textarea"
              value={formValues.remarques}
              onChange={handleFieldChange('remarques')}
              disabled={saving}
              rows={3}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" type="button" onClick={toggle} disabled={saving}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
          <Button color="primary" type="submit" disabled={saving}>
            {saving ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
            <Translate contentKey="entity.action.save" />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ContactAssocieModal;
