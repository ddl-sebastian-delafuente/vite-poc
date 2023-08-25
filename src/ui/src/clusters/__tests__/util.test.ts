import { getClusterDisabledMessage } from '../util';
import { ComputeClusterLabels } from '../types';

const appName = 'Domino';

describe('getClusterDisabledMessage', () => {
  it('should return admin disabled message when `showAdminMessage` argument is received true', () => {
    const message = getClusterDisabledMessage(true, ComputeClusterLabels.Dask, appName);
    expect(message).toMatch('clusters are disabled by your Domino administrator');
  });

  it('should return no environments message when `showAdminMessage` argument is received false', () => {
    const clusterType = ComputeClusterLabels.Dask;
    const message = getClusterDisabledMessage(false, clusterType, appName);
    expect(message).toMatch(`no ${clusterType} enabled Environments available`);
  });

  it(`should have the received cluster type in the return message
    when 'showAdminMessage' argument is received true`, () => {
    const clusterType = ComputeClusterLabels.Dask;
    const message = getClusterDisabledMessage(true, clusterType, appName);
    expect(message).toMatch(`${clusterType}`);
  });

  it(`should have the received cluster type in the return message
    when 'showAdminMessage' argument is received false`, () => {
    const clusterType = ComputeClusterLabels.Dask;
    const message = getClusterDisabledMessage(false, clusterType, appName);
    expect(message).toMatch(`${clusterType}`);
  });
});
