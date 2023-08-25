import { Configuration } from '@domino/api/dist/dmm-api-client';
export const DMM_LINK = `${window.location.origin}/model-monitor`;

export const configuration = new Configuration({
  basePath: DMM_LINK,
  baseOptions: {
    withCredentials: true
  }
});
