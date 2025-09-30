import React from 'react';
import { Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import DashboardMetricsCard from 'app/custom/dashboard/components/cards/MetricsCard/MetricCard';
import { useDashboardData } from './hooks/useDashboardData';
import MetricCard from 'app/custom/dashboard/components/cards/MetricsCard/MetricCard';
import PieChartCard from 'app/custom/dashboard/components/cards/PieChartCard/PieChartCard';
import BarChartCard from 'app/custom/dashboard/components/cards/BarChartCard/BarChartCard';
import LineChartCard from 'app/custom/dashboard/components/cards/LineChartCard/LineChartCard';

const AdminDashboard = () => {
  const { data, loading } = useDashboardData();
  // Sample data
  const pieData = [
    { name: 'send', value: 860, color: '#7E57C2' },
    { name: 'open', value: 730, color: '#FF6B6B' },
    { name: 'spam', value: 234, color: '#4ECDC4' },
  ];

  const barData = [
    { name: 'Target', value: 841, change: 0 },
    { name: 'Last week', value: 234, change: -12 },
    { name: 'Last month', value: 3278, change: 45 },
  ];

  const lineData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 25000 },
    { name: 'Jun', value: 28000 },
    { name: 'Jul', value: 26000 },
    { name: 'Aug', value: 29000 },
    { name: 'Sep', value: 31000 },
    { name: 'Oct', value: 28000 },
    { name: 'Nov', value: 25000 },
    { name: 'Dec', value: 22000 },
  ];
  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">
        <Translate contentKey="global.dashboard.title">Hi , </Translate>
      </h2>

      <Row className={'mb-3'}>
        <Col md="3">
          <MetricCard title="Revenue" value="$22,880.50" subtitle="Won from 18 Deals" progress={67} iconColor="#7E57C2" />
        </Col>
        <Col md="3">
          <MetricCard title="Daily average income" value="$1,096.30" subtitle="Daily average income" progress={18} iconColor="#F9837C" />
        </Col>
        <Col md="3">
          <MetricCard title="Revenue" value="33.98%" subtitle="Lead coversation" progress={78} iconColor="#70B6C1" />
        </Col>
        <Col md="3">
          <MetricCard title="Campaign sent" value="778" subtitle="Campaign sent" progress={80} iconColor="#F3CC5C" />
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <PieChartCard title="Email Sent Total" subtitle="March 2020" data={pieData} />
        </Col>
        <Col md="4">
          <BarChartCard title="Income Amounts" data={barData} />
        </Col>
        <Col md="4">
          <LineChartCard title="Revenue" subtitle="Won from 262 Deals" value="$165,750.23" data={lineData} />
        </Col>
      </Row>

      {/* Add charts, tables, etc. here */}
    </div>
  );
};

export default AdminDashboard;
