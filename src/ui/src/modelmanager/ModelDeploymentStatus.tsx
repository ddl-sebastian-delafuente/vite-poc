import * as React from 'react';
const { LiveDeploymentStatus } = require('../../../model-manager/src/DeploymentStatus');

const getProps = (url: string) => () =>
  fetch(url)
    .then(response => {
      if (response.status < 400) {
        return response.json();
      } else {
        throw Error();
      }
    })
    .then((status) => ({
      name: status.status,
      isPending: status.isPending
    }))
    .catch(function (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    });

export interface Props {
  name?: string;
  isPending?: boolean;
  url: string;
}

const ModelDeploymentStatus = ({
    name,
    isPending,
    url,
  }: Props) => (
  <LiveDeploymentStatus
    defaultProps={{
      name,
      isPending,
    }}
    getProps={getProps(url)}
  />
);

export default ModelDeploymentStatus;
