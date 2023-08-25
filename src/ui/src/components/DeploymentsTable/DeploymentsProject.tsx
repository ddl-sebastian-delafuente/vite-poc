import * as React from 'react';

interface DeploymentType {
  name: string;
  url: string;
}
export interface DeploymentProjectProps {
  project: DeploymentType;
}

const DeploymentsProject: React.FC<DeploymentProjectProps> = ({ project }) => (
  <div>
    <a href={project.url}>{project.name}</a>
  </div>
);

export default DeploymentsProject;
