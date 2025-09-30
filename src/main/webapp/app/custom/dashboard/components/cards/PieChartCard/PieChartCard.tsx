// src/main/webapp/app/custom/dashboard/components/PieChartCard.tsx
import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './PieChartCard.scss';

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ name: string; value: number; color: string }>;
  className?: string;
}

const PieChartCard: React.FC<PieChartCardProps> = ({ title, subtitle, data, className = '' }) => {
  const COLORS = data.map(item => item.color);

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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ percent, index }) => {
                  if (typeof percent === 'number') {
                    return `${(percent * 100).toFixed(0)}%`;
                  }
                  return '';
                }}
                labelLine={false}
                stroke="none"
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip formatter={value => value.toLocaleString()} />

              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }}
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default PieChartCard;
