import { DefaultApi } from '@domino/api/dist/training-set-client';
import { configuration } from './featuresetConfiguration';

export const featureSetApi = new DefaultApi(configuration);
