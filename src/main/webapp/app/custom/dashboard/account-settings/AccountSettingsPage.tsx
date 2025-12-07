import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faEnvelope, faLock, faMobileAlt, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from 'app/config/store';
import './account-settings.scss';

type SessionItem = {
  id: string;
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
};

const sessionsMock: SessionItem[] = [
  { id: '1', browser: 'Chrome', os: 'macOS', ip: '192.168.0.12', lastActive: 'Il y a 5 minutes' },
  { id: '2', browser: 'Firefox', os: 'Windows', ip: '10.0.0.5', lastActive: 'Aujourd’hui, 10:14' },
  { id: '3', browser: 'Safari', os: 'iOS', ip: '82.45.10.31', lastActive: 'Hier, 21:02' },
];

const browserIcon = (_browser: string) => faDesktop;

const AccountSettingsPage = () => {
  const account = useAppSelector(state => state.authentication.account);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [email, setEmail] = useState(account?.email ?? '');
  const [login, setLogin] = useState(account?.login ?? '');
  const [emailVerified] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
    sms: Boolean(account?.phone),
  });
  const [privacy, setPrivacy] = useState({ visibility: 'team', dms: true, adminAccess: true });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initials = useMemo(() => (account?.login?.[0] ?? 'U').toUpperCase(), [account?.login]);
  const avatarSrc = account?.imageUrl;

  const handlePasswordChange = (field: 'current' | 'next' | 'confirm', value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationsChange = (field: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePrivacyChange = (field: keyof typeof privacy, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('Les paramètres ont été mis à jour.');
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage('Les informations de connexion ont été mises à jour.');
  };

  return (
    <div className="account-settings-page py-4">
      <Breadcrumb listClassName="bg-transparent px-0">
        <BreadcrumbItem>
          <Link to="/dashboard">Aperçu</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Paramètres du compte</BreadcrumbItem>
      </Breadcrumb>

      <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">Paramètres du compte</h2>
          <p className="text-muted mb-0">Gérez les paramètres liés à votre compte et votre sécurité.</p>
        </div>
        {avatarSrc ? (
          <img src={avatarSrc} alt="Avatar" className="account-settings__avatar" />
        ) : (
          <div className="account-settings__avatar-fallback d-flex align-items-center justify-content-center">{initials}</div>
        )}
      </div>

      {successMessage ? (
        <Alert color="success" className="mb-3">
          {successMessage}
        </Alert>
      ) : null}

      <Row className="gy-4">
        <Col lg="8">
          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white d-flex align-items-center">
              <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
              <div>
                <h6 className="mb-0">Sécurité du mot de passe</h6>
                <small className="text-muted">Mettez à jour votre mot de passe pour renforcer la sécurité.</small>
              </div>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handlePasswordSubmit}>
                <FormGroup className="mb-3">
                  <Label for="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="********"
                    value={passwords.current}
                    onChange={e => handlePasswordChange('current', e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="********"
                    value={passwords.next}
                    onChange={e => handlePasswordChange('next', e.target.value)}
                  />
                  <small className="text-muted d-block mt-1">Utilisez au moins 8 caractères avec chiffres et symboles.</small>
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={passwords.confirm}
                    onChange={e => handlePasswordChange('confirm', e.target.value)}
                  />
                </FormGroup>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <Button color="primary" type="submit">
                    Enregistrer
                  </Button>
                  <small className="text-muted">Pour des raisons de sécurité, choisissez un mot de passe fort.</small>
                </div>
              </Form>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white d-flex align-items-center">
              <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
              <div>
                <h6 className="mb-0">Informations de connexion</h6>
                <small className="text-muted">Mettez à jour votre email ou vérifiez votre identité.</small>
              </div>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleLoginSubmit}>
                <FormGroup className="mb-3">
                  <Label for="email">Adresse email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <small className={emailVerified ? 'text-success' : 'text-warning'}>
                    {emailVerified ? 'Email vérifié' : 'Email non vérifié'}
                  </small>
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="username">Nom d’utilisateur</Label>
                  <Input id="username" type="text" value={login} onChange={e => setLogin(e.target.value)} readOnly />
                </FormGroup>
                <div className="d-flex flex-wrap gap-2">
                  <Button color="primary" type="submit">
                    Enregistrer
                  </Button>
                  {!emailVerified ? (
                    <Button color="secondary" outline type="button">
                      Envoyer un email de vérification
                    </Button>
                  ) : null}
                </div>
              </Form>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white d-flex align-items-center">
              <FontAwesomeIcon icon={faMobileAlt} className="me-2 text-primary" />
              <div>
                <h6 className="mb-0">Notifications</h6>
                <small className="text-muted">Choisissez comment vous souhaitez être informé.</small>
              </div>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-column gap-3">
                <div className="form-check form-switch">
                  <Input
                    type="switch"
                    role="switch"
                    id="notifEmail"
                    checked={notifications.email}
                    onChange={() => handleNotificationsChange('email')}
                  />
                  <Label className="form-check-label ms-2" htmlFor="notifEmail">
                    Recevoir les notifications par email
                  </Label>
                </div>
                <div className="form-check form-switch">
                  <Input
                    type="switch"
                    role="switch"
                    id="notifAlerts"
                    checked={notifications.alerts}
                    onChange={() => handleNotificationsChange('alerts')}
                  />
                  <Label className="form-check-label ms-2" htmlFor="notifAlerts">
                    Recevoir les alertes système
                  </Label>
                </div>
                <div className="form-check form-switch">
                  <Input
                    type="switch"
                    role="switch"
                    id="notifSms"
                    checked={notifications.sms}
                    onChange={() => handleNotificationsChange('sms')}
                    disabled={!account?.phone}
                  />
                  <Label className="form-check-label ms-2" htmlFor="notifSms">
                    Recevoir les SMS {account?.phone ? `(n° ${account.phone})` : '(ajoutez un numéro dans votre profil)'}
                  </Label>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="shadow-sm border-0 mb-4">
            <CardHeader className="bg-white d-flex align-items-center justify-content-between">
              <div>
                <h6 className="mb-0">Appareils connectés</h6>
                <small className="text-muted">Sécurisez vos sessions actives.</small>
              </div>
              <FontAwesomeIcon icon={faPowerOff} className="text-danger" />
            </CardHeader>
            <CardBody className="p-0">
              <ul className="list-group list-group-flush">
                {sessionsMock.map(session => (
                  <li key={session.id} className="list-group-item d-flex align-items-center">
                    <div className="me-3 text-primary">
                      <FontAwesomeIcon icon={browserIcon(session.browser)} />
                    </div>
                    <div className="flex-fill">
                      <div className="fw-semibold">
                        {session.browser} · {session.os}
                      </div>
                      <div className="text-muted small">
                        IP {session.ip} · Dernière activité: {session.lastActive}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 border-top text-end">
                <Button color="secondary" outline size="sm">
                  Déconnecter tous les autres appareils
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader className="bg-white">
              <h6 className="mb-0">Confidentialité</h6>
              <small className="text-muted">Contrôlez votre visibilité.</small>
            </CardHeader>
            <CardBody>
              <FormGroup className="mb-3">
                <Label for="visibility">Afficher mon avatar pour</Label>
                <Input
                  type="select"
                  id="visibility"
                  value={privacy.visibility}
                  onChange={e => handlePrivacyChange('visibility', e.target.value)}
                >
                  <option value="everyone">Tout le monde</option>
                  <option value="team">L’équipe</option>
                  <option value="me">Moi uniquement</option>
                </Input>
              </FormGroup>
              <div className="form-check form-switch mb-3">
                <Input
                  type="switch"
                  role="switch"
                  id="privacyDms"
                  checked={privacy.dms}
                  onChange={e => handlePrivacyChange('dms', e.target.checked)}
                />
                <Label className="form-check-label ms-2" htmlFor="privacyDms">
                  Autoriser les messages directs
                </Label>
              </div>
              <div className="form-check form-switch">
                <Input
                  type="switch"
                  role="switch"
                  id="privacyAdmin"
                  checked={privacy.adminAccess}
                  onChange={e => handlePrivacyChange('adminAccess', e.target.checked)}
                />
                <Label className="form-check-label ms-2" htmlFor="privacyAdmin">
                  Autoriser les administrateurs à accéder à mes données
                </Label>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountSettingsPage;
