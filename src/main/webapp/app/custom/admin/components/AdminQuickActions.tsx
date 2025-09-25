import React from 'react';
import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';

export const AdminQuickActions = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">
          <Translate contentKey="crmApp.admin.dashboard.quickActions">Quick Actions</Translate>
        </CardTitle>
        <div className="d-grid gap-2">
          <Button tag={Link} to="/client/new" color="primary" size="sm">
            <Translate contentKey="crmApp.admin.dashboard.createClient">+ Create Client</Translate>
          </Button>
          <Button tag={Link} to="/prospect/new" color="success" size="sm">
            <Translate contentKey="crmApp.admin.dashboard.createProspect">+ Create Prospect</Translate>
          </Button>
          <Button tag={Link} to="/opportunity/new" color="warning" size="sm">
            <Translate contentKey="crmApp.admin.dashboard.createOpportunity">+ Create Opportunity</Translate>
          </Button>
          <Button tag={Link} to="/prospect" color="info" size="sm">
            <Translate contentKey="crmApp.admin.dashboard.convertProspect">Convert Prospect</Translate>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
