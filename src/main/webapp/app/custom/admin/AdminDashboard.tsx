import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

import './admin.scss';
import { AdminMetricsCard } from './components/AdminMetricsCard';
import { AdminQuickActions } from './components/AdminQuickActions';
import { AdminChart } from './components/AdminChart';
import { useAdminMetrics } from 'app/shared/lib/hooks/useAdminMetrics';

export const AdminDashboard = () => {
  const { metrics, loading } = useAdminMetrics();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <Container fluid>
        <h2>
          <Translate contentKey="crmApp.admin.dashboard.title">CRM Admin Dashboard</Translate>
        </h2>

        {/* METRICS ROW */}
        <Row>
          <Col md="4">
            <AdminMetricsCard title="Active Clients" value={metrics.activeClients} icon="user-check" color="success" />
          </Col>
          <Col md="4">
            <AdminMetricsCard title="New Prospects" value={metrics.newProspects} icon="user-plus" color="info" />
          </Col>
          <Col md="4">
            <AdminMetricsCard
              title="Total Opportunity Value"
              value={`$${metrics.totalOpportunityAmount.toLocaleString()}`}
              icon="dollar-sign"
              color="warning"
            />
          </Col>
        </Row>

        {/* CHART + QUICK ACTIONS */}
        <Row className="mt-4">
          <Col md="8">
            <div className="chart-container p-3 bg-light rounded">
              <h5>
                <Translate contentKey="crmApp.admin.dashboard.chartTitle">Opportunities by Stage</Translate>
              </h5>
              <AdminChart data={metrics.opportunitiesByStage} />
            </div>
          </Col>
          <Col md="4">
            <AdminQuickActions />
          </Col>
        </Row>

        {/* RECENT ACTIVITY */}
        <Row className="mt-4">
          <Col>
            <div className="activity-container p-3 bg-light rounded">
              <h5>
                <Translate contentKey="crmApp.admin.dashboard.recentActivity">Recent Activity</Translate>
              </h5>
              <ul className="recent-activity-list">
                <li>👤 John assigned Opportunity #12 to you</li>
                <li>🔄 Prospect “ABC Corp” converted to Client</li>
                <li>🆕 New user “Sarah” registered</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
