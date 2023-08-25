import { DatasetJobApi, DefaultApi, ModelApi, WorkbenchApi, AuthnApi, NotificationApi } from '@domino/api/dist/dmm-api-client';
import { configuration } from './dmmConfiguration';

export const modelApi = new ModelApi(configuration);
export const predictionApi = new DefaultApi(configuration);
export const datasetApi = new DatasetJobApi(configuration);
export const workbenchApi = new WorkbenchApi(configuration);
export const authApi = new AuthnApi(configuration);
export const notificationApi = new NotificationApi(configuration);
