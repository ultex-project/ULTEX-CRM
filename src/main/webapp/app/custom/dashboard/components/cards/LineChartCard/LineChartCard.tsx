// src/main/webapp/app/custom/dashboard/components/LineChartCard.tsx
import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import './LineChartCard.scss';

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  data: Array<{ name: string; value: number }>;
  className?: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title, subtitle, value, data, className = '' }) => {
  return (
    <Card className={`chart-card ${className}`} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <CardTitle tag="h5" className="mb-1" style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
              {title}
            </CardTitle>
            {subtitle && (
              <CardText className="text-muted" style={{ fontSize: '0.75rem' }}>
                {subtitle}
              </CardText>
            )}
          </div>
          <div className="dropdown-menu-icon">
            <i className="fas fa-ellipsis-v text-muted"></i>
          </div>
        </div>

        <div className="d-flex align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#212529' }}>
            {value}
          </CardTitle>
        </div>

        <div style={{ height: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                }}
                formatter={value2 => [value2.toLocaleString(), 'Value']}
              />
              <Area type="monotone" dataKey="value" stroke="#7E57C2" fill="#EDE7F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value" stroke="#7E57C2" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default LineChartCard;
