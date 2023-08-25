import { DefaultApi } from '@domino/api/dist/domino-cost-client';
import { Configuration } from '@domino/api/dist/domino-cost-client';

export const COST_LINK = `${window.location.origin}`;

export const configuration = new Configuration({
  basePath: COST_LINK,
  baseOptions: {
    withCredentials: true
  }
});

export const costApi = new DefaultApi(configuration);
