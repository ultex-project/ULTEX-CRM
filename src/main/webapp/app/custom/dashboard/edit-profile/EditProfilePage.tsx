import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Form, FormText, Row, Spinner } from 'reactstrap';
import { Translate, isEmail, translate } from 'react-jhipster';
import axios from 'axios';
import { locales, languages } from 'app/config/translation';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import AvatarUploader from './components/AvatarUploader';
import PersonalInfoForm, { PersonalInfoFormErrors, PersonalInfoFormValues } from './components/PersonalInfoForm';
import './edit-profile.scss';

type AccountPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  login?: string;
  phone?: string;
  langKey?: string;
  imageUrl?: string | null;
};

type AccountResponse = AccountPayload & {
  id?: string | number;
  activated?: boolean;
  authorities?: string[];
};

const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);

  const [formValues, setFormValues] = useState<PersonalInfoFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    login: '',
    phone: '',
    langKey: '',
    imageUrl: undefined,
  });
  const [formErrors, setFormErrors] = useState<PersonalInfoFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(undefined);
  const temporaryPreviewRef = useRef<string | null>(null);
  const avatarFeatureEnabled =
    typeof process !== 'undefined' && process.env ? process.env.REACT_APP_ACCOUNT_AVATAR_ENABLED !== 'false' : true;
  const [avatarAvailable, setAvatarAvailable] = useState(avatarFeatureEnabled);
  const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

  const setTemporaryPreview = (url: string) => {
    if (temporaryPreviewRef.current) {
      URL.revokeObjectURL(temporaryPreviewRef.current);
    }
    temporaryPreviewRef.current = url;
    setAvatarPreviewUrl(url);
  };

  const clearTemporaryPreview = () => {
    if (temporaryPreviewRef.current) {
      URL.revokeObjectURL(temporaryPreviewRef.current);
      temporaryPreviewRef.current = null;
    }
  };

  const languageOptions = useMemo(
    () =>
      locales.map(locale => ({
        value: locale,
        label: languages[locale]?.name ?? locale,
      })),
    [],
  );

  useEffect(() => {
    const loadAccount = async () => {
      setLoading(true);
      setLoadingError(null);
      try {
        const response = await axios.get<AccountResponse>('api/account');
        const data = response.data;
        setFormValues({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email ?? '',
          login: data.login ?? '',
          phone: data.phone ?? '',
          langKey: data.langKey ?? '',
          imageUrl: data.imageUrl ?? undefined,
        });
        setAvatarPreviewUrl(data.imageUrl ?? undefined);
      } catch (error) {
        setLoadingError(translate('global.messages.loading.error') || 'Unable to load account');
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, []);

  useEffect(
    () => () => {
      if (temporaryPreviewRef.current) {
        URL.revokeObjectURL(temporaryPreviewRef.current);
        temporaryPreviewRef.current = null;
      }
    },
    [],
  );

  const validate = (values: PersonalInfoFormValues) => {
    const errors: PersonalInfoFormErrors = {};
    if (!values.firstName.trim()) {
      errors.firstName = translate('settings.messages.validate.firstname.required') || 'First name is required';
    }
    if (!values.lastName.trim()) {
      errors.lastName = translate('settings.messages.validate.lastname.required') || 'Last name is required';
    }
    if (!values.login.trim()) {
      errors.login = translate('settings.messages.validate.login.required') || 'Login is required';
    }
    if (!values.langKey.trim()) {
      errors.langKey = translate('settings.messages.validate.langKey.required') || 'Language is required';
    }
    if (!values.email.trim()) {
      errors.email = translate('global.messages.validate.email.required') || 'Email is required';
    } else if (!isEmail(values.email)) {
      errors.email = translate('global.messages.validate.email.invalid') || 'Invalid email';
    }
    return errors;
  };

  const handleChange = (field: keyof PersonalInfoFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaving(true);
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const payload: AccountPayload = {
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        login: formValues.login.trim(),
        phone: formValues.phone?.trim(),
        langKey: formValues.langKey,
        imageUrl: formValues.imageUrl ?? null,
      };

      await axios.post('api/account', payload);
      setSuccessMessage(translate('settings.messages.success') || 'Profile updated successfully');
      dispatch(getSession());
    } catch (error) {
      setSubmitError(translate('settings.messages.error') || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!avatarAvailable) {
      setSubmitError(translate('editProfile.avatarNotSupported'));
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setSubmitError(translate('editProfile.avatarTooLarge') || 'Avatar must be under 2MB');
      return;
    }
    const previousImageUrl = formValues.imageUrl ?? account?.imageUrl ?? undefined;
    const previewUrl = URL.createObjectURL(file);
    setTemporaryPreview(previewUrl);
    setUploadingAvatar(true);
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post<AccountResponse>('api/account/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const nextImageUrl = response.data?.imageUrl ?? undefined;
      clearTemporaryPreview();
      setAvatarPreviewUrl(nextImageUrl);
      setFormValues(prev => ({ ...prev, imageUrl: nextImageUrl }));
      setSuccessMessage(translate('settings.messages.success') || 'Profile updated successfully');
      dispatch(getSession());
    } catch (error) {
      clearTemporaryPreview();
      setAvatarPreviewUrl(previousImageUrl);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setAvatarAvailable(false);
        setSubmitError(translate('editProfile.avatarNotSupported'));
      } else {
        setSubmitError(translate('global.messages.upload.fail') || 'Unable to upload avatar');
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!avatarAvailable) {
      setFormValues(prev => ({ ...prev, imageUrl: undefined }));
      setAvatarPreviewUrl(undefined);
      return;
    }
    clearTemporaryPreview();
    setRemovingAvatar(true);
    setSubmitError(null);
    setSuccessMessage(null);
    const previousImageUrl = formValues.imageUrl ?? account?.imageUrl ?? undefined;
    try {
      const response = await axios.delete<AccountResponse>('api/account/avatar');
      const nextImageUrl = response.data?.imageUrl ?? undefined;
      setFormValues(prev => ({ ...prev, imageUrl: nextImageUrl }));
      setAvatarPreviewUrl(nextImageUrl);
      setSuccessMessage(translate('settings.messages.success') || 'Profile updated successfully');
      dispatch(getSession());
    } catch (error) {
      setAvatarPreviewUrl(previousImageUrl);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setAvatarAvailable(false);
        setSubmitError(translate('editProfile.avatarNotSupported'));
      } else {
        setSubmitError(translate('global.messages.delete.fail') || 'Unable to remove avatar');
      }
    } finally {
      setRemovingAvatar(false);
    }
  };

  const displayedAvatar = avatarPreviewUrl ?? formValues.imageUrl ?? account?.imageUrl;

  const renderHeaderAvatar = () => {
    const source = displayedAvatar;
    if (!source) {
      return (
        <div className="edit-profile__avatar-fallback d-flex align-items-center justify-content-center">
          <span className="text-uppercase">{account?.login?.[0] ?? 'U'}</span>
        </div>
      );
    }
    return <img src={source} alt="User avatar" className="edit-profile__avatar" />;
  };

  return (
    <div className="edit-profile-page py-4">
      <Breadcrumb listClassName="bg-transparent px-0">
        <BreadcrumbItem>
          <Link to="/dashboard">
            <Translate contentKey="global.menu.overview">Dashboard</Translate>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <Translate contentKey="global.menu.editProfile">Edit Profile</Translate>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">
            <Translate contentKey="editProfile.title">Edit Profile</Translate>
          </h2>
          <p className="text-muted mb-0">
            <Translate contentKey="editProfile.subtitle">Update your personal information</Translate>
          </p>
        </div>
        {renderHeaderAvatar()}
      </div>

      {loadingError ? (
        <Alert color="danger" className="mb-3">
          {loadingError}
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert color="success" className="mb-3">
          {successMessage}
        </Alert>
      ) : null}

      {submitError ? (
        <Alert color="danger" className="mb-3">
          {submitError}
        </Alert>
      ) : null}
      {!avatarAvailable ? (
        <Alert color="info" className="mb-3">
          <Translate contentKey="editProfile.avatarNotSupported">Avatar upload is not available on this server.</Translate>
        </Alert>
      ) : null}

      <Card className="shadow-sm border-0">
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="gy-4">
                <Col md="7" lg="8">
                  <PersonalInfoForm values={formValues} errors={formErrors} onChange={handleChange} languageOptions={languageOptions} />
                  <div className="mt-3 text-muted small">
                    <Translate contentKey="editProfile.passwordNote">
                      To change your password, go to the Password section in Account Settings.
                    </Translate>
                  </div>
                </Col>
                <Col md="5" lg="4">
                  <AvatarUploader
                    imageUrl={displayedAvatar}
                    uploading={uploadingAvatar}
                    removing={removingAvatar}
                    placeholderInitial={(account?.login ?? 'U')[0]?.toUpperCase()}
                    disabled={!avatarAvailable}
                    disabledMessage={translate('editProfile.avatarNotSupported')}
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                  />
                  <FormText color="muted" className="d-block mt-2">
                    <Translate contentKey="editProfile.avatarHint">Use a square image for best results.</Translate>
                  </FormText>
                </Col>
              </Row>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Button color="primary" type="submit" disabled={saving}>
                  {saving ? <Spinner size="sm" className="me-2" /> : null}
                  <Translate contentKey="editProfile.save">Save Changes</Translate>
                </Button>
                <Button color="secondary" outline tag={Link} to="/dashboard" disabled={saving}>
                  <Translate contentKey="editProfile.cancel">Cancel</Translate>
                </Button>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfilePage;
