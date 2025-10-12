import React from 'react';
import { Card, CardBody } from 'reactstrap';
import SousService from 'app/entities/sous-service/sous-service';

const SousServiceListPage = () => (
  <div className="sous-service-list-page py-4">
    <Card className="shadow-sm border-0">
      <CardBody className="p-0">
        <SousService />
      </CardBody>
    </Card>
  </div>
);

export default SousServiceListPage;
