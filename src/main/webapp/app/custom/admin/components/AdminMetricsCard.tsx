import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type AdminMetricsCardProps = {
  title: string;
  value: string | number;
  icon: IconProp;
  color: string;
};

export const AdminMetricsCard = ({ title, value, icon, color }: AdminMetricsCardProps) => {
  return (
    <Card className={`bg-${color} text-white`}>
      <CardBody>
        <CardTitle tag="h5">
          <FontAwesomeIcon icon={icon} /> {title}
        </CardTitle>
        <CardText>
          <strong>{value}</strong>
        </CardText>
      </CardBody>
    </Card>
  );
};
