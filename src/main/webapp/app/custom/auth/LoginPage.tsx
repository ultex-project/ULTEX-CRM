import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AUTHORITIES } from 'app/config/constants';
import { login } from 'app/shared/reducers/authentication';

import './login-page.scss';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched);
  const account = useAppSelector(state => state.authentication.account);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const errorMessage = useAppSelector(state => state.authentication.errorMessage);
  const loading = useAppSelector(state => state.authentication.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    if (sessionHasBeenFetched && isAuthenticated) {
      const authorities = account?.authorities ?? [];
      const hasDataOnly = authorities.includes(AUTHORITIES.DATA) && !authorities.includes(AUTHORITIES.USER);
      const target = hasDataOnly ? '/dashboard/data' : '/dashboard';
      navigate(target, { replace: true });
    }
  }, [account?.authorities, isAuthenticated, sessionHasBeenFetched, navigate]);

  useEffect(() => {
    if (location.pathname === '/login') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormTouched(true);

    if (!email || !password) {
      return;
    }

    dispatch(login(email, password, rememberMe));
  };

  const showFieldError = formTouched && (!email || !password);
  const credentialError = loginError ? errorMessage || 'Identifiants invalides. Veuillez réessayer.' : null;

  return (
    <div className="login-page">
      <div className="login-overlay" />
      <div className="login-content container">
        <div className="login-card shadow-lg">
          <div className="login-illustration d-none d-md-flex">
            <div className="illustration-copy">
              <h2>Gérez vos prospects avec sérénité</h2>
              <p>Suivez vos contacts, organisez vos campagnes et donnez du rythme à votre équipe commerciale.</p>
            </div>
          </div>
          <div className="login-form-wrapper">
            <div className="text-center mb-4">
              <img src={'./content/images/logo.svg'} alt="ULTex CRM" className="login-logo" />
              <h5 className="mt-3 mb-1">Bienvenue sur ULTex CRM</h5>
              <p className="text-muted mb-0">Connectez-vous pour accéder à votre espace.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="prenom.nom@ultex.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  invalid={formTouched && !email}
                  disabled={loading}
                  autoComplete="username"
                />
                {formTouched && !email ? <small className="text-danger">L&apos;adresse e-mail est requise.</small> : null}
              </FormGroup>
              <FormGroup className="mt-3">
                <Label for="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  invalid={formTouched && !password}
                  disabled={loading}
                  autoComplete="current-password"
                />
                {formTouched && !password ? <small className="text-danger">Le mot de passe est requis.</small> : null}
              </FormGroup>
              {credentialError ? <div className="text-danger mt-2">{credentialError}</div> : null}
              <FormGroup check className="mt-4 d-flex align-items-center justify-content-between">
                <div className="form-check">
                  <Input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="form-check-input"
                    checked={rememberMe}
                    onChange={event => setRememberMe(event.target.checked)}
                    disabled={loading}
                  />
                  <Label className="form-check-label" htmlFor="rememberMe">
                    Se souvenir de moi
                  </Label>
                </div>
                <a href="#" className="forgot-link" onClick={event => event.preventDefault()}>
                  Mot de passe oublié ?
                </a>
              </FormGroup>
              <Button type="submit" color="primary" className="w-100 mt-4" size="lg" disabled={loading || showFieldError}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
