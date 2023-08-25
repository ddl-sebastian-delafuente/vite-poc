import * as React from 'react';

interface DeploymentType {
  name: string;
  url: string;
}
export interface DeploymentProps {
  deployment: DeploymentType;
}

const DeploymentsDeployment: React.FC<DeploymentProps> = ({ deployment: { name, url } }) => (
  <div>
    <a href={url}>{name}</a>
  </div>
);

export default DeploymentsDeployment;
