import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { useAppDispatch } from 'app/config/store';
import { createEntity } from 'app/entities/contact-associe/contact-associe.reducer';
import { IContactAssocie } from 'app/shared/model/contact-associe.model';

import './ContactAssocieCreatePage.scss';

type ContactFormState = {
  nom: string;
  prenom: string;
  relation: string;
  telephone: string;
  whatsapp: string;
  email: string;
  autorisation: string;
  remarques: string;
};

type FormErrors = Partial<Record<keyof ContactFormState, string>>;

const CONTACT_FORM_ID = 'contact-associe-form';

const mapStateToPayload = (values: ContactFormState): IContactAssocie => {
  const toOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  };

  return {
    nom: values.nom.trim(),
    prenom: values.prenom.trim(),
    relation: toOptional(values.relation),
    telephone: toOptional(values.telephone),
    whatsapp: toOptional(values.whatsapp),
    email: toOptional(values.email),
    autorisation: toOptional(values.autorisation),
    remarques: toOptional(values.remarques),
  };
};

const ContactAssocieCreatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<ContactFormState>({
    nom: '',
    prenom: '',
    relation: '',
    telephone: '',
    whatsapp: '',
    email: '',
    autorisation: '',
    remarques: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof ContactFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const renderError = (field: keyof ContactFormState) =>
    formErrors[field] ? <div className="text-danger small mt-1">{formErrors[field]}</div> : null;

  const handleTelephoneChange = (value: string) => {
    const sanitized = value.replace(/^\+/, '');
    setFormValues(prev => ({ ...prev, telephone: sanitized ? `+${sanitized}` : '' }));
  };

  const validate = () => {
    const errors: FormErrors = {};
    if (!formValues.nom.trim()) {
      errors.nom = translate('entity.validation.required');
    }
    if (!formValues.prenom.trim()) {
      errors.prenom = translate('entity.validation.required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    navigate('/dashboard/contact-associe');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = mapStateToPayload(formValues);
      await dispatch(createEntity(payload)).unwrap();
      navigate('/dashboard/contact-associe', { replace: true });
    } catch (error) {
      const message =
        (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
          ? error.message
          : translate('crmApp.contactAssocie.home.notFound')) ?? translate('crmApp.contactAssocie.home.notFound');
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-associe-create-page">
      <Card className="shadow-sm border-0">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h5 className="mb-1">
                <Translate contentKey="crmApp.contactAssocie.home.createLabel" />
              </h5>
              <p className="mb-0 text-muted">
                <Translate contentKey="crmApp.contactAssocie.home.title" />
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button color="secondary" outline onClick={handleCancel} disabled={submitting}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                <Translate contentKey="entity.action.back" />
              </Button>
              <Button color="primary" type="submit" form={CONTACT_FORM_ID} disabled={submitting}>
                {submitting ? <Spinner size="sm" className="me-2" /> : <FontAwesomeIcon icon={faSave} className="me-2" />}
                <Translate contentKey="entity.action.save" />
              </Button>
            </div>
          </div>

          {submitError ? (
            <Alert color="danger" className="mb-4">
              {submitError}
            </Alert>
          ) : null}

          <Form id={CONTACT_FORM_ID} onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md="6">
                <FormGroup>
                  <Label for="contact-nom">
                    <Translate contentKey="crmApp.contactAssocie.nom" /> *
                  </Label>
                  <Input id="contact-nom" value={formValues.nom} onChange={handleChange('nom')} />
                  {renderError('nom')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-prenom">
                    <Translate contentKey="crmApp.contactAssocie.prenom" /> *
                  </Label>
                  <Input id="contact-prenom" value={formValues.prenom} onChange={handleChange('prenom')} />
                  {renderError('prenom')}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-relation">
                    <Translate contentKey="crmApp.contactAssocie.relation" />
                  </Label>
                  <Input id="contact-relation" value={formValues.relation} onChange={handleChange('relation')} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-telephone">
                    <Translate contentKey="crmApp.contactAssocie.telephone" />
                  </Label>
                  <PhoneInput
                    country="ma"
                    value={formValues.telephone.replace(/^\+/, '')}
                    onChange={handleTelephoneChange}
                    inputClass="form-control"
                    containerClass="w-100"
                    inputProps={{
                      id: 'contact-telephone',
                      name: 'contact-telephone',
                      autoComplete: 'tel',
                      'data-testid': 'contact-telephone',
                    }}
                    disabled={submitting}
                    specialLabel=""
                    enableSearch
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-whatsapp">WhatsApp</Label>
                  <Input id="contact-whatsapp" value={formValues.whatsapp} onChange={handleChange('whatsapp')} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-email">
                    <Translate contentKey="crmApp.contactAssocie.email" />
                  </Label>
                  <Input id="contact-email" type="email" value={formValues.email} onChange={handleChange('email')} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="contact-autorisation">
                    <Translate contentKey="crmApp.contactAssocie.autorisation" />
                  </Label>
                  <Input id="contact-autorisation" value={formValues.autorisation} onChange={handleChange('autorisation')} />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="contact-remarques">
                    <Translate contentKey="crmApp.contactAssocie.remarques" />
                  </Label>
                  <Input
                    id="contact-remarques"
                    type="textarea"
                    rows={4}
                    value={formValues.remarques}
                    onChange={handleChange('remarques')}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ContactAssocieCreatePage;
