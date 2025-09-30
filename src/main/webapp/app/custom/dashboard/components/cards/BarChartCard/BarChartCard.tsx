// src/main/webapp/app/custom/dashboard/components/BarChartCard.tsx
import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import './BarChartCard.scss';

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ name: string; value: number; target?: number; change?: number }>;
  className?: string;
}

const BarChartCard: React.FC<BarChartCardProps> = ({ title, subtitle, data, className = '' }) => {
  const formatChange = (change?: number) => {
    if (change === undefined) return '';
    return change > 0 ? `↑${change}` : `↓${Math.abs(change)}`;
  };

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

        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
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
              <Bar dataKey="value" fill="#7E57C2" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" fontSize={10} fill="#6c757d" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Labels below chart */}
        <div className="d-flex justify-content-around mt-2" style={{ fontSize: '0.75rem' }}>
          {data.map((item, idx) => (
            <div key={idx} className="text-center">
              <div>{item.name}</div>
              <div className="text-success" style={{ fontSize: '0.7rem' }}>
                <i className={`fas fa-arrow-${item.change && item.change > 0 ? 'up' : 'down'} me-1`}></i>
                {formatChange(item.change)}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default BarChartCard;
