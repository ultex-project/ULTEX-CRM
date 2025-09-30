// src/main/webapp/app/custom/dashboard/components/MetricCard.tsx
import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './MetricCard.scss';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  progress: number; // 0 to 100
  iconColor?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, progress, iconColor = '#7E57C2', className = '' }) => {
  return (
    <Card className={`metric-card ${className}`} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <CardBody className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <CardTitle tag="h5" className="mb-1" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#333' }}>
              {value}
            </CardTitle>
            <CardText className="text-muted" style={{ fontSize: '0.85rem' }}>
              {subtitle}
            </CardText>
          </div>
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="lg"
            style={{
              color: iconColor,
              backgroundColor: `${iconColor}20`,
              padding: '6px',
              borderRadius: '8px',
            }}
          />
        </div>

        <div className="d-flex align-items-center mt-3">
          <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>{progress}%</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default MetricCard;
