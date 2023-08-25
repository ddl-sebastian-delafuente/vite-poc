import { Configuration } from '@domino/api/dist/training-set-client';

export const basePath = `${window.location.origin}/trainingset`;

export const configuration = new Configuration({
  basePath,
  baseOptions: {
    withCredentials: true,
  }
});
